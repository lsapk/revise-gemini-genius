
// Système de stockage local pour l'application
export interface Subject {
  id: string;
  name: string;
  color: string;
  chapters: Chapter[];
  createdAt: Date;
}

export interface Chapter {
  id: string;
  name: string;
  subjectId: string;
  lessons: Lesson[];
  createdAt: Date;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  chapterId: string;
  subjectId: string;
  type: 'text' | 'pdf' | 'image';
  aiGenerated?: {
    summary?: any;
    qcm?: any;
    quiz?: any;
    flashcards?: any;
    fiche?: any;
  };
  createdAt: Date;
  lastReviewed?: Date;
}

export interface StudySession {
  id: string;
  lessonId: string;
  type: 'qcm' | 'quiz' | 'flashcards';
  score: number;
  totalQuestions: number;
  duration: number; // en secondes
  createdAt: Date;
}

export interface UserStats {
  totalStudyTime: number; // en minutes
  sessionsCompleted: number;
  averageScore: number;
  subjectStats: Record<string, {
    studyTime: number;
    averageScore: number;
    sessionsCount: number;
  }>;
}

class StorageManager {
  private readonly SUBJECTS_KEY = 'revise_genius_subjects';
  private readonly SESSIONS_KEY = 'revise_genius_sessions';
  private readonly STATS_KEY = 'revise_genius_stats';
  private readonly SETTINGS_KEY = 'revise_genius_settings';

