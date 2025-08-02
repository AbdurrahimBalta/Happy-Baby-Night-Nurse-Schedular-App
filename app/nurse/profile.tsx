import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Upload, Plus, X } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import CustomInput from '@/components/common/CustomInput';
import CustomButton from '@/components/common/CustomButton';

export default function NurseProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Angela Davis',
    email: 'angela.davis@example.com',
    phone: '(415) 555-0123',
    bio: 'Experienced nurse with 10+ years in neonatal care. Specialized in sleep training and newborn development.',
    certifications: ['RN', 'CPR', 'Newborn Care Specialist', 'Sleep Training Certified'],
    picture: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300'
  });

  const handleSave = () => {
    setIsEditing(false);
    // Add save logic here
  };

  const handleAddCertification = () => {
    // Add certification logic here
  };

  const handleRemoveCertification = (index: number) => {
    const newCertifications = [...profile.certifications];
    newCertifications.splice(index, 1);
    setProfile({ ...profile, certifications: newCertifications });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? 'Cancel' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.pictureContainer}
          disabled={!isEditing}
        >
          {profile.picture ? (
            <Image 
              source={{ uri: profile.picture }}
              style={styles.profilePicture}
            />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Upload size={32} color={COLORS.textSecondary} />
              <Text style={styles.uploadText}>Upload Picture</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.section}>
          <CustomInput
            label="Name"
            value={profile.name}
            editable={isEditing}
          />
          <CustomInput
            label="Email"
            value={profile.email}
            editable={isEditing}
            keyboardType="email-address"
          />
          <CustomInput
            label="Phone"
            value={profile.phone}
            editable={isEditing}
            keyboardType="phone-pad"
          />
          <CustomInput
            label="Bio"
            value={profile.bio}
            editable={isEditing}
            multiline
            numberOfLines={4}
            style={styles.bioInput}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          <View style={styles.certificationsContainer}>
            {profile.certifications.map((cert, index) => (
              <View key={index} style={styles.certificationTag}>
                <Text style={styles.certificationText}>{cert}</Text>
                {isEditing && (
                  <TouchableOpacity
                    onPress={() => handleRemoveCertification(index)}
                    style={styles.removeButton}
                  >
                    <X size={16} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {isEditing && (
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddCertification}
              >
                <Plus size={20} color={COLORS.primary} />
                <Text style={styles.addButtonText}>Add Certification</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {isEditing && (
          <CustomButton
            title="Save Changes"
            onPress={handleSave}
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
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 16,
  },
  editButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  pictureContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    backgroundColor: COLORS.backgroundSecondary,
  },
  profilePicture: {
    width: '100%',
    height: '100%',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  certificationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  certificationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  certificationText: {
    fontSize: 14,
    color: COLORS.primary,
    marginRight: 4,
  },
  removeButton: {
    padding: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  addButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: COLORS.primary,
  },
  saveButton: {
    marginTop: 8,
  },
});