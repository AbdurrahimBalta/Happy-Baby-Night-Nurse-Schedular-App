import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import CustomButton from '@/components/common/CustomButton';

export default function AvailabilityScreen() {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  const generateCalendarDays = (date: Date) => {
    const daysInMonth = getDaysInMonth(date);
    const firstDay = getFirstDayOfMonth(date);
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

  const formatDate = (day: number, monthOffset: number = 0) => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() + monthOffset);
    date.setDate(day);
    return date.toISOString().split('T')[0];
  };

  const toggleDate = (day: number, monthOffset: number) => {
    const dateStr = formatDate(day, monthOffset);
    if (selectedDates.includes(dateStr)) {
      setSelectedDates(selectedDates.filter(d => d !== dateStr));
    } else {
      setSelectedDates([...selectedDates, dateStr]);
    }
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentMonth(newDate);
  };

  const handleSave = () => {
    // Add save logic here
    router.back();
  };

  const renderCalendar = (monthOffset: number = 0) => {
    const calendarDate = new Date(currentMonth);
    calendarDate.setMonth(calendarDate.getMonth() + monthOffset);
    const days = generateCalendarDays(calendarDate);
    const monthName = calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
      <View style={styles.calendarContainer}>
        <Text style={styles.monthTitle}>{monthName}</Text>
        <View style={styles.weekDaysContainer}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <Text key={index} style={styles.weekDay}>{day}</Text>
          ))}
        </View>
        <View style={styles.daysContainer}>
          {days.map((day, index) => {
            if (day === null) {
              return <View key={`empty-${index}`} style={styles.emptyDay} />;
            }

            const dateStr = formatDate(day, monthOffset);
            const isSelected = selectedDates.includes(dateStr);
            const date = new Date(dateStr);
            const isDisabled = date < new Date() || date > new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

            return (
              <TouchableOpacity
                key={dateStr}
                style={[
                  styles.day,
                  isSelected && styles.selectedDay,
                  isDisabled && styles.disabledDay,
                ]}
                onPress={() => !isDisabled && toggleDate(day, monthOffset)}
                disabled={isDisabled}
              >
                <Text style={[
                  styles.dayText,
                  isSelected && styles.selectedDayText,
                  isDisabled && styles.disabledDayText,
                ]}>{day}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
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
        <Text style={styles.headerTitle}>Update Availability</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.monthNavigation}>
        <TouchableOpacity 
          style={styles.navigationButton}
          onPress={() => changeMonth(-2)}
        >
          <ChevronLeft size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navigationButton}
          onPress={() => changeMonth(2)}
        >
          <ChevronRight size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.calendarsContainer}>
          {renderCalendar(0)}
          {renderCalendar(1)}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.selectedCountContainer}>
          <Text style={styles.selectedCountLabel}>Total Shifts Selected:</Text>
          <Text style={styles.selectedCountNumber}>{selectedDates.length}</Text>
        </View>
        <CustomButton
          title="Save Availability"
          onPress={handleSave}
          style={styles.saveButton}
        />
      </View>
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
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  navigationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  calendarsContainer: {
    padding: 16,
  },
  calendarContainer: {
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
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
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
  },
  emptyDay: {
    width: '14.28%',
    aspectRatio: 1,
  },
  selectedDay: {
    backgroundColor: COLORS.primary,
  },
  disabledDay: {
    opacity: 0.5,
  },
  dayText: {
    fontSize: 16,
    color: COLORS.text,
  },
  selectedDayText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  disabledDayText: {
    color: COLORS.textSecondary,
  },
  footer: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  selectedCountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: COLORS.backgroundSecondary,
    padding: 12,
    borderRadius: 8,
  },
  selectedCountLabel: {
    fontSize: 16,
    color: COLORS.text,
    marginRight: 8,
  },
  selectedCountNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  saveButton: {
    marginTop: 8,
  },
});