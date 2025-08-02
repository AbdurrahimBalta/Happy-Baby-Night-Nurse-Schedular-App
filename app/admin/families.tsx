import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, ChevronRight, Baby } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';

export default function FamiliesScreen() {
  // Mock families data
  const families = [
    {
      id: '1',
      name: 'Smith Family',
      children: ['Emma (6m)', 'Liam (6m)'],
      activeShifts: 3,
      nextShift: 'Tonight at 8:00 PM',
      picture: 'https://images.pexels.com/photos/3995919/pexels-photo-3995919.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '2',
      name: 'Johnson Family',
      children: ['Oliver (3m)'],
      activeShifts: 2,
      nextShift: 'Tomorrow at 9:00 PM',
      picture: 'https://images.pexels.com/photos/3995902/pexels-photo-3995902.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '3',
      name: 'Williams Family',
      children: ['Sophia (4m)', 'Lucas (4m)'],
      activeShifts: 4,
      nextShift: 'Tonight at 7:30 PM',
      picture: 'https://images.pexels.com/photos/3995911/pexels-photo-3995911.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

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