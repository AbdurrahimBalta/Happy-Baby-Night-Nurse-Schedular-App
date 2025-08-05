import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Paperclip, Phone, MoveVertical as MoreVertical, CheckCheck, Clock } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'family' | 'admin';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
}

export default function MessengerScreen() {
  const { user, markFirstLoginComplete } = useAuth();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [adminTyping, setAdminTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Initialize messages with welcome message for first-time users
  const getInitialMessages = (): Message[] => {
    const baseMessages: Message[] = [];
    
    // Add welcome message for first-time family users
    if (user?.isFirstLogin && user?.role === 'family') {
      baseMessages.push({
        id: 'welcome-1',
        text: 'Hello! Welcome to Happy Baby Night Nurses Support, please reach out if you have any additional needs or questions!',
        sender: 'admin',
        timestamp: new Date(Date.now() - 60000), // 1 minute ago
        status: 'read',
        type: 'text'
      });
      
      // Mark first login as complete after showing welcome message
      setTimeout(() => {
        markFirstLoginComplete();
      }, 1000);
    }
    
    return baseMessages;
  };

  const [messages, setMessages] = useState<Message[]>(getInitialMessages());

  // Simulate admin typing
  useEffect(() => {
    const typingTimer = setTimeout(() => {
      setAdminTyping(true);
      setTimeout(() => setAdminTyping(false), 3000);
    }, 5000);

    return () => clearTimeout(typingTimer);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handlePhoneCall = () => {
    const phoneNumber = '9042034430';
    const phoneUrl = `tel:${phoneNumber}`;
    
    Linking.canOpenURL(phoneUrl)
      .then(supported => {
        if (supported) {
          return Linking.openURL(phoneUrl);
        } else {
          console.log('Phone calls not supported on this device');
        }
      })
      .catch(err => console.error('Error making phone call:', err));
  };

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: 'family',
        timestamp: new Date(),
        status: 'sending',
        type: 'text'
      };

      setMessages(prev => [...prev, newMessage]);
      setMessage('');

      // Simulate message status updates
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, status: 'sent' as const }
              : msg
          )
        );
      }, 1000);

      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, status: 'delivered' as const }
              : msg
          )
        );
      }, 2000);

      // TODO: Send message to Supabase and handle real-time responses
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return minutes < 1 ? 'Just now' : `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <Clock size={12} color={COLORS.textSecondary} />;
      case 'sent':
        return <CheckCheck size={12} color={COLORS.textSecondary} />;
      case 'delivered':
        return <CheckCheck size={12} color={COLORS.primary} />;
      case 'read':
        return <CheckCheck size={12} color={COLORS.success} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.adminAvatar}>
            <Text style={styles.adminAvatarText}>HB</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Happy Baby Support</Text>
            <Text style={styles.headerSubtitle}>
              {adminTyping ? 'Admin is typing...' : 'Usually replies within minutes'}
            </Text>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handlePhoneCall}
          >
            <Phone size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <MoreVertical size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.messagesContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, index) => {
            const isFamily = msg.sender === 'family';
            const showTimestamp = index === 0 || 
              (messages[index - 1].timestamp.getTime() - msg.timestamp.getTime()) > 300000; // 5 minutes

            return (
              <View key={msg.id}>
                {showTimestamp && (
                  <View style={styles.timestampContainer}>
                    <Text style={styles.timestampText}>
                      {formatTime(msg.timestamp)}
                    </Text>
                  </View>
                )}
                
                <View style={[
                  styles.messageContainer,
                  isFamily ? styles.familyMessageContainer : styles.adminMessageContainer
                ]}>
                  <View style={[
                    styles.messageBubble,
                    isFamily ? styles.familyMessageBubble : styles.adminMessageBubble
                  ]}>
                    <Text style={[
                      styles.messageText,
                      isFamily ? styles.familyMessageText : styles.adminMessageText
                    ]}>
                      {msg.text}
                    </Text>
                    
                    {isFamily && (
                      <View style={styles.messageStatus}>
                        {getStatusIcon(msg.status)}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })}

          {adminTyping && (
            <View style={styles.typingIndicator}>
              <View style={styles.typingBubble}>
                <View style={styles.typingDots}>
                  <View style={[styles.typingDot, styles.typingDot1]} />
                  <View style={[styles.typingDot, styles.typingDot2]} />
                  <View style={[styles.typingDot, styles.typingDot3]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Paperclip size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.messageInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.textSecondary}
            multiline
            maxLength={1000}
          />
          
          <TouchableOpacity 
            style={[
              styles.sendButton,
              message.trim() ? styles.sendButtonActive : styles.sendButtonInactive
            ]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Send size={20} color={message.trim() ? COLORS.white : COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  adminAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  adminAvatarText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  timestampContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  timestampText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageContainer: {
    marginBottom: 8,
  },
  familyMessageContainer: {
    alignItems: 'flex-end',
  },
  adminMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    position: 'relative',
  },
  familyMessageBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  adminMessageBubble: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  familyMessageText: {
    color: COLORS.white,
  },
  adminMessageText: {
    color: COLORS.text,
  },
  messageStatus: {
    position: 'absolute',
    bottom: 4,
    right: 8,
  },
  typingIndicator: {
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  typingBubble: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.textSecondary,
  },
  typingDot1: {
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.7,
  },
  typingDot3: {
    opacity: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  messageInput: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
    color: COLORS.text,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: COLORS.primary,
  },
  sendButtonInactive: {
    backgroundColor: COLORS.backgroundSecondary,
  },
});