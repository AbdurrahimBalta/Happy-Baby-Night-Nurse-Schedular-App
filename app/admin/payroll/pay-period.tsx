import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Calendar, Plus, Trash2, ChevronDown } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import CustomInput from '@/components/common/CustomInput';
import CustomButton from '@/components/common/CustomButton';

interface PayPeriodSettings {
  frequency: 'weekly' | 'biweekly' | 'monthly';
  startDay: string;
  weekendRate: number;
  holidayRate: number;
  twinsRate: number;
  insuranceDeduction: number;
  backgroundCheckDeduction: number;
}

interface Holiday {
  id: string;
  name: string;
  date: Date;
}

export default function PayPeriodSettingsScreen() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<PayPeriodSettings>({
    frequency: 'biweekly',
    startDay: 'monday',
    weekendRate: 4,
    holidayRate: 4,
    twinsRate: 5,
    insuranceDeduction: 125,
    backgroundCheckDeduction: 30
  });

  const [holidays, setHolidays] = useState<Holiday[]>([
    { id: '1', name: 'New Year\'s Day', date: new Date(2024, 0, 1) },
    { id: '2', name: 'Memorial Day', date: new Date(2024, 4, 27) },
    { id: '3', name: 'Independence Day', date: new Date(2024, 6, 4) },
    { id: '4', name: 'Labor Day', date: new Date(2024, 8, 2) },
    { id: '5', name: 'Thanksgiving', date: new Date(2024, 10, 28) },
    { id: '6', name: 'Christmas Day', date: new Date(2024, 11, 25) }
  ]);

  const [newHolidayName, setNewHolidayName] = useState('');
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [showDayPicker, setShowDayPicker] = useState(false);

  const daysOfWeek = [
    { key: 'sunday', label: 'Sunday' },
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Pay period settings updated successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddHoliday = () => {
    if (!newHolidayName.trim() || !newHolidayDate.trim()) {
      Alert.alert('Error', 'Please enter both holiday name and date');
      return;
    }

    const date = new Date(newHolidayDate);
    if (isNaN(date.getTime())) {
      Alert.alert('Error', 'Please enter a valid date (YYYY-MM-DD)');
      return;
    }

    const newHoliday: Holiday = {
      id: Date.now().toString(),
      name: newHolidayName.trim(),
      date: date
    };

    setHolidays(prev => [...prev, newHoliday].sort((a, b) => a.date.getTime() - b.date.getTime()));
    setNewHolidayName('');
    setNewHolidayDate('');
  };

  const handleRemoveHoliday = (holidayId: string) => {
    Alert.alert(
      'Remove Holiday',
      'Are you sure you want to remove this holiday?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => setHolidays(prev => prev.filter(h => h.id !== holidayId))
        }
      ]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const selectDay = (day: string) => {
    setSettings(prev => ({ ...prev, startDay: day }));
    setShowDayPicker(false);
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
        <Text style={styles.headerTitle}>Pay Period Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Pay Period Frequency */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pay Period Frequency</Text>
          <View style={styles.frequencyOptions}>
            {[
              { key: 'weekly', label: 'Weekly' },
              { key: 'biweekly', label: 'Bi-weekly (Every 2 weeks)' },
              { key: 'monthly', label: 'Monthly' }
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.frequencyOption,
                  settings.frequency === option.key && styles.selectedFrequency
                ]}
                onPress={() => setSettings(prev => ({ ...prev, frequency: option.key as any }))}
              >
                <View style={[
                  styles.radioButton,
                  settings.frequency === option.key && styles.selectedRadio
                ]}>
                  {settings.frequency === option.key && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.frequencyLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pay Period Start Day */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pay Period Start Day</Text>
          <TouchableOpacity 
            style={styles.dayPickerButton}
            onPress={() => setShowDayPicker(!showDayPicker)}
          >
            <Text style={styles.dayPickerText}>
              {daysOfWeek.find(d => d.key === settings.startDay)?.label || 'Select a day'}
            </Text>
            <ChevronDown size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          {showDayPicker && (
            <View style={styles.dayPickerDropdown}>
              {daysOfWeek.map((day) => (
                <TouchableOpacity
                  key={day.key}
                  style={[
                    styles.dayOption,
                    settings.startDay === day.key && styles.selectedDayOption
                  ]}
                  onPress={() => selectDay(day.key)}
                >
                  <Text style={[
                    styles.dayOptionText,
                    settings.startDay === day.key && styles.selectedDayOptionText
                  ]}>
                    {day.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Rate Adjustments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rate Adjustments</Text>
          <CustomInput
            label="Weekend Rate Bonus (per hour)"
            value={`${settings.weekendRate}`}
            onChangeText={(text) => {
              const value = parseFloat(text.replace('$', '')) || 0;
              setSettings(prev => ({ ...prev, weekendRate: value }));
            }}
            keyboardType="numeric"
          />
          <CustomInput
            label="Holiday Rate Bonus (per hour)"
            value={`${settings.holidayRate}`}
            onChangeText={(text) => {
              const value = parseFloat(text.replace('$', '')) || 0;
              setSettings(prev => ({ ...prev, holidayRate: value }));
            }}
            keyboardType="numeric"
          />
          <CustomInput
            label="Twins Care Bonus (per hour)"
            value={`${settings.twinsRate}`}
            onChangeText={(text) => {
              const value = parseFloat(text.replace('$', '')) || 0;
              setSettings(prev => ({ ...prev, twinsRate: value }));
            }}
            keyboardType="numeric"
          />
        </View>

        {/* Deductions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Standard Deductions</Text>
          <CustomInput
            label="Insurance Deduction"
            value={`${settings.insuranceDeduction}`}
            onChangeText={(text) => {
              const value = parseFloat(text.replace('$', '')) || 0;
              setSettings(prev => ({ ...prev, insuranceDeduction: value }));
            }}
            keyboardType="numeric"
          />
          <CustomInput
            label="Background Check Deduction"
            value={`${settings.backgroundCheckDeduction}`}
            onChangeText={(text) => {
              const value = parseFloat(text.replace('$', '')) || 0;
              setSettings(prev => ({ ...prev, backgroundCheckDeduction: value }));
            }}
            keyboardType="numeric"
          />
        </View>

        {/* Holidays */}
        <View style={styles.section}>
          <View style={styles.holidayHeaderContainer}>
            <Text style={styles.sectionTitle}>Company Holidays</Text>
            <TouchableOpacity 
              style={styles.addHolidayIconButton}
              onPress={handleAddHoliday}
            >
              <Plus size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSubtitle}>
            Nurses working on these dates will receive the holiday rate bonus
          </Text>
          
          {/* Add New Holiday */}
          <View style={styles.addHolidayContainer}>
            <View style={styles.addHolidayInputs}>
              <CustomInput
                label="Holiday Name"
                value={newHolidayName}
                onChangeText={setNewHolidayName}
                placeholder="e.g., Martin Luther King Jr. Day"
                style={styles.holidayNameInput}
              />
              <CustomInput
                label="Date (YYYY-MM-DD)"
                value={newHolidayDate}
                onChangeText={setNewHolidayDate}
                placeholder="2024-01-15"
                style={styles.holidayDateInput}
              />
            </View>
            <TouchableOpacity 
              style={styles.addHolidayButton}
              onPress={handleAddHoliday}
            >
              <Plus size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Holidays List */}
          <View style={styles.holidaysList}>
            {holidays.map((holiday) => (
              <View key={holiday.id} style={styles.holidayItem}>
                <View style={styles.holidayInfo}>
                  <Calendar size={16} color={COLORS.primary} />
                  <View style={styles.holidayDetails}>
                    <Text style={styles.holidayName}>{holiday.name}</Text>
                    <Text style={styles.holidayDate}>{formatDate(holiday.date)}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.removeHolidayButton}
                  onPress={() => handleRemoveHoliday(holiday.id)}
                >
                  <Trash2 size={16} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.saveContainer}>
          <CustomButton
            title="Save Settings"
            onPress={handleSave}
            isLoading={isSaving}
            style={styles.saveButton}
          />
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
    flex: 1,
  },
  section: {
    backgroundColor: COLORS.white,
    margin: 16,
    marginBottom: 0,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  frequencyOptions: {
    gap: 12,
  },
  frequencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.backgroundSecondary,
  },
  selectedFrequency: {
    backgroundColor: COLORS.primary + '20',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadio: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  frequencyLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  dayPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 8,
    marginBottom: 8,
  },
  dayPickerText: {
    fontSize: 16,
    color: COLORS.text,
  },
  dayPickerDropdown: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
    overflow: 'hidden',
  },
  dayOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  selectedDayOption: {
    backgroundColor: COLORS.primary + '20',
  },
  dayOptionText: {
    fontSize: 16,
    color: COLORS.text,
  },
  selectedDayOptionText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  holidayHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addHolidayIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addHolidayContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
    gap: 12,
  },
  addHolidayInputs: {
    flex: 1,
    gap: 16,
  },
  holidayNameInput: {
    flex: 2,
  },
  holidayDateInput: {
    flex: 1,
  },
  addHolidayButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  holidaysList: {
    gap: 8,
  },
  holidayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 8,
  },
  holidayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  holidayDetails: {
    marginLeft: 12,
  },
  holidayName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 2,
  },
  holidayDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  removeHolidayButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.errorLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveContainer: {
    padding: 16,
  },
  saveButton: {
    marginBottom: 20,
  },
});