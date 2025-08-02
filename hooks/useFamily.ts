import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface FamilyProfile {
  id: string;
  email: string;
  parent1Name: string;
  parent2Name?: string;
  babyNames: string[];
  address: string;
  checkInSteps: string[];
  additionalNotes?: string;
  logoUri?: string | null;
}

interface Shift {
  id: string;
  familyId: string;
  nurseId: string;
  date: string;
  startTime: string;
  endTime: string;
  confirmed: boolean;
  recurring: boolean;
  recurringDays?: number[];
  recurringWeeks?: number;
  nurse: {
    id: string;
    name: string;
    picture?: string;
    rating: number;
    bio: string;
    certifications: string[];
  };
}

// Mock data for demonstration
const MOCK_FAMILY_PROFILES: Record<string, FamilyProfile> = {
  '1': {
    id: '1',
    email: 'family@example.com',
    parent1Name: 'Sarah Johnson',
    parent2Name: 'Michael Johnson',
    babyNames: ['Emma', 'Liam'],
    address: '123 Maple Street, Suite 405, San Francisco, CA 94110',
    checkInSteps: [
      'Enter gate code: #2468',
      'Take elevator to 4th floor',
      'Apartment is on the right, #405',
      'Remove shoes at entrance',
      'Nursery is first door on the left'
    ],
    additionalNotes: 'Emma is allergic to peanuts. Both babies usually sleep through the night but Liam might wake up for feeding around 2 AM. White noise machine is essential for their sleep routine.',
    logoUri: null
  }
};

const MOCK_SHIFTS: Shift[] = [
  {
    id: 's1',
    familyId: '1',
    nurseId: '1',
    date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    startTime: '8:00 PM',
    endTime: '6:00 AM',
    confirmed: true,
    recurring: false,
    nurse: {
      id: '1',
      name: 'Angela Davis',
      picture: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.9,
      bio: 'Specialized in newborn care with 10+ years of experience. Certified sleep training expert.',
      certifications: ['RN', 'NCS', 'CPR']
    }
  },
  {
    id: 's2',
    familyId: '1',
    nurseId: '2',
    date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    startTime: '9:00 PM',
    endTime: '7:00 AM',
    confirmed: false,
    recurring: true,
    recurringDays: [2, 4], // Tuesday and Thursday
    recurringWeeks: 4,
    nurse: {
      id: '2',
      name: 'Michael Chen',
      picture: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.8,
      bio: 'Pediatric nurse specializing in twins and multiples care. Gentle sleep training approach.',
      certifications: ['RN', 'IBCLC']
    }
  },
  {
    id: 's3',
    familyId: '1',
    nurseId: '3',
    date: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
    startTime: '8:30 PM',
    endTime: '6:30 AM',
    confirmed: true,
    recurring: false,
    nurse: {
      id: '3',
      name: 'Sophia Rodriguez',
      picture: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.9,
      bio: 'Experienced in newborn development and establishing healthy sleep routines.',
      certifications: ['RN', 'NCS', 'CPR']
    }
  },
  {
    id: 's4',
    familyId: '1',
    nurseId: '4',
    date: new Date(Date.now() + 345600000).toISOString(), // 4 days from now
    startTime: '9:00 PM',
    endTime: '7:00 AM',
    confirmed: true,
    recurring: false,
    nurse: {
      id: '4',
      name: 'James Wilson',
      picture: 'https://images.pexels.com/photos/6749773/pexels-photo-6749773.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.7,
      bio: 'Specializing in sleep training and establishing bedtime routines. Certified lactation consultant.',
      certifications: ['RN', 'IBCLC', 'CPR']
    }
  }
];

export function useFamily() {
  const { user } = useAuth();
  const [familyProfile, setFamilyProfile] = useState<FamilyProfile | null>(null);
  const [upcomingShifts, setUpcomingShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'family') {
      // Simulate API call to fetch family profile
      setTimeout(() => {
        setFamilyProfile(MOCK_FAMILY_PROFILES['1']);
        setUpcomingShifts(MOCK_SHIFTS);
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const updateFamilyProfile = async (profileData: Partial<FamilyProfile>) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFamilyProfile(prev => {
        if (!prev) return null;
        return { ...prev, ...profileData };
      });
      return true;
    } catch (error) {
      console.error('Error updating family profile:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    familyProfile,
    upcomingShifts,
    updateFamilyProfile,
    isLoading
  };
}