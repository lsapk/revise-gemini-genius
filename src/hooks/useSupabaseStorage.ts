
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({});
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user settings
  const loadSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Erreur lors du chargement des paramètres:', error);
        return;
      }

      if (data) {
        setSettings({
          gemini_api_key: data.gemini_api_key,
          dark_mode: data.dark_mode,
          notifications_enabled: data.notifications_enabled
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    }
  };

  // Save settings
  const saveSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          id: user.id,
          ...newSettings,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Erreur lors de la sauvegarde des paramètres:', error);
        return;
      }

      setSettings(prev => ({ ...prev, ...newSettings }));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
    }
  };

  // Load subjects
  const loadSubjects = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des matières:', error);
        return;
      }

      setSubjects(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des matières:', error);
    }
  };

  // Add subject
  const addSubject = async (name: string, description?: string, color: string = '#3B82F6') => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert({
          user_id: user.id,
          name,
          description,
          color
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de l\'ajout de la matière:', error);
        return null;
      }

      setSubjects(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la matière:', error);
      return null;
    }
  };

  // Delete subject
  const deleteSubject = async (subjectId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', subjectId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erreur lors de la suppression de la matière:', error);
        return;
      }

      setSubjects(prev => prev.filter(s => s.id !== subjectId));
    } catch (error) {
      console.error('Erreur lors de la suppression de la matière:', error);
    }
  };

  useEffect(() => {
    if (user) {
      Promise.all([loadSettings(), loadSubjects()]).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

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
