import { Stack } from 'expo-router';
import { COLORS } from '@/constants/Colors';

export default function PayrollLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="nurse/[id]" />
      <Stack.Screen name="pay-period" />
    </Stack>
  );
}