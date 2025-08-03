import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, DollarSign, TrendingUp, FileText, ChartBar as BarChart } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';

// TODO: Fetch financial data from Supabase
const EMPTY_FINANCIAL_DATA = {
  grossRevenue: 0,
  expenses: 0,
  profit: 0,
  monthlyData: []
};

export default function ExpenseDashboardScreen() {
  const [financialData, setFinancialData] = useState(EMPTY_FINANCIAL_DATA);
  const [selectedPeriod, setSelectedPeriod] = useState('year');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
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
        <Text style={styles.headerTitle}>Expense Dashboard</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.periodSelector}>
        {['month', 'quarter', 'year'].map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.selectedPeriodButton
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === period && styles.selectedPeriodButtonText
            ]}>
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.metricsContainer}>
          <TouchableOpacity 
            style={styles.metricCard}
            onPress={() => router.push('/admin/expense-dashboard/revenue')}
          >
            <View style={styles.metricIconContainer}>
              <DollarSign size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.metricLabel}>Gross Revenue</Text>
            <Text style={styles.metricValue}>{formatCurrency(financialData.grossRevenue)}</Text>
            <Text style={styles.metricSubtext}>YTD</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.metricCard}
            onPress={() => router.push('/admin/expense-dashboard/revenue')}
          >
            <View style={styles.metricIconContainer}>
              <TrendingUp size={24} color={COLORS.success} />
            </View>
            <Text style={styles.metricLabel}>Net Profit</Text>
            <Text style={[styles.metricValue, { color: COLORS.success }]}>
              {formatCurrency(financialData.profit)}
            </Text>
            <Text style={styles.metricSubtext}>YTD</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.metricCard}
            onPress={() => router.push('/admin/expense-dashboard/expenses')}
          >
            <View style={styles.metricIconContainer}>
              <BarChart size={24} color={COLORS.warning} />
            </View>
            <Text style={styles.metricLabel}>Expenses</Text>
            <Text style={[styles.metricValue, { color: COLORS.warning }]}>
              {formatCurrency(financialData.expenses)}
            </Text>
            <Text style={styles.metricSubtext}>YTD</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.metricCard}
            onPress={() => router.push('/admin/expense-dashboard/export')}
          >
            <View style={styles.metricIconContainer}>
              <FileText size={24} color={COLORS.text} />
            </View>
            <Text style={styles.metricLabel}>Export Files</Text>
            <Text style={styles.exportText}>Generate Reports</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Performance</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chartContainer}
          >
            {financialData.monthlyData.map((data, index) => (
              <View key={index} style={styles.monthColumn}>
                <View style={styles.barContainer}>
                  <View 
                    style={[
                      styles.bar, 
                      styles.expenseBar,
                      { height: (data.expenses / 20000) * 200 }
                    ]}
                  />
                  <View 
                    style={[
                      styles.bar, 
                      styles.profitBar,
                      { height: (data.profit / 20000) * 200 }
                    ]}
                  />
                </View>
                <Text style={styles.monthLabel}>{data.month}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: COLORS.primary }]} />
              <Text style={styles.legendText}>Revenue</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: COLORS.warning }]} />
              <Text style={styles.legendText}>Expenses</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: COLORS.success }]} />
              <Text style={styles.legendText}>Profit</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue Breakdown</Text>
          <View style={styles.breakdownContainer}>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Sign-up Fees</Text>
              <Text style={styles.breakdownValue}>{formatCurrency(25000)}</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: '20%', backgroundColor: COLORS.primary }
                  ]}
                />
              </View>
              <Text style={styles.breakdownPercent}>20%</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Night Shifts</Text>
              <Text style={styles.breakdownValue}>{formatCurrency(87500)}</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: '70%', backgroundColor: COLORS.primary }
                  ]}
                />
              </View>
              <Text style={styles.breakdownPercent}>70%</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Service Fees</Text>
              <Text style={styles.breakdownValue}>{formatCurrency(12500)}</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: '10%', backgroundColor: COLORS.primary }
                  ]}
                />
              </View>
              <Text style={styles.breakdownPercent}>10%</Text>
            </View>
          </View>
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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 20,
    padding: 4,
    margin: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 16,
  },
  selectedPeriodButton: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  selectedPeriodButtonText: {
    color: COLORS.primary,
  },
  content: {
    flex: 1,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  metricCard: {
    width: '46%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  metricIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  metricSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  exportText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 8,
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
  chartContainer: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    height: 250,
    alignItems: 'flex-end',
  },
  monthColumn: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  barContainer: {
    height: 200,
    width: 40,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: 20,
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  expenseBar: {
    backgroundColor: COLORS.warning,
    left: 0,
  },
  profitBar: {
    backgroundColor: COLORS.success,
    right: 0,
  },
  monthLabel: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  breakdownContainer: {
    gap: 16,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  breakdownLabel: {
    width: '30%',
    fontSize: 14,
    color: COLORS.text,
  },
  breakdownValue: {
    width: '25%',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  progressBar: {
    width: '30%',
    height: 8,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 4,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  breakdownPercent: {
    width: '10%',
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
});