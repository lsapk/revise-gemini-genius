import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Subject {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color: string;
  lessons_count: number;
  created_at: string;
  updated_at: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  user_id: string;
  subject_id: string;
  title: string;
  content?: string;
  type: string;
  difficulty?: string;
  data?: any; // Données IA (QCM, flashcards, etc.)
  created_at: string;
  updated_at: string;
}

export function useSupabaseData() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  // Vérifier l'utilisateur
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Charger les matières
  const loadSubjects = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des matières:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les matières",
          variant: "destructive"
        });
        return;
      }

      // Charger les leçons pour chaque matière
      const subjectsWithLessons = await Promise.all(
        (data || []).map(async (subject) => {
          const { data: lessonsData } = await supabase
            .from('lessons')
            .select('*')
            .eq('subject_id', subject.id)
            .order('created_at', { ascending: false });

          return {
            ...subject,
            lessons: lessonsData || []
          };
        })
      );

      setSubjects(subjectsWithLessons);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const loadLessons = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des leçons:', error);
        return;
      }

      setLessons(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        setLoading(true);
        await Promise.all([loadSubjects(), loadLessons()]);
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  // Ajouter une matière
  const addSubject = async (name: string, description?: string, color: string = '#3B82F6') => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté",
        variant: "destructive"
      });
      return null;
    }

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
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter la matière",
          variant: "destructive"
        });
        return null;
      }

      await loadSubjects();
      toast({
        title: "Succès",
        description: "Matière créée avec succès"
      });
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      return null;
    }
  };

  // Ajouter une leçon
  const addLesson = async (subjectId: string, title: string, content?: string, type: string = 'lesson', aiData?: any) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté",
        variant: "destructive"
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('lessons')
        .insert({
          user_id: user.id,
          subject_id: subjectId,
          title,
          content,
          type,
          data: aiData
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de l\'ajout de la leçon:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter la leçon",
          variant: "destructive"
        });
        return null;
      }

      await loadSubjects();
      await loadLessons();
      toast({
        title: "Succès",
        description: "Cours ajouté avec succès"
      });
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      return null;
    }
  };

  // Supprimer une matière
  const deleteSubject = async (subjectId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', subjectId);

      if (error) {
        console.error('Erreur lors de la suppression de la matière:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la matière",
          variant: "destructive"
        });
        return;
      }

      await loadSubjects();
      toast({
        title: "Succès",
        description: "Matière supprimée avec succès"
      });
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Obtenir une matière par ID
  const getSubjectById = (id: string): Subject | undefined => {
    return subjects.find(s => s.id === id);
  };

  // Obtenir une leçon par ID
  const getLessonById = (id: string): Lesson | undefined => {
    return lessons.find(l => l.id === id);
  };

  return {
    subjects,
    lessons,
    loading,
    user,
    addSubject,
    addLesson,
    deleteSubject,
    getSubjectById,
    getLessonById,
    loadSubjects,
    loadLessons
  };
}