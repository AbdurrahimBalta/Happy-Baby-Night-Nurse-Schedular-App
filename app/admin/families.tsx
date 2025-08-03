import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, ChevronRight, Baby } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';

export default function FamiliesScreen() {
  // TODO: Fetch families data from Supabase
  const families: any[] = [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Active Families</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {families.map((family) => (
          <TouchableOpacity
            key={family.id}
            style={styles.familyCard}
            onPress={() => router.push(`/admin/families/${family.id}`)}
          >
            <Image 
              source={{ uri: family.picture }}
              style={styles.familyImage}
            />
            
            <View style={styles.familyInfo}>
              <View style={styles.familyHeader}>
                <Text style={styles.familyName}>{family.name}</Text>
                <ChevronRight size={20} color={COLORS.textSecondary} />
              </View>
              
              <View style={styles.childrenContainer}>
                <Baby size={16} color={COLORS.primary} />
                <Text style={styles.childrenText}>
                  {family.children.join(', ')}
                </Text>
              </View>
              
              <View style={styles.shiftsInfo}>
                <View style={styles.shiftBadge}>
                  <Text style={styles.shiftBadgeText}>
                    {family.activeShifts} Active Shifts
                  </Text>
                </View>
                <Text style={styles.nextShiftText}>
                  Next: {family.nextShift}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
    padding: 16,
  },
  familyCard: {
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
  familyImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  familyInfo: {
    flex: 1,
  },
  familyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  familyName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  childrenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  childrenText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text,
  },
  shiftsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shiftBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  shiftBadgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  nextShiftText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});