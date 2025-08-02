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
  signUp: async () => {},
  signOut: async () => {},
  markFirstLoginComplete: () => {},
});

// Mock user data for demo
const MOCK_USERS = [
  {
    id: '1',
    email: 'family@example.com',
    password: 'password123',
    role: 'family',
  },
  {
    id: '2',
    email: 'nurse@example.com',
    password: 'password123',
    role: 'nurse',
  },
  {
    id: '3',
    email: 'info@happybabynightnurses.com',
    password: 'password123',
    role: 'admin',
  },
  {
    id: '4',
    email: 'admin@happybabynightnurses.com',
    password: 'password123',
    role: 'admin',
  },
];

// Function to determine user role based on email
const determineUserRole = (email: string): 'family' | 'nurse' | 'admin' => {
  const normalizedEmail = email.toLowerCase().trim();
  
  // Check if email is from the company domain for admin access
  if (normalizedEmail.endsWith('@happybabynightnurses.com')) {
    return 'admin';
  }
  
  // For demo purposes, we'll check against mock users
  // In a real app, this would be determined by your backend/database
  const mockUser = MOCK_USERS.find(u => u.email.toLowerCase() === normalizedEmail);
  if (mockUser) {
    return mockUser.role as 'family' | 'nurse' | 'admin';
  }
  
  // Default to family role for new signups
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
    try {
      setIsLoading(true);
      
      // Determine the user role based on email
      const userRole = determineUserRole(email);
      
      // Find user in mock data or validate credentials
      const foundUser = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      // For admin role, strictly enforce company email domain
      if (userRole === 'admin') {
        if (!email.toLowerCase().endsWith('@happybabynightnurses.com')) {
          throw new Error('Admin access requires a @happybabynightnurses.com email address');
        }
        
        // For demo purposes, allow any password for company emails
        // In production, this would validate against your user database
        if (!foundUser && email.toLowerCase().endsWith('@happybabynightnurses.com')) {
          // Create a temporary admin user for company emails
          const adminUser: User = {
            id: Math.random().toString(36).substring(2, 9),
            email: email.toLowerCase(),
            role: 'admin',
          };
          setUser(adminUser);
          return;
        }
      }

      if (!foundUser) {
        throw new Error('Invalid credentials');
      }

      // Verify the role matches what we determined
      if (foundUser.role !== userRole) {
        throw new Error('Access denied for this account type');
      }

      // Check if this is a first-time login for family users
      const isFirstLogin = userRole === 'family' && !localStorage.getItem(`user_${foundUser.id}_first_login_complete`);

      // Create authenticated user object
      const authenticatedUser: User = {
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role as 'family' | 'nurse' | 'admin',
        isFirstLogin,
      };

      // Set user in state
      setUser(authenticatedUser);
      
    } catch (error) {
      console.error('Sign in error:', error);
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
      
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email: email.toLowerCase(),
        role: actualRole,
        isFirstLogin: actualRole === 'family', // New family users get first login experience
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(newUser);
      
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
      localStorage.setItem(`user_${user.id}_first_login_complete`, 'true');
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