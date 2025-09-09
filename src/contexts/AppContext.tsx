import { createContext, useContext, useEffect, useState } from 'react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAuth } from '@/contexts/AuthContext';

interface AppContextType {
  subjects: any[];
  lessons: any[];
  currentLesson: any | null;
  isDarkMode: boolean;
  geminiApiKey: string;
  stats: any;
  loading: boolean;
  user: any;
  
  // Actions
  refreshSubjects: () => void;
  setCurrentLesson: (lesson: any | null) => void;
  toggleDarkMode: () => void;
  setGeminiApiKey: (key: string) => void;
  addStudySession: (session: any) => void;
  refreshStats: () => void;
  addSubject: (name: string, description?: string, color?: string) => Promise<any>;
  addLesson: (subjectId: string, title: string, content?: string, type?: string, aiData?: any) => Promise<any>;
  deleteSubject: (id: string) => void;
  getSubjectById: (id: string) => any;
  getLessonById: (id: string) => any;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user: authUser } = useAuth();
  
  const { 
    subjects,
    lessons,
    loading,
    user,
    addSubject: addSubjectToDb,
    addLesson: addLessonToDb,
    deleteSubject: deleteSubjectFromDb,
    getSubjectById,
    getLessonById,
    loadSubjects
  } = useSupabaseData();
  
  const [currentLesson, setCurrentLesson] = useState<any | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true); // Mode sombre par défaut
  const [geminiApiKey, setGeminiApiKeyState] = useState('');
  const [stats] = useState<any>({
    totalStudyTime: 0,
    sessionsCompleted: 0,
    averageScore: 0,
    subjectStats: {}
  });

  useEffect(() => {
    // Appliquer le mode sombre par défaut
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  const setGeminiApiKey = (key: string) => {
    setGeminiApiKeyState(key);
  };

  const addSubject = async (name: string, description?: string, color?: string) => {
    return await addSubjectToDb(name, description, color);
  };

  const addLesson = async (subjectId: string, title: string, content?: string, type?: string, aiData?: any) => {
    return await addLessonToDb(subjectId, title, content, type, aiData);
  };

  const deleteSubject = async (id: string) => {
    await deleteSubjectFromDb(id);
  };

  const addStudySession = (session: any) => {
    console.log('Session d\'étude ajoutée:', session);
  };

  const refreshStats = () => {
    console.log('Rafraîchissement des statistiques');
  };

  const refreshSubjects = () => {
    loadSubjects();
  };

  return (
    <AppContext.Provider value={{
      subjects,
      lessons,
      currentLesson,
      isDarkMode,
      geminiApiKey,
      stats,
      loading,
      user,
      refreshSubjects,
      setCurrentLesson,
      toggleDarkMode,
      setGeminiApiKey,
      addStudySession,
      refreshStats,
      addSubject,
      addLesson,
      deleteSubject,
      getSubjectById,
      getLessonById
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