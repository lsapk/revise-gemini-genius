
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout/Layout';
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useApp } from '@/contexts/AppContext';
import { storage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar,
  Clock,
  BookOpen,
  Target,
  Plus,
  CheckCircle2,
  Edit2,
  Trash2,
  Brain,
  Zap
} from 'lucide-react';

interface StudySession {
  id: string;
  subject: string;
  subjectId: string;
  lesson: string;
  lessonId?: string;
  time: string;
  duration: number;
  type: 'Révision' | 'Quiz' | 'Flashcards' | 'Fiche';
  completed: boolean;
  date: string;
}

export default function Planning() {
  const { subjects } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSession, setNewSession] = useState<Partial<StudySession>>({
    time: '14:00',
    duration: 30,
    type: 'Révision',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadSessions();
  }, [selectedDate]);

  const loadSessions = () => {
    try {
      const savedSessions = localStorage.getItem('revise_genius_sessions');
      if (savedSessions) {
        const allSessions = JSON.parse(savedSessions);
        const todaySessions = allSessions.filter((session: StudySession) => 
          session.date === selectedDate.toISOString().split('T')[0]
        );
        setSessions(todaySessions);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des sessions:', error);
    }
  };

  const saveSessions = (updatedSessions: StudySession[]) => {
    try {
      const savedSessions = localStorage.getItem('revise_genius_sessions');
      const allSessions = savedSessions ? JSON.parse(savedSessions) : [];
      
      // Remove old sessions for this date and add new ones
      const otherDateSessions = allSessions.filter((session: StudySession) => 
        session.date !== selectedDate.toISOString().split('T')[0]
      );
      
      const newAllSessions = [...otherDateSessions, ...updatedSessions];
      localStorage.setItem('revise_genius_sessions', JSON.stringify(newAllSessions));
      setSessions(updatedSessions);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des sessions:', error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Révision': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Quiz': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Flashcards': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Fiche': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const addSession = () => {
    if (!newSession.subject || !newSession.lesson || !newSession.time) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    const session: StudySession = {
      id: Date.now().toString(),
      subject: newSession.subject!,
      subjectId: newSession.subjectId!,
      lesson: newSession.lesson!,
      lessonId: newSession.lessonId,
      time: newSession.time!,
      duration: newSession.duration || 30,
      type: newSession.type as 'Révision' | 'Quiz' | 'Flashcards' | 'Fiche',
      completed: false,
      date: selectedDate.toISOString().split('T')[0]
    };

    const updatedSessions = [...sessions, session].sort((a, b) => a.time.localeCompare(b.time));
    saveSessions(updatedSessions);
    
    setIsAddDialogOpen(false);
    setNewSession({
      time: '14:00',
      duration: 30,
      type: 'Révision',
      date: new Date().toISOString().split('T')[0]
    });

    toast({
      title: "Session ajoutée",
      description: "Votre session de révision a été programmée."
    });
  };

  const toggleSessionComplete = (sessionId: string) => {
    const updatedSessions = sessions.map(session => 
      session.id === sessionId 
        ? { ...session, completed: !session.completed }
        : session
    );
    saveSessions(updatedSessions);
  };

  const deleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(session => session.id !== sessionId);
    saveSessions(updatedSessions);
    toast({
      title: "Session supprimée",
      description: "La session a été supprimée de votre planning."
    });
  };

  const startSession = (session: StudySession) => {
    if (session.lessonId) {
      navigate(`/lesson/${session.lessonId}`);
    } else {
      toast({
        title: "Cours non trouvé",
        description: "Cette session fait référence à un cours qui n'existe plus.",
        variant: "destructive"
      });
    }
  };

  const generateSmartPlan = () => {
    const allLessons = subjects.flatMap(subject => 
      subject.chapters.flatMap(chapter => 
        chapter.lessons.map(lesson => ({
          ...lesson,
          subjectName: subject.name,
          subjectId: subject.id,
          chapterId: chapter.id
        }))
      )
    );

    if (allLessons.length === 0) {
      toast({
        title: "Aucun cours disponible",
        description: "Ajoutez d'abord des cours pour générer un planning intelligent.",
        variant: "destructive"
      });
      return;
    }

    const newSessions: StudySession[] = [];
    const types: ('Révision' | 'Quiz' | 'Flashcards' | 'Fiche')[] = ['Révision', 'Quiz', 'Flashcards', 'Fiche'];
    
    allLessons.forEach((lesson, index) => {
      if (index < 4) { // Limite à 4 sessions par jour
        const baseTime = 14 + (index * 2); // 14h, 16h, 18h, 20h
        const session: StudySession = {
          id: `smart_${Date.now()}_${index}`,
          subject: lesson.subjectName,
          subjectId: lesson.subjectId,
          lesson: lesson.title,
          lessonId: lesson.id,
          time: `${baseTime.toString().padStart(2, '0')}:00`,
          duration: 30 + (index * 15), // 30, 45, 60, 75 minutes
          type: types[index % types.length],
          completed: false,
          date: selectedDate.toISOString().split('T')[0]
        };
        newSessions.push(session);
      }
    });

    saveSessions(newSessions);
    toast({
      title: "Planning généré",
      description: `${newSessions.length} sessions ont été programmées intelligemment.`
    });
  };

  return (
    <Layout title="Planning de révision">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        
        {/* Header avec statistiques du jour */}
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Aujourd'hui - {selectedDate.toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{sessions.length}</p>
                <p className="text-sm text-muted-foreground">Sessions prévues</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">
                  {sessions.filter(s => s.completed).length}
                </p>
                <p className="text-sm text-muted-foreground">Terminées</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
                <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">
                  {sessions.reduce((total, session) => total + session.duration, 0)}min
                </p>
                <p className="text-sm text-muted-foreground">Temps total</p>
              </div>
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Sessions du jour */}
        <ModernCard>
          <ModernCardHeader>
            <div className="flex items-center justify-between">
              <ModernCardTitle>Sessions du jour</ModernCardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={generateSmartPlan} className="gap-2">
                  <Brain className="w-4 h-4" />
                  Planning IA
                </Button>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Ajouter
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter une session de révision</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="subject">Matière</Label>
                        <Select 
                          value={newSession.subjectId} 
                          onValueChange={(value) => {
                            const subject = subjects.find(s => s.id === value);
                            setNewSession(prev => ({ 
                              ...prev, 
                              subjectId: value, 
                              subject: subject?.name || '',
                              lesson: '',
                              lessonId: undefined 
                            }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir une matière" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map(subject => (
                              <SelectItem key={subject.id} value={subject.id}>
                                {subject.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {newSession.subjectId && (
                        <div className="space-y-2">
                          <Label htmlFor="lesson">Cours</Label>
                          <Select 
                            value={newSession.lessonId} 
                            onValueChange={(value) => {
                              const subject = subjects.find(s => s.id === newSession.subjectId);
                              const lesson = subject?.chapters
                                .flatMap(c => c.lessons)
                                .find(l => l.id === value);
                              setNewSession(prev => ({ 
                                ...prev, 
                                lessonId: value, 
                                lesson: lesson?.title || '' 
                              }));
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choisir un cours" />
                            </SelectTrigger>
                            <SelectContent>
                              {subjects
                                .find(s => s.id === newSession.subjectId)
                                ?.chapters.flatMap(chapter => 
                                  chapter.lessons.map(lesson => (
                                    <SelectItem key={lesson.id} value={lesson.id}>
                                      {lesson.title}
                                    </SelectItem>
                                  ))
                                )}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="time">Heure</Label>
                          <Input
                            id="time"
                            type="time"
                            value={newSession.time}
                            onChange={(e) => setNewSession(prev => ({ ...prev, time: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="duration">Durée (min)</Label>
                          <Input
                            id="duration"
                            type="number"
                            min="5"
                            max="180"
                            value={newSession.duration}
                            onChange={(e) => setNewSession(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="type">Type de révision</Label>
                        <Select 
                          value={newSession.type} 
                          onValueChange={(value) => setNewSession(prev => ({ ...prev, type: value as any }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Révision">Révision</SelectItem>
                            <SelectItem value="Quiz">Quiz</SelectItem>
                            <SelectItem value="Flashcards">Flashcards</SelectItem>
                            <SelectItem value="Fiche">Fiche</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button onClick={addSession} className="w-full">
                        Ajouter la session
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </ModernCardHeader>
          <ModernCardContent>
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucune session programmée pour aujourd'hui</p>
                <p className="text-sm">Cliquez sur "Ajouter" ou "Planning IA" pour commencer</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-4 rounded-xl border transition-all hover:shadow-md ${
                      session.completed 
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
                        : 'bg-card border-border hover:border-primary/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleSessionComplete(session.id)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            session.completed 
                              ? 'bg-green-500 border-green-500' 
                              : 'border-muted-foreground hover:border-primary'
                          }`}
                        >
                          {session.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </button>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-medium ${session.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {session.lesson}
                            </h3>
                            <Badge className={getTypeColor(session.type)}>
                              {session.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {session.subject}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {session.time} ({session.duration}min)
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!session.completed && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => startSession(session)}
                            className="gap-1"
                          >
                            <Zap className="w-3 h-3" />
                            Commencer
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteSession(session.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ModernCardContent>
        </ModernCard>

        {/* Suggestions d'optimisation */}
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle>Suggestions pour optimiser vos révisions</ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <p className="text-sm">
                  <strong>Conseil :</strong> Alternez entre différents types de révision (lecture, quiz, flashcards) 
                  pour améliorer la mémorisation.
                </p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                <p className="text-sm">
                  <strong>Astuce :</strong> Planifiez des sessions courtes mais régulières plutôt que de longues 
                  sessions espacées.
                </p>
              </div>
            </div>
          </ModernCardContent>
        </ModernCard>
      </div>
    </Layout>
  );
}
