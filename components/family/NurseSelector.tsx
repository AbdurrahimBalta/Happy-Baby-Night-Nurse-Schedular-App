import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { Star, Clock } from 'lucide-react-native';

// Mock data for demonstration
const MOCK_NURSES = [
  {
    id: '1',
    name: 'Angela Davis',
    picture: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'Experienced nurse with 10 years in neonatal care',
    certifications: ['RN', 'CPR', 'Newborn Care Specialist'],
    rating: 4.9,
    availability: 'Available tonight'
  },
  {
    id: '2',
    name: 'Michael Chen',
    picture: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'Pediatric nurse with special focus on infant care',
    certifications: ['RN', 'CPR', 'Lactation Consultant'],
    rating: 4.7,
    availability: 'Available tomorrow'
  },
  {
    id: '3',
    name: 'Sophia Rodriguez',
    picture: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'Specialized in twins and multiples care',
    certifications: ['RN', 'Newborn Care Specialist'],
    rating: 4.8,
    availability: 'Available tonight'
  },
  {
    id: '4',
    name: 'James Wilson',
    picture: 'https://images.pexels.com/photos/6749773/pexels-photo-6749773.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'Night nurse with sleep training expertise',
    certifications: ['RN', 'Sleep Consultant'],
    rating: 4.6,
    availability: 'Available in 2 days'
  }
];

interface NurseSelectorProps {
  selectedNurseId: string | null;
  onSelectNurse: (id: string) => void;
}

const NurseSelector: React.FC<NurseSelectorProps> = ({ selectedNurseId, onSelectNurse }) => {
  const [nurses, setNurses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNurses(MOCK_NURSES);
      setLoading(false);
    }, 1000);
  }, []);

  const renderNurseCard = ({ item }: { item: any }) => {
    const isSelected = selectedNurseId === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.nurseCard,
          isSelected ? styles.selectedNurseCard : {}
        ]}
        onPress={() => onSelectNurse(item.id)}
      >
        <View style={styles.nurseHeader}>
          <Image 
            source={{ uri: item.picture }} 
            style={styles.nurseImage} 
          />
          <View style={styles.nurseInfo}>
            <Text style={styles.nurseName}>{item.name}</Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color={COLORS.warning} fill={COLORS.warning} />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.nurseBio}>{item.bio}</Text>
        
        <View style={styles.certificationsContainer}>
          {item.certifications.map((cert: string, index: number) => (
            <View key={index} style={styles.certBadge}>
              <Text style={styles.certText}>{cert}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.availabilityContainer}>
          <Clock size={16} color={COLORS.success} />
          <Text style={styles.availabilityText}>{item.availability}</Text>
        </View>
        
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Text style={styles.selectedText}>Selected</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading available nurses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        Select a nurse for your shift. Each nurse is certified and background-checked.
      </Text>
      
      <FlatList
        data={nurses}
        renderItem={renderNurseCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.nurseList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  nurseList: {
    paddingBottom: 16,
  },
  nurseCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedNurseCard: {
    borderColor: COLORS.primary,
  },
  nurseHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  nurseImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  nurseInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nurseName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  nurseBio: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  certificationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  certBadge: {
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  certText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.success,
    fontWeight: '500',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default NurseSelector;