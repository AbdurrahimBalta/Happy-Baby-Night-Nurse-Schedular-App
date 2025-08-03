import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';

// Define the user type
type User = {
  id: string;
  email: string;
  role: 'family' | 'nurse' | 'admin';
  isFirstLogin?: boolean;
};

// Define the auth context type
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: 'family' | 'nurse' | 'admin' | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInAsRole: (role: 'family' | 'nurse' | 'admin') => Promise<void>;
  signUp: (email: string, password: string, role: string) => Promise<void>;
  signOut: () => Promise<void>;
  markFirstLoginComplete: () => void;
};

// Create the auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  userRole: null,
  signIn: async () => {},
  signInAsRole: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  markFirstLoginComplete: () => {},
});

// Mock users removed - will be replaced with real authentication

// Function to determine user role based on email
const determineUserRole = (email: string): 'family' | 'nurse' | 'admin' => {
  const normalizedEmail = email.toLowerCase().trim();
  
  // Check if email is from the company domain for admin access
  if (normalizedEmail.endsWith('@happybabynightnurses.com')) {
    return 'admin';
  }
  
  // TODO: In a real app, this would be determined by your backend/database
  // For now, default to family role for new signups
  return 'family';
};

// Auth provider component
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session
  useEffect(() => {
    const checkSession = async () => {
      try {
        // In a real app, check for stored credentials
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking session:', error);
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Handle routing based on user role
  useEffect(() => {
    if (!user) return;

    // Ensure we're not in a loading state before redirecting
    if (!isLoading) {
      switch (user.role) {
        case 'family':
          router.replace('/family/home');
          break;
        case 'nurse':
          router.replace('/nurse/home');
          break;
        case 'admin':
          router.replace('/admin/home');
          break;
      }
    }
  }, [user, isLoading]);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement real authentication with Supabase
      throw new Error('Authentication not implemented yet');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Development role sign-in for testing purposes - TODO: Remove in production
  const signInAsRole = async (role: 'family' | 'nurse' | 'admin') => {
    setIsLoading(true);
    try {
      // Create a mock user for development testing
      const mockUser: User = {
        id: `dev-${role}-${Date.now()}`,
        email: `dev-${role}@example.com`,
        role: role,
        isFirstLogin: false
      };
      
      setUser(mockUser);
      
      // Small delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Development sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, role: string) => {
    try {
      setIsLoading(true);
      
      // Determine the actual role based on email
      const actualRole = determineUserRole(email);
      
      // If someone tries to sign up as admin without company email, deny it
      if (role === 'admin' && !email.toLowerCase().endsWith('@happybabynightnurses.com')) {
        throw new Error('Admin accounts require a @happybabynightnurses.com email address');
      }
      
      // If someone with company email tries to sign up as non-admin, make them admin
      if (email.toLowerCase().endsWith('@happybabynightnurses.com') && role !== 'admin') {
        Alert.alert(
          'Company Email Detected',
          'Your email domain indicates you should have admin access. You have been registered as an administrator.',
          [{ text: 'OK' }]
        );
      }
      
      // TODO: Implement real user creation with Supabase
      throw new Error('User registration not implemented yet');
      
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setUser(null);
      router.replace('/auth/login');
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  // Mark first login as complete
  const markFirstLoginComplete = () => {
    if (user) {
      // Note: localStorage is not available in React Native, using AsyncStorage would be better
      // For now, just update the state
      setUser(prev => prev ? { ...prev, isFirstLogin: false } : null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        userRole: user?.role || null,
        signIn,
        signInAsRole,
        signUp,
        signOut,
        markFirstLoginComplete,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);