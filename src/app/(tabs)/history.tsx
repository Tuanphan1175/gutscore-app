import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '@/constants/theme';
import { getAssessmentHistory } from '@/lib/supabase';
import { getScoreColor } from '@/lib/scoring';
import { AssessmentResult } from '@/types/assessment';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/user-store';

export default function HistoryScreen() {
  const router = useRouter();
  const { isLoggedIn } = useUserStore();
  const [history, setHistory] = useState<AssessmentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      loadHistory();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <View style={styles.gateContainer}>
        <View style={styles.gateCard}>
          <Text style={styles.gateLogo}>📊</Text>
          <Text style={styles.gateTitle}>Lịch sử Đánh giá</Text>
          <Text style={styles.gateSubtitle}>
            Tính năng lưu trữ và theo dõi tiến trình 29 chỉ số sức khỏe đường ruột chi tiết theo thời gian chỉ dành riêng cho hội viên Premium đã kích hoạt.
          </Text>

          <View style={styles.gateButtons}>
            <Button
              title="Đăng nhập Premium"
              onPress={() => router.push('/login')}
              style={styles.gateLoginBtn}
            />
            <Button
              title="Đăng ký gói Premium"
              onPress={() => router.push('/subscription')}
              variant="outline"
              style={styles.gateRegisterBtn}
            />
          </View>
        </View>
      </View>
    );
  }

  const loadHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAssessmentHistory();
      setHistory(data as AssessmentResult[]);
    } catch (err) {
      console.error('Failed to load history:', err);
      setError('Không thể tải lịch sử');
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>Chưa có lịch sử</Text>
      <Text style={styles.emptyText}>
        Hoàn thành đánh giá để xem kết quả tại đây
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: AssessmentResult }) => {
    const date = new Date(item.createdAt).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardDate}>{date}</Text>
          <Text style={[styles.overallScore, { color: getScoreColor(item.overallScore) }]}>
            {item.overallScore}/100
          </Text>
        </View>

        <View style={styles.scores}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Sức khỏe ruột</Text>
            <Text style={[styles.scoreValue, { color: getScoreColor(item.gutHealthIndex) }]}>
              {item.gutHealthIndex}
            </Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Chất xơ</Text>
            <Text style={[styles.scoreValue, { color: getScoreColor(item.fiberScore) }]}>
              {item.fiberScore}
            </Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Vi khuẩn</Text>
            <Text style={[styles.scoreValue, { color: getScoreColor(item.microbiomeScore) }]}>
              {item.microbiomeScore}
            </Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Nguy cơ</Text>
            <Text style={[styles.scoreValue, { color: getScoreColor(item.nutritionalRiskIndex) }]}>
              {item.nutritionalRiskIndex}
            </Text>
          </View>
        </View>

        {item.aiAnalysis && (
          <View style={styles.aiAnalysis}>
            <Text style={styles.aiLabel}>Doctor Phan Anh Tuấn Phân Tích:</Text>
            <Text style={styles.aiText} numberOfLines={3}>{item.aiAnalysis}</Text>
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Đang tải lịch sử...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorHint}>Vui lòng kiểm tra kết nối và thử lại</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {history.length > 0 ? (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshing={isLoading}
          onRefresh={loadHistory}
        />
      ) : (
        renderEmpty()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
  },
  errorText: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.danger,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  errorHint: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  list: {
    padding: SPACING.md,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cardDate: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  overallScore: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
  },
  scores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreItem: {
    alignItems: 'center',
    flex: 1,
  },
  scoreLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  scoreValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
  },
  aiAnalysis: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  aiLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  aiText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  gateContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  gateCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  gateLogo: {
    fontSize: 54,
    marginBottom: SPACING.md,
  },
  gateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  gateSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  gateButtons: {
    width: '100%',
    flexDirection: 'column',
    gap: SPACING.md,
  },
  gateLoginBtn: {
    width: '100%',
  },
  gateRegisterBtn: {
    width: '100%',
  },
});