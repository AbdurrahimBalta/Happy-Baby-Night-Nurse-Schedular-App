import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Calendar, Clock, CreditCard } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';

// TODO: Fetch nurse data from Supabase when needed

interface ShiftSummaryProps {
  date: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  recurringDays: string[];
  recurringWeeks: number;
  hourlyRate: number;
  hours: number;
  subtotal: number;
  serviceFee: number;
  total: number;
  selectedNurseId: string | null;
}

const ShiftSummary: React.FC<ShiftSummaryProps> = ({
  date,
  startTime,
  endTime,
  isRecurring,
  recurringDays,
  recurringWeeks,
  hourlyRate,
  hours,
  subtotal,
  serviceFee,
  total,
  selectedNurseId
}) => {
  // TODO: Fetch selected nurse data from Supabase based on selectedNurseId
  const selectedNurse = null;
  
  const totalSessions = isRecurring ? recurringDays.length * recurringWeeks : 1;
  const totalCost = total * totalSessions;
  
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Date & Time</Text>
        <View style={styles.infoRow}>
          <Calendar size={16} color={COLORS.primary} />
          <Text style={styles.infoText}>{date}</Text>
        </View>
        <View style={styles.infoRow}>
          <Clock size={16} color={COLORS.primary} />
          <Text style={styles.infoText}>{startTime} - {endTime}</Text>
        </View>
        
        {isRecurring && (
          <View style={styles.recurringInfo}>
            <Text style={styles.recurringTitle}>Recurring Shift</Text>
            <Text style={styles.recurringText}>
              Every {recurringDays.join(', ')} for {recurringWeeks} weeks
            </Text>
            <Text style={styles.totalSessionsText}>
              Total sessions: {totalSessions}
            </Text>
          </View>
        )}
      </View>
      
      {selectedNurse && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected Nurse</Text>
          <View style={styles.nurseInfo}>
            <Image 
              source={{ uri: selectedNurse.picture }} 
              style={styles.nurseImage} 
            />
            <Text style={styles.nurseName}>{selectedNurse.name}</Text>
          </View>
        </View>
      )}
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Summary</Text>
        
        <View style={styles.costRow}>
          <Text style={styles.costLabel}>Rate</Text>
          <Text style={styles.costValue}>${hourlyRate}/hour</Text>
        </View>
        
        <View style={styles.costRow}>
          <Text style={styles.costLabel}>Duration</Text>
          <Text style={styles.costValue}>{hours} hours</Text>
        </View>
        
        <View style={styles.costRow}>
          <Text style={styles.costLabel}>Subtotal (per session)</Text>
          <Text style={styles.costValue}>${subtotal.toFixed(2)}</Text>
        </View>
        
        <View style={styles.costRow}>
          <Text style={styles.costLabel}>Service Fee</Text>
          <Text style={styles.costValue}>${serviceFee.toFixed(2)}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.costRow}>
          <Text style={styles.totalLabel}>Total per session</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
        
        {isRecurring && (
          <View style={[styles.costRow, styles.grandTotal]}>
            <Text style={styles.grandTotalLabel}>Total for all sessions</Text>
            <Text style={styles.grandTotalValue}>${totalCost.toFixed(2)}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentMethod}>
          <CreditCard size={20} color={COLORS.primary} />
          <Text style={styles.paymentText}>Credit Card ending in 4242</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.text,
  },
  recurringInfo: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  recurringTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  recurringText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  totalSessionsText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
  },
  nurseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nurseImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  nurseName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  costLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  costValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  grandTotal: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    padding: 12,
    borderRadius: 8,
  },
  paymentText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text,
  },
});

export default ShiftSummary;