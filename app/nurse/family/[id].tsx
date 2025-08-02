import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Send, MapPin, Clock } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';

export default function FamilyDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState('');

  // Mock family data
  const family = {
    name: 'Smith Family',
    address: '456 Oak Avenue, San Francisco, CA 94110',
    babies: [
      {
        name: 'Oliver',
        age: '3 months',
        schedule: '7:30 PM - Bath time\n8:00 PM - Last feeding\n8:30 PM - Bedtime',
        notes: 'Currently sleep training, may need extra soothing'
      }
    ],
    checkInSteps: [
      'Park in visitor spot #12',
      'Enter through main lobby',
      'Take elevator to 3rd floor',
      'Unit 304 on the right',
      'Remove shoes at entrance'
    ]
  };

  const messages = [
    {
      id: 1,
      sender: 'nurse',
      text: "I've arrived and am following the check-in steps.",
      time: '7:55 PM'
    },
    {
      id: 2,
      sender: 'family',
      text: "Perfect! We'll be ready in a moment.",
      time: '7:56 PM'
    }
  ];

  const handleSend = () => {
    if (message.trim()) {
      // Add message handling logic here
      setMessage('');
    }
  };

  const openMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    let url;
    
    if (Platform.OS === 'ios') {
      url = `maps://0,0?q=${encodedAddress}`;
    } else {
      url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    }

    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          // Fallback to Google Maps web URL
          return Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`);
        }
      })
      .catch(err => console.error('An error occurred', err));
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
        <Text style={styles.headerTitle}>{family.name}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <TouchableOpacity 
            style={styles.addressContainer}
            onPress={() => openMaps(family.address)}
          >
            <MapPin size={20} color={COLORS.primary} />
            <Text style={styles.addressText}>{family.address}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Check-in Steps</Text>
          {family.checkInSteps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {family.babies.map((baby, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{baby.name}'s Information</Text>
            <Text style={styles.babyAge}>Age: {baby.age}</Text>
            
            <Text style={styles.subsectionTitle}>Schedule</Text>
            <View style={styles.scheduleContainer}>
              <Clock size={20} color={COLORS.primary} />
              <Text style={styles.scheduleText}>{baby.schedule}</Text>
            </View>
            
            <Text style={styles.subsectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{baby.notes}</Text>
          </View>
        ))}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Messages</Text>
          <View style={styles.messagesContainer}>
            {messages.map((msg) => (
              <View 
                key={msg.id}
                style={[
                  styles.messageItem,
                  msg.sender === 'nurse' ? styles.sentMessage : styles.receivedMessage
                ]}
              >
                <Text style={[
                  styles.messageText,
                  msg.sender === 'nurse' ? styles.sentMessageText : styles.receivedMessageText
                ]}>{msg.text}</Text>
                <Text style={[
                  styles.messageTime,
                  msg.sender === 'nurse' ? styles.sentMessageTime : styles.receivedMessageTime
                ]}>{msg.time}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

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
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginBottom: 0,
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
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    padding: 12,
    borderRadius: 8,
  },
  addressText: {
    marginLeft: 12,
    fontSize: 14,
    color: COLORS.primary,
    textDecorationLine: 'underline',
    flex: 1,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 24,
  },
  babyAge: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  scheduleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.backgroundSecondary,
    padding: 12,
    borderRadius: 8,
  },
  scheduleText: {
    marginLeft: 12,
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
    lineHeight: 24,
  },
  notesText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 24,
  },
  messagesContainer: {
    gap: 12,
  },
  messageItem: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.backgroundSecondary,
  },
  messageText: {
    fontSize: 14,
    marginBottom: 4,
  },
  sentMessageText: {
    color: COLORS.white,
  },
  receivedMessageText: {
    color: COLORS.text,
  },
  messageTime: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  sentMessageTime: {
    color: COLORS.white + '80',
  },
  receivedMessageTime: {
    color: COLORS.textSecondary,
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
});