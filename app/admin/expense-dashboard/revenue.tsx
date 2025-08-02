import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, DollarSign, Plus, CreditCard as Edit2, Calendar } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import CustomInput from '@/components/common/CustomInput';
import CustomButton from '@/components/common/CustomButton';

interface RevenueEntry {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  family?: string;
}

export default function RevenueScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<RevenueEntry | null>(null);
  
  const [newEntry, setNewEntry] = useState<Omit<RevenueEntry, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    category: 'Night Shift',
    amount: 0,
    description: '',
    family: ''
  });

  // Mock revenue data
  const [revenueEntries, setRevenueEntries] = useState<RevenueEntry[]>([
    {
      id: '1',
      date: '2024-03-01',
      category: 'Sign-up Fee',
      amount: 250,
      description: 'New family registration',
      family: 'Smith Family'
    },
    {
      id: '2',
      date: '2024-03-02',
      category: 'Night Shift',
      amount: 520,
      description: 'Regular 10-hour shift',
      family: 'Johnson Family'
    },
    {
      id: '3',
      date: '2024-03-03',
      category: 'Night Shift',
      amount: 560,
      description: 'Weekend shift with twins',
      family: 'Williams Family'
    },
    {
      id: '4',
      date: '2024-03-05',
      category: 'Sign-up Fee',
      amount: 250,
      description: 'New family registration',
      family: 'Brown Family'
    },
    {
      id: '5',
      date: '2024-03-07',
      category: 'Night Shift',
      amount: 520,
      description: 'Regular 10-hour shift',
      family: 'Smith Family'
    }
  ]);

  const totalRevenue = revenueEntries.reduce((sum, entry) => sum + entry.amount, 0);

  const handleAddEntry = () => {
    if (!newEntry.description || newEntry.amount <= 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const entry: RevenueEntry = {
      id: Date.now().toString(),
      ...newEntry
    };

    setRevenueEntries([entry, ...revenueEntries]);
    setShowAddForm(false);
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      category: 'Night Shift',
      amount: 0,
      description: '',
      family: ''
    });

    Alert.alert('Success', 'Revenue entry added successfully');
  };

  const handleEditEntry = (entry: RevenueEntry) => {
    setSelectedEntry(entry);
    setIsEditing(true);
  };

  const handleUpdateEntry = () => {
    if (!selectedEntry) return;

    setRevenueEntries(entries => 
      entries.map(entry => 
        entry.id === selectedEntry.id ? selectedEntry : entry
      )
    );
    
    setIsEditing(false);
    setSelectedEntry(null);
    
    Alert.alert('Success', 'Revenue entry updated successfully');
  };

  const handleDeleteEntry = (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this revenue entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setRevenueEntries(entries => entries.filter(entry => entry.id !== id));
            Alert.alert('Success', 'Revenue entry deleted successfully');
          }
        }
      ]
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
        <Text style={styles.headerTitle}>Revenue Management</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Revenue</Text>
          <Text style={styles.summaryAmount}>{formatCurrency(totalRevenue)}</Text>
          <Text style={styles.summaryPeriod}>Year to Date</Text>
        </View>

        {showAddForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Add Revenue Entry</Text>
            
            <CustomInput
              label="Date"
              value={newEntry.date}
              onChangeText={(text) => setNewEntry({...newEntry, date: text})}
              placeholder="YYYY-MM-DD"
            />
            
            <View style={styles.categorySelector}>
              <Text style={styles.categoryLabel}>Category</Text>
              <View style={styles.categoryOptions}>
                {['Sign-up Fee', 'Night Shift', 'Service Fee', 'Other'].map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      newEntry.category === category && styles.selectedCategory
                    ]}
                    onPress={() => setNewEntry({...newEntry, category})}
                  >
                    <Text style={[
                      styles.categoryText,
                      newEntry.category === category && styles.selectedCategoryText
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <CustomInput
              label="Amount ($)"
              value={newEntry.amount.toString()}
              onChangeText={(text) => setNewEntry({...newEntry, amount: parseFloat(text) || 0})}
              keyboardType="numeric"
            />
            
            <CustomInput
              label="Family (Optional)"
              value={newEntry.family}
              onChangeText={(text) => setNewEntry({...newEntry, family: text})}
              placeholder="e.g., Smith Family"
            />
            
            <CustomInput
              label="Description"
              value={newEntry.description}
              onChangeText={(text) => setNewEntry({...newEntry, description: text})}
              placeholder="Brief description of the revenue"
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.formButtons}>
              <CustomButton
                title="Cancel"
                onPress={() => setShowAddForm(false)}
                style={styles.cancelButton}
                outline
              />
              <CustomButton
                title="Add Entry"
                onPress={handleAddEntry}
                style={styles.submitButton}
              />
            </View>
          </View>
        )}

        {isEditing && selectedEntry && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Edit Revenue Entry</Text>
            
            <CustomInput
              label="Date"
              value={selectedEntry.date}
              onChangeText={(text) => setSelectedEntry({...selectedEntry, date: text})}
              placeholder="YYYY-MM-DD"
            />
            
            <View style={styles.categorySelector}>
              <Text style={styles.categoryLabel}>Category</Text>
              <View style={styles.categoryOptions}>
                {['Sign-up Fee', 'Night Shift', 'Service Fee', 'Other'].map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      selectedEntry.category === category && styles.selectedCategory
                    ]}
                    onPress={() => setSelectedEntry({...selectedEntry, category})}
                  >
                    <Text style={[
                      styles.categoryText,
                      selectedEntry.category === category && styles.selectedCategoryText
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <CustomInput
              label="Amount ($)"
              value={selectedEntry.amount.toString()}
              onChangeText={(text) => setSelectedEntry({...selectedEntry, amount: parseFloat(text) || 0})}
              keyboardType="numeric"
            />
            
            <CustomInput
              label="Family (Optional)"
              value={selectedEntry.family}
              onChangeText={(text) => setSelectedEntry({...selectedEntry, family: text})}
              placeholder="e.g., Smith Family"
            />
            
            <CustomInput
              label="Description"
              value={selectedEntry.description}
              onChangeText={(text) => setSelectedEntry({...selectedEntry, description: text})}
              placeholder="Brief description of the revenue"
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.formButtons}>
              <CustomButton
                title="Cancel"
                onPress={() => {
                  setIsEditing(false);
                  setSelectedEntry(null);
                }}
                style={styles.cancelButton}
                outline
              />
              <CustomButton
                title="Update Entry"
                onPress={handleUpdateEntry}
                style={styles.submitButton}
              />
            </View>
          </View>
        )}

        <View style={styles.entriesSection}>
          <Text style={styles.entriesTitle}>Revenue Entries</Text>
          
          {revenueEntries.map((entry) => (
            <View key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View style={styles.entryDate}>
                  <Calendar size={16} color={COLORS.primary} />
                  <Text style={styles.dateText}>{formatDate(entry.date)}</Text>
                </View>
                <Text style={styles.entryAmount}>{formatCurrency(entry.amount)}</Text>
              </View>
              
              <View style={styles.entryDetails}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{entry.category}</Text>
                </View>
                {entry.family && (
                  <Text style={styles.familyText}>{entry.family}</Text>
                )}
                <Text style={styles.descriptionText}>{entry.description}</Text>
              </View>
              
              <View style={styles.entryActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleEditEntry(entry)}
                >
                  <Edit2 size={16} color={COLORS.primary} />
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeleteEntry(entry.id)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  summaryPeriod: {
    fontSize: 14,
    color: COLORS.white + 'CC',
  },
  formCard: {
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
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  categorySelector: {
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  categoryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedCategory: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  selectedCategoryText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
  entriesSection: {
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
  entriesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  entryCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text,
  },
  entryAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  entryDetails: {
    marginBottom: 12,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  familyText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  entryActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.primary,
  },
  deleteButton: {
    backgroundColor: COLORS.errorLight,
  },
  deleteText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.error,
  },
});