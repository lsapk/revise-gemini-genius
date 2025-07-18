
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseStorage } from '@/hooks/useSupabaseStorage';

interface AppContextType {
  subjects: any[];
  currentLesson: any | null;
  isDarkMode: boolean;
  geminiApiKey: string;
  stats: any;
  
  // Actions
  refreshSubjects: () => void;
  setCurrentLesson: (lesson: any | null) => void;
  toggleDarkMode: () => void;
  setGeminiApiKey: (key: string) => void;
  addStudySession: (session: any) => void;
  refreshStats: () => void;
  addSubject: (name: string, description?: string, color?: string) => Promise<any>;
  deleteSubject: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { settings, subjects, saveSettings, addSubject: addSubjectToDb, deleteSubject: deleteSubjectFromDb, refreshSubjects } = useSupabaseStorage();
  
  const [currentLesson, setCurrentLesson] = useState<any | null>(null);
  const [stats] = useState<any>({
    totalStudyTime: 0,
    sessionsCompleted: 0,
    averageScore: 0,
    subjectStats: {}
  });

  const isDarkMode = settings.dark_mode || false;
  const geminiApiKey = settings.gemini_api_key || '';

  useEffect(() => {
    // Appliquer le mode sombre
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = async () => {
    const newDarkMode = !isDarkMode;
    await saveSettings({ dark_mode: newDarkMode });
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setGeminiApiKey = async (key: string) => {
    await saveSettings({ gemini_api_key: key });
  };

  const addSubject = async (name: string, description?: string, color?: string) => {
    return await addSubjectToDb(name, description, color);
  };

  const deleteSubject = async (id: string) => {
    await deleteSubjectFromDb(id);
  };

  const addStudySession = (session: any) => {
    // TODO: Implémenter avec Supabase
    console.log('Session d\'étude ajoutée:', session);
  };

  const refreshStats = () => {
    // TODO: Implémenter avec Supabase
    console.log('Rafraîchissement des statistiques');
  };

  return (
    <AppContext.Provider value={{
      subjects,
      currentLesson,
      isDarkMode,
      geminiApiKey,
      stats,
      refreshSubjects,
      setCurrentLesson,
      toggleDarkMode,
      setGeminiApiKey,
      addStudySession,
      refreshStats,
      addSubject,
      deleteSubject
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
