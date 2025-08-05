import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Clock, User } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';

interface Shift {
  time: string;
  nurse: string;
  family: string;
}

interface DayShifts {
  id: string;
  date: string;
  shifts: Shift[];
}

export default function WeeklyShiftsScreen() {
  const shifts: DayShifts[] = [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Weekly Shifts</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {shifts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No shifts scheduled</Text>
            <Text style={styles.emptyStateSubtext}>Weekly shifts will appear here once scheduled</Text>
          </View>
        ) : (
          shifts.map((day) => (
            <View key={day.id} style={styles.daySection}>
              <Text style={styles.dayTitle}>{day.date}</Text>
              {day.shifts.map((shift, index) => (
                <View key={index} style={styles.shiftCard}>
                  <View style={styles.shiftTime}>
                    <Clock size={16} color={COLORS.primary} />
                    <Text style={styles.timeText}>{shift.time}</Text>
                  </View>
                  <View style={styles.shiftDetails}>
                    <View style={styles.detailRow}>
                      <User size={16} color={COLORS.primary} />
                      <Text style={styles.detailText}>{shift.nurse}</Text>
                    </View>
                    <Text style={styles.familyText}>{shift.family}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))
        )}
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
  content: {
    padding: 16,
  },
  daySection: {
    marginBottom: 24,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  shiftCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  shiftTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  shiftDetails: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text,
  },
  familyText: {
    marginLeft: 24,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});