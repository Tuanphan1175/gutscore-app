import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Share, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '@/constants/theme';
import { Button } from '@/components/ui/button';
import { ScoreCard } from '@/components/ui/score-card';
import { useAssessmentStore } from '@/store/assessment-store';
import { getScoreLabel, getScoreColor } from '@/lib/scoring';
import { analyzeGutHealth } from '@/lib/ai-analysis';
import { saveAssessmentResult } from '@/lib/supabase';
import { useUserStore } from '@/store/user-store';

export default function ResultScreen() {
  const router = useRouter();
  const { result, setAiAnalysis, clearAssessment } = useAssessmentStore();
  const { isLoggedIn } = useUserStore();
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (result) {
      saveResultToSupabase();
      if (isLoggedIn) {
        fetchAIAnalysis();
      }
    }
  }, [result, isLoggedIn]);

  const saveResultToSupabase = async () => {
    if (!result) return;
    setIsSaving(true);
    try {
      await saveAssessmentResult({
        gut_health_index: result.gutHealthIndex,
        fiber_score: result.fiberScore,
        microbiome_score: result.microbiomeScore,
        nutritional_risk_index: result.nutritionalRiskIndex,
        overall_score: result.overallScore,
        answers: result.answers.map(a => a.value),
        ai_analysis: result.aiAnalysis,
      });
    } catch (error) {
      console.error('Failed to save result:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const fetchAIAnalysis = async () => {
    if (!result) return;
    setIsLoadingAI(true);
    try {
      const analysis = await analyzeGutHealth({
        gutHealthIndex: result.gutHealthIndex,
        fiberScore: result.fiberScore,
        microbiomeScore: result.microbiomeScore,
        nutritionalRiskIndex: result.nutritionalRiskIndex,
        overallScore: result.overallScore,
      });
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('AI analysis failed:', error);
      setAiAnalysis('Không thể phân tích AI lúc này. Vui lòng thử lại sau.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleShare = async () => {
    if (!result) return;
    try {
      await Share.share({
        message: `Gutscore của tôi: ${result.overallScore}/100\n${getScoreLabel(result.overallScore)}\n\nPhân tích:\n${result.aiAnalysis || 'Đang tải...'}`,
        title: 'Kết quả Gutscore',
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleRetake = () => {
    clearAssessment();
    router.push('/assessment');
  };

  if (!result) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không tìm thấy kết quả</Text>
        <Button title="Làm lại" onPress={handleRetake} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Kết quả đánh giá</Text>
        <Text style={styles.date}>
          {new Date(result.createdAt).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </Text>
        {isSaving && (
          <View style={styles.savingIndicator}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.savingText}>Đang lưu...</Text>
          </View>
        )}
      </View>

      <View style={styles.overallCard}>
        <Text style={styles.overallLabel}>Điểm sức khỏe đường ruột</Text>
        <Text style={[styles.overallScore, { color: getScoreColor(result.overallScore) }]}>
          {result.overallScore}
        </Text>
        <Text style={styles.overallMax}>/100</Text>
        <Text style={[styles.overallStatus, { color: getScoreColor(result.overallScore) }]}>
          {getScoreLabel(result.overallScore)}
        </Text>
      </View>

      <View style={styles.scoresGrid}>
        <ScoreCard label="Sức khỏe ruột" score={result.gutHealthIndex} color={getScoreColor(result.gutHealthIndex)} />
        <ScoreCard label="Chất xơ" score={result.fiberScore} color={getScoreColor(result.fiberScore)} />
        <ScoreCard label="Vi khuẩn" score={result.microbiomeScore} color={getScoreColor(result.microbiomeScore)} />
        <ScoreCard label="Nguy cơ dinh dưỡng" score={result.nutritionalRiskIndex} color={getScoreColor(result.nutritionalRiskIndex)} />
      </View>

      <View style={styles.aiSection}>
        <Text style={styles.sectionTitle}>Doctor Phan Anh Tuấn Phân Tích</Text>
        {!isLoggedIn ? (
          <View style={styles.paywallContainer}>
            <Text style={styles.paywallTitle}>🔒 Độc quyền Premium</Text>
            <Text style={styles.paywallText}>
              Bản phân tích chuyên sâu chi tiết 29 chỉ số cùng phác đồ dinh dưỡng phục hồi từ Doctor Phan Anh Tuấn chỉ dành riêng cho hội viên Premium đã kích hoạt.
            </Text>
            <View style={styles.paywallButtons}>
              <Button
                title="Đăng nhập mở khóa"
                onPress={() => router.push('/login')}
                style={styles.paywallBtn}
              />
              <Button
                title="Đăng ký gói (79.000đ/tháng)"
                onPress={() => router.push('/subscription')}
                variant="outline"
                style={styles.paywallOutlineBtn}
              />
            </View>
          </View>
        ) : isLoadingAI ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={COLORS.primary} />
            <Text style={styles.loadingText}>Doctor Phan Anh Tuấn đang phân tích...</Text>
          </View>
        ) : (
          <Text style={styles.aiText}>{result.aiAnalysis || 'Doctor Phan Anh Tuấn đang tải phân tích...'}</Text>
        )}
      </View>

      <View style={styles.actions}>
        <Button title="Chia sẻ kết quả" onPress={handleShare} variant="outline" style={styles.actionButton} />
        <Button title="Đánh giá lại" onPress={handleRetake} style={styles.actionButton} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  date: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  savingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    gap: SPACING.xs,
  },
  savingText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  overallCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  overallLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  overallScore: {
    fontSize: 72,
    fontWeight: '700',
    lineHeight: 80,
  },
  overallMax: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.textSecondary,
    marginTop: -SPACING.sm,
  },
  overallStatus: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    marginTop: SPACING.sm,
  },
  scoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
    marginBottom: SPACING.lg,
  },
  aiSection: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  loadingText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  aiText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: 26,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  actionButton: {
    flex: 1,
  },
  errorText: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  paywallContainer: {
    backgroundColor: '#FAF7EE', // Cream/gold-ish premium background
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  paywallTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#D4AF37',
    marginBottom: SPACING.sm,
  },
  paywallText: {
    fontSize: 13,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  paywallButtons: {
    width: '100%',
    flexDirection: 'column',
    gap: SPACING.sm,
  },
  paywallBtn: {
    backgroundColor: '#1C1C1E',
    borderColor: '#1C1C1E',
    width: '100%',
  },
  paywallOutlineBtn: {
    width: '100%',
  },
});