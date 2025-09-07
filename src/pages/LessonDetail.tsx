
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout/Layout';
import { ProfessionalCard, ProfessionalCardContent } from '@/components/ui/professional-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  BookOpen, 
  Brain, 
  Target, 
  Zap, 
  FileText, 
  Clock,
  Play,
  Award
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { storage } from '@/lib/storage';
import { QuizView } from '@/components/Quiz/QuizView';
import { FlashcardView } from '@/components/Flashcards/FlashcardView';
import { QuizResults } from '@/components/Quiz/QuizResults';

export default function LessonDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addStudySession } = useApp();
  const [lesson, setLesson] = useState<any>(null);
  const [quizResults, setQuizResults] = useState<any>(null);
  const [flashcardResults, setFlashcardResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const lessonData = storage.getLesson(id);
      setLesson(lessonData);
      setLoading(false);
    }
  }, [id]);

  const handleQuizComplete = (score: number, totalQuestions: number, duration: number) => {
    const results = {
      score,
      totalQuestions,
      duration,
      percentage: Math.round((score / totalQuestions) * 100)
    };
    setQuizResults(results);
    
    addStudySession({
      lessonId: id!,
      type: 'qcm',
      score,
      totalQuestions,
      duration
    });
  };

  const handleFlashcardComplete = (easyCount: number, hardCount: number) => {
    const results = {
      easyCount,
      hardCount,
      totalCards: easyCount + hardCount
    };
    setFlashcardResults(results);
    
    addStudySession({
      lessonId: id!,
      type: 'flashcards',
      score: easyCount,
      totalQuestions: easyCount + hardCount,
      duration: 300 // 5 minutes par défaut
    });
  };

  const resetQuiz = () => setQuizResults(null);
  const resetFlashcards = () => setFlashcardResults(null);

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
          <h2 className="text-2xl font-bold text-card-foreground mb-2">Cours introuvable</h2>
          <p className="text-muted-foreground mb-6">
            Le cours que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Link to="/courses">
            <ModernButton variant="gradient" icon={<ArrowLeft />}>
              Retour aux cours
            </ModernButton>
          </Link>
        </div>
      </Layout>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const hasAiContent = lesson.aiGenerated && (
    lesson.aiGenerated.summary || 
    lesson.aiGenerated.qcm || 
    lesson.aiGenerated.flashcards || 
    lesson.aiGenerated.fiche
  );

  return (
    <Layout title={lesson.title}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/courses">
              <ModernButton variant="outline" size="sm" icon={<ArrowLeft />}>
                Retour
              </ModernButton>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{lesson.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDate(lesson.createdAt)}
                </span>
                {lesson.type && (
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded uppercase font-medium">
                    {lesson.type}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {hasAiContent && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {lesson.aiGenerated?.qcm && (
              <ModernButton 
                variant="outline" 
                size="sm"
                icon={<Target />}
                onClick={() => document.getElementById('qcm-tab')?.click()}
              >
                QCM
              </ModernButton>
            )}
            {lesson.aiGenerated?.flashcards && (
              <ModernButton 
                variant="outline" 
                size="sm"
                icon={<Zap />}
                onClick={() => document.getElementById('flashcards-tab')?.click()}
              >
                Flashcards
              </ModernButton>
            )}
            {lesson.aiGenerated?.summary && (
              <ModernButton 
                variant="outline" 
                size="sm"
                icon={<Brain />}
                onClick={() => document.getElementById('summary-tab')?.click()}
              >
                Résumé
              </ModernButton>
            )}
            {lesson.aiGenerated?.fiche && (
              <ModernButton 
                variant="outline" 
                size="sm"
                icon={<FileText />}
                onClick={() => document.getElementById('fiche-tab')?.click()}
              >
                Fiche
              </ModernButton>
            )}
          </div>
        )}

        {/* Content Tabs */}
        <ProfessionalCard>
          <ProfessionalCardContent className="p-6">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                <TabsTrigger value="content" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Contenu
                </TabsTrigger>
                {lesson.aiGenerated?.summary && (
                  <TabsTrigger value="summary" id="summary-tab" className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Résumé
                  </TabsTrigger>
                )}
                {lesson.aiGenerated?.qcm && (
                  <TabsTrigger value="qcm" id="qcm-tab" className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    QCM
                  </TabsTrigger>
                )}
                {lesson.aiGenerated?.flashcards && (
                  <TabsTrigger value="flashcards" id="flashcards-tab" className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Flashcards
                  </TabsTrigger>
                )}
                {lesson.aiGenerated?.fiche && (
                  <TabsTrigger value="fiche" id="fiche-tab" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Fiche
                  </TabsTrigger>
                )}
              </TabsList>

              {/* Contenu original */}
              <TabsContent value="content" className="mt-6">
                <div className="prose max-w-none dark:prose-invert">
                  <h3 className="text-xl font-semibold text-card-foreground mb-4">
                    Contenu du cours
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-6">
                    <p className="text-card-foreground whitespace-pre-wrap leading-relaxed">
                      {lesson.content}
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Résumé IA */}
              {lesson.aiGenerated?.summary && (
                <TabsContent value="summary" className="mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-card-foreground">
                          Résumé automatique
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Généré par l'intelligence artificielle
                        </p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-lg p-6 border border-purple-200/30 dark:border-purple-800/30">
                      <p className="text-card-foreground leading-relaxed">
                        {lesson.aiGenerated.summary.content}
                      </p>
                      {lesson.aiGenerated.summary.keyPoints && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-card-foreground mb-2">Points clés :</h4>
                          <ul className="space-y-1">
                            {lesson.aiGenerated.summary.keyPoints.map((point: string, index: number) => (
                              <li key={index} className="flex items-start gap-2 text-card-foreground">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              )}

              {/* QCM */}
              {lesson.aiGenerated?.qcm && (
                <TabsContent value="qcm" className="mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-card-foreground">
                            Quiz QCM
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Testez vos connaissances
                          </p>
                        </div>
                      </div>
                      {quizResults && (
                        <ModernButton 
                          variant="outline" 
                          size="sm"
                          onClick={resetQuiz}
                          icon={<Play />}
                        >
                          Recommencer
                        </ModernButton>
                      )}
                    </div>

                    {quizResults ? (
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-6 border border-green-200/30 dark:border-green-800/30">
                        <div className="flex items-center gap-3 mb-4">
                          <Award className="w-8 h-8 text-green-600" />
                          <div>
                            <h4 className="text-lg font-semibold text-card-foreground">
                              Quiz terminé !
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Excellent travail !
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="bg-background/50 rounded-lg p-3">
                            <div className="text-2xl font-bold text-green-600">
                              {quizResults.score}
                            </div>
                            <div className="text-xs text-muted-foreground">Correct</div>
                          </div>
                          <div className="bg-background/50 rounded-lg p-3">
                            <div className="text-2xl font-bold text-orange-600">
                              {quizResults.totalQuestions - quizResults.score}
                            </div>
                            <div className="text-xs text-muted-foreground">Incorrect</div>
                          </div>
                          <div className="bg-background/50 rounded-lg p-3">
                            <div className="text-2xl font-bold text-primary">
                              {quizResults.percentage}%
                            </div>
                            <div className="text-xs text-muted-foreground">Score</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <QuizView 
                        questions={lesson.aiGenerated.qcm.questions}
                        onComplete={handleQuizComplete}
                      />
                    )}
                  </div>
                </TabsContent>
              )}

              {/* Flashcards */}
              {lesson.aiGenerated?.flashcards && (
                <TabsContent value="flashcards" className="mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-card-foreground">
                            Flashcards
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Mémorisation active
                          </p>
                        </div>
                      </div>
                      {flashcardResults && (
                        <ModernButton 
                          variant="outline" 
                          size="sm"
                          onClick={resetFlashcards}
                          icon={<Play />}
                        >
                          Recommencer
                        </ModernButton>
                      )}
                    </div>

                    {flashcardResults ? (
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg p-6 border border-blue-200/30 dark:border-blue-800/30">
                        <div className="flex items-center gap-3 mb-4">
                          <Award className="w-8 h-8 text-blue-600" />
                          <div>
                            <h4 className="text-lg font-semibold text-card-foreground">
                              Session terminée !
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Beau travail !
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="bg-background/50 rounded-lg p-3">
                            <div className="text-2xl font-bold text-green-600">
                              {flashcardResults.easyCount}
                            </div>
                            <div className="text-xs text-muted-foreground">Faciles</div>
                          </div>
                          <div className="bg-background/50 rounded-lg p-3">
                            <div className="text-2xl font-bold text-orange-600">
                              {flashcardResults.hardCount}
                            </div>
                            <div className="text-xs text-muted-foreground">Difficiles</div>
                          </div>
                          <div className="bg-background/50 rounded-lg p-3">
                            <div className="text-2xl font-bold text-primary">
                              {flashcardResults.totalCards}
                            </div>
                            <div className="text-xs text-muted-foreground">Total</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <FlashcardView 
                        cards={lesson.aiGenerated.flashcards.cards}
                        onComplete={handleFlashcardComplete}
                      />
                    )}
                  </div>
                </TabsContent>
              )}

              {/* Fiche de révision */}
              {lesson.aiGenerated?.fiche && (
                <TabsContent value="fiche" className="mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-card-foreground">
                          Fiche de révision
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Synthèse pour réviser
                        </p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-lg p-6 border border-orange-200/30 dark:border-orange-800/30">
                      <div className="prose max-w-none dark:prose-invert">
                        <p className="text-card-foreground leading-relaxed">
                          {lesson.aiGenerated.fiche.content}
                        </p>
                        {lesson.aiGenerated.fiche.sections && (
                          <div className="mt-4">
                            <h4 className="font-semibold text-card-foreground mb-2">Sections :</h4>
                            <div className="space-y-2">
                              {lesson.aiGenerated.fiche.sections.map((section: string, index: number) => (
                                <div key={index} className="bg-background/50 rounded-lg p-3">
                                  {section}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </ProfessionalCardContent>
        </ProfessionalCard>
      </div>
    </Layout>
  );
}
