import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, ChevronRight, DollarSign, Clock, Calendar, Users, Plus, CreditCard as Edit3, X, Check, MapPin } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import CustomButton from '@/components/common/CustomButton';
import CustomInput from '@/components/common/CustomInput';

interface Nurse {
  id: string;
  name: string;
  region: string;
  hoursWorked: number;
  hourlyRate: number;
  weekendHours: number;
  holidayHours: number;
  twinsHours: number;
  weekendTwinsHours: number;
  totalPay: number;
  startDate: string;
  insurancePaid: boolean;
  backgroundCheckPaid: boolean;
  isActive: boolean;
}

interface Region {
  id: string;
  name: string;
  nurses: Nurse[];
}

interface PayPeriod {
  id: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export default function ManagePayrollScreen() {
  const [currentPayPeriod, setCurrentPayPeriod] = useState<PayPeriod>({
    id: '1',
    startDate: '2024-03-01',
    endDate: '2024-03-14',
    isActive: true
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showPayPeriodModal, setShowPayPeriodModal] = useState(false);
  const [showAddRegionModal, setShowAddRegionModal] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);
  const [editedNurse, setEditedNurse] = useState<Nurse | null>(null);
  const [newRegionName, setNewRegionName] = useState('');
  const [editedPayPeriod, setEditedPayPeriod] = useState<PayPeriod>(currentPayPeriod);

  const [regions, setRegions] = useState<Region[]>([
    {
      id: 'northeast-fl',
      name: 'Northeast Florida',
      nurses: [
        {
          id: '1',
          name: 'Angela Davis',
          region: 'northeast-fl',
          hoursWorked: 80,
          hourlyRate: 52,
          weekendHours: 20,
          holidayHours: 0,
          twinsHours: 30,
          weekendTwinsHours: 10,
          totalPay: 4940,
          startDate: '2023-01-15',
          insurancePaid: true,
          backgroundCheckPaid: true,
          isActive: true
        },
        {
          id: '2',
          name: 'Sophia Rodriguez',
          region: 'northeast-fl',
          hoursWorked: 72,
          hourlyRate: 50,
          weekendHours: 16,
          holidayHours: 8,
          twinsHours: 24,
          weekendTwinsHours: 8,
          totalPay: 4416,
          startDate: '2023-03-20',
          insurancePaid: true,
          backgroundCheckPaid: true,
          isActive: true
        },
        {
          id: '3',
          name: 'James Wilson',
          region: 'northeast-fl',
          hoursWorked: 64,
          hourlyRate: 48,
          weekendHours: 12,
          holidayHours: 0,
          twinsHours: 20,
          weekendTwinsHours: 6,
          totalPay: 3648,
          startDate: '2023-06-10',
          insurancePaid: false,
          backgroundCheckPaid: true,
          isActive: true
        }
      ]
    },
    {
      id: 'tampa',
      name: 'Tampa Bay',
      nurses: [
        {
          id: '4',
          name: 'Michael Chen',
          region: 'tampa',
          hoursWorked: 76,
          hourlyRate: 51,
          weekendHours: 18,
          holidayHours: 0,
          twinsHours: 28,
          weekendTwinsHours: 12,
          totalPay: 4636,
          startDate: '2023-02-28',
          insurancePaid: true,
          backgroundCheckPaid: true,
          isActive: true
        },
        {
          id: '5',
          name: 'Jessica Martinez',
          region: 'tampa',
          hoursWorked: 68,
          hourlyRate: 49,
          weekendHours: 14,
          holidayHours: 4,
          twinsHours: 22,
          weekendTwinsHours: 6,
          totalPay: 3948,
          startDate: '2023-04-12',
          insurancePaid: true,
          backgroundCheckPaid: false,
          isActive: true
        }
      ]
    },
    {
      id: 'orlando',
      name: 'Orlando',
      nurses: [
        {
          id: '6',
          name: 'David Thompson',
          region: 'orlando',
          hoursWorked: 70,
          hourlyRate: 50,
          weekendHours: 16,
          holidayHours: 0,
          twinsHours: 26,
          weekendTwinsHours: 8,
          totalPay: 4200,
          startDate: '2023-05-08',
          insurancePaid: true,
          backgroundCheckPaid: true,
          isActive: true
        }
      ]
    }
  ]);

  const calculateTotalPay = (nurse: Nurse): number => {
    const regularHours = nurse.hoursWorked - nurse.weekendHours - nurse.holidayHours;
    const regularPay = regularHours * nurse.hourlyRate;
    
    // Weekend/Holiday bonus: +$4/hour
    const weekendHolidayPay = (nurse.weekendHours + nurse.holidayHours) * (nurse.hourlyRate + 4);
    
    // Twins bonus: +$5/hour
    const regularTwinsPay = (nurse.twinsHours - nurse.weekendTwinsHours) * (nurse.hourlyRate + 5);
    
    // Weekend twins: +$4 (weekend) + $5 (twins) = +$9/hour
    const weekendTwinsPay = nurse.weekendTwinsHours * (nurse.hourlyRate + 9);
    
    let totalPay = regularPay + weekendHolidayPay + regularTwinsPay + weekendTwinsPay;
    
    // Deduct insurance if not paid
    if (!nurse.insurancePaid) {
      totalPay -= 125;
    }
    
    // Deduct background check if not paid
    if (!nurse.backgroundCheckPaid) {
      totalPay -= 30;
    }
    
    return totalPay;
  };

  const getAllNurses = (): Nurse[] => {
    return regions.flatMap(region => region.nurses);
  };

  const getTopEarners = (): Nurse[] => {
    return getAllNurses()
      .filter(nurse => nurse.isActive)
      .sort((a, b) => calculateTotalPay(b) - calculateTotalPay(a))
      .slice(0, 5);
  };

  const handleEditNurse = (nurse: Nurse) => {
    setSelectedNurse(nurse);
    setEditedNurse({ ...nurse });
    setShowEditModal(true);
  };

  const handleSaveNurse = () => {
    if (!editedNurse || !selectedNurse) return;

    setRegions(prevRegions => 
      prevRegions.map(region => ({
        ...region,
        nurses: region.nurses.map(nurse => 
          nurse.id === selectedNurse.id 
            ? { ...editedNurse, totalPay: calculateTotalPay(editedNurse) }
            : nurse
        )
      }))
    );

    setShowEditModal(false);
    setSelectedNurse(null);
    setEditedNurse(null);
    Alert.alert('Success', 'Nurse details updated successfully');
  };

  const handleToggleInsurance = (nurseId: string) => {
    setRegions(prevRegions => 
      prevRegions.map(region => ({
        ...region,
        nurses: region.nurses.map(nurse => {
          if (nurse.id === nurseId) {
            const updatedNurse = { ...nurse, insurancePaid: !nurse.insurancePaid };
            return { ...updatedNurse, totalPay: calculateTotalPay(updatedNurse) };
          }
          return nurse;
        })
      }))
    );
  };

  const handleToggleBackgroundCheck = (nurseId: string) => {
    setRegions(prevRegions => 
      prevRegions.map(region => ({
        ...region,
        nurses: region.nurses.map(nurse => {
          if (nurse.id === nurseId) {
            const updatedNurse = { ...nurse, backgroundCheckPaid: !nurse.backgroundCheckPaid };
            return { ...updatedNurse, totalPay: calculateTotalPay(updatedNurse) };
          }
          return nurse;
        })
      }))
    );
  };

  const handleAddRegion = () => {
    if (!newRegionName.trim()) {
      Alert.alert('Error', 'Please enter a region name');
      return;
    }

    const newRegion: Region = {
      id: newRegionName.toLowerCase().replace(/\s+/g, '-'),
      name: newRegionName,
      nurses: []
    };

    setRegions(prev => [...prev, newRegion]);
    setNewRegionName('');
    setShowAddRegionModal(false);
    Alert.alert('Success', `${newRegionName} region added successfully`);
  };

  const handleUpdatePayPeriod = () => {
    setCurrentPayPeriod(editedPayPeriod);
    setShowPayPeriodModal(false);
    Alert.alert('Success', 'Pay period updated successfully');
  };

  const renderTopEarnerCard = ({ item, index }: { item: Nurse; index: number }) => (
    <TouchableOpacity 
      style={styles.earnerCard}
      onPress={() => handleEditNurse(item)}
    >
      <View style={styles.earnerRank}>
        <Text style={styles.rankNumber}>{index + 1}</Text>
      </View>
      <View style={styles.earnerInfo}>
        <Text style={styles.earnerName}>{item.name}</Text>
        <Text style={styles.earnerRegion}>{regions.find(r => r.id === item.region)?.name}</Text>
        <View style={styles.earnerStats}>
          <View style={styles.statItem}>
            <Clock size={14} color={COLORS.primary} />
            <Text style={styles.statText}>{item.hoursWorked}h</Text>
          </View>
          <View style={styles.statItem}>
            <DollarSign size={14} color={COLORS.success} />
            <Text style={styles.statText}>${calculateTotalPay(item).toLocaleString()}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderToggle = (value: boolean, onToggle: () => void, label: string) => (
    <View style={styles.toggleContainer}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <TouchableOpacity 
        style={[styles.toggle, value ? styles.toggleActive : styles.toggleInactive]}
        onPress={onToggle}
      >
        <View style={[
          styles.toggleCircle,
          value ? styles.toggleCircleActive : styles.toggleCircleInactive
        ]} />
      </TouchableOpacity>
    </View>
  );

  const renderNurseItem = (nurse: Nurse) => (
    <TouchableOpacity 
      key={nurse.id}
      style={styles.nurseItem}
      onPress={() => handleEditNurse(nurse)}
    >
      <View style={styles.nurseHeader}>
        <Text style={styles.nurseName}>{nurse.name}</Text>
        <Text style={styles.nursePay}>${calculateTotalPay(nurse).toLocaleString()}</Text>
      </View>
      
      <View style={styles.nurseDetails}>
        <Text style={styles.nurseHours}>{nurse.hoursWorked} hours • ${nurse.hourlyRate}/hr</Text>
        <Text style={styles.nurseStartDate}>Started: {new Date(nurse.startDate).toLocaleDateString()}</Text>
      </View>

      <View style={styles.nurseToggles}>
        {renderToggle(
          nurse.insurancePaid,
          () => handleToggleInsurance(nurse.id),
          'Insurance'
        )}
        {renderToggle(
          nurse.backgroundCheckPaid,
          () => handleToggleBackgroundCheck(nurse.id),
          'Background Check'
        )}
      </View>
    </TouchableOpacity>
  );

  const totalPayroll = getAllNurses()
    .filter(nurse => nurse.isActive)
    .reduce((sum, nurse) => sum + calculateTotalPay(nurse), 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Payroll</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => setShowPayPeriodModal(true)}
        >
          <Calendar size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Pay Period Info */}
        <TouchableOpacity 
          style={styles.payPeriodCard}
          onPress={() => setShowPayPeriodModal(true)}
        >
          <View style={styles.payPeriodHeader}>
            <Text style={styles.payPeriodTitle}>Current Pay Period</Text>
            <ChevronRight size={20} color={COLORS.textSecondary} />
          </View>
          <Text style={styles.payPeriodDates}>
            {new Date(currentPayPeriod.startDate).toLocaleDateString()} - {new Date(currentPayPeriod.endDate).toLocaleDateString()}
          </Text>
          <Text style={styles.totalPayroll}>Total Payroll: ${totalPayroll.toLocaleString()}</Text>
        </TouchableOpacity>

        {/* Top Earners Carousel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earners this period</Text>
          <FlatList
            data={getTopEarners()}
            renderItem={renderTopEarnerCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.earnersCarousel}
          />
        </View>

        {/* Nurses by Region */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nurses by Region</Text>
            <TouchableOpacity 
              style={styles.addRegionButton}
              onPress={() => setShowAddRegionModal(true)}
            >
              <Plus size={20} color={COLORS.primary} />
              <Text style={styles.addRegionText}>Add Region</Text>
            </TouchableOpacity>
          </View>

          {regions.map((region) => (
            <View key={region.id} style={styles.regionCard}>
              <View style={styles.regionHeader}>
                <View style={styles.regionTitleContainer}>
                  <MapPin size={20} color={COLORS.primary} />
                  <Text style={styles.regionTitle}>{region.name}</Text>
                </View>
                <Text style={styles.regionCount}>{region.nurses.length} nurses</Text>
              </View>
              
              <View style={styles.nursesList}>
                {region.nurses.map(renderNurseItem)}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Edit Nurse Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Nurse Details</Text>
              <TouchableOpacity 
                onPress={() => setShowEditModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            {editedNurse && (
              <ScrollView style={styles.modalBody}>
                <CustomInput
                  label="Name"
                  value={editedNurse.name}
                  onChangeText={(text) => setEditedNurse(prev => prev ? {...prev, name: text} : null)}
                />
                
                <CustomInput
                  label="Hourly Rate ($)"
                  value={editedNurse.hourlyRate.toString()}
                  onChangeText={(text) => setEditedNurse(prev => prev ? {...prev, hourlyRate: parseFloat(text) || 0} : null)}
                  keyboardType="numeric"
                />
                
                <CustomInput
                  label="Hours Worked"
                  value={editedNurse.hoursWorked.toString()}
                  onChangeText={(text) => setEditedNurse(prev => prev ? {...prev, hoursWorked: parseFloat(text) || 0} : null)}
                  keyboardType="numeric"
                />
                
                <CustomInput
                  label="Weekend Hours"
                  value={editedNurse.weekendHours.toString()}
                  onChangeText={(text) => setEditedNurse(prev => prev ? {...prev, weekendHours: parseFloat(text) || 0} : null)}
                  keyboardType="numeric"
                />
                
                <CustomInput
                  label="Holiday Hours"
                  value={editedNurse.holidayHours.toString()}
                  onChangeText={(text) => setEditedNurse(prev => prev ? {...prev, holidayHours: parseFloat(text) || 0} : null)}
                  keyboardType="numeric"
                />
                
                <CustomInput
                  label="Twins Hours"
                  value={editedNurse.twinsHours.toString()}
                  onChangeText={(text) => setEditedNurse(prev => prev ? {...prev, twinsHours: parseFloat(text) || 0} : null)}
                  keyboardType="numeric"
                />
                
                <CustomInput
                  label="Weekend Twins Hours"
                  value={editedNurse.weekendTwinsHours.toString()}
                  onChangeText={(text) => setEditedNurse(prev => prev ? {...prev, weekendTwinsHours: parseFloat(text) || 0} : null)}
                  keyboardType="numeric"
                />
                
                <CustomInput
                  label="Start Date"
                  value={editedNurse.startDate}
                  onChangeText={(text) => setEditedNurse(prev => prev ? {...prev, startDate: text} : null)}
                  placeholder="YYYY-MM-DD"
                />

                <View style={styles.modalToggles}>
                  {renderToggle(
                    editedNurse.insurancePaid,
                    () => setEditedNurse(prev => prev ? {...prev, insurancePaid: !prev.insurancePaid} : null),
                    'Insurance Paid'
                  )}
                  {renderToggle(
                    editedNurse.backgroundCheckPaid,
                    () => setEditedNurse(prev => prev ? {...prev, backgroundCheckPaid: !prev.backgroundCheckPaid} : null),
                    'Background Check Paid'
                  )}
                  {renderToggle(
                    editedNurse.isActive,
                    () => setEditedNurse(prev => prev ? {...prev, isActive: !prev.isActive} : null),
                    'Active Status'
                  )}
                </View>

                <View style={styles.payCalculation}>
                  <Text style={styles.payCalculationTitle}>Pay Calculation</Text>
                  <Text style={styles.payCalculationText}>
                    Total Pay: ${calculateTotalPay(editedNurse).toLocaleString()}
                  </Text>
                </View>
              </ScrollView>
            )}

            <View style={styles.modalActions}>
              <CustomButton
                title="Cancel"
                onPress={() => setShowEditModal(false)}
                style={styles.cancelButton}
                outline
              />
              <CustomButton
                title="Save Changes"
                onPress={handleSaveNurse}
                style={styles.saveButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Pay Period Modal */}
      <Modal
        visible={showPayPeriodModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPayPeriodModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Pay Period</Text>
              <TouchableOpacity 
                onPress={() => setShowPayPeriodModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <CustomInput
                label="Start Date"
                value={editedPayPeriod.startDate}
                onChangeText={(text) => setEditedPayPeriod(prev => ({...prev, startDate: text}))}
                placeholder="YYYY-MM-DD"
              />
              
              <CustomInput
                label="End Date"
                value={editedPayPeriod.endDate}
                onChangeText={(text) => setEditedPayPeriod(prev => ({...prev, endDate: text}))}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.modalActions}>
              <CustomButton
                title="Cancel"
                onPress={() => setShowPayPeriodModal(false)}
                style={styles.cancelButton}
                outline
              />
              <CustomButton
                title="Update Period"
                onPress={handleUpdatePayPeriod}
                style={styles.saveButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Region Modal */}
      <Modal
        visible={showAddRegionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddRegionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Region</Text>
              <TouchableOpacity 
                onPress={() => setShowAddRegionModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <CustomInput
                label="Region Name"
                value={newRegionName}
                onChangeText={setNewRegionName}
                placeholder="e.g., Miami-Dade, Gainesville"
              />
            </View>

            <View style={styles.modalActions}>
              <CustomButton
                title="Cancel"
                onPress={() => setShowAddRegionModal(false)}
                style={styles.cancelButton}
                outline
              />
              <CustomButton
                title="Add Region"
                onPress={handleAddRegion}
                style={styles.saveButton}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  payPeriodCard: {
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
  payPeriodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  payPeriodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  payPeriodDates: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  totalPayroll: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
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
  addRegionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  addRegionText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
  },
  earnersCarousel: {
    paddingRight: 16,
  },
  earnerCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 200,
    flexDirection: 'row',
    alignItems: 'center',
  },
  earnerRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  earnerInfo: {
    flex: 1,
  },
  earnerName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  earnerRegion: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  earnerStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.text,
  },
  regionCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  regionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  regionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  regionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  regionCount: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  nursesList: {
    gap: 12,
  },
  nurseItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
  },
  nurseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nurseName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  nursePay: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.success,
  },
  nurseDetails: {
    marginBottom: 12,
  },
  nurseHours: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  nurseStartDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  nurseToggles: {
    flexDirection: 'row',
    gap: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  toggle: {
    width: 40,
    height: 20,
    borderRadius: 10,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: COLORS.success,
  },
  toggleInactive: {
    backgroundColor: COLORS.error,
  },
  toggleCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  toggleCircleActive: {
    alignSelf: 'flex-end',
  },
  toggleCircleInactive: {
    alignSelf: 'flex-start',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    maxHeight: 400,
    marginBottom: 20,
  },
  modalToggles: {
    gap: 16,
    marginVertical: 16,
  },
  payCalculation: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  payCalculationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  payCalculationText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});