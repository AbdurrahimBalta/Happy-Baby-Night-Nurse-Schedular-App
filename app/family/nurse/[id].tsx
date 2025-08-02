import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Star, Send, Clock, Award, MessageSquare } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';

export default function NurseProfileScreen() {
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState('');

  // Mock nurse data - in a real app, this would come from an API
  const nurse = {
    id,
    name: 'Angela Davis',
    picture: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300',
    rating: 4.9,
    experience: '10+ years',
    bio: 'Experienced night nurse specializing in newborn care and sleep training. Certified in infant CPR and sleep consulting.',
    certifications: ['RN', 'CPR Certified', 'Sleep Training Specialist', 'Newborn Care Specialist'],
    specialties: ['Sleep Training', 'Twins Care', 'Premature Babies', 'Breastfeeding Support'],
    onShiftToday: true, // This would be determined by checking current date against scheduled shifts
    nextShift: 'Tonight at 8:00 PM',
    messages: [
      {
        id: 1,
        sender: 'nurse',
        text: "I've reviewed Emma and Liam's sleep schedule for tonight.",
        time: '7:55 PM'
      },
      {
        id: 2,
        sender: 'family',
        text: "Great! Emma might need an extra feeding around 2 AM.",
        time: '7:56 PM'
      }
    ]
  };

  const handleSend = () => {
    if (message.trim()) {
      // Add message handling logic here
      setMessage('');
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
        <Text style={styles.headerTitle}>Nurse Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: nurse.picture }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.nurseName}>{nurse.name}</Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color={COLORS.warning} fill={COLORS.warning} />
              <Text style={styles.ratingText}>{nurse.rating}</Text>
            </View>
            <View style={styles.experienceContainer}>
              <Clock size={16} color={COLORS.primary} />
              <Text style={styles.experienceText}>{nurse.experience}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{nurse.bio}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          <View style={styles.tagsContainer}>
            {nurse.certifications.map((cert, index) => (
              <View key={index} style={styles.tag}>
                <Award size={16} color={COLORS.primary} />
                <Text style={styles.tagText}>{cert}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialties</Text>
          <View style={styles.tagsContainer}>
            {nurse.specialties.map((specialty, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>

        {nurse.onShiftToday && (
          <View style={styles.section}>
            <View style={styles.messageHeader}>
              <Text style={styles.sectionTitle}>Messages</Text>
              <View style={styles.activeIndicator}>
                <Text style={styles.activeText}>On Shift</Text>
              </View>
            </View>
            
            <View style={styles.messagesContainer}>
              {nurse.messages.map((msg) => (
                <View 
                  key={msg.id}
                  style={[
                    styles.messageItem,
                    msg.sender === 'nurse' ? styles.nurseMessage : styles.familyMessage
                  ]}
                >
                  <Text style={[
                    styles.messageText,
                    msg.sender === 'nurse' ? styles.nurseMessageText : styles.familyMessageText
                  ]}>{msg.text}</Text>
                  <Text style={[
                    styles.messageTime,
                    msg.sender === 'nurse' ? styles.nurseMessageTime : styles.familyMessageTime
                  ]}>{msg.time}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {nurse.onShiftToday && (
        <View style={styles.messageInputContainer}>
          <TextInput
            style={styles.messageInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            multiline
          />
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={handleSend}
          >
            <Send size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      )}

      {!nurse.onShiftToday && (
        <View style={styles.nextShiftContainer}>
          <MessageSquare size={20} color={COLORS.textSecondary} />
          <Text style={styles.nextShiftText}>
            Messaging available during active shifts • Next shift: {nurse.nextShift}
          </Text>
        </View>
      )}
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
  profileHeader: {
    backgroundColor: COLORS.white,
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
  },
  nurseName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  experienceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  experienceText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  section: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  bioText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  activeIndicator: {
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.success,
  },
  messagesContainer: {
    gap: 12,
  },
  messageItem: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  nurseMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.backgroundSecondary,
  },
  familyMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
  },
  messageText: {
    fontSize: 14,
    marginBottom: 4,
  },
  nurseMessageText: {
    color: COLORS.text,
  },
  familyMessageText: {
    color: COLORS.white,
  },
  messageTime: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  nurseMessageTime: {
    color: COLORS.textSecondary,
  },
  familyMessageTime: {
    color: COLORS.white + '80',
  },
  messageInputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  messageInput: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextShiftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.backgroundSecondary,
    gap: 12,
  },
  nextShiftText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});