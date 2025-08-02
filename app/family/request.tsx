import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateTimePicker from '@/components/common/DateTimePicker';
import CustomButton from '@/components/common/CustomButton';
import NurseSelector from '@/components/family/NurseSelector';
import ShiftSummary from '@/components/family/ShiftSummary';
import { COLORS } from '@/constants/Colors';
import { formatDate, formatTime } from '@/utils/dateUtils';

export default function RequestShiftScreen() {
  const router = useRouter();
  const { date: initialDate } = useLocalSearchParams<{ date: string }>();
  
  const [date, setDate] = useState(initialDate ? new Date(initialDate) : new Date());
  const [startTime, setStartTime] = useState(new Date().setHours(20, 0, 0, 0));
  const [endTime, setEndTime] = useState(new Date().setHours(8, 0, 0, 0));
  const [selectedNurseId, setSelectedNurseId] = useState<string | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState<number[]>([]);
  const [recurringWeeks, setRecurringWeeks] = useState(4);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const totalHours = Math.abs(new Date(endTime).getHours() - new Date(startTime).getHours()) || 12;
  const baseRate = 52; // Standard rate per hour
  const weekendRate = 56; // Weekend rate per hour
  
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const hourlyRate = isWeekend ? weekendRate : baseRate;
  const subtotal = totalHours * hourlyRate;
  const serviceFee = subtotal * 0.05; // 5% service fee
  const total = subtotal + serviceFee;
  
  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
  };
  
  const handleStartTimeChange = (newTime: number) => {
    setStartTime(newTime);
  };
  
  const handleEndTimeChange = (newTime: number) => {
    setEndTime(newTime);
  };
  
  const toggleRecurring = () => {
    setIsRecurring(!isRecurring);
    if (!isRecurring) {
      // When enabling recurring, add the current day of week
      setRecurringDays([date.getDay()]);
    } else {
      // When disabling, clear the selected days
      setRecurringDays([]);
    }
  };
  
  const toggleDay = (dayIndex: number) => {
    if (recurringDays.includes(dayIndex)) {
      setRecurringDays(recurringDays.filter(day => day !== dayIndex));
    } else {
      setRecurringDays([...recurringDays, dayIndex]);
    }
  };
  
  const adjustRecurringWeeks = (amount: number) => {
    const newValue = recurringWeeks + amount;
    if (newValue >= 1 && newValue <= 12) {
      setRecurringWeeks(newValue);
    }
  };
  
  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Request Submitted',
        'Your shift request has been sent successfully!',
        [
          { 
            text: 'OK', 
            onPress: () => router.push('/family/home')
          }
        ]
      );
    }, 2000);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Request a Nurse</Text>
        <View style={styles.stepIndicator}>
          {[1, 2, 3].map((s) => (
            <View 
              key={s}
              style={[
                styles.stepDot,
                step === s ? styles.activeStepDot : null
              ]}
            />
          ))}
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Select Date & Time</Text>
            
            <View style={styles.formSection}>
              <Text style={styles.sectionLabel}>Date</Text>
              <DateTimePicker
                mode="date"
                value={date}
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            </View>
            
            <View style={styles.formSection}>
              <Text style={styles.sectionLabel}>Start Time</Text>
              <DateTimePicker
                mode="time"
                value={new Date(startTime)}
                onChange={handleStartTimeChange}
              />
            </View>
            
            <View style={styles.formSection}>
              <Text style={styles.sectionLabel}>End Time</Text>
              <DateTimePicker
                mode="time"
                value={new Date(endTime)}
                onChange={handleEndTimeChange}
              />
            </View>
            
            <View style={styles.recurringContainer}>
              <View style={styles.recurringHeader}>
                <Text style={styles.sectionLabel}>Make it recurring?</Text>
                <TouchableOpacity 
                  style={[
                    styles.toggleButton,
                    isRecurring ? styles.toggleActive : {}
                  ]}
                  onPress={toggleRecurring}
                >
                  <View style={[
                    styles.toggleCircle,
                    isRecurring ? styles.toggleCircleActive : {}
                  ]} />
                </TouchableOpacity>
              </View>
              
              {isRecurring && (
                <View style={styles.recurringOptions}>
                  <Text style={styles.recurringLabel}>Select days:</Text>
                  <View style={styles.daysContainer}>
                    {daysOfWeek.map((day, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dayButton,
                          recurringDays.includes(index) ? styles.dayButtonActive : {}
                        ]}
                        onPress={() => toggleDay(index)}
                      >
                        <Text 
                          style={[
                            styles.dayText,
                            recurringDays.includes(index) ? styles.dayTextActive : {}
                          ]}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  
                  <Text style={styles.recurringLabel}>For how many weeks?</Text>
                  <View style={styles.weeksSelector}>
                    <TouchableOpacity 
                      style={styles.weekButton}
                      onPress={() => adjustRecurringWeeks(-1)}
                    >
                      <Text style={styles.weekButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.weeksText}>{recurringWeeks} weeks</Text>
                    <TouchableOpacity 
                      style={styles.weekButton}
                      onPress={() => adjustRecurringWeeks(1)}
                    >
                      <Text style={styles.weekButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}
        
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Select Nurse</Text>
            <NurseSelector 
              selectedNurseId={selectedNurseId}
              onSelectNurse={setSelectedNurseId}
            />
          </View>
        )}
        
        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Review & Confirm</Text>
            
            <ShiftSummary
              date={formatDate(date)}
              startTime={formatTime(new Date(startTime))}
              endTime={formatTime(new Date(endTime))}
              isRecurring={isRecurring}
              recurringDays={recurringDays.map(day => daysOfWeek[day])}
              recurringWeeks={recurringWeeks}
              hourlyRate={hourlyRate}
              hours={totalHours}
              subtotal={subtotal}
              serviceFee={serviceFee}
              total={total}
              selectedNurseId={selectedNurseId}
            />
          </View>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        {step > 1 && (
          <CustomButton
            title="Back"
            onPress={handleBack}
            style={styles.backButton}
            textStyle={styles.backButtonText}
            outline
          />
        )}
        
        {step < 3 ? (
          <CustomButton
            title="Next"
            onPress={handleNext}
            style={[styles.actionButton, step > 1 ? styles.halfButton : {}]}
          />
        ) : (
          <CustomButton
            title="Confirm Request"
            onPress={handleSubmit}
            isLoading={isLoading}
            style={[styles.actionButton, styles.halfButton]}
          />
        )}
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
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  activeStepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 24,
  },
  formSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  recurringContainer: {
    marginTop: 8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
  },
  recurringHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleButton: {
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.border,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.white,
  },
  toggleCircleActive: {
    alignSelf: 'flex-end',
  },
  recurringOptions: {
    marginTop: 16,
  },
  recurringLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  dayButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: COLORS.backgroundSecondary,
    marginRight: 8,
    marginBottom: 8,
  },
  dayButtonActive: {
    backgroundColor: COLORS.primary,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  dayTextActive: {
    color: COLORS.white,
  },
  weeksSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  weekButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  weeksText: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 16,
    color: COLORS.text,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  backButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backButtonText: {
    color: COLORS.text,
  },
  actionButton: {
    flex: 1,
  },
  halfButton: {
    flex: 1,
    marginLeft: 8,
  },
});