import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    home: '🏠',
    assessment: '📋',
    history: '📊',
    profile: '👤',
  };
  return (
    <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.5 }}>
      {icons[name] || '•'}
    </Text>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#208AEF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#E5E5EA',
          height: Platform.OS === 'web' ? 75 : 60,
          paddingBottom: Platform.OS === 'web' ? 12 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: '#208AEF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
          headerTitle: 'Gutscore',
        }}
      />
      <Tabs.Screen
        name="assessment"
        options={{
          title: 'Đánh giá',
          tabBarIcon: ({ focused }) => <TabIcon name="assessment" focused={focused} />,
          headerTitle: 'Đánh giá sức khỏe',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Lịch sử',
          tabBarIcon: ({ focused }) => <TabIcon name="history" focused={focused} />,
          headerTitle: 'Lịch sử đánh giá',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Hồ sơ',
          tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} />,
          headerTitle: 'Hồ sơ cá nhân',
        }}
      />
    </Tabs>
  );
}