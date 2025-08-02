import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Lock } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import CustomInput from '@/components/common/CustomInput';
import CustomButton from '@/components/common/CustomButton';

export default function SettingsScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      // Show error
      return;
    }
    setIsLoading(true);
    // Add password update logic here
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
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

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Notifications</Text>
          </View>
          <TouchableOpacity style={styles.toggleItem}>
            <Text style={styles.toggleText}>Push Notifications</Text>
            <View style={[styles.toggle, styles.toggleActive]}>
              <View style={styles.toggleCircle} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toggleItem}>
            <Text style={styles.toggleText}>Email Notifications</Text>
            <View style={[styles.toggle, styles.toggleActive]}>
              <View style={styles.toggleCircle} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toggleItem}>
            <Text style={styles.toggleText}>New Shift Alerts</Text>
            <View style={[styles.toggle, styles.toggleActive]}>
              <View style={styles.toggleCircle} />
            </View>
          </TouchableOpacity>
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
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  content: {
    flex: 1,
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
    marginTop: 16,
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
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    alignSelf: 'flex-end',
  },
});