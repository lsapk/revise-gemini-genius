
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { storage, Subject, Chapter, Lesson } from '@/lib/storage';
import { useApp } from '@/contexts/AppContext';
import { 
  BookOpen, 
  Plus, 
  Clock, 
  Target,
  ChevronRight,
  Brain,
  FileText,
  Zap,
  BarChart3
} from 'lucide-react';

export default function SubjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { refreshSubjects } = useApp();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  useEffect(() => {
    if (id) {
      const subjects = storage.getSubjects();
      const foundSubject = subjects.find(s => s.id === id);
      if (foundSubject) {
        setSubject(foundSubject);
        if (foundSubject.chapters.length > 0) {
          setSelectedChapter(foundSubject.chapters[0]);
        }
      } else {
        navigate('/');
      }
    }
  }, [id, navigate]);

  const handleLessonClick = (lesson: Lesson) => {
    navigate(`/lesson/${lesson.id}`);
  };

  const handleCreateLesson = () => {
    navigate('/add');
  };

  if (!subject) {
    return (
      <Layout title="Chargement..." showBack>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Chargement de la matière...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const totalLessons = subject.chapters.reduce((acc, chapter) => acc + chapter.lessons.length, 0);
  const progressPercentage = totalLessons > 0 ? (totalLessons * 25) : 0; // Simulation d'un progrès

  return (
    <Layout 
      title={subject.name} 
      showBack
      headerActions={
        <Button onClick={handleCreateLesson} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      }
    >
      <div className="p-4 space-y-6 max-w-4xl mx-auto">
        {/* En-tête de la matière */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{subject.name}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{subject.chapters.length} chapitre{subject.chapters.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>{totalLessons} leçon{totalLessons > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                style={{ backgroundColor: subject.color }}
              >
                {subject.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Progression globale</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button 
            variant="outline" 
            className="h-16 flex-col gap-2"
            onClick={() => navigate('/add')}
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs">Nouveau cours</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-16 flex-col gap-2"
            disabled={totalLessons === 0}
          >
            <Brain className="w-5 h-5" />
            <span className="text-xs">Quiz IA</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-16 flex-col gap-2"
            disabled={totalLessons === 0}
          >
            <Zap className="w-5 h-5" />
            <span className="text-xs">Révision</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-16 flex-col gap-2"
            onClick={() => navigate('/stats')}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs">Statistiques</span>
          </Button>
        </div>

        {/* Liste des chapitres et leçons */}
        {subject.chapters.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">Aucun cours pour le moment</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Commencez par ajouter votre premier cours dans cette matière
              </p>
              <Button onClick={handleCreateLesson}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un cours
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {subject.chapters.map((chapter) => (
              <Card key={chapter.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{chapter.name}</span>
                    <Badge variant="secondary">
                      {chapter.lessons.length} leçon{chapter.lessons.length > 1 ? 's' : ''}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {chapter.lessons.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Aucune leçon dans ce chapitre</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {chapter.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          onClick={() => handleLessonClick(lesson)}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">{lesson.title}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {new Date(lesson.createdAt).toLocaleDateString('fr-FR')}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {lesson.type}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
