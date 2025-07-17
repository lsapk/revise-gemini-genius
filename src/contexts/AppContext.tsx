
import { createContext, useContext, useEffect, useState } from 'react';
import { storage, Subject, Lesson, StudySession, UserStats } from '@/lib/storage';

interface AppContextType {
  subjects: Subject[];
  currentLesson: Lesson | null;
  isDarkMode: boolean;
  geminiApiKey: string;
  stats: UserStats;
  
  // Actions
  refreshSubjects: () => void;
  setCurrentLesson: (lesson: Lesson | null) => void;
  toggleDarkMode: () => void;
  setGeminiApiKey: (key: string) => void;
  addStudySession: (session: Omit<StudySession, 'id' | 'createdAt'>) => void;
  refreshStats: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [geminiApiKey, setGeminiApiKeyState] = useState('');
  const [stats, setStats] = useState<UserStats>({
    totalStudyTime: 0,
    sessionsCompleted: 0,
    averageScore: 0,
    subjectStats: {}
  });

  useEffect(() => {
    // Charger les données au démarrage
    refreshSubjects();
    refreshStats();
    
    const settings = storage.getSettings();
    setIsDarkMode(settings.darkMode);
    setGeminiApiKeyState(settings.geminiApiKey);
    
    // Appliquer le mode sombre
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const refreshSubjects = () => {
    setSubjects(storage.getSubjects());
  };

  const refreshStats = () => {
    setStats(storage.getStats());
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    const settings = storage.getSettings();
    storage.saveSettings({ ...settings, darkMode: newDarkMode });
  };

  const setGeminiApiKey = (key: string) => {
    setGeminiApiKeyState(key);
    const settings = storage.getSettings();
    storage.saveSettings({ ...settings, geminiApiKey: key });
  };

  const addStudySession = (session: Omit<StudySession, 'id' | 'createdAt'>) => {
    storage.addStudySession(session);
    refreshStats();
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
      refreshStats
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
