import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Calendar, Clock, User, MapPin, Plus, Filter, X, ChevronRight, Grid3x3 as Grid3X3, Copy, CreditCard as Edit3 } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import CustomButton from '@/components/common/CustomButton';

interface Shift {
  id: string;
  familyName: string;
  nurseName: string | null;
  date: string;
  time: string;
  location: string;
  status: 'covered' | 'uncovered' | 'pending';
  recurring: boolean;
  fullDate: Date;
}

interface Nurse {
  id: string;
  name: string;
  availability: string;
  rating: number;
}

interface FamilyColor {
  familyName: string;
  color: string;
}

export default function ManageShiftsScreen() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'covered' | 'uncovered' | 'pending'>('all');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);
  const [selectedDateShifts, setSelectedDateShifts] = useState<Shift[]>([]);
  const [selectedDateString, setSelectedDateString] = useState<string>('');
  const [duplicateCount, setDuplicateCount] = useState('1');
  const [duplicateInterval, setDuplicateInterval] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());

  // TODO: Fetch family colors from Supabase
  const familyColors: FamilyColor[] = [];

  const getFamilyColor = (familyName: string): string => {
    const familyColor = familyColors.find(fc => fc.familyName === familyName);
    return familyColor ? familyColor.color : '#95A5A6'; // Default gray color
  };

  // TODO: Fetch available nurses from Supabase
  const availableNurses: Nurse[] = [];

  // TODO: Fetch shifts data from Supabase
  const [shifts, setShifts] = useState<Shift[]>([]);

  const filteredShifts = shifts.filter(shift => {
    if (selectedFilter === 'all') return true;
    return shift.status === selectedFilter;
  });

  // Calendar helper functions
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

  const getShiftsForDate = (day: number) => {
    const date = new Date(currentDate);
    date.setDate(day);
    
    return shifts.filter(shift => {
      const shiftDate = shift.fullDate;
      return (
        shiftDate.getDate() === date.getDate() &&
        shiftDate.getMonth() === date.getMonth() &&
        shiftDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  const handleCreateShift = () => {
    setShowCreateModal(true);
  };

  const handleAssignNurse = (shiftId: string) => {
    setSelectedShiftId(shiftId);
    setShowAssignModal(true);
  };

  const handleDuplicateShift = (shiftId: string) => {
    setSelectedShiftId(shiftId);
    setShowDuplicateModal(true);
  };

  const handleNurseSelection = (nurseId: string, nurseName: string) => {
    if (selectedShiftId) {
      setShifts(prevShifts => 
        prevShifts.map(shift => 
          shift.id === selectedShiftId 
            ? { ...shift, nurseName, status: 'covered' as const }
            : shift
        )
      );
      
      setShowAssignModal(false);
      setSelectedShiftId(null);
      
      Alert.alert(
        'Nurse Assigned',
        `${nurseName} has been successfully assigned to this shift.`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleCreateNewShift = () => {
    // TODO: Implement real shift creation with form data
    setShowCreateModal(false);
    
    Alert.alert(
      'Feature Coming Soon',
      'Shift creation will be implemented with real data integration.',
      [{ text: 'OK' }]
    );
  };

  const handleShiftDetails = (shiftId: string) => {
    const shift = shifts.find(s => s.id === shiftId);
    if (shift) {
      Alert.alert(
        'Shift Details',
        `Family: ${shift.familyName}\nDate: ${shift.date}\nTime: ${shift.time}\nLocation: ${shift.location}\nNurse: ${shift.nurseName || 'Unassigned'}\nStatus: ${shift.status}\nRecurring: ${shift.recurring ? 'Yes' : 'No'}`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleDateSelect = (day: number) => {
    const date = new Date(currentDate);
    date.setDate(day);
    
    const dayShifts = getShiftsForDate(day);
    const dateString = date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
    
    setSelectedDateShifts(dayShifts);
    setSelectedDateString(dateString);
    setShowDateModal(true);
  };

  const handleDuplicateConfirm = () => {
    if (!selectedShiftId) return;

    const originalShift = shifts.find(s => s.id === selectedShiftId);
    if (!originalShift) return;

    const count = parseInt(duplicateCount);
    if (isNaN(count) || count < 1 || count > 52) {
      Alert.alert('Invalid Count', 'Please enter a number between 1 and 52');
      return;
    }

    const newShifts: Shift[] = [];
    
    for (let i = 1; i <= count; i++) {
      const newDate = new Date(originalShift.fullDate);
      
      switch (duplicateInterval) {
        case 'daily':
          newDate.setDate(newDate.getDate() + i);
          break;
        case 'weekly':
          newDate.setDate(newDate.getDate() + (i * 7));
          break;
        case 'monthly':
          newDate.setMonth(newDate.getMonth() + i);
          break;
      }

      const newShift: Shift = {
        ...originalShift,
        id: `${originalShift.id}_dup_${i}_${Date.now()}`,
        date: newDate.toLocaleDateString(),
        fullDate: newDate,
        nurseName: null, // Reset nurse assignment for duplicated shifts
        status: 'uncovered' // Reset status for duplicated shifts
      };

      newShifts.push(newShift);
    }

    setShifts(prevShifts => [...prevShifts, ...newShifts]);
    setShowDuplicateModal(false);
    setSelectedShiftId(null);
    setDuplicateCount('1');
    
    Alert.alert(
      'Shifts Duplicated',
      `Successfully created ${count} duplicate shift${count > 1 ? 's' : ''} for ${originalShift.familyName}.`,
      [{ text: 'OK' }]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'covered':
        return COLORS.success;
      case 'uncovered':
        return COLORS.error;
      case 'pending':
        return COLORS.warning;
      default:
        return COLORS.textSecondary;
    }
  };

  const getUniqueFamiliesInShifts = () => {
    const uniqueFamilies = [...new Set(shifts.map(shift => shift.familyName))];
    return uniqueFamilies.map(familyName => ({
      familyName,
      color: getFamilyColor(familyName)
    }));
  };

  const filters = [
    { key: 'all', label: 'All Shifts' },
    { key: 'covered', label: 'Covered' },
    { key: 'uncovered', label: 'Uncovered' },
    { key: 'pending', label: 'Pending' }
  ];

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Shifts</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.viewToggle, viewMode === 'calendar' && styles.activeViewToggle]}
            onPress={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
          >
            {viewMode === 'list' ? (
              <Calendar size={20} color={COLORS.primary} />
            ) : (
              <Grid3X3 size={20} color={COLORS.primary} />
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleCreateShift}
          >
            <Plus size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterTab,
                selectedFilter === filter.key && styles.activeFilterTab
              ]}
              onPress={() => setSelectedFilter(filter.key as any)}
            >
              <Text style={[
                styles.filterTabText,
                selectedFilter === filter.key && styles.activeFilterTabText
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {viewMode === 'calendar' ? (
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
                
                // Get unique families for this day
                const uniqueFamilies = [...new Set(dayShifts.map(shift => shift.familyName))];
                
                // Check if there are any uncovered shifts (for warning indicator)
                const hasUncoveredShifts = dayShifts.some(shift => shift.status === 'uncovered');

                return (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.calendarDay,
                      hasShifts && styles.dayWithShifts,
                    ]}
                    onPress={() => handleDateSelect(day)}
                  >
                    <Text style={styles.dayText}>{day}</Text>
                    
                    {/* Family color indicators */}
                    {hasShifts && (
                      <View style={styles.familyIndicators}>
                        {uniqueFamilies.slice(0, 3).map((familyName, index) => (
                          <View 
                            key={familyName}
                            style={[
                              styles.familyDot, 
                              { 
                                backgroundColor: getFamilyColor(familyName),
                                left: index * 6 
                              }
                            ]} 
                          />
                        ))}
                        {uniqueFamilies.length > 3 && (
                          <Text style={styles.moreFamiliesIndicator}>+{uniqueFamilies.length - 3}</Text>
                        )}
                      </View>
                    )}
                    
                    {/* Shift count */}
                    {dayShifts.length > 0 && (
                      <Text style={styles.shiftCount}>{dayShifts.length}</Text>
                    )}
                    
                    {/* Warning indicator for uncovered shifts */}
                    {hasUncoveredShifts && (
                      <View style={styles.warningIndicator}>
                        <Text style={styles.warningText}>!</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Family Legend */}
          <View style={styles.legend}>
            <Text style={styles.legendTitle}>Family Color Legend:</Text>
            <View style={styles.familyLegendContainer}>
              {getUniqueFamiliesInShifts().map((family, index) => (
                <View key={family.familyName} style={styles.familyLegendItem}>
                  <View style={[styles.familyLegendDot, { backgroundColor: family.color }]} />
                  <Text style={styles.familyLegendText}>{family.familyName}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.statusLegend}>
              <Text style={styles.statusLegendTitle}>Status Indicators:</Text>
              <View style={styles.statusLegendItems}>
                <View style={styles.statusLegendItem}>
                  <View style={styles.warningIndicator}>
                    <Text style={styles.warningText}>!</Text>
                  </View>
                  <Text style={styles.statusLegendText}>Uncovered shifts</Text>
                </View>
                <View style={styles.statusLegendItem}>
                  <Text style={styles.shiftCountExample}>3</Text>
                  <Text style={styles.statusLegendText}>Number of shifts</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.content}>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{shifts.filter(s => s.status === 'covered').length}</Text>
              <Text style={styles.statLabel}>Covered</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: COLORS.error }]}>
                {shifts.filter(s => s.status === 'uncovered').length}
              </Text>
              <Text style={styles.statLabel}>Uncovered</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: COLORS.warning }]}>
                {shifts.filter(s => s.status === 'pending').length}
              </Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>

          {filteredShifts.map((shift) => (
            <TouchableOpacity
              key={shift.id}
              style={[
                styles.shiftCard,
                { borderLeftColor: getFamilyColor(shift.familyName), borderLeftWidth: 4 }
              ]}
              onPress={() => handleShiftDetails(shift.id)}
            >
              <View style={styles.shiftHeader}>
                <Text style={styles.familyName}>{shift.familyName}</Text>
                <View style={styles.shiftActions}>
                  <TouchableOpacity
                    style={styles.duplicateButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDuplicateShift(shift.id);
                    }}
                  >
                    <Copy size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(shift.status) + '20' }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: getStatusColor(shift.status) }
                    ]}>
                      {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.shiftDetails}>
                <View style={styles.detailRow}>
                  <Calendar size={16} color={COLORS.primary} />
                  <Text style={styles.detailText}>{shift.date}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Clock size={16} color={COLORS.primary} />
                  <Text style={styles.detailText}>{shift.time}</Text>
                </View>

                <View style={styles.detailRow}>
                  <MapPin size={16} color={COLORS.primary} />
                  <Text style={styles.detailText}>{shift.location}</Text>
                </View>

                <View style={styles.detailRow}>
                  <User size={16} color={COLORS.primary} />
                  <Text style={styles.detailText}>
                    {shift.nurseName || 'No nurse assigned'}
                  </Text>
                </View>

                {shift.recurring && (
                  <View style={styles.recurringBadge}>
                    <Text style={styles.recurringText}>Recurring Shift</Text>
                  </View>
                )}
              </View>

              {(shift.status === 'uncovered' || shift.status === 'pending') && (
                <TouchableOpacity 
                  style={styles.assignButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleAssignNurse(shift.id);
                  }}
                >
                  <Text style={styles.assignButtonText}>
                    {shift.status === 'uncovered' ? 'Assign Nurse' : 'Reassign Nurse'}
                  </Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}

          {filteredShifts.length === 0 && (
            <View style={styles.emptyState}>
              <Calendar size={48} color={COLORS.textSecondary} />
              <Text style={styles.emptyStateTitle}>No shifts found</Text>
              <Text style={styles.emptyStateText}>
                No shifts match the selected filter criteria.
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Date Details Modal */}
      <Modal
        visible={showDateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Shifts for {selectedDateString}</Text>
              <TouchableOpacity 
                onPress={() => setShowDateModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            {selectedDateShifts.length > 0 ? (
              <ScrollView style={styles.dateShiftsList}>
                {selectedDateShifts.map((shift) => (
                  <View 
                    key={shift.id} 
                    style={[
                      styles.dateShiftCard,
                      { borderLeftColor: getFamilyColor(shift.familyName), borderLeftWidth: 4 }
                    ]}
                  >
                    <View style={styles.dateShiftHeader}>
                      <Text style={styles.dateShiftFamily}>{shift.familyName}</Text>
                      <View style={styles.dateShiftActions}>
                        <TouchableOpacity
                          style={styles.dateShiftActionButton}
                          onPress={() => {
                            setShowDateModal(false);
                            handleDuplicateShift(shift.id);
                          }}
                        >
                          <Copy size={16} color={COLORS.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.dateShiftActionButton}
                          onPress={() => {
                            setShowDateModal(false);
                            handleShiftDetails(shift.id);
                          }}
                        >
                          <Edit3 size={16} color={COLORS.primary} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    <View style={styles.dateShiftDetails}>
                      <Text style={styles.dateShiftTime}>{shift.time}</Text>
                      <Text style={styles.dateShiftLocation}>{shift.location}</Text>
                      <Text style={styles.dateShiftNurse}>
                        Nurse: {shift.nurseName || 'Unassigned'}
                      </Text>
                      <View style={[
                        styles.dateShiftStatus,
                        { backgroundColor: getStatusColor(shift.status) + '20' }
                      ]}>
                        <Text style={[
                          styles.dateShiftStatusText,
                          { color: getStatusColor(shift.status) }
                        ]}>
                          {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                        </Text>
                      </View>
                    </View>

                    {(shift.status === 'uncovered' || shift.status === 'pending') && (
                      <TouchableOpacity 
                        style={styles.dateShiftAssignButton}
                        onPress={() => {
                          setShowDateModal(false);
                          handleAssignNurse(shift.id);
                        }}
                      >
                        <Text style={styles.dateShiftAssignText}>
                          {shift.status === 'uncovered' ? 'Assign Nurse' : 'Reassign Nurse'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.noShiftsContainer}>
                <Calendar size={48} color={COLORS.textSecondary} />
                <Text style={styles.noShiftsTitle}>No shifts scheduled</Text>
                <Text style={styles.noShiftsText}>
                  No shifts are scheduled for this date.
                </Text>
                <CustomButton
                  title="Create New Shift"
                  onPress={() => {
                    setShowDateModal(false);
                    handleCreateShift();
                  }}
                  style={styles.createShiftButton}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Duplicate Shift Modal */}
      <Modal
        visible={showDuplicateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDuplicateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Duplicate Shift</Text>
              <TouchableOpacity 
                onPress={() => setShowDuplicateModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Create multiple copies of this shift with the specified interval.
            </Text>

            <View style={styles.duplicateForm}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Number of duplicates:</Text>
                <TextInput
                  style={styles.formInput}
                  value={duplicateCount}
                  onChangeText={setDuplicateCount}
                  keyboardType="numeric"
                  placeholder="1"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Interval:</Text>
                <View style={styles.intervalButtons}>
                  {(['daily', 'weekly', 'monthly'] as const).map((interval) => (
                    <TouchableOpacity
                      key={interval}
                      style={[
                        styles.intervalButton,
                        duplicateInterval === interval && styles.activeIntervalButton
                      ]}
                      onPress={() => setDuplicateInterval(interval)}
                    >
                      <Text style={[
                        styles.intervalButtonText,
                        duplicateInterval === interval && styles.activeIntervalButtonText
                      ]}>
                        {interval.charAt(0).toUpperCase() + interval.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <Text style={styles.duplicateNote}>
                Note: Duplicated shifts will be unassigned and marked as uncovered.
              </Text>

              <View style={styles.duplicateActions}>
                <CustomButton
                  title="Cancel"
                  onPress={() => setShowDuplicateModal(false)}
                  style={styles.cancelButton}
                  outline
                />
                <CustomButton
                  title="Duplicate"
                  onPress={handleDuplicateConfirm}
                  style={styles.confirmButton}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Assign Nurse Modal */}
      <Modal
        visible={showAssignModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAssignModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assign Nurse</Text>
              <TouchableOpacity 
                onPress={() => setShowAssignModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Select a nurse to assign to this shift:
            </Text>

            <ScrollView style={styles.nurseList}>
              {availableNurses.map((nurse) => (
                <TouchableOpacity
                  key={nurse.id}
                  style={styles.nurseOption}
                  onPress={() => handleNurseSelection(nurse.id, nurse.name)}
                >
                  <View style={styles.nurseInfo}>
                    <Text style={styles.nurseName}>{nurse.name}</Text>
                    <Text style={styles.nurseAvailability}>{nurse.availability}</Text>
                    <Text style={styles.nurseRating}>Rating: {nurse.rating}/5</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Create Shift Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Shift</Text>
              <TouchableOpacity 
                onPress={() => setShowCreateModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Create a new shift assignment for a family.
            </Text>

            <View style={styles.createShiftForm}>
              <Text style={styles.formNote}>
                This is a simplified demo. In a full implementation, you would have forms to select:
                {'\n\n'}• Family from your client list
                {'\n'}• Date and time preferences
                {'\n'}• Specific care requirements
                {'\n'}• Recurring schedule options
                {'\n'}• Special instructions
              </Text>

              <CustomButton
                title="Create Sample Shift"
                onPress={handleCreateNewShift}
                style={styles.createButton}
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeViewToggle: {
    backgroundColor: COLORS.primary,
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 12,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundSecondary,
  },
  activeFilterTab: {
    backgroundColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  activeFilterTabText: {
    color: COLORS.white,
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
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
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
  calendarDay: {
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
  dayWithShifts: {
    backgroundColor: COLORS.backgroundSecondary,
  },
  dayText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  familyIndicators: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  familyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
  },
  moreFamiliesIndicator: {
    fontSize: 8,
    color: COLORS.text,
    fontWeight: '600',
    marginLeft: 18,
  },
  shiftCount: {
    position: 'absolute',
    top: 2,
    right: 2,
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '600',
  },
  warningIndicator: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningText: {
    fontSize: 8,
    color: COLORS.white,
    fontWeight: '700',
  },
  legend: {
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
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  familyLegendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  familyLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  familyLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  familyLegendText: {
    fontSize: 12,
    color: COLORS.text,
  },
  statusLegend: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  statusLegendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  statusLegendItems: {
    flexDirection: 'row',
    gap: 20,
  },
  statusLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLegendText: {
    fontSize: 12,
    color: COLORS.text,
    marginLeft: 8,
  },
  shiftCountExample: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '600',
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.success,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  shiftCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
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
    flex: 1,
  },
  shiftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  duplicateButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  shiftDetails: {
    gap: 8,
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
    marginTop: 8,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  dateShiftsList: {
    maxHeight: 400,
  },
  dateShiftCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  dateShiftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateShiftFamily: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  dateShiftActions: {
    flexDirection: 'row',
    gap: 8,
  },
  dateShiftActionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateShiftDetails: {
    marginBottom: 12,
  },
  dateShiftTime: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  dateShiftLocation: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  dateShiftNurse: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
  },
  dateShiftStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  dateShiftStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateShiftAssignButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  dateShiftAssignText: {
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
  createShiftButton: {
    minWidth: 200,
  },
  duplicateForm: {
    gap: 20,
  },
  formGroup: {
    gap: 8,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  formInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  intervalButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  intervalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
  },
  activeIntervalButton: {
    backgroundColor: COLORS.primary,
  },
  intervalButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  activeIntervalButtonText: {
    color: COLORS.white,
  },
  duplicateNote: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  duplicateActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
  },
  nurseList: {
    maxHeight: 300,
  },
  nurseOption: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  nurseInfo: {
    flex: 1,
  },
  nurseName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  nurseAvailability: {
    fontSize: 14,
    color: COLORS.success,
    marginBottom: 4,
  },
  nurseRating: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  createShiftForm: {
    alignItems: 'center',
  },
  formNote: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 24,
    textAlign: 'left',
  },
});