import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Plus, CreditCard as Edit2, Calendar, DollarSign, Tag } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import CustomInput from '@/components/common/CustomInput';
import CustomButton from '@/components/common/CustomButton';

interface ExpenseEntry {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  vendor?: string;
  receipt?: string;
}

export default function ExpensesScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ExpenseEntry | null>(null);
  
  const [newEntry, setNewEntry] = useState<Omit<ExpenseEntry, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    category: 'Payroll',
    amount: 0,
    description: '',
    vendor: ''
  });

  // Mock expense categories
  const expenseCategories = [
    'Payroll', 'Insurance', 'Office', 'Marketing', 'Software', 'Travel', 'Legal', 'Other'
  ];

  // Mock expense data
  const [expenseEntries, setExpenseEntries] = useState<ExpenseEntry[]>([
    {
      id: '1',
      date: '2024-03-01',
      category: 'Payroll',
      amount: 45000,
      description: 'Monthly nurse payroll',
      vendor: 'Payroll Service'
    },
    {
      id: '2',
      date: '2024-03-05',
      category: 'Insurance',
      amount: 2500,
      description: 'Liability insurance premium',
      vendor: 'Insurance Co.'
    },
    {
      id: '3',
      date: '2024-03-10',
      category: 'Office',
      amount: 1200,
      description: 'Office rent',
      vendor: 'Property Management'
    },
    {
      id: '4',
      date: '2024-03-15',
      category: 'Marketing',
      amount: 1500,
      description: 'Social media advertising',
      vendor: 'Facebook Ads'
    },
    {
      id: '5',
      date: '2024-03-20',
      category: 'Software',
      amount: 800,
      description: 'Scheduling software subscription',
      vendor: 'SaaS Provider'
    }
  ]);

  const totalExpenses = expenseEntries.reduce((sum, entry) => sum + entry.amount, 0);

  const handleAddEntry = () => {
    if (!newEntry.description || newEntry.amount <= 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const entry: ExpenseEntry = {
      id: Date.now().toString(),
      ...newEntry
    };

    setExpenseEntries([entry, ...expenseEntries]);
    setShowAddForm(false);
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      category: 'Payroll',
      amount: 0,
      description: '',
      vendor: ''
    });

    Alert.alert('Success', 'Expense entry added successfully');
  };

  const handleEditEntry = (entry: ExpenseEntry) => {
    setSelectedEntry(entry);
    setIsEditing(true);
  };

  const handleUpdateEntry = () => {
    if (!selectedEntry) return;

    setExpenseEntries(entries => 
      entries.map(entry => 
        entry.id === selectedEntry.id ? selectedEntry : entry
      )
    );
    
    setIsEditing(false);
    setSelectedEntry(null);
    
    Alert.alert('Success', 'Expense entry updated successfully');
  };

  const handleDeleteEntry = (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this expense entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setExpenseEntries(entries => entries.filter(entry => entry.id !== id));
            Alert.alert('Success', 'Expense entry deleted successfully');
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Payroll':
        return COLORS.primary;
      case 'Insurance':
        return '#4ECDC4';
      case 'Office':
        return '#FF6B6B';
      case 'Marketing':
        return '#FFD166';
      case 'Software':
        return '#06D6A0';
      case 'Travel':
        return '#118AB2';
      case 'Legal':
        return '#073B4C';
      default:
        return COLORS.textSecondary;
    }
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
        <Text style={styles.headerTitle}>Expense Management</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Expenses</Text>
          <Text style={styles.summaryAmount}>{formatCurrency(totalExpenses)}</Text>
          <Text style={styles.summaryPeriod}>Year to Date</Text>
        </View>

        {showAddForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Add Expense Entry</Text>
            
            <CustomInput
              label="Date"
              value={newEntry.date}
              onChangeText={(text) => setNewEntry({...newEntry, date: text})}
              placeholder="YYYY-MM-DD"
            />
            
            <View style={styles.categorySelector}>
              <Text style={styles.categoryLabel}>Category</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryOptions}
              >
                {expenseCategories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      newEntry.category === category && styles.selectedCategory,
                      { borderColor: getCategoryColor(category) }
                    ]}
                    onPress={() => setNewEntry({...newEntry, category})}
                  >
                    <Text style={[
                      styles.categoryText,
                      newEntry.category === category && styles.selectedCategoryText,
                      { color: newEntry.category === category ? getCategoryColor(category) : COLORS.textSecondary }
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <CustomInput
              label="Amount ($)"
              value={newEntry.amount.toString()}
              onChangeText={(text) => setNewEntry({...newEntry, amount: parseFloat(text) || 0})}
              keyboardType="numeric"
            />
            
            <CustomInput
              label="Vendor/Payee (Optional)"
              value={newEntry.vendor}
              onChangeText={(text) => setNewEntry({...newEntry, vendor: text})}
              placeholder="e.g., Office Supplies Inc."
            />
            
            <CustomInput
              label="Description"
              value={newEntry.description}
              onChangeText={(text) => setNewEntry({...newEntry, description: text})}
              placeholder="Brief description of the expense"
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
            <Text style={styles.formTitle}>Edit Expense Entry</Text>
            
            <CustomInput
              label="Date"
              value={selectedEntry.date}
              onChangeText={(text) => setSelectedEntry({...selectedEntry, date: text})}
              placeholder="YYYY-MM-DD"
            />
            
            <View style={styles.categorySelector}>
              <Text style={styles.categoryLabel}>Category</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryOptions}
              >
                {expenseCategories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      selectedEntry.category === category && styles.selectedCategory,
                      { borderColor: getCategoryColor(category) }
                    ]}
                    onPress={() => setSelectedEntry({...selectedEntry, category})}
                  >
                    <Text style={[
                      styles.categoryText,
                      selectedEntry.category === category && styles.selectedCategoryText,
                      { color: selectedEntry.category === category ? getCategoryColor(category) : COLORS.textSecondary }
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <CustomInput
              label="Amount ($)"
              value={selectedEntry.amount.toString()}
              onChangeText={(text) => setSelectedEntry({...selectedEntry, amount: parseFloat(text) || 0})}
              keyboardType="numeric"
            />
            
            <CustomInput
              label="Vendor/Payee (Optional)"
              value={selectedEntry.vendor}
              onChangeText={(text) => setSelectedEntry({...selectedEntry, vendor: text})}
              placeholder="e.g., Office Supplies Inc."
            />
            
            <CustomInput
              label="Description"
              value={selectedEntry.description}
              onChangeText={(text) => setSelectedEntry({...selectedEntry, description: text})}
              placeholder="Brief description of the expense"
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
          <Text style={styles.entriesTitle}>Expense Entries</Text>
          
          {expenseEntries.map((entry) => (
            <View key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View style={styles.entryDate}>
                  <Calendar size={16} color={COLORS.primary} />
                  <Text style={styles.dateText}>{formatDate(entry.date)}</Text>
                </View>
                <Text style={styles.entryAmount}>{formatCurrency(entry.amount)}</Text>
              </View>
              
              <View style={styles.entryDetails}>
                <View style={[
                  styles.categoryBadge,
                  { backgroundColor: getCategoryColor(entry.category) + '20' }
                ]}>
                  <Tag size={12} color={getCategoryColor(entry.category)} />
                  <Text style={[
                    styles.categoryBadgeText,
                    { color: getCategoryColor(entry.category) }
                  ]}>
                    {entry.category}
                  </Text>
                </View>
                
                {entry.vendor && (
                  <Text style={styles.vendorText}>{entry.vendor}</Text>
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
    backgroundColor: COLORS.warning,
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
    paddingVertical: 8,
    gap: 8,
  },
  categoryOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 1,
    borderColor: 'transparent',
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: COLORS.white,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  selectedCategoryText: {
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
    color: COLORS.warning,
  },
  entryDetails: {
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
    gap: 4,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  vendorText: {
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