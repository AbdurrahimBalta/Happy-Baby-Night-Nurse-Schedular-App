import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Send, Pin } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';

export default function GroupChatScreen() {
  const [message, setMessage] = useState('');

  const pinnedMessages = [
    {
      id: 'p1',
      sender: 'Admin',
      text: '🎉 Welcome to our newest nurse, Michael Chen! He\'ll be starting next week.',
      time: '2 days ago'
    },
    {
      id: 'p2',
      sender: 'Admin',
      text: '📢 Remember to submit your timesheets by Sunday evening.',
      time: '1 day ago'
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'Angela Davis',
      avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300',
      text: 'Good evening everyone! Just wanted to share that I had a great experience with the Johnson twins tonight.',
      time: '8:30 PM'
    },
    {
      id: 2,
      sender: 'Sophia Rodriguez',
      avatar: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=300',
      text: "That's wonderful! They're such sweet babies.",
      time: '8:32 PM'
    },
    {
      id: 3,
      sender: 'Michael Chen',
      avatar: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300',
      text: 'Looking forward to meeting everyone next week!',
      time: '8:35 PM'
    }
  ];

  const handleSend = () => {
    if (message.trim()) {
      // Add message handling logic
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
        <Text style={styles.headerTitle}>Nurses Group Chat</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.pinnedContainer}>
          <View style={styles.pinnedHeader}>
            <Pin size={16} color={COLORS.primary} />
            <Text style={styles.pinnedTitle}>Pinned Messages</Text>
          </View>
          {pinnedMessages.map((msg) => (
            <View key={msg.id} style={styles.pinnedMessage}>
              <Text style={styles.pinnedSender}>{msg.sender}</Text>
              <Text style={styles.pinnedText}>{msg.text}</Text>
              <Text style={styles.pinnedTime}>{msg.time}</Text>
            </View>
          ))}
        </View>

        <View style={styles.messagesContainer}>
          {messages.map((msg) => (
            <View key={msg.id} style={styles.messageItem}>
              <Image 
                source={{ uri: msg.avatar }}
                style={styles.avatar}
              />
              <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                  <Text style={styles.messageSender}>{msg.sender}</Text>
                  <Text style={styles.messageTime}>{msg.time}</Text>
                </View>
                <Text style={styles.messageText}>{msg.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
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
  pinnedContainer: {
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  pinnedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pinnedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 8,
  },
  pinnedMessage: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  pinnedSender: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  pinnedText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
  },
  pinnedTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  messagesContainer: {
    padding: 16,
  },
  messageItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  messageSender: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  messageTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  messageText: {
    fontSize: 14,
    color: COLORS.text,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  input: {
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