import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Star, Clock, MessageSquare } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';

interface ActiveNurse {
  id: string;
  name: string;
  picture: string;
  rating: number;
  currentFamily: string;
  shiftTime: string;
  certifications: string[];
  workingDays: string[];
  nextShifts: string[];
}

interface AvailableNurse {
  id: string;
  name: string;
  picture: string;
  rating: number;
  availability: string;
  preferredHours: string;
  certifications: string[];
}

interface UncoveredShift {
  id: string;
  family: string;
  date: string;
  time: string;
  recurring: boolean;
  frequency?: string;
}

interface AssignmentModalProps {
  visible: boolean;
  onClose: () => void;
  nurse: AvailableNurse;
  shifts: UncoveredShift[];
}

// TODO: Fetch active nurses from Supabase
const activeNurses: ActiveNurse[] = [];

// TODO: Fetch available nurses from Supabase
const availableNurses: AvailableNurse[] = [];

// TODO: Fetch uncovered shifts from Supabase
const uncoveredShifts: UncoveredShift[] = [];

const AssignmentModal = ({ visible, onClose, nurse, shifts }: AssignmentModalProps) => {
  if (!visible) return null;

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Assign {nurse.name}</Text>
        <Text style={styles.modalSubtitle}>Select a shift to cover:</Text>
        
        {shifts.map((shift) => (
          <TouchableOpacity 
            key={shift.id} 
            style={styles.shiftOption}
            onPress={() => {
              // Handle assignment
              onClose();
            }}
          >
            <View>
              <Text style={styles.shiftFamilyName}>{shift.family}</Text>
              <Text style={styles.shiftDetails}>
                {shift.date} • {shift.time}
              </Text>
              {shift.recurring && (
                <Text style={styles.recurringText}>
                  Recurring: {shift.frequency}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function NursesScreen() {
  const [selectedNurse, setSelectedNurse] = useState<AvailableNurse | null>(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Nurses</Text>
        <TouchableOpacity 
          style={styles.chatButton}
          onPress={() => router.push('/admin/group-chat')}
        >
          <MessageSquare size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Currently Working</Text>
          {activeNurses.map((nurse) => (
            <View key={nurse.id} style={styles.nurseCard}>
              <Image 
                source={{ uri: nurse.picture }}
                style={styles.nurseImage}
              />
              <View style={styles.nurseInfo}>
                <View style={styles.nurseHeader}>
                  <Text style={styles.nurseName}>{nurse.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Star size={16} color={COLORS.warning} fill={COLORS.warning} />
                    <Text style={styles.ratingText}>{nurse.rating}</Text>
                  </View>
                </View>

                <View style={styles.assignmentInfo}>
                  <Text style={styles.assignmentText}>
                    Assigned to: {nurse.currentFamily}
                  </Text>
                  <View style={styles.shiftTime}>
                    <Clock size={16} color={COLORS.primary} />
                    <Text style={styles.timeText}>{nurse.shiftTime}</Text>
                  </View>
                </View>

                <View style={styles.certifications}>
                  {nurse.certifications.map((cert, index) => (
                    <View key={index} style={styles.certBadge}>
                      <Text style={styles.certText}>{cert}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.workingDays}>
                  <Text style={styles.workingDaysLabel}>Working Days:</Text>
                  <View style={styles.daysContainer}>
                    {nurse.workingDays.map((day, index) => (
                      <View key={index} style={styles.dayBadge}>
                        <Text style={styles.dayText}>{day}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.nextShifts}>
                  <Text style={styles.nextShiftsLabel}>Upcoming Shifts:</Text>
                  {nurse.nextShifts.map((shift, index) => (
                    <Text key={index} style={styles.shiftText}>• {shift}</Text>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Nurses</Text>
          {availableNurses.map((nurse) => (
            <View key={nurse.id} style={styles.nurseCard}>
              <Image 
                source={{ uri: nurse.picture }}
                style={styles.nurseImage}
              />
              <View style={styles.nurseInfo}>
                <View style={styles.nurseHeader}>
                  <Text style={styles.nurseName}>{nurse.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Star size={16} color={COLORS.warning} fill={COLORS.warning} />
                    <Text style={styles.ratingText}>{nurse.rating}</Text>
                  </View>
                </View>

                <View style={styles.availabilityContainer}>
                  <Text style={styles.availabilityText}>
                    {nurse.availability}
                  </Text>
                  <View style={styles.shiftTime}>
                    <Clock size={16} color={COLORS.primary} />
                    <Text style={styles.timeText}>
                      Preferred: {nurse.preferredHours}
                    </Text>
                  </View>
                </View>

                <View style={styles.certifications}>
                  {nurse.certifications.map((cert, index) => (
                    <View key={index} style={styles.certBadge}>
                      <Text style={styles.certText}>{cert}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity 
                  style={styles.assignButton}
                  onPress={() => {
                    setSelectedNurse(nurse);
                    setShowAssignmentModal(true);
                  }}
                >
                  <Text style={styles.assignButtonText}>Assign to Family</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {selectedNurse && (
        <AssignmentModal
          visible={showAssignmentModal}
          onClose={() => setShowAssignmentModal(false)}
          nurse={selectedNurse}
          shifts={uncoveredShifts}
        />
      )}
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
  chatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    margin: 16,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  nurseCard: {
    flexDirection: 'row',
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
  nurseImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  nurseInfo: {
    flex: 1,
  },
  nurseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nurseName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  assignmentInfo: {
    marginBottom: 12,
  },
  assignmentText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  shiftTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  availabilityContainer: {
    marginBottom: 12,
  },
  availabilityText: {
    fontSize: 14,
    color: COLORS.success,
    fontWeight: '500',
    marginBottom: 4,
  },
  certifications: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  certBadge: {
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  certText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  assignButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  assignButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  workingDays: {
    marginTop: 8,
    marginBottom: 12,
  },
  workingDaysLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dayText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  nextShifts: {
    marginBottom: 12,
  },
  nextShiftsLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  shiftText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 2,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  shiftOption: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundSecondary,
    marginBottom: 12,
  },
  shiftFamilyName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  shiftDetails: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  recurringText: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 4,
  },
  closeButton: {
    marginTop: 8,
    padding: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});