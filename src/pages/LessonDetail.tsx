import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Play, 
  BookOpen, 
  Brain, 
  CreditCard, 
  FileText, 
  Calendar,
  Clock,
  Award,
  Target,
  Zap
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { QuizView } from '@/components/Quiz/QuizView';
import { FlashcardView } from '@/components/Flashcards/FlashcardView';
import { QuizResults } from '@/components/Quiz/QuizResults';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';

export default function LessonDetail() {
  const { id } = useParams<{ id: string }>();
  const { getLessonById, loading: dataLoading } = useApp();
  const [lesson, setLesson] = useState<any>(null);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDuration, setQuizDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (id && !dataLoading) {
      const lessonData = getLessonById(id);
      setLesson(lessonData);
      setLoading(false);
    }
  }, [id, getLessonById, dataLoading]);

  const handleQuizComplete = (score: number, totalQuestions: number, duration: number) => {
    setQuizScore(score);
    setQuizDuration(duration);
    setShowQuizResults(true);
  };

  const handleFlashcardsComplete = (easyCount: number, hardCount: number) => {
    console.log('Flashcards terminées:', { easyCount, hardCount });
  };

  if (loading) {
    return (
      <Layout title="Chargement...">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement du cours...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!lesson) {
    return (
      <Layout title="Cours introuvable">
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Cours introuvable</h2>
          <p className="text-muted-foreground mb-6">
            Le cours que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Link to="/courses">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour aux cours
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  // Extraire les données AI du cours
  const aiData = lesson.data || lesson.aiGenerated || {};
  const qcmQuestions = aiData.qcm?.questions || [];
  const flashcards = aiData.flashcards?.cards || [];
  const summary = aiData.summary?.content || aiData.summary?.title || '';
  const fiche = aiData.fiche || {};

  return (
    <Layout title={lesson.title} className="space-y-6">
      {/* Header avec navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/courses">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {!isMobile && "Retour"}
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">{lesson.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{lesson.type}</Badge>
              <span className="text-sm text-muted-foreground">
                {format(new Date(lesson.created_at), 'dd MMMM yyyy', { locale: fr })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className={`w-full ${isMobile ? 'flex-wrap gap-1' : 'grid grid-cols-5'}`}>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {!isMobile && "Aperçu"}
              </TabsTrigger>
              {summary && (
                <TabsTrigger value="summary" className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  {!isMobile && "Résumé"}
                </TabsTrigger>
              )}
              {qcmQuestions.length > 0 && (
                <TabsTrigger value="quiz" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  {!isMobile && "Quiz"}
                </TabsTrigger>
              )}
              {flashcards.length > 0 && (
                <TabsTrigger value="flashcards" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  {!isMobile && "Cartes"}
                </TabsTrigger>
              )}
              {(fiche.sections || fiche.content) && (
                <TabsTrigger value="fiche" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {!isMobile && "Fiche"}
                </TabsTrigger>
              )}
            </TabsList>

            {/* Contenu original */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>📚 Contenu du cours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {lesson.content}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Statistiques rapides */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {summary && (
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <Brain className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium">Résumé IA</p>
                      <p className="text-xs text-muted-foreground">Généré</p>
                    </CardContent>
                  </Card>
                )}
                {qcmQuestions.length > 0 && (
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">{qcmQuestions.length} Questions</p>
                      <p className="text-xs text-muted-foreground">Quiz QCM</p>
                    </CardContent>
                  </Card>
                )}
                {flashcards.length > 0 && (
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">{flashcards.length} Cartes</p>
                      <p className="text-xs text-muted-foreground">Flashcards</p>
                    </CardContent>
                  </Card>
                )}
                {(fiche.sections || fiche.content) && (
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <FileText className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">Fiche</p>
                      <p className="text-xs text-muted-foreground">Révision</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Résumé IA */}
            {summary && (
              <TabsContent value="summary" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-primary" />
                      Résumé automatique
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      {typeof summary === 'string' ? (
                        <p className="text-muted-foreground leading-relaxed">{summary}</p>
                      ) : (
                        <div>
                          {summary.title && <h3 className="font-semibold mb-3">{summary.title}</h3>}
                          {summary.content && (
                            <div 
                              className="text-muted-foreground leading-relaxed"
                              dangerouslySetInnerHTML={{ 
                                __html: summary.content.replace(/\n/g, '<br>').replace(/##\s+(.*?)\n/g, '<h3 class="font-semibold mt-4 mb-2">$1</h3>') 
                              }} 
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Quiz QCM */}
            {qcmQuestions.length > 0 && (
              <TabsContent value="quiz">
                {!showQuizResults ? (
                  <QuizView
                    questions={qcmQuestions}
                    onComplete={handleQuizComplete}
                    title={`Quiz - ${lesson.title}`}
                  />
                ) : (
                  <QuizResults
                    score={quizScore}
                    totalQuestions={qcmQuestions.length}
                    duration={quizDuration}
                    onRetry={() => setShowQuizResults(false)}
                  />
                )}
              </TabsContent>
            )}

            {/* Flashcards */}
            {flashcards.length > 0 && (
              <TabsContent value="flashcards">
                <FlashcardView
                  cards={flashcards}
                  onComplete={handleFlashcardsComplete}
                  title={`Flashcards - ${lesson.title}`}
                />
              </TabsContent>
            )}

            {/* Fiche de révision */}
            {(fiche.sections || fiche.content) && (
              <TabsContent value="fiche" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-orange-600" />
                      Fiche de révision
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {fiche.title && <h3 className="font-semibold text-lg">{fiche.title}</h3>}
                      {fiche.sections && Array.isArray(fiche.sections) ? (
                        fiche.sections.map((section: any, index: number) => (
                          <div key={index} className="border-l-4 border-primary pl-4">
                            <h4 className="font-medium mb-2">{section.title || `Section ${index + 1}`}</h4>
                            {Array.isArray(section.content) ? (
                              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                {section.content.map((item: string, itemIndex: number) => (
                                  <li key={itemIndex}>{item}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-muted-foreground">{section.content || section}</p>
                            )}
                          </div>
                        ))
                      ) : fiche.content ? (
                        <div className="text-muted-foreground leading-relaxed">
                          <div dangerouslySetInnerHTML={{ 
                            __html: fiche.content.replace(/\n/g, '<br>').replace(/##\s+(.*?)\n/g, '<h3 class="font-semibold mt-4 mb-2">$1</h3>') 
                          }} />
                        </div>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </Layout>
  );
}