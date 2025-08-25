
import { createContext, useContext, useEffect, useState } from 'react';
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
  addChapter: (subjectId: string, name: string) => Promise<any>;
  addLesson: (chapterId: string, name: string, content: string) => Promise<any>;
  deleteSubject: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { 
    settings, 
    subjects, 
    saveSettings, 
    addSubject: addSubjectToDb, 
    addChapter: addChapterToDb,
    addLesson: addLessonToDb,
    deleteSubject: deleteSubjectFromDb, 
    refreshSubjects 
  } = useSupabaseStorage();
  
  const [currentLesson, setCurrentLesson] = useState<any | null>(null);
  const [stats] = useState<any>({
    totalStudyTime: 0,
    sessionsCompleted: 0,
    averageScore: 0,
    subjectStats: {}
  });

  const isDarkMode = settings.dark_mode !== false; // Sombre par défaut
  const geminiApiKey = settings.gemini_api_key || '';

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

  const toggleDarkMode = async () => {
    const newDarkMode = !isDarkMode;
    await saveSettings({ dark_mode: newDarkMode });
    
    if (newDarkMode) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  const setGeminiApiKey = async (key: string) => {
    await saveSettings({ gemini_api_key: key });
  };

  const addSubject = async (name: string, description?: string, color?: string) => {
    return await addSubjectToDb(name, description, color);
  };

  const addChapter = async (subjectId: string, name: string) => {
    return await addChapterToDb(subjectId, name);
  };

  const addLesson = async (chapterId: string, name: string, content: string) => {
    return await addLessonToDb(chapterId, name, content);
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
      addChapter,
      addLesson,
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
