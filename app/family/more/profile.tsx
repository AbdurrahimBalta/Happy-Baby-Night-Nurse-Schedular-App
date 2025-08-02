import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, CreditCard as Edit2, Upload } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useFamily } from '@/hooks/useFamily';
import CustomInput from '@/components/common/CustomInput';
import CustomButton from '@/components/common/CustomButton';

export default function FamilyProfileScreen() {
  const { user } = useAuth();
  const { familyProfile, updateFamilyProfile, isLoading } = useFamily();
  
  const [isEditing, setIsEditing] = useState(false);
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    parent1Name: 'Sarah Johnson',
    parent2Name: 'Michael Johnson',
    babyNames: 'Emma, Liam',
    address: '123 Maple Street, Suite 405, San Francisco, CA 94110',
    checkInSteps: [
      'Enter gate code: #2468',
      'Take elevator to 4th floor',
      'Apartment is on the right, #405',
      'Remove shoes at entrance',
      'Nursery is first door on the left'
    ],
    additionalNotes: 'Emma is allergic to peanuts. Both babies usually sleep through the night but Liam might wake up for feeding around 2 AM. White noise machine is essential for their sleep routine.'
  });

  useEffect(() => {
    if (familyProfile) {
      setFormData({
        parent1Name: familyProfile.parent1Name || 'Sarah Johnson',
        parent2Name: familyProfile.parent2Name || 'Michael Johnson',
        babyNames: familyProfile.babyNames ? familyProfile.babyNames.join(', ') : 'Emma, Liam',
        address: familyProfile.address || '123 Maple Street, Suite 405, San Francisco, CA 94110',
        checkInSteps: familyProfile.checkInSteps || [
          'Enter gate code: #2468',
          'Take elevator to 4th floor',
          'Apartment is on the right, #405',
          'Remove shoes at entrance',
          'Nursery is first door on the left'
        ],
        additionalNotes: familyProfile.additionalNotes || 'Emma is allergic to peanuts. Both babies usually sleep through the night but Liam might wake up for feeding around 2 AM. White noise machine is essential for their sleep routine.'
      });
      setLogoUri(familyProfile.logoUri || null);
    }
  }, [familyProfile]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setLogoUri(uri);
        Alert.alert('Success', 'Picture updated successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleSave = async () => {
    try {
      const babyNamesArray = formData.babyNames
        .split(',')
        .map(name => name.trim())
        .filter(name => name.length > 0);
      
      const checkInStepsFiltered = formData.checkInSteps.filter(step => step.trim().length > 0);
      
      await updateFamilyProfile({
        ...formData,
        babyNames: babyNamesArray,
        checkInSteps: checkInStepsFiltered,
        email: user?.email || '',
        logoUri: logoUri
      });
      
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
      console.error(error);
    }
  };

  const updateCheckInStep = (index: number, value: string) => {
    const updatedSteps = [...formData.checkInSteps];
    updatedSteps[index] = value;
    setFormData(prev => ({ ...prev, checkInSteps: updatedSteps }));
  };

  if (isLoading && !familyProfile) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => setIsEditing(!isEditing)}
        >
          {!isEditing && <Edit2 size={20} color={COLORS.primary} />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Picture</Text>
          <TouchableOpacity 
            style={styles.logoContainer}
            onPress={pickImage}
            disabled={!isEditing}
          >
            {logoUri ? (
              <Image 
                source={{ uri: logoUri }} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Upload size={32} color={COLORS.textSecondary} />
                <Text style={styles.logoPlaceholderText}>
                  {isEditing ? 'Upload picture' : 'No picture uploaded'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parents</Text>
          {isEditing ? (
            <>
              <CustomInput
                label="Parent 1 Name"
                value={formData.parent1Name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, parent1Name: text }))}
                placeholder="e.g., Sarah Johnson"
              />
              <CustomInput
                label="Parent 2 Name (Optional)"
                value={formData.parent2Name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, parent2Name: text }))}
                placeholder="e.g., Michael Johnson"
              />
            </>
          ) : (
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Parent 1:</Text>
              <Text style={styles.infoValue}>{formData.parent1Name}</Text>
              
              {formData.parent2Name && (
                <>
                  <Text style={styles.infoLabel}>Parent 2:</Text>
                  <Text style={styles.infoValue}>{formData.parent2Name}</Text>
                </>
              )}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Babies</Text>
          {isEditing ? (
            <CustomInput
              label="Baby Names (comma separated)"
              value={formData.babyNames}
              onChangeText={(text) => setFormData(prev => ({ ...prev, babyNames: text }))}
              placeholder="e.g., Emma, Liam"
            />
          ) : (
            <View style={styles.infoContainer}>
              {formData.babyNames.split(',').map((name, index) => (
                <View key={index} style={styles.babyItem}>
                  <Text style={styles.babyName}>{name.trim()}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          {isEditing ? (
            <CustomInput
              label="Home Address"
              value={formData.address}
              onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
              placeholder="e.g., 123 Maple Street, San Francisco"
              multiline
              numberOfLines={2}
            />
          ) : (
            <View style={styles.infoContainer}>
              <Text style={styles.infoValue}>{formData.address}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Check-in Steps</Text>
          {isEditing ? (
            <>
              {formData.checkInSteps.map((step, index) => (
                <CustomInput
                  key={index}
                  label={`Step ${index + 1}`}
                  value={step}
                  onChangeText={(text) => updateCheckInStep(index, text)}
                  placeholder={`e.g., Enter gate code: #2468`}
                />
              ))}
            </>
          ) : (
            <View style={styles.infoContainer}>
              <View style={styles.stepsList}>
                {formData.checkInSteps.map((step, index) => (
                  <View key={index} style={styles.stepItem}>
                    <Text style={styles.stepNumber}>{index + 1}.</Text>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          {isEditing ? (
            <CustomInput
              label="Notes for Nurses"
              value={formData.additionalNotes}
              onChangeText={(text) => setFormData(prev => ({ ...prev, additionalNotes: text }))}
              placeholder="e.g., Allergies, feeding schedule, sleep routine"
              multiline
              numberOfLines={4}
            />
          ) : (
            <View style={styles.infoContainer}>
              <Text style={styles.infoValue}>{formData.additionalNotes}</Text>
            </View>
          )}
        </View>

        {isEditing && (
          <View style={styles.buttonsContainer}>
            <CustomButton
              title="Cancel"
              onPress={() => setIsEditing(false)}
              style={styles.cancelButton}
              textStyle={styles.cancelButtonText}
              outline
            />
            <CustomButton
              title="Save Profile"
              onPress={handleSave}
              isLoading={isLoading}
              style={styles.saveButton}
            />
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
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
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  logoContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  logoPlaceholder: {
    alignItems: 'center',
  },
  logoPlaceholderText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  infoContainer: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 12,
    lineHeight: 24,
  },
  babyItem: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  babyName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
  },
  stepsList: {
    marginTop: 8,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    color: COLORS.text,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
  },
});