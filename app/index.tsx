import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { COLORS } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Users, Shield } from 'lucide-react-native';

export default function Index() {
  const { user, isLoading, signInAsRole } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // If user is authenticated, redirect to appropriate home
  if (user) {
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

  // Show development mode screen if no user is authenticated
  const handleRoleLogin = async (role: 'family' | 'nurse' | 'admin') => {
    try {
      setIsSigningIn(true);
      await signInAsRole(role);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/Happy Baby Night Nurses Logos.png')}
            style={styles.logo} 
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Development Mode</Text>
          <Text style={styles.subtitle}>Which role would you like to login as?</Text>

          <TouchableOpacity
            style={[styles.roleButton, styles.familyButton]}
            onPress={() => handleRoleLogin('family')}
            disabled={isSigningIn}
          >
            <View style={styles.roleButtonContent}>
              <Heart size={32} color={COLORS.white} />
              <View style={styles.roleTextContainer}>
                <Text style={styles.roleTitle}>Family</Text>
                <Text style={styles.roleDescription}>Login as family account</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleButton, styles.nurseButton]}
            onPress={() => handleRoleLogin('nurse')}
            disabled={isSigningIn}
          >
            <View style={styles.roleButtonContent}>
              <Users size={32} color={COLORS.white} />
              <View style={styles.roleTextContainer}>
                <Text style={styles.roleTitle}>Nurse</Text>
                <Text style={styles.roleDescription}>Login as nurse account</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleButton, styles.adminButton]}
            onPress={() => handleRoleLogin('admin')}
            disabled={isSigningIn}
          >
            <View style={styles.roleButtonContent}>
              <Shield size={32} color={COLORS.white} />
              <View style={styles.roleTextContainer}>
                <Text style={styles.roleTitle}>Admin</Text>
                <Text style={styles.roleDescription}>Login as admin account</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.devNote}>
            <Text style={styles.devNoteText}>
              🚀 This is development mode. Normal auth system will be used in production.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
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
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 120,
    height: 120,
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: COLORS.textSecondary,
  },
  roleButton: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  roleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  roleTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
  },
  familyButton: {
    backgroundColor: '#4F46E5',
  },
  nurseButton: {
    backgroundColor: '#059669',
  },
  adminButton: {
    backgroundColor: '#7C3AED',
  },
  devNote: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  devNoteText: {
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
    lineHeight: 20,
  },
});