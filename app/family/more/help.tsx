import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Heart, Moon, Baby, Bell, Clock } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';

export default function HelpScreen() {
  const tips = [
    {
      icon: <Moon size={24} color={COLORS.primary} />,
      title: "Sleep Schedule",
      content: "Maintain a consistent bedtime routine. Dim lights and reduce noise 30 minutes before bedtime. Use white noise machines to create a soothing environment."
    },
    {
      icon: <Baby size={24} color={COLORS.primary} />,
      title: "Feeding Tips",
      content: "Feed your baby every 2-3 hours during the night. Keep a feeding log to track patterns. Ensure proper burping after each feeding to prevent discomfort."
    },
    {
      icon: <Bell size={24} color={COLORS.primary} />,
      title: "Soothing Techniques",
      content: "Try the 5 S's: Swaddle, Side/Stomach position, Shush, Swing, and Suck. Each baby responds differently, so observe what works best for yours."
    },
    {
      icon: <Clock size={24} color={COLORS.primary} />,
      title: "Night Routine",
      content: "Create a calming bedtime routine with activities like warm baths, gentle massage, and soft lullabies. Consistency is key for developing good sleep habits."
    },
    {
      icon: <Heart size={24} color={COLORS.primary} />,
      title: "Self-Care",
      content: "Take care of yourself too! Sleep when the baby sleeps. Accept help from family and friends. Remember that it's okay to ask for support when needed."
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
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Newborn Care Tips</Text>
          {tips.map((tip, index) => (
            <View key={index} style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <View style={styles.iconContainer}>
                  {tip.icon}
                </View>
                <Text style={styles.tipTitle}>{tip.title}</Text>
              </View>
              <Text style={styles.tipContent}>{tip.content}</Text>
            </View>
          ))}
        </View>

        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>Need More Help?</Text>
          <TouchableOpacity 
            style={styles.supportButton}
            onPress={() => Linking.openURL('tel:+1234567890')}
          >
            <Text style={styles.supportButtonText}>Call Support (24/7)</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.supportButton, styles.supportButtonOutline]}
            onPress={() => router.push('/family/messages')}
          >
            <Text style={styles.supportButtonTextOutline}>Message Us</Text>
          </TouchableOpacity>
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
  scrollContent: {
    padding: 16,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  tipCard: {
    marginBottom: 20,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  tipContent: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  supportSection: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  supportButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    marginBottom: 12,
    alignItems: 'center',
  },
  supportButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  supportButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  supportButtonTextOutline: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});