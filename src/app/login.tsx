import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '@/constants/theme';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/user-store';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useUserStore();
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!fullname.trim() || !phone.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ Họ tên và Số điện thoại');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(fullname, phone);
      if (res.success) {
        Alert.alert('Thành công', 'Chào mừng bạn quay trở lại với Gutscore Premium!');
        router.replace('/(tabs)/profile');
      } else {
        Alert.alert('Đăng nhập thất bại', res.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Đã xảy ra sự cố kết nối. Vui lòng kiểm tra mạng và thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.logo}>👨‍⚕️</Text>
          <Text style={styles.title}>Đăng Nhập Premium</Text>
          <Text style={styles.subtitle}>
            Nhập Họ tên và Số điện thoại đã được Bác sĩ Phan Anh Tuấn kích hoạt để mở khóa tính năng cao cấp.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Họ và tên của bạn:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ví dụ: Nguyễn Văn A"
            placeholderTextColor="#8E8E93"
            value={fullname}
            onChangeText={setFullname}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Số điện thoại đăng ký:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ví dụ: 09xxxxxxxx"
            placeholderTextColor="#8E8E93"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Button
            title={isLoading ? "Đang xử lý..." : "Đăng nhập ngay"}
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginBtn}
          />
        </View>

        <TouchableOpacity 
          style={styles.registerLink}
          onPress={() => router.push('/subscription')}
        >
          <Text style={styles.registerText}>
            Chưa có gói Premium? <Text style={styles.registerHighlight}>Đăng ký ngay tại đây</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.backLink}
        onPress={() => router.replace('/(tabs)')}
      >
        <Text style={styles.backText}>Quay lại Trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logo: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  form: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
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
  loginBtn: {
    marginTop: SPACING.sm,
    width: '100%',
  },
  registerLink: {
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  registerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  registerHighlight: {
    color: COLORS.secondary,
    fontWeight: '600',
  },
  backLink: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  backText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
  },
});
