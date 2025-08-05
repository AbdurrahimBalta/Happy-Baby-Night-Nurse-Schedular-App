import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Pin, MapPin, Users, Plus } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';

interface Message {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  time: string;
  region: string;
  read: boolean;
}

interface Region {
  id: string;
  name: string;
  shortName: string;
  nurseCount: number;
  color: string;
}

export default function GroupChatScreen() {
  const [message, setMessage] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [showUnread, setShowUnread] = useState(false);

  const regions: Region[] = [
    { id: 'all', name: 'All Regions', shortName: 'All', nurseCount: 0, color: COLORS.primary }
  ];
  // TODO: Fetch regions from Supabase

  const pinnedMessages: Array<{
    id: string;
    sender: string;
    text: string;
    time: string;
    region: string;
  }> = [];
  // TODO: Fetch pinned messages from Supabase

  const messages: Message[] = [];
  // TODO: Fetch group chat messages from Supabase

  const getFilteredMessages = () => {
    let filtered = messages;
    
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(msg => msg.region === selectedRegion);
    }
    
    if (showUnread) {
      filtered = filtered.filter(msg => !msg.read);
    }
    
    return filtered;
  };

  const getRegionColor = (regionId: string) => {
    const region = regions.find(r => r.id === regionId);
    return region?.color || COLORS.textSecondary;
  };

  const getRegionName = (regionId: string) => {
    const region = regions.find(r => r.id === regionId);
    return region?.shortName || regionId;
  };

  const handleSend = () => {
    if (message.trim()) {
      // Add message handling logic here
      setMessage('');
    }
  };

  const handleAddTerritory = () => {
    Alert.alert(
      'Add New Territory',
      'Contact your administrator to add new territories to the nurse chat system. We\'re always expanding to serve more families!',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Contact Admin', 
          onPress: () => {
            // In a real app, this would open a contact form or redirect to admin
            Alert.alert('Success', 'Admin has been notified about your territory expansion request.');
          }
        }
      ]
    );
  };

  const filteredMessages = getFilteredMessages();
  const selectedRegionData = regions.find(r => r.id === selectedRegion);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nurses Group Chat</Text>
        <View style={styles.headerStats}>
          <Users size={16} color={COLORS.primary} />
          <Text style={styles.headerStatsText}>
            {selectedRegionData?.nurseCount} nurses
          </Text>
        </View>
      </View>

      {/* Region Filter */}
      <View style={styles.regionFilter}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.regionScrollContent}
        >
          {regions.map((region) => (
            <TouchableOpacity
              key={region.id}
              style={[
                styles.regionChip,
                selectedRegion === region.id && styles.regionChipActive,
                { borderColor: region.color }
              ]}
              onPress={() => setSelectedRegion(region.id)}
            >
              <View style={[styles.regionDot, { backgroundColor: region.color }]} />
              <Text style={[
                styles.regionChipText,
                selectedRegion === region.id && styles.regionChipTextActive
              ]}>
                {region.shortName}
              </Text>
              <Text style={[
                styles.regionCount,
                selectedRegion === region.id && styles.regionCountActive
              ]}>
                {region.nurseCount}
              </Text>
            </TouchableOpacity>
          ))}
          
          {/* Add Territory Button */}
          <TouchableOpacity
            style={styles.addTerritoryButton}
            onPress={handleAddTerritory}
          >
            <Plus size={16} color={COLORS.primary} />
            <Text style={styles.addTerritoryText}>Add Territory</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Toggle Controls */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[styles.toggleButton, !showUnread && styles.toggleButtonActive]}
          onPress={() => setShowUnread(false)}
        >
          <Text style={[styles.toggleText, !showUnread && styles.toggleTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toggleButton, showUnread && styles.toggleButtonActive]}
          onPress={() => setShowUnread(true)}
        >
          <Text style={[styles.toggleText, showUnread && styles.toggleTextActive]}>Unread</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Pinned Messages */}
        <View style={styles.pinnedContainer}>
          <View style={styles.pinnedHeader}>
            <Pin size={16} color={COLORS.primary} />
            <Text style={styles.pinnedTitle}>Pinned Messages</Text>
          </View>
          {pinnedMessages
            .filter(msg => selectedRegion === 'all' || msg.region === selectedRegion || msg.region === 'all')
            .map((msg) => (
            <View key={msg.id} style={styles.pinnedMessage}>
              <View style={styles.pinnedMessageHeader}>
                <Text style={styles.pinnedSender}>{msg.sender}</Text>
                {msg.region !== 'all' && (
                  <View style={[styles.regionBadge, { backgroundColor: getRegionColor(msg.region) + '20' }]}>
                    <Text style={[styles.regionBadgeText, { color: getRegionColor(msg.region) }]}>
                      {getRegionName(msg.region)}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.pinnedText}>{msg.text}</Text>
              <Text style={styles.pinnedTime}>{msg.time}</Text>
            </View>
          ))}
        </View>

        {/* Messages */}
        <View style={styles.messagesContainer}>
          {filteredMessages.length === 0 ? (
            <View style={styles.emptyState}>
              <MapPin size={48} color={COLORS.textSecondary} />
              <Text style={styles.emptyStateTitle}>No messages in this region</Text>
              <Text style={styles.emptyStateText}>
                {selectedRegion === 'all' 
                  ? 'No unread messages at the moment'
                  : `No ${showUnread ? 'unread ' : ''}messages from ${selectedRegionData?.name}`
                }
              </Text>
            </View>
          ) : (
            filteredMessages.map((msg) => (
              <View key={msg.id} style={styles.messageItem}>
                <Image 
                  source={{ uri: msg.avatar }}
                  style={styles.avatar}
                />
                <View style={styles.messageContent}>
                  <View style={styles.messageHeader}>
                    <View style={styles.messageHeaderLeft}>
                      <Text style={styles.messageSender}>{msg.sender}</Text>
                      <View style={[styles.regionBadge, { backgroundColor: getRegionColor(msg.region) + '20' }]}>
                        <Text style={[styles.regionBadgeText, { color: getRegionColor(msg.region) }]}>
                          {getRegionName(msg.region)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.messageTime}>{msg.time}</Text>
                  </View>
                  <Text style={styles.messageText}>{msg.text}</Text>
                  {!msg.read && <View style={styles.unreadIndicator} />}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder={`Message ${selectedRegionData?.name || 'all nurses'}...`}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  headerStatsText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
    marginLeft: 6,
  },
  regionFilter: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 12,
  },
  regionScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  regionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 6,
  },
  regionChipActive: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  regionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  regionChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  regionChipTextActive: {
    color: COLORS.text,
  },
  regionCount: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    backgroundColor: COLORS.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 20,
    textAlign: 'center',
  },
  regionCountActive: {
    color: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  addTerritoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
    borderStyle: 'dashed',
    gap: 6,
  },
  addTerritoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 20,
    padding: 4,
    margin: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 16,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  toggleTextActive: {
    color: COLORS.primary,
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
  pinnedMessageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  pinnedSender: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
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
    position: 'relative',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  messageSender: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: 8,
  },
  regionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  regionBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  messageTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  messageText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
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