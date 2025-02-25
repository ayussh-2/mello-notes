import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { userStorage } from '~/utils/userStorage';

interface User {
  id: string;
  email: string;
  fullName: string;
  geminiKey?: string;
}

interface SessionContextType {
  session: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await userStorage.getUser();
        setSession(user);
      } catch (error) {
        console.error('Error loading user session:', error);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const router = useRouter();

  const signOut = async () => {
    try {
      await userStorage.deleteUser();
      setSession(null);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const refreshSession = async () => {
    try {
      setIsLoading(true);
      const user = await userStorage.getUser();
      setSession(user);
    } catch (error) {
      console.error('Error refreshing user session:', error);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SessionContext.Provider value={{ session, isLoading, signOut, refreshSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
