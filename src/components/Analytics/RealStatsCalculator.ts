// Utilities pour calculer de vraies statistiques basées sur les données
export interface StudySession {
  id: string;
  user_id: string;
  lesson_id?: string;
  subject_id?: string;
  duration: number; // en minutes
  score?: number;
  completed_at: string;
  session_type: string; // 'quiz', 'flashcard', 'study'
}

export interface Subject {
  id: string;
  name: string;
  lessons_count: number;
  created_at: string;
}

export interface Lesson {
  id: string;
  subject_id: string;
  title: string;
  created_at: string;
  data?: any;
}

export function calculateUserStats(
  studySessions: StudySession[],
  subjects: Subject[],
  lessons: Lesson[]
) {
  // Calculer le temps total d'étude (en minutes)
  const totalStudyTime = studySessions.reduce((total, session) => total + session.duration, 0);

  // Calculer le nombre de sessions complétées
  const sessionsCompleted = studySessions.length;

  // Calculer le score moyen (seulement pour les sessions avec score)
  const sessionsWithScores = studySessions.filter(s => s.score !== undefined && s.score !== null);
  const averageScore = sessionsWithScores.length > 0 
    ? Math.round(sessionsWithScores.reduce((sum, s) => sum + (s.score || 0), 0) / sessionsWithScores.length)
    : 0;

  // Calculer les statistiques par matière
  const subjectStats: Record<string, any> = {};
  subjects.forEach(subject => {
    const subjectSessions = studySessions.filter(s => s.subject_id === subject.id);
    const subjectLessons = lessons.filter(l => l.subject_id === subject.id);
    
    subjectStats[subject.id] = {
      name: subject.name,
      totalTime: subjectSessions.reduce((sum, s) => sum + s.duration, 0),
      sessionsCount: subjectSessions.length,
      lessonsCount: subjectLessons.length,
      averageScore: subjectSessions.filter(s => s.score).length > 0 
        ? Math.round(subjectSessions.filter(s => s.score).reduce((sum, s) => sum + (s.score || 0), 0) / subjectSessions.filter(s => s.score).length)
        : 0
    };
  });

  return {
    totalStudyTime,
    sessionsCompleted,
    averageScore,
    subjectStats,
    recentActivity: studySessions
      .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
      .slice(0, 5) // Les 5 dernières sessions
  };
}

export function getSubjectAnalytics(subjectId: string, lessons: Lesson[], studySessions: StudySession[]) {
  const subjectLessons = lessons.filter(l => l.subject_id === subjectId);
  const subjectSessions = studySessions.filter(s => s.subject_id === subjectId);
  
  return {
    lessonsCount: subjectLessons.length,
    summariesCount: subjectLessons.filter(l => l.data?.summary).length,
    quizzesCount: subjectLessons.filter(l => l.data?.quiz || l.data?.qcm).length,
    flashcardsCount: subjectLessons.filter(l => l.data?.flashcards).length,
    totalStudyTime: subjectSessions.reduce((sum, s) => sum + s.duration, 0),
    averageScore: subjectSessions.filter(s => s.score).length > 0
      ? Math.round(subjectSessions.filter(s => s.score).reduce((sum, s) => sum + (s.score || 0), 0) / subjectSessions.filter(s => s.score).length)
      : 0,
    completionRate: subjectLessons.length > 0 
      ? Math.round((subjectSessions.length / subjectLessons.length) * 100)
      : 0
  };
}