  // Subjects
  getSubjects(): Subject[] {
    const data = localStorage.getItem(this.SUBJECTS_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveSubjects(subjects: Subject[]): void {
    localStorage.setItem(this.SUBJECTS_KEY, JSON.stringify(subjects));
  }

  addSubject(subject: Omit<Subject, 'id' | 'createdAt'>): Subject {
    const subjects = this.getSubjects();
    const newSubject: Subject = {
      ...subject,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      chapters: []
    };
    subjects.push(newSubject);
    this.saveSubjects(subjects);
    return newSubject;
  }

  updateSubject(id: string, updates: Partial<Subject>): void {
    const subjects = this.getSubjects();
    const index = subjects.findIndex(s => s.id === id);
    if (index !== -1) {
      subjects[index] = { ...subjects[index], ...updates };
      this.saveSubjects(subjects);
    }
  }

  deleteSubject(id: string): void {
    const subjects = this.getSubjects().filter(s => s.id !== id);
    this.saveSubjects(subjects);
  }

  // Chapters
  addChapter(subjectId: string, chapter: Omit<Chapter, 'id' | 'createdAt' | 'subjectId'>): Chapter {
    const subjects = this.getSubjects();
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) throw new Error('Subject not found');

    const newChapter: Chapter = {
      ...chapter,
      id: crypto.randomUUID(),
      subjectId,
      createdAt: new Date(),
      lessons: []
    };

    subject.chapters.push(newChapter);
    this.saveSubjects(subjects);
    return newChapter;
  }

  // Lessons
  addLesson(chapterId: string, lesson: Omit<Lesson, 'id' | 'createdAt' | 'chapterId' | 'subjectId'>): Lesson {
    const subjects = this.getSubjects();
    let targetChapter: Chapter | undefined;
    let targetSubject: Subject | undefined;

    for (const subject of subjects) {
      const chapter = subject.chapters.find(c => c.id === chapterId);
      if (chapter) {
        targetChapter = chapter;
        targetSubject = subject;
        break;
      }
    }

    if (!targetChapter || !targetSubject) throw new Error('Chapter not found');

    const newLesson: Lesson = {
      ...lesson,
      id: crypto.randomUUID(),
      chapterId,
      subjectId: targetSubject.id,
      createdAt: new Date()
    };

    targetChapter.lessons.push(newLesson);
    this.saveSubjects(subjects);
    return newLesson;
  }

  updateLesson(lessonId: string, updates: Partial<Lesson>): void {
    const subjects = this.getSubjects();
    for (const subject of subjects) {
      for (const chapter of subject.chapters) {
        const lessonIndex = chapter.lessons.findIndex(l => l.id === lessonId);
        if (lessonIndex !== -1) {
          chapter.lessons[lessonIndex] = { ...chapter.lessons[lessonIndex], ...updates };
          this.saveSubjects(subjects);
          return;
        }
      }
    }
  }

  getLesson(lessonId: string): Lesson | undefined {
    const subjects = this.getSubjects();
    for (const subject of subjects) {
      for (const chapter of subject.chapters) {
        const lesson = chapter.lessons.find(l => l.id === lessonId);
        if (lesson) return lesson;
      }
    }
    return undefined;
  }

  // Study Sessions
  getStudySessions(): StudySession[] {
    const data = localStorage.getItem(this.SESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  }

  addStudySession(session: Omit<StudySession, 'id' | 'createdAt'>): StudySession {
    const sessions = this.getStudySessions();
    const newSession: StudySession = {
      ...session,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    sessions.push(newSession);
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
    this.updateStats(newSession);
    return newSession;
  }

  // Statistics
  getStats(): UserStats {
    const data = localStorage.getItem(this.STATS_KEY);
    return data ? JSON.parse(data) : {
      totalStudyTime: 0,
      sessionsCompleted: 0,
      averageScore: 0,
      subjectStats: {}
    };
  }

  private updateStats(session: StudySession): void {
    const stats = this.getStats();
    const lesson = this.getLesson(session.lessonId);
    if (!lesson) return;

    stats.totalStudyTime += Math.round(session.duration / 60); // convertir en minutes
    stats.sessionsCompleted += 1;
    
    // Calculer la moyenne des scores
    const sessions = this.getStudySessions();
    const totalScore = sessions.reduce((sum, s) => sum + (s.score / s.totalQuestions * 100), 0);
    stats.averageScore = totalScore / sessions.length;

    // Stats par matière
    if (!stats.subjectStats[lesson.subjectId]) {
      stats.subjectStats[lesson.subjectId] = {
        studyTime: 0,
        averageScore: 0,
        sessionsCount: 0
      };
    }

    const subjectStats = stats.subjectStats[lesson.subjectId];
    subjectStats.studyTime += Math.round(session.duration / 60);
    subjectStats.sessionsCount += 1;
    
    const subjectSessions = sessions.filter(s => {
      const l = this.getLesson(s.lessonId);
      return l && l.subjectId === lesson.subjectId;
    });
    
    const subjectTotalScore = subjectSessions.reduce((sum, s) => sum + (s.score / s.totalQuestions * 100), 0);
    subjectStats.averageScore = subjectTotalScore / subjectSessions.length;

    localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
  }

  // Settings
  getSettings(): any {
    const data = localStorage.getItem(this.SETTINGS_KEY);
    return data ? JSON.parse(data) : {
      darkMode: false,
      geminiApiKey: '',
      notifications: true
    };
  }

  saveSettings(settings: any): void {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }

  // Utility methods
  searchLessons(query: string): Lesson[] {
    const subjects = this.getSubjects();
    const results: Lesson[] = [];
    
    for (const subject of subjects) {
      for (const chapter of subject.chapters) {
        for (const lesson of chapter.lessons) {
          if (lesson.title.toLowerCase().includes(query.toLowerCase()) ||
              lesson.content.toLowerCase().includes(query.toLowerCase())) {
            results.push(lesson);
          }
        }
      }
    }
    
    return results;
  }

  exportData(): string {
    return JSON.stringify({
      subjects: this.getSubjects(),
      sessions: this.getStudySessions(),
      stats: this.getStats(),
      settings: this.getSettings(),
      exportDate: new Date().toISOString()
    });
  }

  importData(data: string): void {
    try {
      const parsed = JSON.parse(data);
      if (parsed.subjects) localStorage.setItem(this.SUBJECTS_KEY, JSON.stringify(parsed.subjects));
      if (parsed.sessions) localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(parsed.sessions));
      if (parsed.stats) localStorage.setItem(this.STATS_KEY, JSON.stringify(parsed.stats));
      if (parsed.settings) localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(parsed.settings));
    } catch (error) {
      throw new Error('Format de données invalide');
    }
  }
}

export const storage = new StorageManager();
