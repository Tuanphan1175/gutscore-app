import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '@/constants/theme';
import { Button } from '@/components/ui/button';
import { createSubscriptionRequest, checkSubscriptionStatus } from '@/lib/supabase';

export default function SubscriptionScreen() {
  const router = useRouter();
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<any>(null);

  const handleSubmitRequest = async () => {
    if (!fullname.trim() || !email.trim() || !phone.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ Họ tên, Email và Số điện thoại');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Lỗi', 'Vui lòng nhập Email hợp lệ');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await createSubscriptionRequest({
        fullname: fullname.trim(),
        email: email.trim(),
        phone: phone.trim(),
        plan: selectedPlan,
      });
      setCurrentRequest(data);
      Alert.alert('Thành công', 'Đã gửi yêu cầu đăng ký Premium! Vui lòng liên hệ Bác sĩ Phan Anh Tuấn để được duyệt nhanh nhất.');
    } catch (error) {
      console.error('Failed to submit subscription:', error);
      Alert.alert('Lỗi', 'Không thể gửi yêu cầu đăng ký lúc này. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!email.trim() && !phone.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập Email hoặc Số điện thoại để kiểm tra trạng thái');
      return;
    }

    setIsChecking(true);
    setCurrentRequest(null);
    try {
      const data = await checkSubscriptionStatus(email.trim(), phone.trim());
      if (data) {
        setCurrentRequest(data);
        if (data.status === 'pending') {
          Alert.alert('Thông tin', 'Yêu cầu của bạn đang chờ phê duyệt. Trạng thái: ĐANG CHỜ DUYỆT.');
        } else if (data.status === 'approved') {
          Alert.alert('Tuyệt vời!', 'Gói đăng ký Premium của bạn ĐÃ ĐƯỢC KÍCH HOẠT!');
        } else {
          Alert.alert('Thông báo', 'Yêu cầu của bạn đã bị Từ chối. Vui lòng liên hệ Admin để được hỗ trợ.');
        }
      } else {
        Alert.alert('Thông tin', 'Không tìm thấy yêu cầu đăng ký nào khớp với thông tin cung cấp.');
      }
    } catch (error) {
      console.error('Failed to check status:', error);
      Alert.alert('Lỗi', 'Không thể kiểm tra trạng thái lúc này.');
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Đang chờ duyệt ⏳';
      case 'approved': return 'Đã kích hoạt 🌟 (Premium)';
      case 'rejected': return 'Bị từ chối ❌';
      default: return 'Chưa đăng ký 📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return COLORS.warning;
      case 'approved': return COLORS.success;
      case 'rejected': return COLORS.danger;
      default: return COLORS.textSecondary;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>👑 Nâng Cấp Premium</Text>
        <Text style={styles.subtitle}>Mở khóa Doctor Phan Anh Tuấn & Phân tích sức khỏe nâng cao</Text>
      </View>

      <View style={styles.benefitsCard}>
        <Text style={styles.benefitsTitle}>Quyền lợi đặc quyền Premium:</Text>
        <Text style={styles.benefitItem}>🚀 Vô hạn số lần phân tích từ Doctor Phan Anh Tuấn</Text>
        <Text style={styles.benefitItem}>📊 Xem lại đầy đủ lịch sử chi tiết 29 chỉ số sức khỏe</Text>
        <Text style={styles.benefitItem}>🍏 Cẩm nang dinh dưỡng chuyên sâu & thực đơn phục hồi từ thực vật</Text>
        <Text style={styles.benefitItem}>💬 Nhận hỗ trợ trực tiếp từ đội ngũ chuyên gia của Bác sĩ Tuấn</Text>
      </View>

      <Text style={styles.sectionTitle}>Chọn gói đăng ký:</Text>
      <View style={styles.plansContainer}>
        <TouchableOpacity
          style={[styles.planCard, selectedPlan === 'monthly' && styles.activePlanCard]}
          onPress={() => setSelectedPlan('monthly')}
          activeOpacity={0.8}
        >
          <Text style={styles.planName}>Gói Tháng 📅</Text>
          <Text style={styles.planPrice}>79.000đ</Text>
          <Text style={styles.planDuration}>/ tháng</Text>
          <Text style={styles.planSavings}>Phù hợp thử nghiệm</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.planCard, selectedPlan === 'yearly' && styles.activePlanCard]}
          onPress={() => setSelectedPlan('yearly')}
          activeOpacity={0.8}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>TIẾT KIỆM 35%</Text>
          </View>
          <Text style={styles.planName}>Gói Năm 🏆</Text>
          <Text style={styles.planPrice}>600.000đ</Text>
          <Text style={styles.planDuration}>/ năm</Text>
          <Text style={styles.planSavings}>Chỉ 50.000đ/tháng</Text>
        </TouchableOpacity>
      </View>

      {currentRequest && (
        <View style={[styles.statusBox, { borderColor: getStatusColor(currentRequest.status) }]}>
          <Text style={styles.statusLabel}>Trạng thái yêu cầu của bạn:</Text>
          <Text style={[styles.statusValue, { color: getStatusColor(currentRequest.status) }]}>
            {getStatusText(currentRequest.status)}
          </Text>
          {currentRequest.status === 'pending' && (
            <Text style={styles.statusInstruction}>
              Vui lòng thực hiện chuyển khoản theo gói đã chọn và liên hệ Bác sĩ Tuấn để duyệt kích hoạt tài khoản.
            </Text>
          )}
        </View>
      )}

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Thông tin đăng ký</Text>
        
        <Text style={styles.inputLabel}>Họ và tên:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập họ và tên của bạn"
          placeholderTextColor="#8E8E93"
          value={fullname}
          onChangeText={setFullname}
          autoCapitalize="words"
        />

        <Text style={styles.inputLabel}>Email liên hệ:</Text>
        <TextInput
          style={styles.input}
          placeholder="example@gmail.com"
          placeholderTextColor="#8E8E93"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={styles.inputLabel}>Số điện thoại:</Text>
        <TextInput
          style={styles.input}
          placeholder="09xxxxxxxx"
          placeholderTextColor="#8E8E93"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <View style={styles.actionButtons}>
          <Button
            title={isSubmitting ? "Đang gửi..." : "Gửi yêu cầu đăng ký"}
            onPress={handleSubmitRequest}
            loading={isSubmitting}
            style={styles.submitBtn}
          />
          <Button
            title={isChecking ? "Đang kiểm tra..." : "Kiểm tra trạng thái"}
            onPress={handleCheckStatus}
            loading={isChecking}
            variant="outline"
            style={styles.checkBtn}
          />
        </View>
      </View>

      <View style={styles.transferCard}>
        <View style={styles.transferHeader}>
          <Text style={styles.transferBankTag}>Vietcombank</Text>
          <Text style={styles.transferHeaderTitle}>THÔNG TIN CHUYỂN KHOẢN</Text>
        </View>
        
        <View style={styles.transferBody}>
          <View style={styles.transferRow}>
            <Text style={styles.transferLabel}>Số tài khoản (VCB):</Text>
            <Text style={styles.transferValueSelectable} selectable={true}>0171003462117</Text>
          </View>
          <View style={styles.transferRow}>
            <Text style={styles.transferLabel}>Chủ tài khoản:</Text>
            <Text style={styles.transferValue}>PHAN ANH TUAN</Text>
          </View>
          <View style={styles.transferRow}>
            <Text style={styles.transferLabel}>Chi nhánh:</Text>
            <Text style={styles.transferValue}>Tây Sài Gòn</Text>
          </View>
          <View style={styles.transferRow}>
            <Text style={styles.transferLabel}>Số tiền:</Text>
            <Text style={[styles.transferValue, { color: COLORS.primary, fontWeight: '700' }]}>
              {selectedPlan === 'monthly' ? '79.000đ' : '600.000đ'}
            </Text>
          </View>
          <View style={styles.transferRow}>
            <Text style={styles.transferLabel}>Nội dung:</Text>
            <Text style={[styles.transferValueSelectable, { color: COLORS.secondary, fontWeight: '700' }]} selectable={true}>
              GUTSCORE {phone.trim() || '[Số điện thoại]'}
            </Text>
          </View>
        </View>

        <View style={styles.qrContainer}>
          <Text style={styles.qrTitle}>Quét mã QR để chuyển khoản nhanh:</Text>
          <Image
            source={{
              uri: `https://img.vietqr.io/image/VCB-0171003462117-compact2.png?amount=${
                selectedPlan === 'monthly' ? 79000 : 600000
              }&addInfo=GUTSCORE%20${phone.trim() || 'SDT'}&accountName=PHAN%20ANH%20TUAN`,
            }}
            style={styles.qrImage}
            resizeMode="contain"
          />
          <Text style={styles.qrSubtitle}>Dùng ứng dụng Ngân hàng để quét mã QR đã điền sẵn số tiền & nội dung</Text>
        </View>
      </View>

      <Button
        title="Quay lại Trang chủ"
        onPress={() => router.push('/(tabs)')}
        variant="outline"
        style={styles.backBtn}
      />
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
    marginBottom: SPACING.xl,
    marginTop: SPACING.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.sm,
  },
  benefitsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  benefitsTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  benefitItem: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  plansContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  planCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
  },
  activePlanCard: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F8FF', // Soft primary tint
  },
  planName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  planPrice: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.primary,
  },
  planDuration: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  planSavings: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: -12,
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  formTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionButtons: {
    flexDirection: 'column',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  submitBtn: {
    width: '100%',
  },
  checkBtn: {
    width: '100%',
  },
  statusBox: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 2,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  statusLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  statusValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  statusInstruction: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  transferCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transferHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    paddingBottom: SPACING.md,
    marginBottom: SPACING.md,
  },
  transferBankTag: {
    backgroundColor: '#005A3C', // Vietcombank primary dark green
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: BORDER_RADIUS.sm,
  },
  transferHeaderTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  transferBody: {
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  transferRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transferLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  transferValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  transferValueSelectable: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    backgroundColor: '#F2F2F7',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: BORDER_RADIUS.sm,
  },
  qrContainer: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: SPACING.lg,
  },
  qrTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  qrImage: {
    width: 220,
    height: 220,
    marginBottom: SPACING.sm,
  },
  qrSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.md,
    lineHeight: 18,
  },
  backBtn: {
    marginBottom: SPACING.xl,
  },
});
