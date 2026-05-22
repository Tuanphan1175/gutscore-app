import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '@/constants/theme';
import { Button } from '@/components/ui/button';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.title}>Gutscore</Text>
        <Text style={styles.subtitle}>Đánh giá sức khỏe đường ruột</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gutscore là gì?</Text>
        <Text style={styles.description}>
          Ứng dụng đánh giá sức khỏe đường ruột dựa trên 29 câu hỏi khoa học,
          kết hợp AI để phân tích và đưa ra lời khuyên dinh dưỡng cá nhân hóa.
        </Text>
      </View>

      <View style={styles.features}>
        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>📋</Text>
          <Text style={styles.featureTitle}>29 Câu hỏi</Text>
          <Text style={styles.featureText}>Đánh giá toàn diện 4 chỉ số</Text>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>👨‍⚕️</Text>
          <Text style={styles.featureTitle}>Doctor Phan Anh Tuấn</Text>
          <Text style={styles.featureText}>Phân tích & khuyến nghị chuyên sâu</Text>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>📊</Text>
          <Text style={styles.featureTitle}>Theo dõi</Text>
          <Text style={styles.featureText}>Lịch sử kết quả chi tiết</Text>
        </View>
      </View>

      <View style={styles.cta}>
        <Button title="Bắt đầu đánh giá" onPress={() => router.push('/assessment')} />
      </View>

      <View style={styles.info}>
        <Text style={styles.infoTitle}>4 Chỉ số đánh giá:</Text>
        <Text style={styles.infoItem}>• Chỉ số sức khỏe đường ruột</Text>
        <Text style={styles.infoItem}>• Điểm chất xơ</Text>
        <Text style={styles.infoItem}>• Điểm vi khuẩn đường ruột</Text>
        <Text style={styles.infoItem}>• Chỉ số nguy cơ dinh dưỡng</Text>
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
  hero: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.lg,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textSecondary,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
    marginBottom: SPACING.lg,
  },
  featureCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    width: '47%',
    marginHorizontal: '1.5%',
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  featureTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  featureText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  cta: {
    marginBottom: SPACING.lg,
  },
  info: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  infoTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  infoItem: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    lineHeight: 22,
  },
});