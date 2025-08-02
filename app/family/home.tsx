import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Calendar, Bell, Clock, Star, FileText } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useFamily } from '@/hooks/useFamily';
import { formatDate } from '@/utils/dateUtils';

export default function FamilyHomeScreen() {
  const { user } = useAuth();
  const { familyProfile, upcomingShifts, isLoading } = useFamily();
  const [greeting, setGreeting] = useState('');
  const [visibleNurses, setVisibleNurses] = useState(2);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const handleNotificationPress = () => {
    Alert.alert(
      'Notifications',
      'You have 3 new notifications:\n\n• Shift confirmed for tonight\n• New message from Angela\n• Payment processed successfully',
      [{ text: 'OK' }]
    );
  };

  const handleViewLogs = () => {
    router.push('/family/logs');
  };

  const renderUpcomingShift = (shift: any, index: number) => {
    return (
      <Animated.View 
        key={shift.id} 
        entering={FadeIn.delay(index * 200)}
        style={styles.shiftCard}
      >
        <View style={styles.shiftHeader}>
          <View style={styles.shiftTime}>
            <Calendar size={16} color={COLORS.primary} />
            <Text style={styles.shiftDate}>{formatDate(new Date(shift.date))}</Text>
          </View>
          <View style={styles.shiftStatus}>
            <Text style={[
              styles.statusText, 
              {color: shift.confirmed ? COLORS.success : COLORS.warning}
            ]}>
              {shift.confirmed ? 'Confirmed' : 'Pending'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.shiftBody}
          onPress={() => router.push(`/family/nurse/${shift.nurse.id}`)}
        >
          <View style={styles.nurseInfo}>
            <Image 
              source={{ uri: shift.nurse.picture }} 
              style={styles.nurseImage} 
            />
            <View style={styles.nurseDetails}>
              <Text style={styles.nurseName}>{shift.nurse.name}</Text>
              <Text style={styles.nurseRole}>Night Nurse</Text>
            </View>
          </View>
          
          <View style={styles.shiftTimes}>
            <Clock size={16} color={COLORS.textSecondary} />
            <Text style={styles.timeText}>
              {shift.startTime} - {shift.endTime}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderNurseProfile = (nurse: any, index: number) => {
    return (
      <Animated.View 
        key={nurse.id}
        entering={FadeIn.delay(index * 200)}
        style={styles.nurseProfileCard}
      >
        <TouchableOpacity 
          onPress={() => router.push(`/family/nurse/${nurse.id}`)}
        >
          <Image 
            source={{ uri: nurse.picture }}
            style={styles.nurseProfileImage}
          />
          <View style={styles.nurseProfileInfo}>
            <Text style={styles.nurseProfileName}>{nurse.name}</Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color={COLORS.warning} fill={COLORS.warning} />
              <Text style={styles.ratingText}>{nurse.rating}</Text>
            </View>
            <Text style={styles.nurseProfileBio}>
              {nurse.bio}
            </Text>
            <View style={styles.certificationsContainer}>
              {nurse.certifications.map((cert: string, index: number) => (
                <View key={index} style={styles.certBadge}>
                  <Text style={styles.certText}>{cert}</Text>
                </View>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
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

        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>{greeting},</Text>
          <Text style={styles.userName}>{familyProfile?.parent1Name || user?.email}</Text>
        </View>

        <View style={styles.notificationContainer}>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={handleNotificationPress}
          >
            <Bell size={24} color={COLORS.text} />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Animated.View 
          entering={FadeIn.duration(800)}
          style={styles.babyStatusCard}
        >
          <View style={styles.babyStatusHeader}>
            <Text style={styles.babyStatusTitle}>How was last night?</Text>
            <TouchableOpacity 
              style={styles.viewLogsButton}
              onPress={handleViewLogs}
            >
              <FileText size={16} color={COLORS.primary} />
              <Text style={styles.viewLogsText}>View Logs</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>6.5h</Text>
              <Text style={styles.statLabel}>Total Sleep</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Feedings</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Diapers</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.viewDetailsButton}
            onPress={handleViewLogs}
          >
            <Text style={styles.viewDetailsText}>View Full Log</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Shifts</Text>
          <TouchableOpacity onPress={() => router.push('/family/schedule')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <Text style={styles.loadingText}>Loading shifts...</Text>
        ) : upcomingShifts && upcomingShifts.length > 0 ? (
          upcomingShifts.map(renderUpcomingShift)
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>No upcoming shifts</Text>
            <TouchableOpacity 
              style={styles.requestButton}
              onPress={() => router.push('/family/request')}
            >
              <Text style={styles.requestButtonText}>Request a Shift</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Nurses</Text>
          <TouchableOpacity onPress={() => setVisibleNurses(prev => prev === 2 ? upcomingShifts.length : 2)}>
            <Text style={styles.seeAllText}>
              {visibleNurses === 2 ? 'See All' : 'Show Less'}
            </Text>
          </TouchableOpacity>
        </View>

        {upcomingShifts.slice(0, visibleNurses).map((shift, index) => renderNurseProfile(shift.nurse, index))}
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
  logoContainer: {
    width: '100%',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logo: {
    width: '80%',
    height: '100%',
  },
  greetingContainer: {
    marginBottom: 16,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  notificationContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
  },
  babyStatusCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  babyStatusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  babyStatusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  viewLogsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  viewLogsText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  viewDetailsButton: {
    alignSelf: 'center',
    paddingVertical: 8,
  },
  viewDetailsText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  seeAllText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  shiftCard: {
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
  shiftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  shiftTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shiftDate: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  shiftStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundSecondary,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  shiftBody: {
    flexDirection: 'column',
    gap: 12,
  },
  nurseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nurseImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  nurseDetails: {
    justifyContent: 'center',
  },
  nurseName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  nurseRole: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  shiftTimes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  loadingText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginVertical: 24,
  },
  emptyStateContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginVertical: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  requestButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  requestButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
  nurseProfileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  nurseProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  nurseProfileInfo: {
    flex: 1,
  },
  nurseProfileName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  nurseProfileBio: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  certificationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  certBadge: {
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  certText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
});