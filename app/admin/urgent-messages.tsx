import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Clock, TriangleAlert as AlertTriangle, MessageSquare, Phone, CheckCheck, X } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';

interface UrgentMessage {
  id: string;
  familyName: string;
  familyImage: string;
  message: string;
  timestamp: Date;
  priority: 'high' | 'urgent' | 'critical';
  status: 'unread' | 'read' | 'responded';
  category: 'shift_change' | 'emergency' | 'complaint' | 'payment' | 'other';
  contactInfo: {
    phone: string;
    email: string;
  };
}

export default function UrgentMessagesScreen() {
  const [messages, setMessages] = useState<UrgentMessage[]>([
    {
      id: '1',
      familyName: 'Smith Family',
      familyImage: 'https://images.pexels.com/photos/3995919/pexels-photo-3995919.jpeg?auto=compress&cs=tinysrgb&w=300',
      message: 'URGENT: Our regular nurse Angela called in sick for tonight\'s shift (8 PM - 6 AM). We desperately need a replacement as we have no backup childcare. Please help!',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      priority: 'critical',
      status: 'unread',
      category: 'shift_change',
      contactInfo: {
        phone: '(904) 555-0123',
        email: 'sarah.smith@email.com'
      }
    },
    {
      id: '2',
      familyName: 'Johnson Family',
      familyImage: 'https://images.pexels.com/photos/3995902/pexels-photo-3995902.jpeg?auto=compress&cs=tinysrgb&w=300',
      message: 'Emergency situation: Baby Oliver has been running a fever and we need our nurse to arrive 2 hours early tonight to help monitor his condition. Can someone please call us ASAP?',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      priority: 'urgent',
      status: 'read',
      category: 'emergency',
      contactInfo: {
        phone: '(904) 555-0456',
        email: 'mike.johnson@email.com'
      }
    },
    {
      id: '3',
      familyName: 'Williams Family',
      familyImage: 'https://images.pexels.com/photos/3995911/pexels-photo-3995911.jpeg?auto=compress&cs=tinysrgb&w=300',
      message: 'We had a concerning experience with last night\'s nurse. She arrived 45 minutes late without notice and seemed unprepared. We need to discuss this situation immediately.',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      priority: 'high',
      status: 'unread',
      category: 'complaint',
      contactInfo: {
        phone: '(904) 555-0789',
        email: 'jennifer.williams@email.com'
      }
    }
  ]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  const getPriorityColor = (priority: UrgentMessage['priority']) => {
    switch (priority) {
      case 'critical':
        return COLORS.error;
      case 'urgent':
        return COLORS.warning;
      case 'high':
        return COLORS.primary;
      default:
        return COLORS.textSecondary;
    }
  };

  const getPriorityIcon = (priority: UrgentMessage['priority']) => {
    switch (priority) {
      case 'critical':
        return <AlertTriangle size={16} color={COLORS.error} />;
      case 'urgent':
        return <AlertTriangle size={16} color={COLORS.warning} />;
      case 'high':
        return <AlertTriangle size={16} color={COLORS.primary} />;
      default:
        return <MessageSquare size={16} color={COLORS.textSecondary} />;
    }
  };

  const getCategoryLabel = (category: UrgentMessage['category']) => {
    switch (category) {
      case 'shift_change':
        return 'Shift Change';
      case 'emergency':
        return 'Emergency';
      case 'complaint':
        return 'Complaint';
      case 'payment':
        return 'Payment Issue';
      case 'other':
        return 'Other';
      default:
        return 'General';
    }
  };

  const handleMarkAsRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: 'read' as const }
          : msg
      )
    );
  };

  const handleMarkAsResponded = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: 'responded' as const }
          : msg
      )
    );
    Alert.alert('Success', 'Message marked as responded');
  };

  const handleCallFamily = (phone: string, familyName: string) => {
    Alert.alert(
      'Call Family',
      `Call ${familyName} at ${phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => {
            // In a real app, this would initiate a phone call
            Alert.alert('Calling...', `Calling ${familyName} at ${phone}`);
          }
        }
      ]
    );
  };

  const handleMessageFamily = (messageId: string, familyName: string) => {
    // Mark as read when opening message
    handleMarkAsRead(messageId);
    
    Alert.alert(
      'Message Family',
      `Send a message to ${familyName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send Message', 
          onPress: () => {
            // In a real app, this would open a messaging interface
            Alert.alert('Message Sent', `Message sent to ${familyName}`);
            handleMarkAsResponded(messageId);
          }
        }
      ]
    );
  };

  const unreadCount = messages.filter(msg => msg.status === 'unread').length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Urgent Messages</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount} unread</Text>
            </View>
          )}
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <MessageSquare size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyStateTitle}>No Urgent Messages</Text>
            <Text style={styles.emptyStateText}>
              All families are happy! Urgent messages will appear here when families need immediate assistance.
            </Text>
          </View>
        ) : (
          messages.map((message) => (
            <TouchableOpacity
              key={message.id}
              style={[
                styles.messageCard,
                message.status === 'unread' && styles.unreadMessageCard
              ]}
              onPress={() => handleMessageFamily(message.id, message.familyName)}
            >
              <View style={styles.messageHeader}>
                <View style={styles.familyInfo}>
                  <Image 
                    source={{ uri: message.familyImage }}
                    style={styles.familyImage}
                  />
                  <View style={styles.familyDetails}>
                    <Text style={styles.familyName}>{message.familyName}</Text>
                    <View style={styles.messageMetadata}>
                      <View style={[
                        styles.priorityBadge,
                        { backgroundColor: getPriorityColor(message.priority) + '20' }
                      ]}>
                        {getPriorityIcon(message.priority)}
                        <Text style={[
                          styles.priorityText,
                          { color: getPriorityColor(message.priority) }
                        ]}>
                          {message.priority.toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>
                          {getCategoryLabel(message.category)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                
                <View style={styles.messageActions}>
                  <View style={styles.timestampContainer}>
                    <Clock size={12} color={COLORS.textSecondary} />
                    <Text style={styles.timestamp}>
                      {formatTimeAgo(message.timestamp)}
                    </Text>
                  </View>
                  
                  {message.status === 'unread' && (
                    <View style={styles.unreadIndicator} />
                  )}
                  
                  {message.status === 'responded' && (
                    <View style={styles.respondedIndicator}>
                      <CheckCheck size={16} color={COLORS.success} />
                    </View>
                  )}
                </View>
              </View>

              <Text style={styles.messageText}>{message.message}</Text>

              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleCallFamily(message.contactInfo.phone, message.familyName)}
                >
                  <Phone size={16} color={COLORS.primary} />
                  <Text style={styles.actionButtonText}>Call</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleMessageFamily(message.id, message.familyName)}
                >
                  <MessageSquare size={16} color={COLORS.primary} />
                  <Text style={styles.actionButtonText}>Message</Text>
                </TouchableOpacity>
                
                {message.status !== 'responded' && (
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.resolveButton]}
                    onPress={() => handleMarkAsResponded(message.id)}
                  >
                    <CheckCheck size={16} color={COLORS.success} />
                    <Text style={[styles.actionButtonText, styles.resolveButtonText]}>
                      Mark Resolved
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: COLORS.error + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unreadBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.error,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 32,
  },
  messageCard: {
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
  unreadMessageCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  messageHeader: {
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
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  familyDetails: {
    flex: 1,
  },
  familyName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  messageMetadata: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  categoryBadge: {
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  messageActions: {
    alignItems: 'flex-end',
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  unreadIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  respondedIndicator: {
    padding: 2,
  },
  messageText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
  },
  resolveButton: {
    backgroundColor: COLORS.success + '20',
  },
  resolveButtonText: {
    color: COLORS.success,
  },
});