import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Calendar, DollarSign, Clock, Save, CreditCard as Edit3, User, MapPin } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import CustomInput from '@/components/common/CustomInput';
import CustomButton from '@/components/common/CustomButton';

interface NurseDetails {
  id: string;
  name: string;
  picture: string;
  email: string;
  phone: string;
  region: string;
  startDate: Date;
  baseRate: number;
  totalHours: number;
  regularHours: number;
  weekendHours: number;
  holidayHours: number;
  twinsHours: number;
  twinsWeekendHours: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  insurancePaid: boolean;
  backgroundCheckPaid: boolean;
  address: string;
  emergencyContact: string;
  certifications: string[];
}

export default function NursePayrollDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mock nurse data - in a real app this would be fetched based on the ID
  const [nurseData, setNurseData] = useState<NurseDetails>({
    id: id as string,
    name: 'Angela Davis',
    picture: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300',
    email: 'angela.davis@happybabynurses.com',
    phone: '(904) 555-0123',
    region: 'Northeast Florida',
    startDate: new Date(2023, 5, 15), // June 15, 2023
    baseRate: 28,
    totalHours: 84,
    regularHours: 60,
    weekendHours: 16,
    holidayHours: 0,
    twinsHours: 24,
    twinsWeekendHours: 8,
    grossPay: 2688,
    deductions: 155,
    netPay: 2533,
    insurancePaid: true,
    backgroundCheckPaid: true,
    address: '123 Oak Street, Jacksonville, FL 32207',
    emergencyContact: 'John Davis - (904) 555-0456',
    certifications: ['RN', 'NCS', 'CPR', 'Sleep Training Certified']
  });

  const [editedData, setEditedData] = useState<NurseDetails>(nurseData);

  // Calculate pay breakdown
  const calculatePay = (data: NurseDetails) => {
    const regularPay = data.regularHours * data.baseRate;
    const weekendPay = data.weekendHours * (data.baseRate + 4); // +$4 for weekends
    const holidayPay = data.holidayHours * (data.baseRate + 4); // +$4 for holidays
    const twinsPay = data.twinsHours * (data.baseRate + 5); // +$5 for twins
    const twinsWeekendPay = data.twinsWeekendHours * (data.baseRate + 9); // +$4 weekend + $5 twins

    const grossPay = regularPay + weekendPay + holidayPay + twinsPay + twinsWeekendPay;
    
    let deductions = 0;
    if (data.insurancePaid) deductions += 125;
    if (data.backgroundCheckPaid) deductions += 30;

    return {
      regularPay,
      weekendPay,
      holidayPay,
      twinsPay,
      twinsWeekendPay,
      grossPay,
      deductions,
      netPay: grossPay - deductions
    };
  };

  const payBreakdown = calculatePay(editedData);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the calculated values
      const updatedData = {
        ...editedData,
        grossPay: payBreakdown.grossPay,
        deductions: payBreakdown.deductions,
        netPay: payBreakdown.netPay
      };
      
      setNurseData(updatedData);
      setEditedData(updatedData);
      setIsEditing(false);
      
      Alert.alert('Success', 'Nurse payroll information updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update nurse information');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedData(nurseData);
    setIsEditing(false);
  };

  const handleInsuranceToggle = (value: boolean) => {
    if (!value && nurseData.insurancePaid) {
      Alert.alert(
        'Remove Insurance Deduction',
        'Are you sure you want to remove the insurance deduction? This will add $125 to their net pay.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Remove', 
            onPress: () => setEditedData(prev => ({ ...prev, insurancePaid: value }))
          }
        ]
      );
    } else if (value && !nurseData.insurancePaid) {
      Alert.alert(
        'Add Insurance Deduction',
        'This will deduct $125 from their payroll for insurance.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Confirm', 
            onPress: () => setEditedData(prev => ({ ...prev, insurancePaid: value }))
          }
        ]
      );
    } else {
      setEditedData(prev => ({ ...prev, insurancePaid: value }));
    }
  };

  const handleBackgroundCheckToggle = (value: boolean) => {
    if (!value && nurseData.backgroundCheckPaid) {
      Alert.alert(
        'Remove Background Check Deduction',
        'Are you sure you want to remove the background check deduction? This will add $30 to their net pay.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Remove', 
            onPress: () => setEditedData(prev => ({ ...prev, backgroundCheckPaid: value }))
          }
        ]
      );
    } else if (value && !nurseData.backgroundCheckPaid) {
      Alert.alert(
        'Add Background Check Deduction',
        'This will deduct $30 from their payroll for background check.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Confirm', 
            onPress: () => setEditedData(prev => ({ ...prev, backgroundCheckPaid: value }))
          }
        ]
      );
    } else {
      setEditedData(prev => ({ ...prev, backgroundCheckPaid: value }));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getYearsOfService = (startDate: Date) => {
    const now = new Date();
    const years = now.getFullYear() - startDate.getFullYear();
    const months = now.getMonth() - startDate.getMonth();
    
    if (months < 0 || (months === 0 && now.getDate() < startDate.getDate())) {
      return years - 1;
    }
    return years;
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
        <Text style={styles.headerTitle}>Nurse Details</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => isEditing ? handleCancel() : setIsEditing(true)}
        >
          {isEditing ? (
            <Text style={styles.cancelText}>Cancel</Text>
          ) : (
            <Edit3 size={20} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Nurse Profile */}
        <View style={styles.profileCard}>
          <Image 
            source={{ uri: nurseData.picture }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.nurseName}>{nurseData.name}</Text>
            <View style={styles.profileDetail}>
              <MapPin size={16} color={COLORS.primary} />
              <Text style={styles.profileDetailText}>{nurseData.region}</Text>
            </View>
            <View style={styles.profileDetail}>
              <Calendar size={16} color={COLORS.primary} />
              <Text style={styles.profileDetailText}>
                {getYearsOfService(nurseData.startDate)} years of service
              </Text>
            </View>
            <View style={styles.profileDetail}>
              <User size={16} color={COLORS.primary} />
              <Text style={styles.profileDetailText}>
                Started {formatDate(nurseData.startDate)}
              </Text>
            </View>
          </View>
        </View>

        {/* Pay Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Pay Period Summary</Text>
          <View style={styles.payGrid}>
            <View style={styles.payItem}>
              <Text style={styles.payValue}>{formatCurrency(payBreakdown.grossPay)}</Text>
              <Text style={styles.payLabel}>Gross Pay</Text>
            </View>
            <View style={styles.payItem}>
              <Text style={styles.payValue}>{editedData.totalHours}</Text>
              <Text style={styles.payLabel}>Total Hours</Text>
            </View>
            <View style={styles.payItem}>
              <Text style={[styles.payValue, { color: COLORS.error }]}>
                -{formatCurrency(payBreakdown.deductions)}
              </Text>
              <Text style={styles.payLabel}>Deductions</Text>
            </View>
            <View style={styles.payItem}>
              <Text style={[styles.payValue, { color: COLORS.success }]}>
                {formatCurrency(payBreakdown.netPay)}
              </Text>
              <Text style={styles.payLabel}>Net Pay</Text>
            </View>
          </View>
        </View>

        {/* Hours Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hours Breakdown</Text>
          {isEditing ? (
            <View style={styles.editForm}>
              <CustomInput
                label="Regular Hours"
                value={editedData.regularHours.toString()}
                onChangeText={(text) => setEditedData(prev => ({ 
                  ...prev, 
                  regularHours: parseInt(text) || 0 
                }))}
                keyboardType="numeric"
              />
              <CustomInput
                label="Weekend Hours (+$4/hr)"
                value={editedData.weekendHours.toString()}
                onChangeText={(text) => setEditedData(prev => ({ 
                  ...prev, 
                  weekendHours: parseInt(text) || 0 
                }))}
                keyboardType="numeric"
              />
              <CustomInput
                label="Holiday Hours (+$4/hr)"
                value={editedData.holidayHours.toString()}
                onChangeText={(text) => setEditedData(prev => ({ 
                  ...prev, 
                  holidayHours: parseInt(text) || 0 
                }))}
                keyboardType="numeric"
              />
              <CustomInput
                label="Twins Hours (+$5/hr)"
                value={editedData.twinsHours.toString()}
                onChangeText={(text) => setEditedData(prev => ({ 
                  ...prev, 
                  twinsHours: parseInt(text) || 0 
                }))}
                keyboardType="numeric"
              />
              <CustomInput
                label="Twins Weekend Hours (+$9/hr)"
                value={editedData.twinsWeekendHours.toString()}
                onChangeText={(text) => setEditedData(prev => ({ 
                  ...prev, 
                  twinsWeekendHours: parseInt(text) || 0 
                }))}
                keyboardType="numeric"
              />
            </View>
          ) : (
            <View style={styles.hoursBreakdown}>
              <View style={styles.hourRow}>
                <Text style={styles.hourLabel}>Regular Hours</Text>
                <Text style={styles.hourValue}>{nurseData.regularHours}h</Text>
                <Text style={styles.hourPay}>{formatCurrency(payBreakdown.regularPay)}</Text>
              </View>
              <View style={styles.hourRow}>
                <Text style={styles.hourLabel}>Weekend Hours (+$4)</Text>
                <Text style={styles.hourValue}>{nurseData.weekendHours}h</Text>
                <Text style={styles.hourPay}>{formatCurrency(payBreakdown.weekendPay)}</Text>
              </View>
              <View style={styles.hourRow}>
                <Text style={styles.hourLabel}>Holiday Hours (+$4)</Text>
                <Text style={styles.hourValue}>{nurseData.holidayHours}h</Text>
                <Text style={styles.hourPay}>{formatCurrency(payBreakdown.holidayPay)}</Text>
              </View>
              <View style={styles.hourRow}>
                <Text style={styles.hourLabel}>Twins Hours (+$5)</Text>
                <Text style={styles.hourValue}>{nurseData.twinsHours}h</Text>
                <Text style={styles.hourPay}>{formatCurrency(payBreakdown.twinsPay)}</Text>
              </View>
              <View style={styles.hourRow}>
                <Text style={styles.hourLabel}>Twins Weekend (+$9)</Text>
                <Text style={styles.hourValue}>{nurseData.twinsWeekendHours}h</Text>
                <Text style={styles.hourPay}>{formatCurrency(payBreakdown.twinsWeekendPay)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Pay Rate */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pay Rate</Text>
          {isEditing ? (
            <CustomInput
              label="Base Hourly Rate"
              value={editedData.baseRate.toString()}
              onChangeText={(text) => setEditedData(prev => ({ 
                ...prev, 
                baseRate: parseFloat(text) || 0 
              }))}
              keyboardType="numeric"
            />
          ) : (
            <View style={styles.rateDisplay}>
              <DollarSign size={24} color={COLORS.primary} />
              <Text style={styles.rateValue}>{formatCurrency(nurseData.baseRate)}/hour</Text>
            </View>
          )}
        </View>

        {/* Deductions & Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deductions & Status</Text>
          
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Insurance Paid</Text>
              <Text style={styles.toggleSubtext}>
                {editedData.insurancePaid ? 'Deducting $125' : 'Not paid - needs to pay $125'}
              </Text>
            </View>
            <Switch
              value={editedData.insurancePaid}
              onValueChange={handleInsuranceToggle}
              trackColor={{ false: COLORS.error, true: COLORS.success }}
              thumbColor={COLORS.white}
              disabled={!isEditing}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Background Check Paid</Text>
              <Text style={styles.toggleSubtext}>
                {editedData.backgroundCheckPaid ? 'Deducting $30' : 'Not paid - needs to pay $30'}
              </Text>
            </View>
            <Switch
              value={editedData.backgroundCheckPaid}
              onValueChange={handleBackgroundCheckToggle}
              trackColor={{ false: COLORS.error, true: COLORS.success }}
              thumbColor={COLORS.white}
              disabled={!isEditing}
            />
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          {isEditing ? (
            <View style={styles.editForm}>
              <CustomInput
                label="Email"
                value={editedData.email}
                onChangeText={(text) => setEditedData(prev => ({ ...prev, email: text }))}
                keyboardType="email-address"
              />
              <CustomInput
                label="Phone"
                value={editedData.phone}
                onChangeText={(text) => setEditedData(prev => ({ ...prev, phone: text }))}
                keyboardType="phone-pad"
              />
              <CustomInput
                label="Address"
                value={editedData.address}
                onChangeText={(text) => setEditedData(prev => ({ ...prev, address: text }))}
                multiline
              />
              <CustomInput
                label="Emergency Contact"
                value={editedData.emergencyContact}
                onChangeText={(text) => setEditedData(prev => ({ ...prev, emergencyContact: text }))}
              />
            </View>
          ) : (
            <View style={styles.contactInfo}>
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>Email:</Text>
                <Text style={styles.contactValue}>{nurseData.email}</Text>
              </View>
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>Phone:</Text>
                <Text style={styles.contactValue}>{nurseData.phone}</Text>
              </View>
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>Address:</Text>
                <Text style={styles.contactValue}>{nurseData.address}</Text>
              </View>
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>Emergency Contact:</Text>
                <Text style={styles.contactValue}>{nurseData.emergencyContact}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Certifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          <View style={styles.certifications}>
            {nurseData.certifications.map((cert, index) => (
              <View key={index} style={styles.certBadge}>
                <Text style={styles.certText}>{cert}</Text>
              </View>
            ))}
          </View>
        </View>

        {isEditing && (
          <View style={styles.saveButtonContainer}>
            <CustomButton
              title="Save Changes"
              onPress={handleSave}
              isLoading={isSaving}
              style={styles.saveButton}
            />
          </View>
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
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  nurseName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  profileDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileDetailText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
  },
  section: {
    backgroundColor: COLORS.white,
    margin: 16,
    marginTop: 0,
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
  payGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  payItem: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  payValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  payLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  hoursBreakdown: {
    gap: 12,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  hourLabel: {
    fontSize: 14,
    color: COLORS.text,
    flex: 2,
  },
  hourValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
  },
  hourPay: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    flex: 1,
    textAlign: 'right',
  },
  editForm: {
    gap: 16,
  },
  rateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
  },
  rateValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  toggleSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  contactInfo: {
    gap: 12,
  },
  contactRow: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
    width: 120,
  },
  contactValue: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  certifications: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  certBadge: {
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  certText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  saveButtonContainer: {
    padding: 16,
  },
  saveButton: {
    marginBottom: 20,
  },
});