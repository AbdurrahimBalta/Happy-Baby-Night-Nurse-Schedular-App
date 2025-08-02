import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Moon, Baby, Clock, Droplet, Heart, Frown, Smile, Thermometer, Wind, MessageSquare } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import CustomInput from '@/components/common/CustomInput';
import CustomButton from '@/components/common/CustomButton';

// Define temperament options with icons
const temperamentOptions = [
  { key: 'happy', label: 'Happy', icon: <Smile size={20} color={COLORS.success} /> },
  { key: 'fussy', label: 'Fussy', icon: <Frown size={20} color={COLORS.warning} /> },
  { key: 'gassy', label: 'Gassy', icon: <Wind size={20} color={COLORS.primary} /> },
  { key: 'sick', label: 'Sick', icon: <Thermometer size={20} color={COLORS.error} /> },
  { key: 'calm', label: 'Calm', icon: <Heart size={20} color={COLORS.primary} /> }
];

// Activity types
type ActivityType = 'sleep' | 'feeding' | 'diaper' | 'wake' | 'medication' | 'note';

// Activity interface
interface Activity {
  id: string;
  time: string;
  type: ActivityType;
  description: string;
}

// Night log interface
interface NightLog {
  id: string;
  date: string;
  nurseName: string;
  nurseId: string;
  familyName: string;
  familyId: string;
  shift: string;
  activities: Activity[];
  summary: {
    sleep: string;
    feedings: string;
    diapers: string;
    notes: string;
    temperament: string;
  };
}

