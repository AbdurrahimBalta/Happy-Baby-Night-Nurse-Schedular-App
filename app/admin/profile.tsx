import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Upload, CreditCard as Edit2, Save, X, Camera, User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import CustomInput from '@/components/common/CustomInput';
import CustomButton from '@/components/common/CustomButton';

interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  department: string;
  location: string;
  startDate: string;
  bio: string;
  profilePicture: string | null;
  permissions: string[];
}

export default function AdminProfileScreen() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // TODO: Fetch admin profile from Supabase
  const [profile, setProfile] = useState<AdminProfile>({
    id: user?.id || '',
    name: '',
    email: user?.email || '',
    phone: '',
    title: '',
    department: '',
    location: '',
    startDate: '',
    bio: '',
    profilePicture: null,
    permissions: []
  });

  const [editedProfile, setEditedProfile] = useState<AdminProfile>(profile);

  useEffect(() => {
    // Simulate loading profile data
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const pickImage = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setEditedProfile(prev => ({ ...prev, profilePicture: imageUri }));
        Alert.alert('Success', 'Profile picture updated! Don\'t forget to save your changes.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      console.error('Image picker error:', error);
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera is required!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setEditedProfile(prev => ({ ...prev, profilePicture: imageUri }));
        Alert.alert('Success', 'Profile picture updated! Don\'t forget to save your changes.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      console.error('Camera error:', error);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Update Profile Picture',
      'Choose how you\'d like to update your profile picture',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        ...(editedProfile.profilePicture ? [{ text: 'Remove Photo', onPress: removePhoto, style: 'destructive' as const }] : [])
      ]
    );
  };

  const removePhoto = () => {
    setEditedProfile(prev => ({ ...prev, profilePicture: null }));
  };

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editedProfile.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    if (!editedProfile.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }

    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setProfile(editedProfile);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const currentProfile = isEditing ? editedProfile : profile;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Profile</Text>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={isEditing ? handleCancel : handleEdit}
        >
          {isEditing ? (
            <X size={20} color={COLORS.error} />
          ) : (
            <Edit2 size={20} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Picture Section */}
        <View style={styles.profilePictureSection}>
          <TouchableOpacity 
            style={styles.profilePictureContainer}
            onPress={isEditing ? showImageOptions : undefined}
            disabled={!isEditing}
          >
            {currentProfile.profilePicture ? (
              <Image 
                source={{ uri: currentProfile.profilePicture }} 
                style={styles.profilePicture}
              />
            ) : (
              <View style={styles.profilePicturePlaceholder}>
                <User size={48} color={COLORS.textSecondary} />
              </View>
            )}
            
            {isEditing && (
              <View style={styles.cameraOverlay}>
                <Camera size={24} color={COLORS.white} />
              </View>
            )}
          </TouchableOpacity>
          
          {isEditing && (
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={showImageOptions}
            >
              <Upload size={16} color={COLORS.primary} />
              <Text style={styles.uploadButtonText}>
                {currentProfile.profilePicture ? 'Change Photo' : 'Upload Photo'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          {isEditing ? (
            <>
              <CustomInput
                label="Full Name"
                value={editedProfile.name}
                onChangeText={(text) => setEditedProfile(prev => ({ ...prev, name: text }))}
                placeholder="Enter your full name"
              />
              
              <CustomInput
                label="Email Address"
                value={editedProfile.email}
                onChangeText={(text) => setEditedProfile(prev => ({ ...prev, email: text }))}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <CustomInput
                label="Phone Number"
                value={editedProfile.phone}
                onChangeText={(text) => setEditedProfile(prev => ({ ...prev, phone: text }))}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
              
              <CustomInput
                label="Job Title"
                value={editedProfile.title}
                onChangeText={(text) => setEditedProfile(prev => ({ ...prev, title: text }))}
                placeholder="Enter your job title"
              />
            </>
          ) : (
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <User size={20} color={COLORS.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>{currentProfile.name}</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <Mail size={20} color={COLORS.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{currentProfile.email}</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <Phone size={20} color={COLORS.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{currentProfile.phone}</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <Shield size={20} color={COLORS.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Title</Text>
                  <Text style={styles.infoValue}>{currentProfile.title}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Work Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Information</Text>
          
          {isEditing ? (
            <>
              <CustomInput
                label="Department"
                value={editedProfile.department}
                onChangeText={(text) => setEditedProfile(prev => ({ ...prev, department: text }))}
                placeholder="Enter your department"
              />
              
              <CustomInput
                label="Location"
                value={editedProfile.location}
                onChangeText={(text) => setEditedProfile(prev => ({ ...prev, location: text }))}
                placeholder="Enter your work location"
              />
            </>
          ) : (
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Shield size={20} color={COLORS.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Department</Text>
                  <Text style={styles.infoValue}>{currentProfile.department}</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <MapPin size={20} color={COLORS.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{currentProfile.location}</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <Calendar size={20} color={COLORS.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Start Date</Text>
                  <Text style={styles.infoValue}>{formatDate(currentProfile.startDate)}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Bio Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          {isEditing ? (
            <CustomInput
              label="Bio"
              value={editedProfile.bio}
              onChangeText={(text) => setEditedProfile(prev => ({ ...prev, bio: text }))}
              placeholder="Tell us about yourself..."
              multiline
              numberOfLines={4}
              style={styles.bioInput}
            />
          ) : (
            <Text style={styles.bioText}>{currentProfile.bio}</Text>
          )}
        </View>

        {/* Permissions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permissions</Text>
          <View style={styles.permissionsContainer}>
            {currentProfile.permissions.map((permission, index) => (
              <View key={index} style={styles.permissionBadge}>
                <Shield size={16} color={COLORS.primary} />
                <Text style={styles.permissionText}>{permission}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Save Button */}
        {isEditing && (
          <CustomButton
            title="Save Changes"
            onPress={handleSave}
            isLoading={isSaving}
            style={styles.saveButton}
          />
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
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
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
  },
  profilePictureSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profilePicturePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  infoContainer: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  bioText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  permissionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  permissionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  permissionText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  saveButton: {
    marginTop: 8,
    marginBottom: 40,
  },
});