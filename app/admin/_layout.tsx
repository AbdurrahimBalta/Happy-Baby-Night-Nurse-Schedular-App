import { Stack } from 'expo-router';
import { COLORS } from '@/constants/Colors';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="home" />
      <Stack.Screen name="nurses" />
      <Stack.Screen name="families" />
      <Stack.Screen name="families/[id]" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="manage-shifts" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="group-chat" />
      <Stack.Screen name="messenger" />
      <Stack.Screen name="urgent-messages" />
      <Stack.Screen name="shifts/weekly" />
      <Stack.Screen name="shifts/tonight" />
      <Stack.Screen name="shifts/uncovered" />
      <Stack.Screen name="shifts/satisfaction" />
      <Stack.Screen name="expense-dashboard" />
      <Stack.Screen name="expense-dashboard/revenue" />
      <Stack.Screen name="expense-dashboard/expenses" />
      <Stack.Screen name="expense-dashboard/export" />
    </Stack>
  );
}