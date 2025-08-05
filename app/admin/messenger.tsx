import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Send, Pin, MapPin, Users, Plus, Paperclip, CheckCheck, Clock, Megaphone, Search, X, UserPlus, Check } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';

interface Message {
  id: string;
  sender: string;
  avatar?: string;
  text: string;
  time: string;
  region: string;
  read: boolean;
  isAdmin: boolean;
  isPinned?: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

interface Region {
  id: string;
  name: string;
  shortName: string;
  nurseCount: number;
  color: string;
}

interface GroupChat {
  id: string;
  name: string;
  members: {
    id: string;
    name: string;
    avatar: string;
  }[];
  lastMessage: {
    text: string;
    time: string;
    sender: string;
  };
  unreadCount: number;
}

interface Nurse {
  id: string;
  name: string;
  avatar: string;
  region: string;
  isSelected?: boolean;
}

export default function AdminMessengerScreen() {
  const [message, setMessage] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [showUnread, setShowUnread] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastRegion, setBroadcastRegion] = useState<string>('all');
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedNurses, setSelectedNurses] = useState<Nurse[]>([]);
  const [searchNurseQuery, setSearchNurseQuery] = useState('');
  const [activeView, setActiveView] = useState<'messages' | 'groups'>('messages');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // TODO: Fetch regions from Supabase
  const regions: Region[] = [];

  // TODO: Fetch pinned messages from Supabase
  const [pinnedMessages, setPinnedMessages] = useState<Array<{id: string; sender: string; text: string; time: string; region: string; isPinned: boolean}>>([]);

  // TODO: Fetch messages from Supabase
  const [messages, setMessages] = useState<Message[]>([]);

  // TODO: Fetch group chats from Supabase
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);

  // TODO: Fetch group chat messages from Supabase
  const [groupMessages, setGroupMessages] = useState<Record<string, Message[]>>({});

  // TODO: Fetch all nurses from Supabase
  const [allNurses, setAllNurses] = useState<Nurse[]>([]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, selectedGroupId, groupMessages]);

  const getFilteredMessages = () => {
    let filtered = messages;
    
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(msg => msg.region === selectedRegion);
    }
    
    if (showUnread) {
      filtered = filtered.filter(msg => !msg.read);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(msg => 
        msg.sender.toLowerCase().includes(query) ||
        msg.text.toLowerCase().includes(query)
      );
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
    if (!message.trim()) return;
    
    if (selectedGroupId) {
      // Send message to group chat
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'Admin (Katelynn)',
        text: message.trim(),
        time: new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        region: 'all',
        read: true,
        isAdmin: true,
        status: 'sending'
      };

      setGroupMessages(prev => ({
        ...prev,
        [selectedGroupId]: [...(prev[selectedGroupId] || []), newMessage]
      }));

      // Update last message in group chat list
      setGroupChats(prev => 
        prev.map(group => 
          group.id === selectedGroupId 
            ? {
                ...group,
                lastMessage: {
                  text: message.trim(),
                  time: new Date().toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  }),
                  sender: 'Admin (Katelynn)'
                }
              }
            : group
        )
      );
    } else {
      // Send message to general chat
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'Admin (Katelynn)',
        text: message.trim(),
        time: new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        region: selectedRegion,
        read: true,
        isAdmin: true,
        status: 'sending'
      };

      setMessages(prev => [...prev, newMessage]);
    }
    
    setMessage('');

    // Simulate message status updates
    setTimeout(() => {
      if (selectedGroupId) {
        setGroupMessages(prev => {
          const groupMsgs = [...(prev[selectedGroupId] || [])];
          const lastIndex = groupMsgs.length - 1;
          if (lastIndex >= 0) {
            groupMsgs[lastIndex] = { ...groupMsgs[lastIndex], status: 'sent' as const };
          }
          return { ...prev, [selectedGroupId]: groupMsgs };
        });
      } else {
        setMessages(prev => 
          prev.map((msg, idx) => 
            idx === prev.length - 1 
              ? { ...msg, status: 'sent' as const }
              : msg
          )
        );
      }
    }, 1000);

    setTimeout(() => {
      if (selectedGroupId) {
        setGroupMessages(prev => {
          const groupMsgs = [...(prev[selectedGroupId] || [])];
          const lastIndex = groupMsgs.length - 1;
          if (lastIndex >= 0) {
            groupMsgs[lastIndex] = { ...groupMsgs[lastIndex], status: 'delivered' as const };
          }
          return { ...prev, [selectedGroupId]: groupMsgs };
        });
      } else {
        setMessages(prev => 
          prev.map((msg, idx) => 
            idx === prev.length - 1 
              ? { ...msg, status: 'delivered' as const }
              : msg
          )
        );
      }
    }, 2000);
  };

  const handleBroadcast = () => {
    setShowBroadcastModal(true);
  };

  const handleSendBroadcast = async () => {
    if (!broadcastMessage.trim()) {
      Alert.alert('Error', 'Please enter a broadcast message');
      return;
    }

    setIsSendingBroadcast(true);

    try {
      // Simulate sending broadcast
      await new Promise(resolve => setTimeout(resolve, 2000));

      const broadcastMsg: Message = {
        id: Date.now().toString(),
        sender: 'Admin (Katelynn)',
        text: `📢 BROADCAST: ${broadcastMessage.trim()}`,
        time: new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        region: broadcastRegion,
        read: true,
        isAdmin: true,
        status: 'delivered'
      };

      setMessages(prev => [...prev, broadcastMsg]);
      
      // Add to pinned messages if it's a broadcast
      const pinnedBroadcast = {
        id: `p${Date.now()}`,
        sender: 'Admin (Katelynn)',
        text: `📢 BROADCAST: ${broadcastMessage.trim()}`,
        time: 'Just now',
        region: broadcastRegion,
        isPinned: true
      };
      
      setPinnedMessages(prev => [pinnedBroadcast, ...prev]);

      setShowBroadcastModal(false);
      setBroadcastMessage('');
      setBroadcastRegion('all');

      const targetRegion = regions.find(r => r.id === broadcastRegion);
      Alert.alert(
        'Broadcast Sent!', 
        `Your message has been sent to ${targetRegion?.name || 'all regions'} (${targetRegion?.nurseCount || 45} nurses).`
      );

    } catch (error) {
      Alert.alert('Error', 'Failed to send broadcast message. Please try again.');
    } finally {
      setIsSendingBroadcast(false);
    }
  };

  const handleAddTerritory = () => {
    Alert.alert(
      'Add New Territory',
      'Enter the details for the new territory you\'d like to add to the nurse communication system.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add Territory', 
          onPress: () => {
            Alert.alert('Success', 'New territory has been added to the system. Nurses in this area can now join the group chat.');
          }
        }
      ]
    );
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const getStatusIcon = (status?: Message['status']) => {
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

  const handleCreateGroup = () => {
    setShowCreateGroupModal(true);
    setGroupName('');
    setSelectedNurses([]);
    setSearchNurseQuery('');
  };

  const toggleNurseSelection = (nurse: Nurse) => {
    if (selectedNurses.some(n => n.id === nurse.id)) {
      setSelectedNurses(selectedNurses.filter(n => n.id !== nurse.id));
    } else {
      setSelectedNurses([...selectedNurses, nurse]);
    }
  };

  const getFilteredNurses = () => {
    if (!searchNurseQuery.trim()) {
      return allNurses;
    }
    
    const query = searchNurseQuery.toLowerCase();
    return allNurses.filter(nurse => 
      nurse.name.toLowerCase().includes(query) ||
      regions.find(r => r.id === nurse.region)?.name.toLowerCase().includes(query)
    );
  };

  const handleSaveGroup = () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    if (selectedNurses.length === 0) {
      Alert.alert('Error', 'Please select at least one nurse');
      return;
    }

    const newGroupId = `group${Date.now()}`;
    
    // Create new group
    const newGroup: GroupChat = {
      id: newGroupId,
      name: groupName.trim(),
      members: selectedNurses.map(nurse => ({
        id: nurse.id,
        name: nurse.name,
        avatar: nurse.avatar
      })),
      lastMessage: {
        text: 'Group created',
        time: new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        sender: 'Admin (Katelynn)'
      },
      unreadCount: 0
    };

    // Add initial message to group
    const initialMessage: Message = {
      id: `${newGroupId}-initial`,
      sender: 'Admin (Katelynn)',
      text: `I've created this group to coordinate care for ${groupName.trim()}. Please use this chat for all communications related to this family.`,
      time: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      region: 'all',
      read: true,
      isAdmin: true,
      status: 'delivered'
    };

    setGroupChats([newGroup, ...groupChats]);
    setGroupMessages(prev => ({
      ...prev,
      [newGroupId]: [initialMessage]
    }));

    setShowCreateGroupModal(false);
    setSelectedGroupId(newGroupId);
    setActiveView('groups');
    
    Alert.alert('Success', `"${groupName.trim()}" group has been created successfully.`);
  };

  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
    
    // Mark messages as read
    setGroupChats(prev => 
      prev.map(group => 
        group.id === groupId 
          ? { ...group, unreadCount: 0 }
          : group
      )
    );
  };

  const handleBackToGroups = () => {
    setSelectedGroupId(null);
  };

  const filteredMessages = getFilteredMessages();
  const selectedRegionData = regions.find(r => r.id === selectedRegion);
  const filteredNurses = getFilteredNurses();
  const selectedGroup = groupChats.find(g => g.id === selectedGroupId);
  const currentGroupMessages = selectedGroupId ? groupMessages[selectedGroupId] || [] : [];
  
  // Calculate total unread group messages
  const totalUnreadGroupMessages = groupChats.reduce((sum, group) => sum + group.unreadCount, 0);

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
          <Text style={styles.headerTitle}>Nurse Messenger</Text>
          <View style={styles.headerStats}>
            <Users size={16} color={COLORS.primary} />
            <Text style={styles.headerStatsText}>
              {selectedRegionData?.nurseCount} nurses
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleCreateGroup}
          >
            <UserPlus size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleBroadcast}
          >
            <Megaphone size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* View Selector */}
      <View style={styles.viewSelector}>
        <TouchableOpacity 
          style={[
            styles.viewTab,
            activeView === 'messages' && styles.activeViewTab
          ]}
          onPress={() => {
            setActiveView('messages');
            setSelectedGroupId(null);
          }}
        >
          <Text style={[
            styles.viewTabText,
            activeView === 'messages' && styles.activeViewTabText
          ]}>
            General Chat
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.viewTab,
            activeView === 'groups' && styles.activeViewTab
          ]}
          onPress={() => setActiveView('groups')}
        >
          <Text style={[
            styles.viewTabText,
            activeView === 'groups' && styles.activeViewTabText
          ]}>
            Group Chats
          </Text>
          {totalUnreadGroupMessages > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{totalUnreadGroupMessages}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      {!selectedGroupId && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={COLORS.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder={activeView === 'messages' ? "Search nurses or messages..." : "Search group chats..."}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={COLORS.textSecondary}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <X size={16} color={COLORS.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Region Filter - Only show in messages view */}
      {activeView === 'messages' && !selectedGroupId && (
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
      )}

      {/* Group Chat Header - Only show when a group is selected */}
      {selectedGroupId && (
        <View style={styles.groupHeader}>
          <TouchableOpacity 
            style={styles.groupBackButton}
            onPress={handleBackToGroups}
          >
            <ChevronLeft size={20} color={COLORS.primary} />
            <Text style={styles.groupBackText}>Groups</Text>
          </TouchableOpacity>
          
          <Text style={styles.groupTitle}>{selectedGroup?.name}</Text>
          
          <TouchableOpacity style={styles.groupInfoButton}>
            <Users size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Toggle Controls - Only show in messages view */}
      {activeView === 'messages' && !selectedGroupId && (
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
      )}

      <KeyboardAvoidingView 
        style={styles.messagesContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {activeView === 'messages' && !selectedGroupId ? (
          <ScrollView 
            ref={scrollViewRef}
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
          >
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
            <View style={styles.messagesListContainer}>
              {filteredMessages.length === 0 ? (
                <View style={styles.emptyState}>
                  {searchQuery ? (
                    <>
                      <Search size={48} color={COLORS.textSecondary} />
                      <Text style={styles.emptyStateTitle}>No messages found</Text>
                      <Text style={styles.emptyStateText}>
                        No messages match your search for "{searchQuery}"
                      </Text>
                    </>
                  ) : (
                    <>
                      <MapPin size={48} color={COLORS.textSecondary} />
                      <Text style={styles.emptyStateTitle}>No messages in this region</Text>
                      <Text style={styles.emptyStateText}>
                        {selectedRegion === 'all' 
                          ? 'No unread messages at the moment'
                          : `No ${showUnread ? 'unread ' : ''}messages from ${selectedRegionData?.name}`
                        }
                      </Text>
                    </>
                  )}
                </View>
              ) : (
                filteredMessages.map((msg) => (
                  <View key={msg.id} style={styles.messageItem}>
                    {!msg.isAdmin && (
                      <Image 
                        source={{ uri: msg.avatar }}
                        style={styles.avatar}
                      />
                    )}
                    <View style={[
                      styles.messageContent,
                      msg.isAdmin && styles.adminMessageContent
                    ]}>
                      <View style={styles.messageHeader}>
                        <View style={styles.messageHeaderLeft}>
                          <Text style={[
                            styles.messageSender,
                            msg.isAdmin && styles.adminMessageSender
                          ]}>
                            {msg.sender}
                          </Text>
                          <View style={[styles.regionBadge, { backgroundColor: getRegionColor(msg.region) + '20' }]}>
                            <Text style={[styles.regionBadgeText, { color: getRegionColor(msg.region) }]}>
                              {getRegionName(msg.region)}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.messageTimeContainer}>
                          <Text style={styles.messageTime}>{msg.time}</Text>
                          {msg.isAdmin && msg.status && (
                            <View style={styles.messageStatus}>
                              {getStatusIcon(msg.status)}
                            </View>
                          )}
                        </View>
                      </View>
                      <Text style={[
                        styles.messageText,
                        msg.isAdmin && styles.adminMessageText
                      ]}>
                        {msg.text}
                      </Text>
                      {!msg.read && !msg.isAdmin && <View style={styles.unreadIndicator} />}
                    </View>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        ) : activeView === 'groups' && !selectedGroupId ? (
          // Group Chats List
          <ScrollView style={styles.content}>
            <View style={styles.groupsHeader}>
              <Text style={styles.groupsTitle}>Family Care Groups</Text>
              <TouchableOpacity 
                style={styles.createGroupButton}
                onPress={handleCreateGroup}
              >
                <UserPlus size={16} color={COLORS.primary} />
                <Text style={styles.createGroupText}>New Group</Text>
              </TouchableOpacity>
            </View>
            
            {groupChats
              .filter(group => 
                !searchQuery.trim() || 
                group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                group.members.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
              )
              .map((group) => (
                <TouchableOpacity
                  key={group.id}
                  style={styles.groupCard}
                  onPress={() => handleSelectGroup(group.id)}
                >
                  <View style={styles.groupAvatars}>
                    {group.members.slice(0, 3).map((member, index) => (
                      <Image 
                        key={member.id}
                        source={{ uri: member.avatar }}
                        style={[
                          styles.groupAvatar,
                          { left: index * 15, zIndex: 3 - index }
                        ]}
                      />
                    ))}
                    {group.members.length > 3 && (
                      <View style={[styles.groupAvatar, styles.groupAvatarMore, { left: 3 * 15 }]}>
                        <Text style={styles.groupAvatarMoreText}>+{group.members.length - 3}</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.groupInfo}>
                    <Text style={styles.groupName}>{group.name}</Text>
                    <Text style={styles.groupLastMessage}>
                      <Text style={styles.groupLastMessageSender}>{group.lastMessage.sender}: </Text>
                      {group.lastMessage.text}
                    </Text>
                  </View>
                  
                  <View style={styles.groupMeta}>
                    <Text style={styles.groupTime}>{group.lastMessage.time}</Text>
                    {group.unreadCount > 0 && (
                      <View style={styles.groupUnreadBadge}>
                        <Text style={styles.groupUnreadText}>{group.unreadCount}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            }
            
            {groupChats.length === 0 || (searchQuery.trim() && groupChats.filter(group => 
              group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              group.members.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
            ).length === 0) ? (
              <View style={styles.emptyGroups}>
                <Users size={48} color={COLORS.textSecondary} />
                <Text style={styles.emptyGroupsTitle}>
                  {searchQuery.trim() ? 'No groups found' : 'No groups created yet'}
                </Text>
                <Text style={styles.emptyGroupsText}>
                  {searchQuery.trim() 
                    ? `No groups match your search for "${searchQuery}"`
                    : 'Create a group to coordinate care for a specific family'
                  }
                </Text>
                <TouchableOpacity 
                  style={styles.createFirstGroupButton}
                  onPress={handleCreateGroup}
                >
                  <UserPlus size={20} color={COLORS.white} />
                  <Text style={styles.createFirstGroupText}>Create New Group</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </ScrollView>
        ) : (
          // Selected Group Chat Messages
          <ScrollView 
            ref={scrollViewRef}
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.groupMembersContainer}>
              <Text style={styles.groupMembersTitle}>Group Members:</Text>
              <View style={styles.groupMembersList}>
                {selectedGroup?.members.map((member) => (
                  <View key={member.id} style={styles.groupMember}>
                    <Image 
                      source={{ uri: member.avatar }}
                      style={styles.groupMemberAvatar}
                    />
                    <Text style={styles.groupMemberName}>{member.name}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            {currentGroupMessages.map((msg) => (
              <View key={msg.id} style={styles.messageItem}>
                {!msg.isAdmin && msg.avatar && (
                  <Image 
                    source={{ uri: msg.avatar }}
                    style={styles.avatar}
                  />
                )}
                <View style={[
                  styles.messageContent,
                  msg.isAdmin && styles.adminMessageContent
                ]}>
                  <View style={styles.messageHeader}>
                    <View style={styles.messageHeaderLeft}>
                      <Text style={[
                        styles.messageSender,
                        msg.isAdmin && styles.adminMessageSender
                      ]}>
                        {msg.sender}
                      </Text>
                    </View>
                    <View style={styles.messageTimeContainer}>
                      <Text style={styles.messageTime}>{msg.time}</Text>
                      {msg.isAdmin && msg.status && (
                        <View style={styles.messageStatus}>
                          {getStatusIcon(msg.status)}
                        </View>
                      )}
                    </View>
                  </View>
                  <Text style={[
                    styles.messageText,
                    msg.isAdmin && styles.adminMessageText
                  ]}>
                    {msg.text}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Paperclip size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.messageInput}
            value={message}
            onChangeText={setMessage}
            placeholder={selectedGroupId 
              ? `Message ${selectedGroup?.name}...` 
              : `Message ${selectedRegionData?.name || 'all nurses'}...`
            }
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

      {/* Broadcast Modal */}
      <Modal
        visible={showBroadcastModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBroadcastModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Megaphone size={24} color={COLORS.primary} />
                <Text style={styles.modalTitle}>Broadcast Message</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setShowBroadcastModal(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Send an important announcement to all nurses in the selected region
            </Text>

            {/* Region Selection for Broadcast */}
            <View style={styles.broadcastRegionContainer}>
              <Text style={styles.broadcastRegionLabel}>Send to:</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.broadcastRegionScroll}
              >
                {regions.map((region) => (
                  <TouchableOpacity
                    key={region.id}
                    style={[
                      styles.broadcastRegionChip,
                      broadcastRegion === region.id && styles.broadcastRegionChipActive,
                      { borderColor: region.color }
                    ]}
                    onPress={() => setBroadcastRegion(region.id)}
                  >
                    <View style={[styles.regionDot, { backgroundColor: region.color }]} />
                    <Text style={[
                      styles.broadcastRegionText,
                      broadcastRegion === region.id && styles.broadcastRegionTextActive
                    ]}>
                      {region.shortName}
                    </Text>
                    <Text style={[
                      styles.broadcastRegionCount,
                      broadcastRegion === region.id && styles.broadcastRegionCountActive
                    ]}>
                      {region.nurseCount}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <TextInput
              style={styles.broadcastInput}
              value={broadcastMessage}
              onChangeText={setBroadcastMessage}
              placeholder="Enter your broadcast message..."
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={4}
              maxLength={500}
            />

            <Text style={styles.characterCount}>
              {broadcastMessage.length}/500 characters
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowBroadcastModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.modalSendButton,
                  (!broadcastMessage.trim() || isSendingBroadcast) && styles.modalSendButtonDisabled
                ]}
                onPress={handleSendBroadcast}
                disabled={!broadcastMessage.trim() || isSendingBroadcast}
              >
                {isSendingBroadcast ? (
                  <Text style={styles.modalSendText}>Sending...</Text>
                ) : (
                  <>
                    <Megaphone size={16} color={COLORS.white} />
                    <Text style={styles.modalSendText}>Send Broadcast</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Group Modal */}
      <Modal
        visible={showCreateGroupModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateGroupModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <UserPlus size={24} color={COLORS.primary} />
                <Text style={styles.modalTitle}>Create Group Chat</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setShowCreateGroupModal(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Create a group chat for nurses to coordinate care for a specific family
            </Text>

            <TextInput
              style={styles.groupNameInput}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="Group name (e.g., Smith Family Care Team)"
              placeholderTextColor={COLORS.textSecondary}
            />

            <Text style={styles.selectNursesTitle}>Select Nurses:</Text>
            
            <View style={styles.searchNurseContainer}>
              <Search size={20} color={COLORS.textSecondary} />
              <TextInput
                style={styles.searchNurseInput}
                value={searchNurseQuery}
                onChangeText={setSearchNurseQuery}
                placeholder="Search nurses by name or region..."
                placeholderTextColor={COLORS.textSecondary}
              />
              {searchNurseQuery.length > 0 && (
                <TouchableOpacity 
                  onPress={() => setSearchNurseQuery('')}
                  style={styles.clearNurseSearch}
                >
                  <X size={16} color={COLORS.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.selectedNursesContainer}>
              {selectedNurses.length > 0 ? (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.selectedNursesScroll}
                >
                  {selectedNurses.map((nurse) => (
                    <View key={nurse.id} style={styles.selectedNurseChip}>
                      <Image 
                        source={{ uri: nurse.avatar }}
                        style={styles.selectedNurseAvatar}
                      />
                      <Text style={styles.selectedNurseName}>{nurse.name}</Text>
                      <TouchableOpacity 
                        style={styles.removeNurseButton}
                        onPress={() => toggleNurseSelection(nurse)}
                      >
                        <X size={14} color={COLORS.white} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <Text style={styles.noNursesSelectedText}>No nurses selected</Text>
              )}
            </View>

            <ScrollView style={styles.nursesList}>
              {filteredNurses.map((nurse) => (
                <TouchableOpacity
                  key={nurse.id}
                  style={[
                    styles.nurseItem,
                    selectedNurses.some(n => n.id === nurse.id) && styles.selectedNurseItem
                  ]}
                  onPress={() => toggleNurseSelection(nurse)}
                >
                  <Image 
                    source={{ uri: nurse.avatar }}
                    style={styles.nurseAvatar}
                  />
                  <View style={styles.nurseInfo}>
                    <Text style={styles.nurseName}>{nurse.name}</Text>
                    <View style={[
                      styles.nurseRegionBadge, 
                      { backgroundColor: getRegionColor(nurse.region) + '20' }
                    ]}>
                      <Text style={[
                        styles.nurseRegionText,
                        { color: getRegionColor(nurse.region) }
                      ]}>
                        {regions.find(r => r.id === nurse.region)?.name}
                      </Text>
                    </View>
                  </View>
                  <View style={[
                    styles.nurseCheckbox,
                    selectedNurses.some(n => n.id === nurse.id) && styles.nurseCheckboxSelected
                  ]}>
                    {selectedNurses.some(n => n.id === nurse.id) && (
                      <Check size={16} color={COLORS.white} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowCreateGroupModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.modalSendButton,
                  (!groupName.trim() || selectedNurses.length === 0) && styles.modalSendButtonDisabled
                ]}
                onPress={handleSaveGroup}
                disabled={!groupName.trim() || selectedNurses.length === 0}
              >
                <UserPlus size={16} color={COLORS.white} />
                <Text style={styles.modalSendText}>Create Group</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  headerStatsText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.primary,
    marginLeft: 6,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  viewTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  activeViewTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  viewTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeViewTabText: {
    color: COLORS.primary,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
    paddingHorizontal: 4,
  },
  unreadBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
  },
  searchContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  clearButton: {
    padding: 4,
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
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  groupBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  groupBackText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  groupInfoButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
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
  messagesContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  pinnedContainer: {
    backgroundColor: COLORS.white,
    margin: 16,
    marginBottom: 0,
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
  messagesListContainer: {
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
  adminMessageContent: {
    backgroundColor: COLORS.primary + '10',
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
    marginLeft: 52, // Align with other messages
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
  adminMessageSender: {
    color: COLORS.primary,
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
  messageTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  messageTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  messageStatus: {
    marginLeft: 4,
  },
  messageText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  adminMessageText: {
    color: COLORS.primary,
    fontWeight: '500',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 12,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  broadcastRegionContainer: {
    marginBottom: 20,
  },
  broadcastRegionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 12,
  },
  broadcastRegionScroll: {
    maxHeight: 50,
  },
  broadcastRegionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 6,
    marginRight: 8,
  },
  broadcastRegionChipActive: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  broadcastRegionText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  broadcastRegionTextActive: {
    color: COLORS.text,
  },
  broadcastRegionCount: {
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
  broadcastRegionCountActive: {
    color: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  broadcastInput: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    textAlignVertical: 'top',
    minHeight: 120,
    marginBottom: 8,
  },
  characterCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  modalSendButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  modalSendButtonDisabled: {
    backgroundColor: COLORS.disabledButton,
  },
  modalSendText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  groupsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  groupsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  createGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  createGroupText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
  },
  groupCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  groupAvatars: {
    width: 80,
    height: 40,
    position: 'relative',
    marginRight: 12,
  },
  groupAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  groupAvatarMore: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupAvatarMoreText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  groupInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  groupLastMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  groupLastMessageSender: {
    fontWeight: '500',
    color: COLORS.text,
  },
  groupMeta: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  groupTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  groupUnreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  groupUnreadText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
  },
  emptyGroups: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 32,
  },
  emptyGroupsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyGroupsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  createFirstGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  createFirstGroupText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  groupNameInput: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 16,
  },
  selectNursesTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 12,
  },
  searchNurseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchNurseInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text,
  },
  clearNurseSearch: {
    padding: 4,
  },
  selectedNursesContainer: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    minHeight: 50,
    justifyContent: 'center',
  },
  selectedNursesScroll: {
    gap: 8,
  },
  selectedNurseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  selectedNurseAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
  },
  selectedNurseName: {
    fontSize: 12,
    color: COLORS.text,
    marginRight: 6,
  },
  removeNurseButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noNursesSelectedText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  nursesList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  nurseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  selectedNurseItem: {
    backgroundColor: COLORS.primary + '10',
  },
  nurseAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  nurseInfo: {
    flex: 1,
  },
  nurseName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  nurseRegionBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  nurseRegionText: {
    fontSize: 10,
    fontWeight: '500',
  },
  nurseCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nurseCheckboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  groupMembersContainer: {
    backgroundColor: COLORS.white,
    margin: 16,
    marginBottom: 0,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  groupMembersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  groupMembersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  groupMember: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  groupMemberAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
  },
  groupMemberName: {
    fontSize: 12,
    color: COLORS.text,
  },
});