import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Upload, Play, CircleCheck as CheckCircle } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';

export default function TrainingsScreen() {
  interface Training {
    id: string;
    title: string;
    duration: string;
    completed: boolean;
    thumbnail: string;
    description: string;
  }

  const [trainings] = useState<Training[]>([]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trainings</Text>
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={() => {}}
        >
          <Upload size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Your Progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '50%' }]} />
          </View>
          <Text style={styles.progressText}>{trainings.filter(t => t.completed).length} of {trainings.length} trainings completed</Text>
        </View>

        <View style={styles.trainingsContainer}>
          {trainings.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No trainings available</Text>
              <Text style={styles.emptyStateSubtext}>Training materials will appear here when available</Text>
            </View>
          ) : (
            trainings.map((training) => (
              <TouchableOpacity 
                key={training.id}
                style={styles.trainingCard}
                onPress={() => {}}
              >
                <Image 
                  source={{ uri: training.thumbnail }}
                  style={styles.thumbnail}
                />
                <View style={styles.trainingInfo}>
                  <View style={styles.trainingHeader}>
                    <Text style={styles.trainingTitle}>{training.title}</Text>
                    {training.completed && (
                      <CheckCircle size={20} color={COLORS.success} />
                    )}
                  </View>
                  <Text style={styles.trainingDescription}>
                    {training.description}
                  </Text>
                  <View style={styles.trainingFooter}>
                    <View style={styles.durationContainer}>
                      <Play size={16} color={COLORS.primary} />
                      <Text style={styles.durationText}>{training.duration}</Text>
                    </View>
                    <TouchableOpacity 
                      style={[
                        styles.startButton,
                        training.completed && styles.completedButton
                      ]}
                    >
                      <Text style={[
                        styles.startButtonText,
                        training.completed && styles.completedButtonText
                      ]}>
                        {training.completed ? 'Review' : 'Start Training'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
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
  uploadButton: {
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
  progressSection: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  trainingsContainer: {
    gap: 16,
  },
  trainingCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  thumbnail: {
    width: '100%',
    height: 200,
  },
  trainingInfo: {
    padding: 16,
  },
  trainingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trainingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  trainingDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  trainingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  completedButton: {
    backgroundColor: COLORS.backgroundSecondary,
  },
  completedButtonText: {
    color: COLORS.primary,
  },
  emptyState: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});