export default function NightLogScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [nightLog, setNightLog] = useState<NightLog | null>(null);
  const [editedLog, setEditedLog] = useState<NightLog | null>(null);
  const [selectedTemperament, setSelectedTemperament] = useState<string>('');
  const [newActivity, setNewActivity] = useState<{
    time: string;
    type: ActivityType;
    description: string;
  }>({
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: 'note',
    description: ''
  });
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Generate mock data for available dates (last 30 days)
  useEffect(() => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    setAvailableDates(dates);
    setSelectedDate(dates[0]);
  }, []);

  // Fetch night log data
  useEffect(() => {
    const fetchNightLog = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, we'll simulate with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockLog: NightLog = {
          id: id as string,
          date: selectedDate || new Date().toISOString().split('T')[0],
          nurseName: 'Angela Davis',
          nurseId: 'nurse-1',
          familyName: 'Smith Family',
          familyId: 'family-1',
          shift: '8:00 PM - 6:00 AM',
          activities: [
            {
              id: '1',
              time: '8:30 PM',
              type: 'sleep',
              description: 'Both babies put to sleep after bedtime routine'
            },
            {
              id: '2',
              time: '11:15 PM',
              type: 'feeding',
              description: 'Liam woke up for feeding - 4oz formula'
            },
            {
              id: '3',
              time: '11:30 PM',
              type: 'diaper',
              description: 'Changed Liam\'s diaper'
            },
            {
              id: '4',
              time: '2:30 AM',
              type: 'feeding',
              description: 'Emma woke up for feeding - 3.5oz formula'
            },
            {
              id: '5',
              time: '2:45 AM',
              type: 'diaper',
              description: 'Changed Emma\'s diaper'
            },
            {
              id: '6',
              time: '5:45 AM',
              type: 'wake',
              description: 'Both babies waking up, starting morning routine'
            }
          ],
          summary: {
            sleep: '8.5 hours average',
            feedings: '2 per baby',
            diapers: '2 per baby',
            notes: 'Both babies slept well. Emma was a bit fussy during her 2:30 AM feeding but settled quickly after.',
            temperament: 'happy'
          }
        };
        
        setNightLog(mockLog);
        setEditedLog(mockLog);
        setSelectedTemperament(mockLog.summary.temperament);
      } catch (error) {
        console.error('Error fetching night log:', error);
        Alert.alert('Error', 'Failed to load night log data');
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedDate) {
      fetchNightLog();
    }
  }, [id, selectedDate]);

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'sleep':
        return <Moon size={20} color={COLORS.primary} />;
      case 'feeding':
        return <Baby size={20} color={COLORS.primary} />;
      case 'diaper':
        return <Droplet size={20} color={COLORS.primary} />;
      case 'wake':
        return <Clock size={20} color={COLORS.primary} />;
      case 'medication':
        return <Thermometer size={20} color={COLORS.primary} />;
      case 'note':
        return <MessageSquare size={20} color={COLORS.primary} />;
      default:
        return null;
    }
  };

  const handleSave = async () => {
    if (!editedLog) return;
    
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the summary with the selected temperament
      const updatedLog = {
        ...editedLog,
        summary: {
          ...editedLog.summary,
          temperament: selectedTemperament
        }
      };
      
      setNightLog(updatedLog);
      setEditedLog(updatedLog);
      setIsEditing(false);
      Alert.alert('Success', 'Night log updated successfully');
    } catch (error) {
      console.error('Error saving night log:', error);
      Alert.alert('Error', 'Failed to save night log');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddActivity = () => {
    if (!editedLog || !newActivity.description.trim()) return;
    
    const activity: Activity = {
      id: Date.now().toString(),
      ...newActivity
    };
    
    const updatedActivities = [...editedLog.activities, activity].sort((a, b) => {
      const timeA = new Date(`2000-01-01T${a.time}`).getTime();
      const timeB = new Date(`2000-01-01T${b.time}`).getTime();
      return timeA - timeB;
    });
    
    setEditedLog({
      ...editedLog,
      activities: updatedActivities
    });
    
    // Reset new activity form
    setNewActivity({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'note',
      description: ''
    });
  };

  const handleRemoveActivity = (activityId: string) => {
    if (!editedLog) return;
    
    setEditedLog({
      ...editedLog,
      activities: editedLog.activities.filter(a => a.id !== activityId)
    });
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  // Check if user has edit permissions
  const canEdit = user?.role === 'nurse' || user?.role === 'admin';

  if (isLoading && !nightLog) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Night Log</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading night log...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!nightLog) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Night Log</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No night log found</Text>
          <CustomButton
            title="Go Back"
            onPress={() => router.back()}
            style={styles.backHomeButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Night Log</Text>
        {canEdit && !isEditing && (
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
        {!canEdit && <View style={styles.placeholder} />}
      </View>

      <View style={styles.dateSelector}>
        <TouchableOpacity 
          style={styles.dateSelectorButton}
          onPress={() => setShowDatePicker(!showDatePicker)}
        >
          <Text style={styles.dateSelectorText}>
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
          <ChevronLeft 
            size={20} 
            color={COLORS.primary} 
            style={{ transform: [{ rotate: showDatePicker ? '90deg' : '270deg' }] }}
          />
        </TouchableOpacity>
        
        {showDatePicker && (
          <ScrollView 
            style={styles.datePickerContainer}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {availableDates.map((date) => (
              <TouchableOpacity
                key={date}
                style={[
                  styles.dateOption,
                  selectedDate === date && styles.selectedDateOption
                ]}
                onPress={() => handleDateSelect(date)}
              >
                <Text style={[
                  styles.dateOptionText,
                  selectedDate === date && styles.selectedDateOptionText
                ]}>
                  {new Date(date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shift Information</Text>
          <Text style={styles.nurse}>Nurse: {nightLog.nurseName}</Text>
          <Text style={styles.shift}>Shift: {nightLog.shift}</Text>
          <Text style={styles.family}>Family: {nightLog.familyName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Baby Temperament</Text>
          <View style={styles.temperamentContainer}>
            {temperamentOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.temperamentOption,
                  selectedTemperament === option.key && styles.selectedTemperament,
                  !isEditing && { opacity: selectedTemperament === option.key ? 1 : 0.5 }
                ]}
                onPress={() => isEditing && setSelectedTemperament(option.key)}
                disabled={!isEditing}
              >
                <View style={styles.temperamentIcon}>
                  {option.icon}
                </View>
                <Text style={[
                  styles.temperamentLabel,
                  selectedTemperament === option.key && styles.selectedTemperamentLabel
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activities Timeline</Text>
          
          {isEditing && (
            <View style={styles.addActivityForm}>
              <Text style={styles.addActivityTitle}>Add New Activity</Text>
              
              <View style={styles.activityTypeSelector}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.activityTypesContainer}
                >
                  {['sleep', 'feeding', 'diaper', 'wake', 'medication', 'note'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.activityTypeOption,
                        newActivity.type === type && styles.selectedActivityType
                      ]}
                      onPress={() => setNewActivity(prev => ({ ...prev, type: type as ActivityType }))}
                    >
                      {getActivityIcon(type as ActivityType)}
                      <Text style={[
                        styles.activityTypeText,
                        newActivity.type === type && styles.selectedActivityTypeText
                      ]}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              <View style={styles.activityFormRow}>
                <CustomInput
                  label="Time"
                  value={newActivity.time}
                  onChangeText={(text) => setNewActivity(prev => ({ ...prev, time: text }))}
                  style={styles.timeInput}
                />
                
                <CustomInput
                  label="Description"
                  value={newActivity.description}
                  onChangeText={(text) => setNewActivity(prev => ({ ...prev, description: text }))}
                  style={styles.descriptionInput}
                />
              </View>
              
              <CustomButton
                title="Add Activity"
                onPress={handleAddActivity}
                style={styles.addActivityButton}
              />
            </View>
          )}
          
          <View style={styles.timeline}>
            {(isEditing ? editedLog?.activities : nightLog.activities).map((activity, index) => (
              <View key={activity.id} style={styles.timelineItem}>
                <View style={styles.timeContainer}>
                  <Text style={styles.time}>{activity.time}</Text>
                </View>
                <View style={styles.activityContainer}>
                  <View style={styles.activityIcon}>
                    {getActivityIcon(activity.type)}
                  </View>
                  <Text style={styles.activityDescription}>
                    {activity.description}
                  </Text>
                  
                  {isEditing && (
                    <TouchableOpacity
                      style={styles.removeActivityButton}
                      onPress={() => handleRemoveActivity(activity.id)}
                    >
                      <Text style={styles.removeActivityText}>×</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Moon size={24} color={COLORS.primary} />
              <Text style={styles.summaryLabel}>Sleep</Text>
              <Text style={styles.summaryValue}>{nightLog.summary.sleep}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Baby size={24} color={COLORS.primary} />
              <Text style={styles.summaryLabel}>Feedings</Text>
              <Text style={styles.summaryValue}>{nightLog.summary.feedings}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Droplet size={24} color={COLORS.primary} />
              <Text style={styles.summaryLabel}>Diapers</Text>
              <Text style={styles.summaryValue}>{nightLog.summary.diapers}</Text>
            </View>
          </View>
          
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Additional Notes:</Text>
            {isEditing ? (
              <CustomInput
                value={editedLog?.summary.notes || ''}
                onChangeText={(text) => setEditedLog(prev => prev ? {
                  ...prev,
                  summary: {
                    ...prev.summary,
                    notes: text
                  }
                } : null)}
                multiline
                numberOfLines={4}
                style={styles.notesInput}
              />
            ) : (
              <Text style={styles.notesText}>{nightLog.summary.notes}</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {isEditing && (
        <View style={styles.footer}>
          <CustomButton
            title="Cancel"
            onPress={() => {
              setEditedLog(nightLog);
              setSelectedTemperament(nightLog.summary.temperament);
              setIsEditing(false);
            }}
            style={styles.cancelButton}
            outline
          />
          <CustomButton
            title="Save Log"
            onPress={handleSave}
            isLoading={isLoading}
            style={styles.saveButton}
          />
        </View>
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
  placeholder: {
    width: 40,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  dateSelector: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dateSelectorButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateSelectorText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  datePickerContainer: {
    marginTop: 12,
    maxHeight: 50,
  },
  dateOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedDateOption: {
    backgroundColor: COLORS.primary,
  },
  dateOptionText: {
    fontSize: 14,
    color: COLORS.text,
  },
  selectedDateOptionText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  content: {
    flex: 1,
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
  nurse: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  shift: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  family: {
    fontSize: 16,
    color: COLORS.text,
  },
  temperamentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  temperamentOption: {
    alignItems: 'center',
    width: 80,
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundSecondary,
  },
  selectedTemperament: {
    backgroundColor: COLORS.primary + '20',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  temperamentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  temperamentLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  selectedTemperamentLabel: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  addActivityForm: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  addActivityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  activityTypeSelector: {
    marginBottom: 16,
  },
  activityTypesContainer: {
    paddingVertical: 8,
    gap: 12,
  },
  activityTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedActivityType: {
    backgroundColor: COLORS.primary,
  },
  activityTypeText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
  },
  selectedActivityTypeText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  activityFormRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  timeInput: {
    flex: 1,
  },
  descriptionInput: {
    flex: 3,
  },
  addActivityButton: {
    marginTop: 8,
  },
  timeline: {
    gap: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timeContainer: {
    width: 80,
    marginRight: 16,
  },
  time: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  activityContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    padding: 12,
    borderRadius: 8,
    position: 'relative',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityDescription: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  removeActivityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -8,
    right: -8,
  },
  removeActivityText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  notesContainer: {
    backgroundColor: COLORS.backgroundSecondary,
    padding: 16,
    borderRadius: 12,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  notesInput: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  backHomeButton: {
    minWidth: 200,
  },
});