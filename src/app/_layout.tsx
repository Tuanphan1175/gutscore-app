import { Stack } from 'expo-router';
import { Platform, View, StyleSheet, ViewStyle } from 'react-native';
import { useEffect } from 'react';
import { useUserStore } from '@/store/user-store';

export default function RootLayout() {
  const { initializeUser } = useUserStore();

  useEffect(() => {
    initializeUser();
  }, []);

  const content = (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="result" options={{ presentation: 'modal' }} />
      <Stack.Screen name="subscription" />
      <Stack.Screen name="login" />
    </Stack>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <View style={styles.phoneFrame}>
          {content}
        </View>
      </View>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#0F0F11',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  phoneFrame: {
    width: '100%',
    maxWidth: 430,
    height: '100%',
    maxHeight: 880,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 8,
    borderColor: '#1E2025',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    paddingBottom: 20,
  },
});
