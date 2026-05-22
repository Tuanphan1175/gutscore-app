import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ASSESSMENT_QUESTIONS, TOTAL_QUESTIONS } from '@/constants/questions';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '@/constants/theme';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { QuestionCard } from '@/components/ui/question-card';
import { useAssessmentStore } from '@/store/assessment-store';
import { useUserStore } from '@/store/user-store';

const PAGE_TITLES = [
  'Sức khỏe đường ruột',
  'Chất xơ & Dinh dưỡng',
  'Vi khuẩn đường ruột',
  'Nguy cơ dinh dưỡng',
];

export default function AssessmentScreen() {
  const router = useRouter();
  const { currentPage, answers, setAnswer, nextPage, prevPage, submitAssessment } = useAssessmentStore();
  const { isLoggedIn } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoggedIn) {
    return (
      <View style={styles.gateContainer}>
        <View style={styles.gateCard}>
          <Text style={styles.gateLogo}>📋</Text>
          <Text style={styles.gateTitle}>Đánh giá Sức khỏe Đường ruột</Text>
          <Text style={styles.gateSubtitle}>
            Hệ thống 29 câu hỏi toàn diện giúp phân tích chi tiết sức khỏe hệ tiêu hóa, nhận lời khuyên lâm sàng cùng phác đồ dinh dưỡng phục hồi cá nhân hóa từ Doctor Phan Anh Tuấn chỉ dành riêng cho hội viên Premium đã kích hoạt.
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

  const questions = ASSESSMENT_QUESTIONS.filter(q => q.page === currentPage);
  const answeredCount = answers.length;
  const isLastPage = currentPage === 4;
  const isFirstPage = currentPage === 1;

  const canProceed = questions.every(q => answers.some(a => a.questionId === q.id));

  const handleNext = async () => {
    if (isLastPage) {
      setIsSubmitting(true);
      try {
        const result = submitAssessment();
        router.push('/result');
      } catch (error) {
        console.error('Submit failed:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      nextPage();
    }
  };

  return (
    <View style={styles.container}>
      <ProgressBar current={answeredCount} total={TOTAL_QUESTIONS} />

      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>{PAGE_TITLES[currentPage - 1]}</Text>
        <Text style={styles.pageNumber}>Trang {currentPage}/4</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {questions.map((q, index) => {
          const answer = answers.find(a => a.questionId === q.id);
          return (
            <QuestionCard
              key={q.id}
              question={`${index + 1}. ${q.question}`}
              options={q.options}
              selectedValue={answer?.value}
              onSelect={(value) => setAnswer(q.id, value)}
            />
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerButtons}>
          {!isFirstPage && (
            <Button
              title="Quay lại"
              onPress={prevPage}
              variant="outline"
              style={styles.footerButton}
            />
          )}
          <Button
            title={isLastPage ? 'Xem kết quả' : 'Tiếp tục'}
            onPress={handleNext}
            disabled={!canProceed}
            loading={isSubmitting}
            style={isFirstPage ? styles.fullWidth : styles.footerButton}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  pageHeader: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  pageTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: COLORS.text,
  },
  pageNumber: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  footer: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  footerButton: {
    flex: 1,
  },
  fullWidth: {
    flex: 1,
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