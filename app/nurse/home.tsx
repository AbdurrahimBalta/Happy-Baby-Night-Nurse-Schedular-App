import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Calendar, Clock, MapPin, Bell, FileText } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { formatDate, formatTime } from '@/utils/dateUtils';

export default function NurseHomeScreen() {
  const { user } = useAuth();
  const currentDate = new Date();
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [shiftStartTime, setShiftStartTime] = useState<Date | null>(null);

  const [notifications] = useState([
    {
      id: '1',
      type: 'urgent',
      title: 'Upcoming Shift Reminder',
      message: 'You have a shift with the Smith Family tonight at 8:00 PM',
      time: '2 hours until shift starts'
    },
    {
      id: '2',
      type: 'reminder',
      title: 'Shift Tomorrow',
      message: 'Scheduled shift with Johnson Family at 9:00 PM tomorrow',
      time: '24 hours until shift starts'
    }
  ]);

  const handleClockInOut = () => {
    if (!isClockedIn) {
      setShiftStartTime(new Date());
      setIsClockedIn(true);
    } else {
      setShiftStartTime(null);
      setIsClockedIn(false);
    }
  };

  const upcomingShifts = [
    {
      id: '1',
      family: 'Smith Family',
      date: 'Tonight',
      time: '8:00 PM - 6:00 AM',
      location: 'San Francisco, CA',
      babies: ['Oliver (3m)'],
      status: 'confirmed'
    },
    {
      id: '2',
      family: 'Johnson Family',
      date: 'Tomorrow',
      time: '9:00 PM - 7:00 AM',
      location: 'Palo Alto, CA',
      babies: ['Emma (6m)', 'Liam (6m)'],
      status: 'pending'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/Happy Baby Night Nurses Logos.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Welcome, {user?.name || 'Angela Davis'}</Text>
          <Text style={styles.dateText}>
            {formatDate(currentDate)} • {formatTime(currentDate)}
          </Text>
        </View>

        {notifications.length > 0 && (
          <View style={styles.notificationsContainer}>
            {notifications.map((notification) => (
              <View 
                key={notification.id} 
                style={[
                  styles.notificationCard,
                  notification.type === 'urgent' && styles.urgentNotification
                ]}
              >
                <View style={styles.notificationIcon}>
                  <Bell 
                    size={20} 
                    color={notification.type === 'urgent' ? COLORS.error : COLORS.primary} 
                  />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.statsContainer}>
          <TouchableOpacity 
            style={[styles.statCard, isClockedIn && styles.activeStatCard]}
            onPress={handleClockInOut}
          >
            <Clock size={24} color={isClockedIn ? COLORS.white : COLORS.primary} />
            <Text style={[styles.statAction, isClockedIn && styles.activeStatText]}>
              {isClockedIn ? 'Clock Out' : 'Clock In'}
            </Text>
            {shiftStartTime && (
              <Text style={[styles.shiftTime, isClockedIn && styles.activeStatText]}>
                Started at {formatTime(shiftStartTime)}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => router.push('/nurse/night-logs')}
          >
            <FileText size={24} color={COLORS.primary} />
            <Text style={styles.statAction}>Night Logs</Text>
            <Text style={styles.shiftTime}>View & Create</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Shifts</Text>
            <TouchableOpacity 
              style={styles.updateAvailabilityButton}
              onPress={() => router.push('/nurse/availability')}
            >
              <Text style={styles.updateAvailabilityText}>Update Availability</Text>
            </TouchableOpacity>
          </View>
          {upcomingShifts.map((shift) => (
            <TouchableOpacity 
              key={shift.id}
              style={styles.shiftCard}
              onPress={() => router.push(`/nurse/family/${shift.id}`)}
            >
              <View style={styles.shiftHeader}>
                <Text style={styles.familyName}>{shift.family}</Text>
                <View style={[
                  styles.statusBadge,
                  shift.status === 'confirmed' ? styles.confirmedBadge : styles.pendingBadge
                ]}>
                  <Text style={[
                    styles.statusText,
                    shift.status === 'confirmed' ? styles.confirmedText : styles.pendingText
                  ]}>
                    {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                  </Text>
                </View>
              </View>

              <View style={styles.shiftDetail}>
                <Calendar size={16} color={COLORS.primary} />
                <Text style={styles.shiftText}>{shift.date}</Text>
              </View>

              <View style={styles.shiftDetail}>
                <Clock size={16} color={COLORS.primary} />
                <Text style={styles.shiftText}>{shift.time}</Text>
              </View>

              <View style={styles.shiftDetail}>
                <MapPin size={16} color={COLORS.primary} />
                <Text style={styles.shiftText}>{shift.location}</Text>
              </View>

              <View style={styles.babiesContainer}>
                {shift.babies.map((baby, index) => (
                  <View key={index} style={styles.babyBadge}>
                    <Text style={styles.babyText}>{baby}</Text>
                  </View>
                ))}
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
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: '60%',
    height: 80,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  notificationsContainer: {
    marginBottom: 24,
    gap: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  urgentNotification: {
    borderLeftColor: COLORS.error,
    backgroundColor: COLORS.errorLight,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 100,
  },
  activeStatCard: {
    backgroundColor: COLORS.primary,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statAction: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 4,
  },
  activeStatText: {
    color: COLORS.white,
  },
  shiftTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  updateAvailabilityButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  updateAvailabilityText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  shiftCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  shiftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  familyName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confirmedBadge: {
    backgroundColor: COLORS.success + '20',
  },
  pendingBadge: {
    backgroundColor: COLORS.warning + '20',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  confirmedText: {
    color: COLORS.success,
  },
  pendingText: {
    color: COLORS.warning,
  },
  shiftDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  shiftText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text,
  },
  babiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  babyBadge: {
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  babyText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
});