import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Calendar, DollarSign, Clock, Users, Settings, ChevronRight, ChevronDown, ChevronUp, Plus } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';

interface PayPeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  status: 'current' | 'upcoming' | 'completed';
}

interface NursePayroll {
  id: string;
  name: string;
  picture: string;
  region: string;
  totalHours: number;
  regularHours: number;
  weekendHours: number;
  holidayHours: number;
  twinsHours: number;
  twinsWeekendHours: number;
  baseRate: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  insurancePaid: boolean;
  backgroundCheckPaid: boolean;
}

interface Region {
  id: string;
  name: string;
  nurses: NursePayroll[];
  expanded: boolean;
}

export default function PayrollScreen() {
  const [currentPayPeriod, setCurrentPayPeriod] = useState<PayPeriod>({
    id: '1',
    startDate: new Date(2024, 2, 1), // March 1, 2024
    endDate: new Date(2024, 2, 14), // March 14, 2024
    status: 'current'
  });

  const [regions, setRegions] = useState<Region[]>([
    {
      id: 'northeast-fl',
      name: 'Northeast Florida',
      expanded: true,
      nurses: [
        {
          id: '1',
          name: 'Angela Davis',
          picture: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300',
          region: 'Northeast Florida',
          totalHours: 84,
          regularHours: 60,
          weekendHours: 16,
          holidayHours: 0,
          twinsHours: 24,
          twinsWeekendHours: 8,
          baseRate: 28,
          grossPay: 2688,
          deductions: 155,
          netPay: 2533,
          insurancePaid: true,
          backgroundCheckPaid: true
        },
        {
          id: '2',
          name: 'Sophia Rodriguez',
          picture: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=300',
          region: 'Northeast Florida',
          totalHours: 72,
          regularHours: 56,
          weekendHours: 16,
          holidayHours: 0,
          twinsHours: 16,
          twinsWeekendHours: 0,
          baseRate: 26,
          grossPay: 2208,
          deductions: 0,
          netPay: 2208,
          insurancePaid: false,
          backgroundCheckPaid: true
        }
      ]
    },
    {
      id: 'tampa',
      name: 'Tampa Bay',
      expanded: false,
      nurses: [
        {
          id: '3',
          name: 'Michael Chen',
          picture: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300',
          region: 'Tampa Bay',
          totalHours: 80,
          regularHours: 64,
          weekendHours: 16,
          holidayHours: 0,
          twinsHours: 32,
          twinsWeekendHours: 8,
          baseRate: 30,
          grossPay: 2880,
          deductions: 155,
          netPay: 2725,
          insurancePaid: true,
          backgroundCheckPaid: true
        },
        {
          id: '4',
          name: 'Jessica Martinez',
          picture: 'https://images.pexels.com/photos/6749773/pexels-photo-6749773.jpeg?auto=compress&cs=tinysrgb&w=300',
          region: 'Tampa Bay',
          totalHours: 68,
          regularHours: 52,
          weekendHours: 16,
          holidayHours: 0,
          twinsHours: 20,
          twinsWeekendHours: 4,
          baseRate: 27,
          grossPay: 2244,
          deductions: 30,
          netPay: 2214,
          insurancePaid: true,
          backgroundCheckPaid: false
        }
      ]
    },
    {
      id: 'orlando',
      name: 'Orlando',
      expanded: false,
      nurses: [
        {
          id: '5',
          name: 'David Thompson',
          picture: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=300',
          region: 'Orlando',
          totalHours: 76,
          regularHours: 60,
          weekendHours: 16,
          holidayHours: 0,
          twinsHours: 28,
          twinsWeekendHours: 12,
          baseRate: 29,
          grossPay: 2668,
          deductions: 155,
          netPay: 2513,
          insurancePaid: true,
          backgroundCheckPaid: true
        }
      ]
    }
  ]);

  // Calculate totals for current pay period
  const allNurses = regions.flatMap(region => region.nurses);
  const totalGrossPay = allNurses.reduce((sum, nurse) => sum + nurse.grossPay, 0);
  const totalDeductions = allNurses.reduce((sum, nurse) => sum + nurse.deductions, 0);
  const totalNetPay = allNurses.reduce((sum, nurse) => sum + nurse.netPay, 0);
  const totalHours = allNurses.reduce((sum, nurse) => sum + nurse.totalHours, 0);

  // Get top earners for carousel
  const topEarners = [...allNurses]
    .sort((a, b) => b.grossPay - a.grossPay)
    .slice(0, 3);

  const toggleRegion = (regionId: string) => {
    setRegions(prev => prev.map(region => 
      region.id === regionId 
        ? { ...region, expanded: !region.expanded }
        : region
    ));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handlePayPeriodSettings = () => {
    router.push('/admin/payroll/pay-period');
  };

  const handleAddRegion = () => {
    Alert.alert(
      'Add New Region',
      'Enter the name of the new region:',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Add',
          onPress: (regionName) => {
            if (regionName && regionName.trim()) {
              const newRegion: Region = {
                id: `region-${Date.now()}`,
                name: regionName.trim(),
                expanded: true,
                nurses: []
              };
              setRegions([...regions, newRegion]);
            } else {
              Alert.alert('Error', 'Please enter a valid region name');
            }
          }
        }
      ],
      {
        cancelable: true,
        prompt: true,
        defaultValue: ''
      }
    );
  };

  const handleToggleInsurance = (nurseId: string) => {
    setRegions(prev => 
      prev.map(region => ({
        ...region,
        nurses: region.nurses.map(nurse => 
          nurse.id === nurseId 
            ? { 
                ...nurse, 
                insurancePaid: !nurse.insurancePaid,
                deductions: !nurse.insurancePaid 
                  ? nurse.deductions + 125 
                  : nurse.deductions - 125,
                netPay: !nurse.insurancePaid 
                  ? nurse.netPay - 125 
                  : nurse.netPay + 125
              }
            : nurse
        )
      }))
    );
  };

  const handleToggleBackgroundCheck = (nurseId: string) => {
    setRegions(prev => 
      prev.map(region => ({
        ...region,
        nurses: region.nurses.map(nurse => 
          nurse.id === nurseId 
            ? { 
                ...nurse, 
                backgroundCheckPaid: !nurse.backgroundCheckPaid,
                deductions: !nurse.backgroundCheckPaid 
                  ? nurse.deductions + 30 
                  : nurse.deductions - 30,
                netPay: !nurse.backgroundCheckPaid 
                  ? nurse.netPay - 30 
                  : nurse.netPay + 30
              }
            : nurse
        )
      }))
    );
  };

  const handleNurseClick = (nurseId: string) => {
    router.push(`/admin/payroll/nurse/${nurseId}`);
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
        <Text style={styles.headerTitle}>Manage Payroll</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={handlePayPeriodSettings}
        >
          <Settings size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Current Pay Period */}
        <View style={styles.payPeriodCard}>
          <View style={styles.payPeriodHeader}>
            <Calendar size={20} color={COLORS.primary} />
            <Text style={styles.payPeriodTitle}>Current Pay Period</Text>
          </View>
          <Text style={styles.payPeriodDates}>
            {formatDate(currentPayPeriod.startDate)} - {formatDate(currentPayPeriod.endDate)}
          </Text>
          <View style={styles.payPeriodStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatCurrency(totalGrossPay)}</Text>
              <Text style={styles.statLabel}>Gross Pay</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalHours}</Text>
              <Text style={styles.statLabel}>Total Hours</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatCurrency(totalNetPay)}</Text>
              <Text style={styles.statLabel}>Net Pay</Text>
            </View>
          </View>
        </View>

        {/* Top Earners Carousel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earners this period</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
          >
            {topEarners.map((nurse, index) => (
              <TouchableOpacity
                key={nurse.id}
                style={styles.earnerCard}
                onPress={() => handleNurseClick(nurse.id)}
              >
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>#{index + 1}</Text>
                </View>
                <Image 
                  source={{ uri: nurse.picture }}
                  style={styles.earnerImage}
                />
                <Text style={styles.earnerName}>{nurse.name}</Text>
                <Text style={styles.earnerRegion}>{nurse.region}</Text>
                <View style={styles.earnerStats}>
                  <Text style={styles.earnerHours}>{nurse.totalHours}h</Text>
                  <Text style={styles.earnerPay}>{formatCurrency(nurse.grossPay)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Nurses by Region */}
        <View style={styles.section}>
          <View style={styles.regionHeaderContainer}>
            <Text style={styles.sectionTitle}>Nurses by Region</Text>
            <TouchableOpacity 
              style={styles.addRegionButton}
              onPress={handleAddRegion}
            >
              <Plus size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          {regions.map((region) => (
            <View key={region.id} style={styles.regionCard}>
              <TouchableOpacity 
                style={styles.regionHeader}
                onPress={() => toggleRegion(region.id)}
              >
                <View style={styles.regionInfo}>
                  <Users size={20} color={COLORS.primary} />
                  <Text style={styles.regionName}>{region.name}</Text>
                  <View style={styles.nurseBadge}>
                    <Text style={styles.nurseBadgeText}>{region.nurses.length} nurses</Text>
                  </View>
                </View>
                {region.expanded ? (
                  <ChevronUp size={20} color={COLORS.textSecondary} />
                ) : (
                  <ChevronDown size={20} color={COLORS.textSecondary} />
                )}
              </TouchableOpacity>

              {region.expanded && (
                <View style={styles.nursesList}>
                  {region.nurses.map((nurse) => (
                    <TouchableOpacity
                      key={nurse.id}
                      style={styles.nurseCard}
                      onPress={() => handleNurseClick(nurse.id)}
                    >
                      <Image 
                        source={{ uri: nurse.picture }}
                        style={styles.nurseImage}
                      />
                      <View style={styles.nurseInfo}>
                        <Text style={styles.nurseName}>{nurse.name}</Text>
                        <View style={styles.nurseMetrics}>
                          <View style={styles.metric}>
                            <Clock size={14} color={COLORS.primary} />
                            <Text style={styles.metricText}>{nurse.totalHours}h</Text>
                          </View>
                          <View style={styles.metric}>
                            <DollarSign size={14} color={COLORS.primary} />
                            <Text style={styles.metricText}>{formatCurrency(nurse.grossPay)}</Text>
                          </View>
                        </View>
                        <View style={styles.statusIndicators}>
                          <TouchableOpacity 
                            style={[
                              styles.statusDot,
                              { backgroundColor: nurse.insurancePaid ? COLORS.success : COLORS.error }
                            ]}
                            onPress={() => handleToggleInsurance(nurse.id)}
                          >
                            <Text style={styles.statusLabel}>Insurance</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={[
                              styles.statusDot,
                              { backgroundColor: nurse.backgroundCheckPaid ? COLORS.success : COLORS.error }
                            ]}
                            onPress={() => handleToggleBackgroundCheck(nurse.id)}
                          >
                            <Text style={styles.statusLabel}>Background</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <ChevronRight size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
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
    padding: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  payPeriodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  payPeriodTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  payPeriodDates: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  payPeriodStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
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
  regionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addRegionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContent: {
    paddingRight: 16,
  },
  earnerCard: {
    width: 160,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    position: 'relative',
  },
  rankBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rankText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  earnerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
  },
  earnerName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  earnerRegion: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  earnerStats: {
    alignItems: 'center',
  },
  earnerHours: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  earnerPay: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  regionCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  regionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  regionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  regionName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 12,
    marginRight: 12,
  },
  nurseBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  nurseBadgeText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  nursesList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  nurseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  nurseImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  nurseInfo: {
    flex: 1,
  },
  nurseName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  nurseMetrics: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 4,
  },
  statusIndicators: {
    flexDirection: 'row',
    gap: 8,
  },
  statusDot: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusLabel: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '600',
  },
});