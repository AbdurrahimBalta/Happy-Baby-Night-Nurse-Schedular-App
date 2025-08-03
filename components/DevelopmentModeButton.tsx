import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Text,
  ScrollView,
  Image,
} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { COLORS } from '@/constants/Colors';
import { Users, Heart, Shield, Code } from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const BUTTON_SIZE = 56;
const EDGE_MARGIN = 20;

export default function DevelopmentModeButton() {
  const { signInAsRole, isLoading } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Position state for the floating button
  const translateX = useSharedValue(screenWidth - BUTTON_SIZE - EDGE_MARGIN);
  const translateY = useSharedValue(screenHeight / 2);

  const handleRoleLogin = async (role: 'family' | 'nurse' | 'admin') => {
    try {
      await signInAsRole(role);
      setIsModalVisible(false);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const onGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: () => {
      runOnJS(setIsDragging)(true);
    },
    onActive: (event) => {
      translateX.value = event.absoluteX - BUTTON_SIZE / 2;
      translateY.value = event.absoluteY - BUTTON_SIZE / 2;
    },
    onEnd: () => {
      // Snap to edges
      const finalX = translateX.value < screenWidth / 2 
        ? EDGE_MARGIN 
        : screenWidth - BUTTON_SIZE - EDGE_MARGIN;
      
      // Keep within screen bounds
      const finalY = Math.max(
        EDGE_MARGIN,
        Math.min(translateY.value, screenHeight - BUTTON_SIZE - EDGE_MARGIN)
      );

      translateX.value = withSpring(finalX);
      translateY.value = withSpring(finalY);
      
      runOnJS(setIsDragging)(false);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const handlePress = () => {
    console.log('Development button pressed!');
    setIsModalVisible(true);
  };

  return (
    <>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={[styles.floatingButton, animatedStyle]}>
          <TouchableOpacity
            style={styles.button}
            onPress={handlePress}
            activeOpacity={0.8}
          >
            <Code size={24} color={COLORS.white} />
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/images/Happy Baby Night Nurses Logos.png')}
                style={styles.logo} 
                resizeMode="contain"
              />
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.title}>Development Mode</Text>
              <Text style={styles.subtitle}>Which role would you like to login as?</Text>

              <TouchableOpacity
                style={[styles.roleButton, styles.familyButton]}
                onPress={() => handleRoleLogin('family')}
                disabled={isLoading}
              >
                <View style={styles.roleButtonContent}>
                  <Heart size={32} color={COLORS.white} />
                  <View style={styles.roleTextContainer}>
                    <Text style={styles.roleTitle}>Family</Text>
                    <Text style={styles.roleDescription}>Login as family account</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleButton, styles.nurseButton]}
                onPress={() => handleRoleLogin('nurse')}
                disabled={isLoading}
              >
                <View style={styles.roleButtonContent}>
                  <Users size={32} color={COLORS.white} />
                  <View style={styles.roleTextContainer}>
                    <Text style={styles.roleTitle}>Nurse</Text>
                    <Text style={styles.roleDescription}>Login as nurse account</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleButton, styles.adminButton]}
                onPress={() => handleRoleLogin('admin')}
                disabled={isLoading}
              >
                <View style={styles.roleButtonContent}>
                  <Shield size={32} color={COLORS.white} />
                  <View style={styles.roleTextContainer}>
                    <Text style={styles.roleTitle}>Admin</Text>
                    <Text style={styles.roleDescription}>Login as admin account</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <View style={styles.devNote}>
                <Text style={styles.devNoteText}>
                  🚀 This is development mode. Normal auth system will be used in production.
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    zIndex: 9999,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  modalContent: {
    flexGrow: 1,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  logo: {
    width: '80%',
    height: 120,
    alignSelf: 'center'
  },
  formContainer: {
    width: '100%',
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  roleButton: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  familyButton: {
    backgroundColor: COLORS.primary,
  },
  nurseButton: {
    backgroundColor: '#10B981', // Green
  },
  adminButton: {
    backgroundColor: '#8B5CF6', // Purple
  },
  roleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
  },
  devNote: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  devNoteText: {
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
    lineHeight: 20,
  },
});