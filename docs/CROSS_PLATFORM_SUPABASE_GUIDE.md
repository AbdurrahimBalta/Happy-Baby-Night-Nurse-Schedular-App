# Cross-Platform Development Guide: Web + iOS + Supabase

## 🎯 Target Architecture

**Platform Support:**
- ✅ iOS (React Native)
- ✅ Web (React Native Web)
- 🔄 Backend: Supabase

**Technology Stack:
- Frontend: React Native + Expo
- Web: React Native Web (automatic)
- Backend: Supabase (PostgreSQL + Auth + Storage + Real-time)
- State Management: React Query + Zustand
- Navigation: Expo Router (universal)

## 📦 Required Packages

### 1. Supabase Dependencies
```bash
npm install @supabase/supabase-js
npm install @react-native-async-storage/async-storage
npm install react-native-url-polyfill
```

### 2. State Management & Data Fetching
```bash
npm install @tanstack/react-query
npm install zustand
```

### 3. Form Handling & Validation
```bash
npm install react-hook-form
npm install @hookform/resolvers
npm install zod
```

### 4. Cross-Platform Utilities
```bash
npm install expo-secure-store
npm install expo-constants
npm install @expo/metro-config
```

## 🏗️ Project Structure Update

```
src/
├── lib/
│   ├── supabase.ts          # Supabase client
│   ├── auth.ts              # Auth helpers
│   └── storage.ts           # Cross-platform storage
├── hooks/
│   ├── useAuth.ts           # Auth hook
│   ├── useSupabase.ts       # Supabase hooks
│   └── queries/             # React Query hooks
│       ├── useUsers.ts
│       ├── useShifts.ts
│       └── useMessages.ts
├── store/
│   ├── authStore.ts         # Zustand auth store
│   └── appStore.ts          # Global app state
├── types/
│   ├── database.ts          # Supabase types
│   ├── auth.ts              # Auth types
│   └── api.ts               # API types
├── utils/
│   ├── platform.ts          # Platform detection
│   ├── storage.ts           # Storage abstraction
│   └── validation.ts        # Zod schemas
└── components/
    ├── forms/               # Form components
    └── platform/            # Platform-specific components
```

## 🔧 Configuration Files

### 1. Environment Variables (.env)
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Metro Config (metro.config.js)
```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// For web support
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Polyfill for Supabase
config.resolver.alias = {
  'react-native-url-polyfill/auto': 'react-native-url-polyfill/auto',
};

module.exports = config;
```

### 3. App Config (app.json) Update
```json
{
  "expo": {
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-secure-store"
    ]
  }
}
```

## 💾 Supabase Database Schema

### Core Tables
```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('family', 'nurse', 'admin')) NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Families table
CREATE TABLE families (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  parent1_name TEXT NOT NULL,
  parent2_name TEXT,
  address TEXT,
  phone TEXT,
  emergency_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Nurses table
CREATE TABLE nurses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  license_number TEXT,
  certifications TEXT[],
  experience_years INTEGER,
  hourly_rate DECIMAL(10,2),
  bio TEXT,
  availability JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Babies table
CREATE TABLE babies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  special_needs TEXT,
  feeding_schedule JSONB,
  sleep_schedule JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shifts table
CREATE TABLE shifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  nurse_id UUID REFERENCES nurses(id) ON DELETE SET NULL,
  baby_id UUID REFERENCES babies(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  hourly_rate DECIMAL(10,2),
  total_amount DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Night logs table
CREATE TABLE night_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shift_id UUID REFERENCES shifts(id) ON DELETE CASCADE,
  baby_id UUID REFERENCES babies(id) ON DELETE CASCADE,
  nurse_id UUID REFERENCES nurses(id) ON DELETE CASCADE,
  log_data JSONB NOT NULL, -- feeding, sleep, diaper changes, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  shift_id UUID REFERENCES shifts(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('text', 'image', 'urgent')) DEFAULT 'text',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS)
```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE nurses ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Families can see their own data
CREATE POLICY "Families can view own data" ON families
  FOR ALL USING (auth.uid() = user_id);

-- Nurses can see their own data
CREATE POLICY "Nurses can view own data" ON nurses
  FOR ALL USING (auth.uid() = user_id);

-- Admin can see everything
CREATE POLICY "Admin can view all" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

## 🔐 Authentication Implementation

