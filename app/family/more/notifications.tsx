import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Bell, Clock, MessageSquare, Calendar, Baby, Star } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import CustomButton from '@/components/common/CustomButton';

export default function NotificationsSettingsScreen() {
  const [isLoading, setIsLoading] = useState(false);
  
  // Notification preferences state
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  
  // Specific notification types
  const [shiftReminders, setShiftReminders] = useState(true);
  const [shiftConfirmations, setShiftConfirmations] = useState(true);
  const [nurseMessages, setNurseMessages] = useState(true);
  const [shiftUpdates, setShiftUpdates] = useState(true);
  const [paymentNotifications, setPaymentNotifications] = useState(true);
  const [promotionalEmails, setPromotionalEmails] = useState(false);
  
  // Timing preferences
  const [reminderTiming, setReminderTiming] = useState('2'); // hours before
  const [quietHours, setQuietHours] = useState(true);
  const [quietStart, setQuietStart] = useState('22:00');
  const [quietEnd, setQuietEnd] = useState('07:00');

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Notification settings updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update notification settings');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSetting = (currentValue: boolean, setter: (value: boolean) => void) => {
    setter(!currentValue);
  };

  const renderToggleItem = (
    title: string,
    subtitle: string,
    value: boolean,
    setter: (value: boolean) => void,
    icon: React.ReactNode
  ) => (
    <TouchableOpacity 
      style={styles.toggleItem}
      onPress={() => toggleSetting(value, setter)}
    >
      <View style={styles.toggleContent}>
        <View style={styles.toggleIcon}>
          {icon}
        </View>
        <View style={styles.toggleTextContainer}>
          <Text style={styles.toggleTitle}>{title}</Text>
          <Text style={styles.toggleSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={[styles.toggle, value && styles.toggleActive]}>
        <View style={[
          styles.toggleCircle,
          value ? styles.toggleCircleActive : styles.toggleCircleInactive
        ]} />
      </View>
    </TouchableOpacity>
  );

  const renderTimeSelector = (label: string, value: string, options: string[]) => (
    <View style={styles.timeSelector}>
      <Text style={styles.timeSelectorLabel}>{label}</Text>
      <View style={styles.timeOptions}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.timeOption,
              value === option && styles.timeOptionActive
            ]}
            onPress={() => {
              if (label.includes('Reminder')) {
                setReminderTiming(option);
              }
            }}
          >
            <Text style={[
              styles.timeOptionText,
              value === option && styles.timeOptionTextActive
            ]}>
              {option} {label.includes('Reminder') ? 'hours' : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Notification Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General Settings</Text>
          
          {renderToggleItem(
            'Push Notifications',
            'Receive notifications on your device',
            pushNotifications,
            setPushNotifications,
            <Bell size={20} color={COLORS.primary} />
          )}
          
          {renderToggleItem(
            'Email Notifications',
            'Receive notifications via email',
            emailNotifications,
            setEmailNotifications,
            <MessageSquare size={20} color={COLORS.primary} />
          )}
        </View>

        {/* Shift-Related Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shift Notifications</Text>
          
          {renderToggleItem(
            'Shift Reminders',
            'Get reminded before your scheduled shifts',
            shiftReminders,
            setShiftReminders,
            <Clock size={20} color={COLORS.primary} />
          )}
          
          {renderToggleItem(
            'Shift Confirmations',
            'Notifications when shifts are confirmed',
            shiftConfirmations,
            setShiftConfirmations,
            <Calendar size={20} color={COLORS.primary} />
          )}
          
          {renderToggleItem(
            'Shift Updates',
            'Changes to your scheduled shifts',
            shiftUpdates,
            setShiftUpdates,
            <Bell size={20} color={COLORS.primary} />
          )}
        </View>

        {/* Communication Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Communication</Text>
          
          {renderToggleItem(
            'Nurse Messages',
            'Messages from your assigned nurses',
            nurseMessages,
            setNurseMessages,
            <MessageSquare size={20} color={COLORS.primary} />
          )}
          
          {renderToggleItem(
            'Payment Notifications',
            'Billing and payment confirmations',
            paymentNotifications,
            setPaymentNotifications,
            <Star size={20} color={COLORS.primary} />
          )}
          
          {renderToggleItem(
            'Promotional Emails',
            'Special offers and updates',
            promotionalEmails,
            setPromotionalEmails,
            <Baby size={20} color={COLORS.primary} />
          )}
        </View>

        {/* Timing Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timing Preferences</Text>
          
          {renderTimeSelector(
            'Shift Reminder Timing',
            reminderTiming,
            ['1', '2', '4', '6', '12', '24']
          )}
          
          <View style={styles.quietHoursContainer}>
            {renderToggleItem(
              'Quiet Hours',
              'Limit notifications during specified hours',
              quietHours,
              setQuietHours,
              <Clock size={20} color={COLORS.primary} />
            )}
            
            {quietHours && (
              <View style={styles.quietHoursSettings}>
                <View style={styles.timeInputRow}>
                  <View style={styles.timeInput}>
                    <Text style={styles.timeInputLabel}>Start</Text>
                    <TouchableOpacity style={styles.timeInputButton}>
                      <Text style={styles.timeInputText}>{quietStart}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.timeInput}>
                    <Text style={styles.timeInputLabel}>End</Text>
                    <TouchableOpacity style={styles.timeInputButton}>
                      <Text style={styles.timeInputText}>{quietEnd}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.quietHoursNote}>
                  Only urgent notifications will be delivered during quiet hours
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Notification History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification History</Text>
          <TouchableOpacity style={styles.historyButton}>
            <Text style={styles.historyButtonText}>View Recent Notifications</Text>
            <ChevronLeft size={16} color={COLORS.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
        </View>

        {/* Test Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Notifications</Text>
          <Text style={styles.testDescription}>
            Send a test notification to make sure everything is working correctly
          </Text>
          <CustomButton
            title="Send Test Notification"
            onPress={() => Alert.alert('Test Sent', 'Check your notifications!')}
            style={styles.testButton}
            outline
          />
        </View>

        {/* Save Button */}
        <CustomButton
          title="Save Settings"
          onPress={handleSaveSettings}
          isLoading={isLoading}
          style={styles.saveButton}
        />
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
  scrollContent: {
    padding: 16,
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 2,
  },
  toggleSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  toggle: {
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
  toggleCircleInactive: {
    alignSelf: 'flex-start',
  },
  timeSelector: {
    marginBottom: 16,
  },
  timeSelectorLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 12,
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  timeOptionActive: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  timeOptionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  timeOptionTextActive: {
    color: COLORS.primary,
  },
  quietHoursContainer: {
    marginTop: 8,
  },
  quietHoursSettings: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  timeInputRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  timeInput: {
    flex: 1,
  },
  timeInputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  timeInputButton: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  timeInputText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  quietHoursNote: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 8,
  },
  historyButtonText: {
    fontSize: 16,
    color: COLORS.text,
  },
  testDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  testButton: {
    marginTop: 8,
  },
  saveButton: {
    marginTop: 8,
    marginBottom: 40,
  },
});