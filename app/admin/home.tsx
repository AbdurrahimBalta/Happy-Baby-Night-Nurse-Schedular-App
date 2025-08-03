import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Users, Settings, ChevronRight, User, MessageSquare, Calendar, DollarSign, FileText, ChartBar as BarChart } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';

export default function AdminHomeScreen() {
  const { user } = useAuth();

  // TODO: Fetch admin profile data from Supabase
  const adminName = user?.email?.split('@')[0] || 'Admin'; // Temporary fallback

  const menuItems = [
    {
      icon: <Users size={24} color={COLORS.primary} />,
      title: 'Manage Families',
      subtitle: '12 active families',
      route: '/admin/families',
    },
    {
      icon: <Calendar size={24} color={COLORS.primary} />,
      title: 'Manage Shifts',
      subtitle: 'Schedule and assign shifts',
      route: '/admin/manage-shifts',
    },
    {
      icon: <DollarSign size={24} color={COLORS.primary} />,
      title: 'Manage Payroll',
      subtitle: 'Track hours and payments',
      route: '/admin/payroll',
    },
    {
      icon: <MessageSquare size={24} color={COLORS.primary} />,
      title: 'Nurse Messenger',
      subtitle: 'Communicate with all nurses',
      route: '/admin/messenger',
    },
    {
      icon: <FileText size={24} color={COLORS.primary} />,
      title: 'Night Logs',
      subtitle: 'View all family night logs',
      route: '/admin/night-logs'
    },
    {
      icon: <BarChart size={24} color={COLORS.primary} />, 
      title: 'Expense Dashboard',
      subtitle: 'Track revenue and expenses',
      route: '/admin/expense-dashboard',
    },
    {
      icon: <User size={24} color={COLORS.primary} />,
      title: 'My Profile',
      subtitle: 'Manage admin profile',
      route: '/admin/profile'
    },
    {
      icon: <Settings size={24} color={COLORS.primary} />,
      title: 'Settings',
      subtitle: 'App configuration',
      route: '/admin/settings',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.adminName}>{adminName}</Text>
          
          {/* Happy Baby Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/Happy Baby Night Nurses Logos.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.statsContainer}>
          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => router.push('/admin/shifts/weekly')}
          >
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Total Shifts</Text>
            <Text style={styles.statSubtext}>This Week</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => router.push('/admin/urgent-messages')}
          >
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Urgent Messages</Text>
            <Text style={styles.statSubtext}>From Families</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => router.push('/admin/shifts/uncovered')}
          >
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Shifts Needing Coverage</Text>
            <Text style={styles.statSubtext}>This Week</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => router.push('/admin/shifts/tonight')}
          >
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Shifts Tonight</Text>
            <Text style={styles.statSubtext}>All Covered</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => router.push(item.route)}
            >
              <View style={styles.menuItemContent}>
                <View style={styles.menuItemIcon}>
                  {item.icon}
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
                <ChevronRight size={20} color={COLORS.textSecondary} />
              </View>
            </TouchableOpacity>
          ))}
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
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  greeting: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  adminName: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 24,
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '70%',
    height: 80,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
    textAlign: 'center',
  },
  statSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});