### 1. Supabase Client Setup
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Platform-specific storage
const storage = Platform.OS === 'web' 
  ? {
      getItem: (key: string) => localStorage.getItem(key),
      setItem: (key: string, value: string) => localStorage.setItem(key, value),
      removeItem: (key: string) => localStorage.removeItem(key),
    }
  : {
      getItem: AsyncStorage.getItem,
      setItem: AsyncStorage.setItem,
      removeItem: AsyncStorage.removeItem,
    };

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});
```

### 2. Auth Hook
```typescript
// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
```

## 🌐 Cross-Platform Optimizations

### 1. Platform Detection Utility
```typescript
// utils/platform.ts
import { Platform, Dimensions } from 'react-native';

export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isMobile = Platform.OS !== 'web';

export const getScreenSize = () => {
  const { width, height } = Dimensions.get('window');
  return {
    width,
    height,
    isTablet: width >= 768,
    isDesktop: width >= 1024,
  };
};

export const getResponsiveValue = <T>(
  mobile: T,
  tablet: T,
  desktop: T
): T => {
  const { isTablet, isDesktop } = getScreenSize();
  if (isDesktop) return desktop;
  if (isTablet) return tablet;
  return mobile;
};
```

### 2. Responsive Styles
```typescript
// utils/responsive.ts
import { StyleSheet } from 'react-native';
import { getResponsiveValue } from './platform';

export const createResponsiveStyles = <T extends Record<string, any>>(
  styles: T
): T => {
  return StyleSheet.create(styles);
};

export const responsiveSize = (size: number) => {
  return getResponsiveValue(
    size,           // mobile
    size * 1.2,     // tablet
    size * 1.4      // desktop
  );
};

export const responsivePadding = {
  container: getResponsiveValue(16, 24, 32),
  section: getResponsiveValue(12, 16, 20),
  item: getResponsiveValue(8, 12, 16),
};
```

### 3. Platform-Specific Components
```typescript
// components/platform/PlatformView.tsx
import React from 'react';
import { View, ViewProps } from 'react-native';
import { isWeb } from '@/utils/platform';

interface PlatformViewProps extends ViewProps {
  webStyle?: ViewProps['style'];
  mobileStyle?: ViewProps['style'];
}

export function PlatformView({ 
  webStyle, 
  mobileStyle, 
  style, 
  ...props 
}: PlatformViewProps) {
  const platformStyle = isWeb ? webStyle : mobileStyle;
  
  return (
    <View 
      style={[style, platformStyle]} 
      {...props} 
    />
  );
}
```

## 🚀 Development Workflow

### 1. Development Scripts (package.json)
```json
{
  "scripts": {
    "start": "expo start",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build:web": "expo export --platform web",
    "build:ios": "expo build:ios",
    "type-check": "tsc --noEmit",
    "lint": "expo lint",
    "test": "jest"
  }
}
```

### 2. Development Process
```bash
# 1. Start development server
npm run start

# 2. Test on different platforms
# Press 'w' for web
# Press 'i' for iOS simulator

# 3. Build for production
npm run build:web    # Web build
npm run build:ios    # iOS build
```

## 📱 Platform-Specific Considerations

### Web Optimizations
1. **SEO & Meta Tags**
   - Add proper meta tags
   - Implement proper routing
   - Optimize for search engines

2. **Performance**
   - Code splitting
   - Lazy loading
   - Image optimization

3. **Responsive Design**
   - Breakpoint management
   - Touch vs mouse interactions
   - Keyboard navigation

### iOS Optimizations
1. **Native Features**
   - Push notifications
   - Biometric authentication
   - Camera/photo access

2. **Performance**
   - Memory management
   - Battery optimization
   - Smooth animations

3. **App Store**
   - Proper app icons
   - Launch screens
   - App Store guidelines

## 🔄 Real-time Features with Supabase

### 1. Real-time Subscriptions
```typescript
// hooks/useRealtimeMessages.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useRealtimeMessages(userId: string) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${userId}`,
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  return messages;
}
```

## 📊 State Management Strategy

### 1. Zustand Store
```typescript
// store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  setUser: (user: any) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(n  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

## 🎯 Next Steps

### Immediate Tasks
1. ✅ Create Supabase project
2. ✅ Set up environment variables
3. ✅ Create database schema
4. ✅ Implement authentication
5. ✅ Build basic CRUD operations

### Medium Term
1. 🔄 Real-time features
2. 🔄 File upload (avatars, documents)
3. 🔄 Push notifications
4. 🔄 Offline support
5. 🔄 Performance optimization

### Long Term
1. 🎯 Advanced analytics
2. 🎯 Multi-language support
3. 🎯 Advanced security features
4. 🎯 Third-party integrations

With this guide, your project will run smoothly on both web and iOS platforms with a powerful Supabase backend!