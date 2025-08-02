import { Stack } from 'expo-router';
import { COLORS } from '@/constants/Colors';

export default function MoreLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="payments" />
      <Stack.Screen name="help" />
    </Stack>
  );
}