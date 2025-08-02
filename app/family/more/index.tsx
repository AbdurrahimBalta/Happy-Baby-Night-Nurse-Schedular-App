import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { User, CreditCard, CircleHelp as HelpCircle, Settings, Star, Bell, LogOut, ChevronRight } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useFamily } from '@/hooks/useFamily';

export default function MoreScreen() {
  const { signOut } = useAuth();
  const { familyProfile } = useFamily();

  const handleOpenGoogleReview = () => {
    Linking.openURL('https://g.co/kgs/pfMJQjS');
  };

  const handleNotifications = () => {
    router.push('/family/more/notifications');
  };

  const handleSettings = () => {
    router.push('/family/more/settings');
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut }
      ]
    );
  };

  const menuItems = [
    {
      icon: <User size={22} color={COLORS.primary} />,
      title: 'My Profile',
      onPress: () => router.push('/family/more/profile'),
    },
    {
      icon: <CreditCard size={22} color={COLORS.primary} />,
      title: 'Payment Methods',
      onPress: () => router.push('/family/more/payments'),
    },
    {
      icon: <Bell size={22} color={COLORS.primary} />,
      title: 'Notifications',
      onPress: handleNotifications,
    },
    {
      icon: <Star size={22} color={COLORS.primary} />,
      title: 'Leave us a 5 Star Review',
      onPress: handleOpenGoogleReview,
    },
    {
      icon: <HelpCircle size={22} color={COLORS.primary} />,
      title: 'Help & Support',
      onPress: () => router.push('/family/more/help'),
    },
    {
      icon: <Settings size={22} color={COLORS.primary} />,
      title: 'Settings',
      onPress: handleSettings,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>More</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>
                {familyProfile?.parent1Name || 'Sarah Johnson'}
              </Text>
              <Text style={styles.profileBabies}>
                Parent of Emma and Liam
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.profileEditButton}
              onPress={() => router.push('/family/more/profile')}
            >
              <Text style={styles.profileEditText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuIconContainer}>{item.icon}</View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <ChevronRight size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

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
  scrollContent: {
    padding: 16,
  },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  profileBabies: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  profileEditButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 16,
  },
  profileEditText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  menuContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 24,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.error,
    fontWeight: '600',
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