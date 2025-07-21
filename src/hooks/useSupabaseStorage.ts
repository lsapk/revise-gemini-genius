
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserSettings {
  gemini_api_key?: string;
  dark_mode?: boolean;
  notifications_enabled?: boolean;
}

interface Subject {
  id: string;
  name: string;
  description?: string;
  color: string;
  lessons_count: number;
  created_at: string;
  updated_at: string;
}

export function useSupabaseStorage() {
  const [settings, setSettings] = useState<UserSettings>({});
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // For now, we'll use localStorage as a fallback since there's no authentication
  const STORAGE_KEY_SETTINGS = 'revise_genius_settings';
  const STORAGE_KEY_SUBJECTS = 'revise_genius_subjects';

  // Load user settings from localStorage
  const loadSettings = async () => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    }
  };

  // Save settings to localStorage
  const saveSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updatedSettings));
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
    }
  };

  // Load subjects from localStorage
  const loadSubjects = async () => {
    try {
      const savedSubjects = localStorage.getItem(STORAGE_KEY_SUBJECTS);
      if (savedSubjects) {
        setSubjects(JSON.parse(savedSubjects));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des matières:', error);
    }
  };

  // Add subject to localStorage
  const addSubject = async (name: string, description?: string, color: string = '#3B82F6') => {
    try {
      const newSubject = {
        id: Date.now().toString(),
        name,
        description,
        color,
        lessons_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const updatedSubjects = [newSubject, ...subjects];
      localStorage.setItem(STORAGE_KEY_SUBJECTS, JSON.stringify(updatedSubjects));
      setSubjects(updatedSubjects);
      return newSubject;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la matière:', error);
      return null;
    }
  };

  // Delete subject from localStorage
  const deleteSubject = async (subjectId: string) => {
    try {
      const updatedSubjects = subjects.filter(s => s.id !== subjectId);
      localStorage.setItem(STORAGE_KEY_SUBJECTS, JSON.stringify(updatedSubjects));
      setSubjects(updatedSubjects);
    } catch (error) {
      console.error('Erreur lors de la suppression de la matière:', error);
    }
  };

  useEffect(() => {
    Promise.all([loadSettings(), loadSubjects()]).finally(() => {
      setLoading(false);
    });
  }, []);

  return {
    settings,
    subjects,
    loading,
    saveSettings,
    addSubject,
    deleteSubject,
    refreshSettings: loadSettings,
    refreshSubjects: loadSubjects
  };
}
