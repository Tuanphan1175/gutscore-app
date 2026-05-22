import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '@/constants/theme';
import { Button } from '@/components/ui/button';
import { useAssessmentStore } from '@/store/assessment-store';
import { useUserStore } from '@/store/user-store';

export default function ProfileScreen() {
  const router = useRouter();
  const { clearAssessment } = useAssessmentStore();
  const { user, isLoggedIn, logout } = useUserStore();

  const handleReset = () => {
    clearAssessment();
    Alert.alert('Thành công', 'Đã làm mới dữ liệu đánh giá sức khỏe.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{isLoggedIn ? '👑' : '👤'}</Text>
        </View>
        <Text style={styles.name}>{isLoggedIn ? user?.fullname : 'Khách hàng Gutscore'}</Text>
        <Text style={styles.email}>
          {isLoggedIn ? `SĐT: ${user?.phone}` : 'Chưa đăng nhập'}
        </Text>
      </View>

      <View style={[styles.premiumCard, isLoggedIn && { borderColor: '#4CD964' }]}>
        <View style={styles.premiumTextContainer}>
          <Text style={[styles.premiumTitle, isLoggedIn && { color: '#4CD964' }]}>
            {isLoggedIn ? '🌟 Premium Active' : '👑 Gutscore Premium'}
          </Text>
          <Text style={styles.premiumSubtitle}>
            {isLoggedIn 
              ? `Tài khoản đã kích hoạt gói: ${user?.plan === 'yearly' ? 'Năm (600.000đ)' : 'Tháng (79.000đ)'}`
              : 'Mở khóa Doctor Phan Anh Tuấn không giới hạn'}
          </Text>
        </View>
        
        {isLoggedIn ? (
          <View style={styles.badgeActive}>
            <Text style={styles.badgeActiveText}>✓ ĐÃ ĐƯỢC DUYỆT</Text>
          </View>
        ) : (
          <View style={{ flexDirection: 'column', gap: SPACING.sm }}>
            <Button
              title="Đăng nhập Premium"
              onPress={() => router.push('/login')}
              style={styles.premiumBtn}
            />
            <Button
              title="Đăng ký Premium"
              onPress={() => router.push('/subscription')}
              variant="outline"
            />
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Về ứng dụng</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phiên bản</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nền tảng</Text>
          <Text style={styles.infoValue}>React Native / Expo</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hướng dẫn</Text>
        <Text style={styles.guideText}>
          1. Trả lời 29 câu hỏi về thói quen ăn uống và sức khỏe{'\n'}
          2. Nhận điểm sức khỏe đường ruột (0-100){'\n'}
          3. Nhận phân tích từ Doctor Phan Anh Tuấn và lời khuyên cá nhân hóa{'\n'}
          4. Theo dõi tiến triển qua lịch sử đánh giá
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="Làm mới đánh giá"
          onPress={handleReset}
          variant="outline"
          style={{ marginBottom: SPACING.md }}
        />
        {isLoggedIn && (
          <Button
            title="Đăng xuất tài khoản"
            onPress={() => {
              logout();
              Alert.alert('Thông báo', 'Đã đăng xuất tài khoản Premium.');
            }}
            variant="outline"
            style={{ borderColor: COLORS.danger }}
          />
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Gutscore - Đánh giá sức khỏe đường ruột
        </Text>
        <Text style={styles.footerSubtext}>
          Bác Sĩ Chính Mình © 2026
        </Text>
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
  premiumCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: '#FFD700', // Gold border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: 'column',
    gap: SPACING.md,
  },
  premiumTextContainer: {
    flexDirection: 'column',
    gap: SPACING.xs,
  },
  premiumTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: '#D4AF37', // Gold color text
  },
  premiumSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  premiumBtn: {
    backgroundColor: '#1C1C1E', // Luxury charcoal black button
  },
  badgeActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CD964',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeActiveText: {
    color: '#4CD964',
    fontWeight: '700',
    fontSize: 14,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: 36,
  },
  name: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  email: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  guideText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    lineHeight: 26,
  },
  actions: {
    marginBottom: SPACING.lg,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  footerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  footerSubtext: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
});