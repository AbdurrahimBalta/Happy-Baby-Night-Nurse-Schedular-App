import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Clock, User, MapPin } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';

interface TonightShift {
  id: string;
  time: string;
  nurse: string;
  family: string;
  location: string;
  status: string;
}

export default function TonightShiftsScreen() {
  const shifts: TonightShift[] = [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tonight's Shifts</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {shifts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No shifts tonight</Text>
            <Text style={styles.emptyStateSubtext}>Tonight's shifts will appear here once scheduled</Text>
          </View>
        ) : (
          shifts.map((shift) => (
            <View key={shift.id} style={styles.shiftCard}>
              <View style={styles.shiftHeader}>
                <View style={styles.timeContainer}>
                  <Clock size={16} color={COLORS.primary} />
                  <Text style={styles.timeText}>{shift.time}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  shift.status === 'Checked In' ? styles.checkedInBadge : styles.pendingBadge
                ]}>
                  <Text style={[
                    styles.statusText,
                    shift.status === 'Checked In' ? styles.checkedInText : styles.pendingText
                  ]}>{shift.status}</Text>
                </View>
              </View>

              <View style={styles.shiftDetails}>
                <View style={styles.detailRow}>
                  <User size={16} color={COLORS.primary} />
                  <Text style={styles.detailText}>{shift.nurse}</Text>
                </View>
                <Text style={styles.familyText}>{shift.family}</Text>
                <View style={styles.detailRow}>
                  <MapPin size={16} color={COLORS.primary} />
                  <Text style={styles.locationText}>{shift.location}</Text>
                </View>
              </View>
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
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  checkedInBadge: {
    backgroundColor: COLORS.success + '20',
  },
  pendingBadge: {
    backgroundColor: COLORS.warning + '20',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  checkedInText: {
    color: COLORS.success,
  },
  pendingText: {
    color: COLORS.warning,
  },
  shiftDetails: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 8,
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