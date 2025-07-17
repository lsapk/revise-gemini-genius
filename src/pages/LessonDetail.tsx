
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { storage, Lesson } from '@/lib/storage';
import { useApp } from '@/contexts/AppContext';
import { QuizView } from '@/components/Quiz/QuizView';
import { FlashcardView } from '@/components/Flashcards/FlashcardView';
import { 
  BookOpen, 
  Brain, 
  Zap, 
  FileText, 
  Clock,
  Play,
  RotateCcw,
  CheckCircle,
  Target
} from 'lucide-react';

export default function LessonDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addStudySession } = useApp();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState('content');
  const [quizResults, setQuizResults] = useState<any>(null);
  const [flashcardResults, setFlashcardResults] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const foundLesson = storage.getLesson(id);
      if (foundLesson) {
        setLesson(foundLesson);
      } else {
        navigate('/');
      }
    }
  }, [id, navigate]);

  const handleQuizComplete = (score: number, totalQuestions: number, duration: number) => {
    const results = { score, totalQuestions, duration };
    setQuizResults(results);
    
    if (lesson) {
      addStudySession({
        lessonId: lesson.id,
        type: 'qcm',
        score,
        totalQuestions,
        duration
      });
    }
  };

  const handleFlashcardComplete = (easyCount: number, hardCount: number) => {
    const results = { easyCount, hardCount };
    setFlashcardResults(results);
    
    if (lesson) {
      addStudySession({
        lessonId: lesson.id,
        type: 'flashcards',
        score: easyCount,
        totalQuestions: easyCount + hardCount,
        duration: 300 // Estimation
      });
    }
  };

  const resetQuiz = () => {
    setQuizResults(null);
  };

  const resetFlashcards = () => {
    setFlashcardResults(null);
  };

  if (!lesson) {
    return (
      <Layout title="Chargement..." showBack>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Chargement de la leçon...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const hasAiContent = lesson.aiGenerated && (
    lesson.aiGenerated.summary || 
    lesson.aiGenerated.qcm || 
    lesson.aiGenerated.flashcards || 
    lesson.aiGenerated.fiche
  );

  return (
    <Layout title={lesson.title} showBack>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* En-tête de la leçon */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">{lesson.title}</CardTitle>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(lesson.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <Badge variant="outline">{lesson.type}</Badge>
                  {hasAiContent && (
                    <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                      <Brain className="w-3 h-3 mr-1" />
                      IA activée
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Contenu de la leçon avec onglets */}
        <Card>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5">
                <TabsTrigger value="content" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Contenu</span>
                </TabsTrigger>
                {lesson.aiGenerated?.summary && (
                  <TabsTrigger value="summary" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">Résumé</span>
                  </TabsTrigger>
                )}
                {lesson.aiGenerated?.qcm && (
                  <TabsTrigger value="qcm" className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span className="hidden sm:inline">QCM</span>
                  </TabsTrigger>
                )}
                {lesson.aiGenerated?.flashcards && (
                  <TabsTrigger value="flashcards" className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span className="hidden sm:inline">Flashcards</span>
                  </TabsTrigger>
                )}
                {lesson.aiGenerated?.fiche && (
                  <TabsTrigger value="fiche" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">Fiche</span>
                  </TabsTrigger>
                )}
              </TabsList>

              {/* Contenu original */}
              <TabsContent value="content" className="p-6">
                <div className="prose dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap">{lesson.content}</div>
                </div>
              </TabsContent>

              {/* Résumé IA */}
              {lesson.aiGenerated?.summary && (
                <TabsContent value="summary" className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Brain className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">Résumé généré par IA</h3>
                    </div>
                    <div className="prose dark:prose-invert max-w-none">
                      <h4>{lesson.aiGenerated.summary.title}</h4>
                      <div className="whitespace-pre-wrap">{lesson.aiGenerated.summary.content}</div>
                    </div>
                  </div>
                </TabsContent>
              )}

              {/* QCM */}
              {lesson.aiGenerated?.qcm && (
                <TabsContent value="qcm" className="p-6">
                  {quizResults ? (
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                      </div>
                      <h3 className="text-xl font-bold">Quiz terminé !</h3>
                      <p className="text-lg">
                        Score: {quizResults.score}/{quizResults.totalQuestions} 
                        ({Math.round((quizResults.score / quizResults.totalQuestions) * 100)}%)
                      </p>
                      <Button onClick={resetQuiz} variant="outline">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Recommencer
                      </Button>
                    </div>
                  ) : (
                    <QuizView
                      questions={lesson.aiGenerated.qcm.questions}
                      onComplete={handleQuizComplete}
                      title="QCM - Test de connaissances"
                    />
                  )}
                </TabsContent>
              )}

              {/* Flashcards */}
              {lesson.aiGenerated?.flashcards && (
                <TabsContent value="flashcards" className="p-6">
                  {flashcardResults ? (
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-10 h-10 text-blue-500" />
                      </div>
                      <h3 className="text-xl font-bold">Session terminée !</h3>
                      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                        <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{flashcardResults.easyCount}</p>
                          <p className="text-sm">Faciles</p>
                        </div>
                        <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                          <p className="text-2xl font-bold text-orange-600">{flashcardResults.hardCount}</p>
                          <p className="text-sm">Difficiles</p>
                        </div>
                      </div>
                      <Button onClick={resetFlashcards} variant="outline">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Recommencer
                      </Button>
                    </div>
                  ) : (
                    <FlashcardView
                      cards={lesson.aiGenerated.flashcards.cards}
                      onComplete={handleFlashcardComplete}
                      title="Flashcards - Mémorisation"
                    />
                  )}
                </TabsContent>
              )}

              {/* Fiche de révision */}
              {lesson.aiGenerated?.fiche && (
                <TabsContent value="fiche" className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">{lesson.aiGenerated.fiche.title}</h3>
                    </div>
                    {lesson.aiGenerated.fiche.sections.map((section: any, index: number) => (
                      <div key={index} className="space-y-3">
                        <h4 className="text-md font-medium border-b pb-2">{section.title}</h4>
                        <ul className="space-y-2">
                          {section.content.map((item: string, itemIndex: number) => (
                            <li key={itemIndex} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        {hasAiContent && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {lesson.aiGenerated?.qcm && (
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('qcm')}
                className="h-16 flex-col gap-2"
              >
                <Target className="w-5 h-5" />
                <span className="text-xs">Faire le QCM</span>
              </Button>
            )}
            {lesson.aiGenerated?.flashcards && (
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('flashcards')}
                className="h-16 flex-col gap-2"
              >
                <Zap className="w-5 h-5" />
                <span className="text-xs">Flashcards</span>
              </Button>
            )}
            {lesson.aiGenerated?.summary && (
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('summary')}
                className="h-16 flex-col gap-2"
              >
                <FileText className="w-5 h-5" />
                <span className="text-xs">Voir résumé</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
