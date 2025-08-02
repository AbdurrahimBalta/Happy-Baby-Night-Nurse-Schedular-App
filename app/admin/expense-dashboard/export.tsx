import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Download, FileText, Calendar, Check } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import CustomButton from '@/components/common/CustomButton';

interface ExportOption {
  id: string;
  title: string;
  description: string;
  format: 'csv' | 'pdf' | 'excel';
  icon: React.ReactNode;
}

export default function ExportScreen() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'pdf' | 'excel'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState([
    {
      id: '1',
      title: 'Revenue Report - March 2024',
      date: '2024-03-15',
      format: 'csv',
      size: '245 KB'
    },
    {
      id: '2',
      title: 'Expense Report - February 2024',
      date: '2024-03-01',
      format: 'pdf',
      size: '1.2 MB'
    },
    {
      id: '3',
      title: 'Profit & Loss - Q1 2024',
      date: '2024-04-01',
      format: 'excel',
      size: '780 KB'
    }
  ]);

  const years = ['2024', '2023', '2022'];
  const months = [
    { value: 'all', label: 'All Months' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const exportOptions: ExportOption[] = [
    {
      id: 'revenue',
      title: 'Revenue Report',
      description: 'Export detailed revenue data including all income sources',
      format: 'csv',
      icon: <FileText size={24} color={COLORS.primary} />
    },
    {
      id: 'expenses',
      title: 'Expense Report',
      description: 'Export all expenses categorized by type',
      format: 'csv',
      icon: <FileText size={24} color={COLORS.warning} />
    },
    {
      id: 'profit',
      title: 'Profit & Loss',
      description: 'Comprehensive P&L statement with monthly breakdown',
      format: 'pdf',
      icon: <FileText size={24} color={COLORS.success} />
    },
    {
      id: 'summary',
      title: 'Financial Summary',
      description: 'High-level overview of financial performance',
      format: 'excel',
      icon: <FileText size={24} color={COLORS.text} />
    }
  ];

  const handleExport = (option: ExportOption) => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      
      const monthText = selectedMonth === 'all' 
        ? 'All Months' 
        : months.find(m => m.value === selectedMonth)?.label;
      
      const newExport = {
        id: Date.now().toString(),
        title: `${option.title} - ${monthText} ${selectedYear}`,
        date: new Date().toISOString().split('T')[0],
        format: option.format,
        size: `${Math.floor(Math.random() * 900 + 100)} KB`
      };
      
      setExportHistory([newExport, ...exportHistory]);
      
      Alert.alert(
        'Export Complete',
        `Your ${option.title} has been exported successfully.`,
        [{ text: 'OK' }]
      );
    }, 2000);
  };

  const handleDownload = (exportId: string) => {
    Alert.alert(
      'Download File',
      'The file would be downloaded to your device in a real implementation.',
      [{ text: 'OK' }]
    );
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'csv':
        return <FileText size={16} color="#4285F4" />;
      case 'pdf':
        return <FileText size={16} color="#DB4437" />;
      case 'excel':
        return <FileText size={16} color="#0F9D58" />;
      default:
        return <FileText size={16} color={COLORS.textSecondary} />;
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
        <Text style={styles.headerTitle}>Export Financial Data</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Export Options</Text>
          <Text style={styles.sectionDescription}>
            Select a report type to export your financial data
          </Text>
          
          <View style={styles.filterContainer}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Year</Text>
              <View style={styles.filterOptions}>
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.filterOption,
                      selectedYear === year && styles.selectedFilterOption
                    ]}
                    onPress={() => setSelectedYear(year)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      selectedYear === year && styles.selectedFilterOptionText
                    ]}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Month</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.monthOptions}
              >
                {months.map((month) => (
                  <TouchableOpacity
                    key={month.value}
                    style={[
                      styles.filterOption,
                      selectedMonth === month.value && styles.selectedFilterOption
                    ]}
                    onPress={() => setSelectedMonth(month.value)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      selectedMonth === month.value && styles.selectedFilterOptionText
                    ]}>
                      {month.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Format</Text>
              <View style={styles.formatOptions}>
                {[
                  { value: 'csv', label: 'CSV' },
                  { value: 'pdf', label: 'PDF' },
                  { value: 'excel', label: 'Excel' }
                ].map((format) => (
                  <TouchableOpacity
                    key={format.value}
                    style={[
                      styles.formatOption,
                      selectedFormat === format.value && styles.selectedFormatOption
                    ]}
                    onPress={() => setSelectedFormat(format.value as any)}
                  >
                    {getFormatIcon(format.value)}
                    <Text style={[
                      styles.formatOptionText,
                      selectedFormat === format.value && styles.selectedFormatOptionText
                    ]}>
                      {format.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          
          <View style={styles.exportOptions}>
            {exportOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.exportCard}
                onPress={() => handleExport(option)}
              >
                <View style={styles.exportCardHeader}>
                  <View style={styles.exportIconContainer}>
                    {option.icon}
                  </View>
                  <Text style={styles.exportTitle}>{option.title}</Text>
                </View>
                <Text style={styles.exportDescription}>{option.description}</Text>
                <CustomButton
                  title="Export"
                  onPress={() => handleExport(option)}
                  isLoading={isExporting}
                  style={styles.exportButton}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Exports</Text>
          
          {exportHistory.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View style={styles.historyItemContent}>
                <View style={styles.historyItemHeader}>
                  <View style={styles.historyItemIcon}>
                    {getFormatIcon(item.format)}
                  </View>
                  <View style={styles.historyItemInfo}>
                    <Text style={styles.historyItemTitle}>{item.title}</Text>
                    <View style={styles.historyItemMeta}>
                      <Calendar size={12} color={COLORS.textSecondary} />
                      <Text style={styles.historyItemDate}>{item.date}</Text>
                      <Text style={styles.historyItemSize}>{item.size}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => handleDownload(item.id)}
                >
                  <Download size={16} color={COLORS.primary} />
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
  placeholder: {
    width: 40,
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
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  filterContainer: {
    marginBottom: 24,
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  monthOptions: {
    paddingVertical: 4,
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundSecondary,
    marginRight: 8,
  },
  selectedFilterOption: {
    backgroundColor: COLORS.primary,
  },
  filterOptionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  selectedFilterOptionText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  formatOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  formatOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.backgroundSecondary,
    gap: 8,
  },
  selectedFormatOption: {
    backgroundColor: COLORS.primary + '20',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  formatOptionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  selectedFormatOptionText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  exportOptions: {
    gap: 16,
  },
  exportCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
  },
  exportCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  exportIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  exportDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  exportButton: {
    alignSelf: 'flex-start',
  },
  historyItem: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  historyItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyItemInfo: {
    flex: 1,
  },
  historyItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  historyItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyItemDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  historyItemSize: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  downloadButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});