import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Calendar, Clock, Plus, ChevronLeft, ChevronRight, User } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';

interface Shift {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  nurseName: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  recurring?: boolean;
}

export default function MyScheduleScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // TODO: Fetch shifts data from Supabase
  const shifts: Shift[] = [];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  const formatDate = (day: number) => {
    const date = new Date(currentDate);
    date.setDate(day);
    return date.toISOString().split('T')[0];
  };

  const getShiftsForDate = (day: number) => {
    const dateStr = formatDate(day);
    return shifts.filter(shift => shift.date === dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    const date = new Date(currentDate);
    date.setDate(day);
    
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (day: number) => {
    const date = new Date(currentDate);
    date.setDate(day);
    
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleDateSelect = (day: number) => {
    const date = new Date(currentDate);
    date.setDate(day);
    setSelectedDate(date);
  };

  const handleRequestShift = () => {
    router.push({
      pathname: '/family/request',
      params: { date: selectedDate.toISOString() }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return COLORS.success; // Green
      case 'pending':
        return COLORS.warning; // Yellow
      case 'cancelled':
        return COLORS.error; // Red
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusDots = (dayShifts: Shift[]) => {
    if (dayShifts.length === 0) return null;

    // Group shifts by status
    const statusCounts = dayShifts.reduce((acc, shift) => {
      acc[shift.status] = (acc[shift.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Create dots for each status type
    const dots: React.ReactNode[] = [];
    let dotIndex = 0;

    // Order: confirmed (green), pending (yellow), cancelled (red)
    const statusOrder = ['confirmed', 'pending', 'cancelled'];
    
    statusOrder.forEach(status => {
      if (statusCounts[status]) {
        for (let i = 0; i < Math.min(statusCounts[status], 3); i++) {
          dots.push(
            <View
              key={`${status}-${i}`}
              style={[
                styles.statusDot,
                { 
                  backgroundColor: getStatusColor(status),
                  left: dotIndex * 6,
                  top: dotIndex * 2
                }
              ]}
            />
          );
          dotIndex++;
          if (dotIndex >= 3) break; // Max 3 dots per day
        }
      }
    });

    return dots;
  };

  const selectedDateShifts = getShiftsForDate(selectedDate.getDate());
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Schedule</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleRequestShift}
        >
          <Plus size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Calendar Header */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity 
            style={styles.navigationButton}
            onPress={() => changeMonth(-1)}
          >
            <ChevronLeft size={24} color={COLORS.primary} />
          </TouchableOpacity>
          
          <Text style={styles.monthTitle}>{monthName}</Text>
          
          <TouchableOpacity 
            style={styles.navigationButton}
            onPress={() => changeMonth(1)}
          >
            <ChevronRight size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Calendar Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.success }]} />
            <Text style={styles.legendText}>Confirmed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.warning }]} />
            <Text style={styles.legendText}>Pending</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.error }]} />
            <Text style={styles.legendText}>Cancelled</Text>
          </View>
        </View>

        {/* Calendar */}
        <View style={styles.calendar}>
          <View style={styles.weekDaysContainer}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <Text key={index} style={styles.weekDay}>{day}</Text>
            ))}
          </View>
          
          <View style={styles.daysContainer}>
            {generateCalendarDays().map((day, index) => {
              if (day === null) {
                return <View key={`empty-${index}`} style={styles.emptyDay} />;
              }

              const dayShifts = getShiftsForDate(day);
              const hasShifts = dayShifts.length > 0;
              const isSelectedDay = isSelected(day);
              const isTodayDay = isToday(day);

              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.day,
                    isTodayDay && styles.todayDay,
                    isSelectedDay && styles.selectedDay,
                    hasShifts && styles.dayWithShifts,
                  ]}
                  onPress={() => handleDateSelect(day)}
                >
                  <Text style={[
                    styles.dayText,
                    isTodayDay && styles.todayDayText,
                    isSelectedDay && styles.selectedDayText,
                  ]}>
                    {day}
                  </Text>
                  {hasShifts && (
                    <View style={styles.statusDotsContainer}>
                      {getStatusDots(dayShifts)}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selected Date Details */}
        <View style={styles.selectedDateSection}>
          <Text style={styles.selectedDateTitle}>
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
          
          {selectedDateShifts.length > 0 ? (
            selectedDateShifts.map((shift) => (
              <View key={shift.id} style={styles.shiftCard}>
                <View style={styles.shiftHeader}>
                  <View style={styles.shiftTime}>
                    <Clock size={16} color={COLORS.primary} />
                    <Text style={styles.shiftTimeText}>
                      {shift.startTime} - {shift.endTime}
                    </Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    shift.status === 'confirmed' ? styles.confirmedBadge : 
                    shift.status === 'pending' ? styles.pendingBadge : styles.cancelledBadge
                  ]}>
                    <Text style={[
                      styles.statusText,
                      shift.status === 'confirmed' ? styles.confirmedText : 
                      shift.status === 'pending' ? styles.pendingText : styles.cancelledText
                    ]}>
                      {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.nurseInfo}>
                  <User size={16} color={COLORS.primary} />
                  <Text style={styles.nurseText}>{shift.nurseName}</Text>
                </View>
                
                {shift.recurring && (
                  <Text style={styles.recurringText}>Recurring shift</Text>
                )}
                
                <View style={styles.shiftActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => Alert.alert('Info', 'Shift details would open here')}
                  >
                    <Text style={styles.actionButtonText}>View Details</Text>
                  </TouchableOpacity>
                  
                  {shift.status === 'pending' && (
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.cancelButton]}
                      onPress={() => Alert.alert('Cancel Shift', 'Are you sure you want to cancel this shift?')}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  )}
                  
                  {shift.status === 'cancelled' && (
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.rescheduleButton]}
                      onPress={() => Alert.alert('Reschedule', 'Would you like to request a new shift for this date?')}
                    >
                      <Text style={styles.rescheduleButtonText}>Request New Shift</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noShiftsContainer}>
              <Calendar size={48} color={COLORS.textSecondary} />
              <Text style={styles.noShiftsTitle}>No shifts scheduled</Text>
              <Text style={styles.noShiftsText}>
                You don't have any shifts scheduled for this date.
              </Text>
              <TouchableOpacity 
                style={styles.requestShiftButton}
                onPress={handleRequestShift}
              >
                <Plus size={16} color={COLORS.white} />
                <Text style={styles.requestShiftText}>Request a Shift</Text>
              </TouchableOpacity>
            </View>
          )}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.white,
  },
  navigationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  calendar: {
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    position: 'relative',
  },
  emptyDay: {
    width: '14.28%',
    aspectRatio: 1,
  },
  todayDay: {
    backgroundColor: COLORS.primary + '20',
  },
  selectedDay: {
    backgroundColor: COLORS.primary,
  },
  dayWithShifts: {
    backgroundColor: COLORS.backgroundSecondary,
  },
  dayText: {
    fontSize: 16,
    color: COLORS.text,
  },
  todayDayText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  selectedDayText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  statusDotsContainer: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 12,
  },
  statusDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  selectedDateSection: {
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedDateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  shiftCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  shiftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  shiftTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shiftTimeText: {
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
  confirmedBadge: {
    backgroundColor: COLORS.success + '20',
  },
  pendingBadge: {
    backgroundColor: COLORS.warning + '20',
  },
  cancelledBadge: {
    backgroundColor: COLORS.error + '20',
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
  cancelledText: {
    color: COLORS.error,
  },
  nurseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nurseText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text,
  },
  recurringText: {
    fontSize: 12,
    color: COLORS.primary,
    marginBottom: 12,
  },
  shiftActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: COLORS.error,
  },
  cancelButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  rescheduleButton: {
    backgroundColor: COLORS.primary,
  },
  rescheduleButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  noShiftsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noShiftsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  noShiftsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  requestShiftButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  requestShiftText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});