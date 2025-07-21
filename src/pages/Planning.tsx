
import { useState } from 'react';
import { Layout } from '@/components/Layout/Layout';
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { 
  Calendar,
  Clock,
  BookOpen,
  Target,
  Plus,
  CheckCircle2
} from 'lucide-react';

export default function Planning() {
  const { subjects } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Données d'exemple pour la planification
  const plannedSessions = [
    {
      id: '1',
      subject: 'Mathématiques',
      lesson: 'Équations du second degré',
      time: '14:00',
      duration: 45,
      type: 'Révision',
      completed: false
    },
    {
      id: '2',
      subject: 'Histoire',
      lesson: 'La Révolution française',
      time: '16:30',
      duration: 30,
      type: 'Quiz',
      completed: true
    },
    {
      id: '3',
      subject: 'Anglais',
      lesson: 'Present Perfect',
      time: '19:00',
      duration: 20,
      type: 'Flashcards',
      completed: false
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Révision': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Quiz': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Flashcards': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
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
                <p className="text-2xl font-bold text-blue-600">{plannedSessions.length}</p>
                <p className="text-sm text-muted-foreground">Sessions prévues</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">
                  {plannedSessions.filter(s => s.completed).length}
                </p>
                <p className="text-sm text-muted-foreground">Terminées</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
                <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">
                  {plannedSessions.reduce((total, session) => total + session.duration, 0)}min
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
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Ajouter une session
              </Button>
            </div>
          </ModernCardHeader>
          <ModernCardContent>
            <div className="space-y-3">
              {plannedSessions.map((session) => (
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
                      <div className={`w-2 h-2 rounded-full ${
                        session.completed ? 'bg-green-500' : 'bg-primary'
                      }`} />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{session.lesson}</h3>
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
                      {session.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Button size="sm" variant="outline">
                          Commencer
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
