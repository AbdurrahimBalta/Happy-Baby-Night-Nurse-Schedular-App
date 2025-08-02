import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { COLORS } from '@/constants/Colors';

export default function Index() {
  const { user, isLoading } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Redirect based on authentication status and user role
  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  switch (user.role) {
    case 'family':
      return <Redirect href="/family/home" />;
    case 'nurse':
      return <Redirect href="/nurse/home" />;
    case 'admin':
      return <Redirect href="/admin/home" />;
    default:
      return <Redirect href="/auth/login" />;
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.text,
  },
});