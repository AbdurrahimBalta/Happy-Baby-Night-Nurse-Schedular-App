import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Clock, MapPin, Baby, AlertCircle } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';

export default function UncoveredShiftsScreen() {
  const shifts = [
    {
      id: '1',
      family: 'Williams Family',
      date: 'Tonight',
      time: '8:00 PM - 6:00 AM',
      location: '789 Pine St, San Francisco',
      children: ['Sophia (4m)', 'Lucas (4m)'],
      recurring: true,
      frequency: 'Mon, Wed, Fri',
      urgent: true
    },
    {
      id: '2',
      family: 'Brown Family',
      date: 'Tomorrow',
      time: '9:00 PM - 7:00 AM',
      location: '321 Elm St, San Francisco',
      children: ['Oliver (3m)'],
      recurring: false,
      urgent: false
    },
    // Add more shifts...
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shifts Needing Coverage</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {shifts.map((shift) => (
          <View key={shift.id} style={styles.shiftCard}>
            <View style={styles.shiftHeader}>
              <Text style={styles.familyName}>{shift.family}</Text>
              {shift.urgent && (
                <View style={styles.urgentBadge}>
                  <AlertCircle size={16} color={COLORS.error} />
                  <Text style={styles.urgentText}>Urgent</Text>
                </View>
              )}
            </View>

            <View style={styles.shiftDetails}>
              <View style={styles.detailRow}>
                <Clock size={16} color={COLORS.primary} />
                <Text style={styles.detailText}>{shift.date} • {shift.time}</Text>
              </View>

              <View style={styles.detailRow}>
                <MapPin size={16} color={COLORS.primary} />
                <Text style={styles.detailText}>{shift.location}</Text>
              </View>

              <View style={styles.detailRow}>
                <Baby size={16} color={COLORS.primary} />
                <Text style={styles.detailText}>{shift.children.join(', ')}</Text>
              </View>

              {shift.recurring && (
                <View style={styles.recurringBadge}>
                  <Text style={styles.recurringText}>
                    Recurring: {shift.frequency}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity 
              style={styles.assignButton}
              onPress={() => router.push('/admin/nurses')}
            >
              <Text style={styles.assignButtonText}>Assign Nurse</Text>
            </TouchableOpacity>
          </View>
        ))}
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
  shiftCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
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
  familyName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgentText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.error,
  },
  shiftDetails: {
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text,
  },
  recurringBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  recurringText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.primary,
  },
  assignButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  assignButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
});