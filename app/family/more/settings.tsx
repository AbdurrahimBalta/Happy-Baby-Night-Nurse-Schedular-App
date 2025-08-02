import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Mail, Lock, Bell, Moon, Shield, CreditCard } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import CustomInput from '@/components/common/CustomInput';
import CustomButton from '@/components/common/CustomButton';

export default function FamilySettingsScreen() {
  const [email, setEmail] = useState('sarah.johnson@example.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [shiftReminders, setShiftReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleUpdateEmail = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Email updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Error', 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSetting = (setting: string, currentValue: boolean, setter: (value: boolean) => void) => {
    setter(!currentValue);
    // In a real app, you would save this to your backend
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // Handle account deletion
            Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Account Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Mail size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Account Settings</Text>
          </View>
          
          <CustomInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <CustomButton
            title="Update Email"
            onPress={handleUpdateEmail}
            isLoading={isLoading}
            style={styles.updateButton}
          />
        </View>

        {/* Password Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Lock size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Change Password</Text>
          </View>
          
          <CustomInput
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
          />
          
          <CustomInput
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          
          <CustomInput
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          
          <CustomButton
            title="Update Password"
            onPress={handleUpdatePassword}
            isLoading={isLoading}
            style={styles.updateButton}
          />
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Notifications</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.toggleItem}
            onPress={() => toggleSetting('push', pushNotifications, setPushNotifications)}
          >
            <Text style={styles.toggleText}>Push Notifications</Text>
            <View style={[styles.toggle, pushNotifications && styles.toggleActive]}>
              <View style={[
                styles.toggleCircle,
                pushNotifications ? styles.toggleCircleActive : styles.toggleCircleInactive
              ]} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.toggleItem}
            onPress={() => toggleSetting('email', emailNotifications, setEmailNotifications)}
          >
            <Text style={styles.toggleText}>Email Notifications</Text>
            <View style={[styles.toggle, emailNotifications && styles.toggleActive]}>
              <View style={[
                styles.toggleCircle,
                emailNotifications ? styles.toggleCircleActive : styles.toggleCircleInactive
              ]} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.toggleItem}
            onPress={() => toggleSetting('shifts', shiftReminders, setShiftReminders)}
          >
            <Text style={styles.toggleText}>Shift Reminders</Text>
            <View style={[styles.toggle, shiftReminders && styles.toggleActive]}>
              <View style={[
                styles.toggleCircle,
                shiftReminders ? styles.toggleCircleActive : styles.toggleCircleInactive
              ]} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Appearance Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Moon size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Appearance</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.toggleItem}
            onPress={() => toggleSetting('dark', darkMode, setDarkMode)}
          >
            <Text style={styles.toggleText}>Dark Mode</Text>
            <View style={[styles.toggle, darkMode && styles.toggleActive]}>
              <View style={[
                styles.toggleCircle,
                darkMode ? styles.toggleCircleActive : styles.toggleCircleInactive
              ]} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Privacy & Security */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Privacy & Security</Text>
          </View>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Privacy Policy</Text>
            <ChevronLeft size={16} color={COLORS.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Terms of Service</Text>
            <ChevronLeft size={16} color={COLORS.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Data Export</Text>
            <ChevronLeft size={16} color={COLORS.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
        </View>

        {/* Billing Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CreditCard size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Billing</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/family/more/payments')}
          >
            <Text style={styles.menuItemText}>Payment Methods</Text>
            <ChevronLeft size={16} color={COLORS.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Billing History</Text>
            <ChevronLeft size={16} color={COLORS.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={styles.dangerSectionTitle}>Danger Zone</Text>
          
          <CustomButton
            title="Delete Account"
            onPress={handleDeleteAccount}
            style={styles.deleteButton}
            textStyle={styles.deleteButtonText}
          />
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 12,
  },
  updateButton: {
    marginTop: 8,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  toggleText: {
    fontSize: 16,
    color: COLORS.text,
  },
  toggle: {
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.border,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.white,
  },
  toggleCircleActive: {
    alignSelf: 'flex-end',
  },
  toggleCircleInactive: {
    alignSelf: 'flex-start',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemText: {
    fontSize: 16,
    color: COLORS.text,
  },
  dangerSection: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.error + '20',
  },
  dangerSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.error,
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
  deleteButtonText: {
    color: COLORS.white,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  versionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});