import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, MessageSquare, Clock, MapPin, Baby, Check, X, Upload, FileText, Download, Eye, Trash2 } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import * as DocumentPicker from 'expo-document-picker';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  uploadedBy: string;
  uri?: string;
}

interface Baby {
  name: string;
  age: string;
  sleepSchedule: string;
  allergies: string;
}

interface Shift {
  id: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'declined';
  recurring: boolean;
  frequency?: string;
}

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  time: string;
  isAdmin: boolean;
  sender: string;
}

interface FamilyPreferences {
  preferredNurses: string[];
  sleepTrainingMethod: string;
  feedingSchedule: string;
  specialInstructions: string;
}

interface Family {
  name: string;
  address: string;
  preferences: FamilyPreferences;
  babies: Baby[];
  requestedShifts: Shift[];
  messages: Message[];
}

export default function FamilyDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  // TODO: Replace with real uploaded files from Supabase
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // TODO: Fetch family data from Supabase
  const family: Family = {
    name: 'Johnson Family',
    address: '123 Main Street, Anytown, USA',
    preferences: {
      preferredNurses: ['Sarah Wilson', 'Emily Davis'],
      sleepTrainingMethod: 'Gentle sleep training',
      feedingSchedule: 'Every 3 hours',
      specialInstructions: 'Baby prefers white noise for sleeping'
    },
    babies: [
      {
        name: 'Emma',
        age: '6 months',
        sleepSchedule: '7 PM - 7 AM',
        allergies: 'None known'
      }
    ],
    requestedShifts: [
      {
        id: '1',
        date: 'March 15, 2024',
        time: '10:00 PM - 6:00 AM',
        status: 'pending',
        recurring: true,
        frequency: 'Weekly on Fridays'
      }
    ],
    messages: [
       {
         id: '1',
         text: 'Hello, we need a nurse for tonight. Emma has been fussy lately.',
         timestamp: new Date(),
         time: '2:30 PM',
         isAdmin: false,
         sender: 'Mrs. Johnson'
       }
     ]
  };

  const handleApproveShift = (shiftId: string) => {
    // Add shift approval logic
  };

  const handleDeclineShift = (shiftId: string) => {
    // Add shift decline logic
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add message sending logic
      setMessage('');
    }
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        
        // Create new file object
        const newFile: UploadedFile = {
          id: Date.now().toString(),
          name: file.name,
          type: file.mimeType || 'application/octet-stream',
          size: file.size || 0,
          uploadDate: new Date(),
          uploadedBy: 'Admin (Katelynn)',
          uri: file.uri
        };

        setUploadedFiles(prev => [newFile, ...prev]);
        
        Alert.alert(
          'File Uploaded Successfully',
          `${file.name} has been uploaded and is now available to nurses assigned to this family.`
        );
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      Alert.alert('Upload Error', 'Failed to upload file. Please try again.');
    }
  };

  const handleFileAction = (file: UploadedFile, action: 'view' | 'download' | 'delete') => {
    switch (action) {
      case 'view':
        Alert.alert('View File', `Opening ${file.name}...`);
        // In a real app, this would open the file viewer
        break;
      case 'download':
        Alert.alert('Download File', `Downloading ${file.name}...`);
        // In a real app, this would trigger file download
        break;
      case 'delete':
        Alert.alert(
          'Delete File',
          `Are you sure you want to delete ${file.name}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Delete', 
              style: 'destructive',
              onPress: () => {
                setUploadedFiles(prev => prev.filter(f => f.id !== file.id));
                Alert.alert('Success', 'File deleted successfully.');
              }
            }
          ]
        );
        break;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) {
      return <FileText size={20} color="#FF6B6B" />;
    } else if (mimeType.includes('word') || mimeType.includes('document')) {
      return <FileText size={20} color="#4285F4" />;
    } else if (mimeType.includes('image')) {
      return <FileText size={20} color="#34A853" />;
    } else {
      return <FileText size={20} color={COLORS.textSecondary} />;
    }
  };

  const formatUploadDate = (date: Date): string => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
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
        <Text style={styles.headerTitle}>{family.name}</Text>
        <TouchableOpacity 
          style={styles.messageButton}
          onPress={() => router.push('/admin/messenger')}
        >
          <MessageSquare size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Family Information</Text>
          <View style={styles.infoRow}>
            <MapPin size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>{family.address}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Children</Text>
          {family.babies.map((baby, index) => (
            <View key={index} style={styles.babyCard}>
              <View style={styles.babyHeader}>
                <Baby size={20} color={COLORS.primary} />
                <Text style={styles.babyName}>{baby.name}</Text>
                <Text style={styles.babyAge}>({baby.age})</Text>
              </View>
              <View style={styles.babyDetails}>
                <Text style={styles.detailLabel}>Sleep Schedule:</Text>
                <Text style={styles.detailText}>{baby.sleepSchedule}</Text>
                <Text style={styles.detailLabel}>Allergies:</Text>
                <Text style={styles.detailText}>{baby.allergies}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.preferenceCard}>
            <Text style={styles.preferenceLabel}>Preferred Nurses:</Text>
            <Text style={styles.preferenceText}>
              {family.preferences.preferredNurses.join(', ')}
            </Text>
            <Text style={styles.preferenceLabel}>Sleep Training Method:</Text>
            <Text style={styles.preferenceText}>
              {family.preferences.sleepTrainingMethod}
            </Text>
            <Text style={styles.preferenceLabel}>Feeding Schedule:</Text>
            <Text style={styles.preferenceText}>
              {family.preferences.feedingSchedule}
            </Text>
            <Text style={styles.preferenceLabel}>Special Instructions:</Text>
            <Text style={styles.preferenceText}>
              {family.preferences.specialInstructions}
            </Text>
          </View>
        </View>

        {/* File Upload Section */}
        <View style={styles.section}>
          <View style={styles.uploadSectionHeader}>
            <Text style={styles.sectionTitle}>Family Documents</Text>
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={handleFileUpload}
            >
              <Upload size={16} color={COLORS.white} />
              <Text style={styles.uploadButtonText}>Upload File</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.uploadDescription}>
            Upload intake forms, emergency contacts, medical information, and other important documents. 
            These files will be accessible to assigned nurses.
          </Text>

          {uploadedFiles.length > 0 ? (
            <View style={styles.filesContainer}>
              {uploadedFiles.map((file) => (
                <View key={file.id} style={styles.fileCard}>
                  <View style={styles.fileHeader}>
                    <View style={styles.fileIconContainer}>
                      {getFileIcon(file.type)}
                    </View>
                    <View style={styles.fileInfo}>
                      <Text style={styles.fileName} numberOfLines={1}>
                        {file.name}
                      </Text>
                      <View style={styles.fileMetadata}>
                        <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
                        <Text style={styles.fileDivider}>•</Text>
                        <Text style={styles.fileDate}>{formatUploadDate(file.uploadDate)}</Text>
                      </View>
                      <Text style={styles.fileUploader}>
                        Uploaded by {file.uploadedBy}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.fileActions}>
                    <TouchableOpacity 
                      style={styles.fileActionButton}
                      onPress={() => handleFileAction(file, 'view')}
                    >
                      <Eye size={16} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.fileActionButton}
                      onPress={() => handleFileAction(file, 'download')}
                    >
                      <Download size={16} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.fileActionButton}
                      onPress={() => handleFileAction(file, 'delete')}
                    >
                      <Trash2 size={16} color={COLORS.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyFilesContainer}>
              <Upload size={48} color={COLORS.textSecondary} />
              <Text style={styles.emptyFilesTitle}>No documents uploaded</Text>
              <Text style={styles.emptyFilesText}>
                Upload intake forms and important documents to share with nurses
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requested Shifts</Text>
          {family.requestedShifts.map((shift) => (
            <View key={shift.id} style={styles.shiftCard}>
              <View style={styles.shiftHeader}>
                <View>
                  <Text style={styles.shiftDate}>{shift.date}</Text>
                  <View style={styles.shiftTime}>
                    <Clock size={16} color={COLORS.primary} />
                    <Text style={styles.timeText}>{shift.time}</Text>
                  </View>
                </View>
                <View style={[
                  styles.statusBadge,
                  shift.status === 'approved' ? styles.approvedBadge : styles.pendingBadge
                ]}>
                  <Text style={[
                    styles.statusText,
                    shift.status === 'approved' ? styles.approvedText : styles.pendingText
                  ]}>
                    {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                  </Text>
                </View>
              </View>
              
              {shift.recurring && (
                <Text style={styles.recurringText}>{shift.frequency}</Text>
              )}
              
              {shift.status === 'pending' && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.approveButton]}
                    onPress={() => handleApproveShift(shift.id)}
                  >
                    <Check size={20} color={COLORS.white} />
                    <Text style={styles.actionButtonText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.declineButton]}
                    onPress={() => handleDeclineShift(shift.id)}
                  >
                    <X size={20} color={COLORS.white} />
                    <Text style={styles.actionButtonText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Messages</Text>
          <View style={styles.messagesContainer}>
            {family.messages.map((msg) => (
              <View 
                key={msg.id}
                style={[
                  styles.messageItem,
                  msg.isAdmin ? styles.adminMessage : styles.familyMessage
                ]}
              >
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
          onPress={handleSendMessage}
        >
          <MessageSquare size={20} color={COLORS.white} />
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
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  babyCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  babyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  babyName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  babyAge: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  babyDetails: {
    marginLeft: 28,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
  },
  preferenceCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
  },
  preferenceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  preferenceText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  uploadSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  uploadButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  uploadDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  filesContainer: {
    gap: 12,
  },
  fileCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  fileMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  fileDivider: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginHorizontal: 8,
  },
  fileDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  fileUploader: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  fileActions: {
    flexDirection: 'row',
    gap: 8,
  },
  fileActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyFilesContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyFilesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyFilesText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  shiftCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  shiftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  shiftDate: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  shiftTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  approvedBadge: {
    backgroundColor: COLORS.success + '20',
  },
  pendingBadge: {
    backgroundColor: COLORS.warning + '20',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  approvedText: {
    color: COLORS.success,
  },
  pendingText: {
    color: COLORS.warning,
  },
  recurringText: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  approveButton: {
    backgroundColor: COLORS.success,
  },
  declineButton: {
    backgroundColor: COLORS.error,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  messagesContainer: {
    gap: 12,
  },
  messageItem: {
    maxWidth: '80%',
    flexDirection: 'row',
  },
  adminMessage: {
    alignSelf: 'flex-end',
  },
  familyMessage: {
    alignSelf: 'flex-start',
  },
  messageContent: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 16,
    padding: 12,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 12,
  },
  messageSender: {
    fontSize: 12,
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
    lineHeight: 20,
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