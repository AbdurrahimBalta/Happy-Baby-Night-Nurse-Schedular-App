import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Star, TrendingUp, TrendingDown, Calendar, User } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';

interface SatisfactionData {
  id: string;
  familyName: string;
  familyImage: string;
  nurseName: string;
  nurseImage: string;
  rating: number;
  date: string;
  feedback: string;
  category: 'excellent' | 'good' | 'average' | 'poor';
}

export default function SatisfactionScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  const satisfactionData: SatisfactionData[] = [
    {
      id: '1',
      familyName: 'Smith Family',
      familyImage: 'https://images.pexels.com/photos/3995919/pexels-photo-3995919.jpeg?auto=compress&cs=tinysrgb&w=300',
      nurseName: 'Angela Davis',
      nurseImage: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 5,
      date: '2024-03-14',
      feedback: 'Angela was absolutely wonderful! She was punctual, professional, and the babies slept through the night. Highly recommend!',
      category: 'excellent'
    },
    {
      id: '2',
      familyName: 'Johnson Family',
      familyImage: 'https://images.pexels.com/photos/3995902/pexels-photo-3995902.jpeg?auto=compress&cs=tinysrgb&w=300',
      nurseName: 'Michael Chen',
      nurseImage: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 5,
      date: '2024-03-13',
      feedback: 'Michael is fantastic with Oliver. Very knowledgeable about infant care and always follows our routine perfectly.',
      category: 'excellent'
    },
    {
      id: '3',
      familyName: 'Williams Family',
      familyImage: 'https://images.pexels.com/photos/3995911/pexels-photo-3995911.jpeg?auto=compress&cs=tinysrgb&w=300',
      nurseName: 'Sophia Rodriguez',
      nurseImage: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4,
      date: '2024-03-12',
      feedback: 'Sophia did a great job with the twins. Very caring and attentive. Would book again!',
      category: 'good'
    }
  ];

  const overallStats = {
    averageRating: 4.8,
    totalReviews: 156,
    excellentPercentage: 78,
    goodPercentage: 18,
    averagePercentage: 3,
    poorPercentage: 1,
    trend: 'up' as const
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        color={index < rating ? COLORS.warning : COLORS.border}
        fill={index < rating ? COLORS.warning : 'transparent'}
      />
    ));
  };

  const getCategoryColor = (category: SatisfactionData['category']) => {
    switch (category) {
      case 'excellent':
        return COLORS.success;
      case 'good':
        return COLORS.primary;
      case 'average':
        return COLORS.warning;
      case 'poor':
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
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
        <Text style={styles.headerTitle}>Satisfaction Reports</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {['7', '30', '90'].map((period) => (
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
                {period} days
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Overall Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.mainStatCard}>
            <View style={styles.mainStatHeader}>
              <Text style={styles.mainStatValue}>{overallStats.averageRating}</Text>
              <View style={styles.trendIndicator}>
                {overallStats.trend === 'up' ? (
                  <TrendingUp size={20} color={COLORS.success} />
                ) : (
                  <TrendingDown size={20} color={COLORS.error} />
                )}
              </View>
            </View>
            <Text style={styles.mainStatLabel}>Average Rating</Text>
            <Text style={styles.mainStatSubtext}>
              Based on {overallStats.totalReviews} reviews
            </Text>
          </View>

          <View style={styles.distributionCard}>
            <Text style={styles.distributionTitle}>Rating Distribution</Text>
            <View style={styles.distributionItem}>
              <Text style={styles.distributionLabel}>Excellent (5★)</Text>
              <View style={styles.distributionBar}>
                <View style={[
                  styles.distributionFill,
                  { width: `${overallStats.excellentPercentage}%`, backgroundColor: COLORS.success }
                ]} />
              </View>
              <Text style={styles.distributionPercent}>{overallStats.excellentPercentage}%</Text>
            </View>
            <View style={styles.distributionItem}>
              <Text style={styles.distributionLabel}>Good (4★)</Text>
              <View style={styles.distributionBar}>
                <View style={[
                  styles.distributionFill,
                  { width: `${overallStats.goodPercentage}%`, backgroundColor: COLORS.primary }
                ]} />
              </View>
              <Text style={styles.distributionPercent}>{overallStats.goodPercentage}%</Text>
            </View>
            <View style={styles.distributionItem}>
              <Text style={styles.distributionLabel}>Average (3★)</Text>
              <View style={styles.distributionBar}>
                <View style={[
                  styles.distributionFill,
                  { width: `${overallStats.averagePercentage}%`, backgroundColor: COLORS.warning }
                ]} />
              </View>
              <Text style={styles.distributionPercent}>{overallStats.averagePercentage}%</Text>
            </View>
            <View style={styles.distributionItem}>
              <Text style={styles.distributionLabel}>Poor (1-2★)</Text>
              <View style={styles.distributionBar}>
                <View style={[
                  styles.distributionFill,
                  { width: `${overallStats.poorPercentage}%`, backgroundColor: COLORS.error }
                ]} />
              </View>
              <Text style={styles.distributionPercent}>{overallStats.poorPercentage}%</Text>
            </View>
          </View>
        </View>

        {/* Recent Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Reviews</Text>
          {satisfactionData.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.familyInfo}>
                  <Image 
                    source={{ uri: review.familyImage }}
                    style={styles.familyImage}
                  />
                  <View style={styles.familyDetails}>
                    <Text style={styles.familyName}>{review.familyName}</Text>
                    <View style={styles.reviewDate}>
                      <Calendar size={12} color={COLORS.textSecondary} />
                      <Text style={styles.dateText}>{formatDate(review.date)}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.ratingContainer}>
                  <View style={styles.starsContainer}>
                    {renderStars(review.rating)}
                  </View>
                  <Text style={styles.ratingText}>{review.rating}.0</Text>
                </View>
              </View>

              <View style={styles.nurseInfo}>
                <Image 
                  source={{ uri: review.nurseImage }}
                  style={styles.nurseImage}
                />
                <View style={styles.nurseDetails}>
                  <Text style={styles.nurseLabel}>Nurse:</Text>
                  <Text style={styles.nurseName}>{review.nurseName}</Text>
                </View>
              </View>

              <Text style={styles.feedbackText}>{review.feedback}</Text>

              <View style={[
                styles.categoryBadge,
                { backgroundColor: getCategoryColor(review.category) + '20' }
              ]}>
                <Text style={[
                  styles.categoryText,
                  { color: getCategoryColor(review.category) }
                ]}>
                  {review.category.charAt(0).toUpperCase() + review.category.slice(1)}
                </Text>
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
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  mainStatCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  mainStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mainStatValue: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.primary,
    marginRight: 8,
  },
  trendIndicator: {
    padding: 4,
  },
  mainStatLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  mainStatSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  distributionCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  distributionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  distributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  distributionLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    width: 80,
  },
  distributionBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  distributionFill: {
    height: '100%',
    borderRadius: 4,
  },
  distributionPercent: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    width: 30,
    textAlign: 'right',
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
  reviewCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  familyInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  familyImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  familyDetails: {
    flex: 1,
  },
  familyName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  reviewDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  nurseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  nurseImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  nurseDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nurseLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  nurseName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  feedbackText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
});