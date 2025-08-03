import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { COLORS } from '@/constants/Colors';
import { Users, Heart, Shield } from 'lucide-react-native';

export default function LoginScreen() {
  const { signInAsRole, isLoading } = useAuth();

  const handleRoleLogin = async (role: 'family' | 'nurse' | 'admin') => {
    try {
      await signInAsRole(role);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/Happy Baby Night Nurses Logos.png')}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: COLORS.white,
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  logo: {
    width: '80%',
    height: 120,
    alignSelf: 'center'
  },
  formContainer: {
    width: '100%',
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  roleButton: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  familyButton: {
    backgroundColor: COLORS.primary,
  },
  nurseButton: {
    backgroundColor: '#10B981', // Green
  },
  adminButton: {
    backgroundColor: '#8B5CF6', // Purple
  },
  roleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
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