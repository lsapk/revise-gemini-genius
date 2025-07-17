
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout/Layout';
import { ContentTypeSelector } from '@/components/Add/ContentTypeSelector';
import { TextInput } from '@/components/Add/TextInput';
import { FileUpload } from '@/components/Add/FileUpload';
import { ContentAnalysisForm } from '@/components/Add/ContentAnalysisForm';
import { ProcessingSteps } from '@/components/Add/ProcessingSteps';
import { SuccessResults } from '@/components/Add/SuccessResults';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { callGemini } from '@/lib/gemini';
import { storage } from '@/lib/storage';
import { useApp } from '@/contexts/AppContext';
import { Sparkles, ArrowLeft, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AddContent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshSubjects } = useApp();
  
  const [step, setStep] = useState<'type' | 'content' | 'details' | 'processing' | 'success'>('type');
  const [contentType, setContentType] = useState<'text' | 'pdf' | 'image' | 'url' | null>(null);
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(1);
  const [lessonTitle, setLessonTitle] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newChapterName, setNewChapterName] = useState('');
  const [aiResults, setAiResults] = useState<any>(null);

  const handleContentTypeSelect = (type: 'text' | 'pdf' | 'image' | 'url') => {
    setContentType(type);
    setStep('content');
  };

  const handleContentSubmit = async (submittedContent: string) => {
    setContent(submittedContent);
    setIsProcessing(true);
    setProcessingStep(1);

    try {
      // Générer un titre automatique si aucun n'est fourni
      if (!lessonTitle) {
        const words = submittedContent.split(' ').slice(0, 8).join(' ');
        setLessonTitle(words + (submittedContent.split(' ').length > 8 ? '...' : ''));
      }

      setStep('details');
      toast({
        title: "Contenu analysé",
        description: "Votre contenu est prêt à être organisé.",
      });
    } catch (error) {
      console.error('Erreur lors du traitement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter le contenu. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveLesson = async () => {
    if (!lessonTitle || !content) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setStep('processing');
    setProcessingStep(1);

    try {
      // Créer ou récupérer la matière
      let subjectId = selectedSubject;
      if (!subjectId && newSubjectName) {
        setProcessingStep(2);
        const newSubject = storage.addSubject({
          name: newSubjectName,
          color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
        });
        subjectId = newSubject.id;
      }

      if (!subjectId) {
        const defaultSubject = storage.addSubject({
          name: "Matière générale",
          color: `hsl(220, 70%, 60%)`
        });
        subjectId = defaultSubject.id;
      }

      // Créer ou récupérer le chapitre
      let chapterId = selectedChapter;
      const subject = storage.getSubjects().find(s => s.id === subjectId);
      
      if (!chapterId && newChapterName && subject) {
        setProcessingStep(3);
        const existingChapter = subject.chapters.find(c => c.name === newChapterName);
        if (existingChapter) {
          chapterId = existingChapter.id;
        } else {
          const newChapter = storage.addChapter(subjectId, {
            name: newChapterName,
            lessons: []
          });
          chapterId = newChapter.id;
        }
      }

      if (!chapterId) {
        const defaultChapter = storage.addChapter(subjectId, {
          name: "Chapitre principal",
          lessons: []
        });
        chapterId = defaultChapter.id;
      }

      // Créer la leçon
      setProcessingStep(4);
      const lesson = storage.addLesson(chapterId, {
        title: lessonTitle,
        content: content,
        type: contentType || 'text'
      });

      // Générer le contenu IA en arrière-plan
      setProcessingStep(5);
      const aiGenerations = await Promise.allSettled([
        callGemini(content, 'summary'),
        callGemini(content, 'qcm'),
        callGemini(content, 'flashcards'),
        callGemini(content, 'fiche')
      ]);

      const results = aiGenerations.map((result, index) => {
        if (result.status === 'fulfilled' && result.value.success) {
          return result.value.data;
        }
        console.error(`AI generation ${index} failed:`, result);
        return null;
      });

      // Sauvegarder les résultats IA
      storage.updateLesson(lesson.id, {
        aiGenerated: {
          summary: results[0],
          qcm: results[1],
          flashcards: results[2],
          fiche: results[3]
        }
      });

      setAiResults({
        summary: !!results[0],
        qcm: !!results[1],
        flashcards: !!results[2],
        fiche: !!results[3]
      });

      refreshSubjects();
      setStep('success');

      toast({
        title: "Succès !",
        description: "Votre cours a été ajouté et analysé par l'IA.",
      });

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le cours. Veuillez réessayer.",
        variant: "destructive"
      });
      setStep('details');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setStep('type');
    setContentType(null);
    setContent('');
    setLessonTitle('');
    setSelectedSubject('');
    setSelectedChapter('');
    setNewSubjectName('');
    setNewChapterName('');
    setAiResults(null);
    setProcessingStep(1);
  };

  return (
    <Layout title="Ajouter un cours" showBack>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Étape 1: Sélection du type de contenu */}
          {step === 'type' && (
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold">Ajouter un nouveau cours</h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  Choisissez la source de votre cours pour commencer l'analyse IA
                </p>
              </div>
              <ContentTypeSelector 
                selectedType={contentType}
                onSelect={handleContentTypeSelect}
              />
            </div>
          )}

          {/* Étape 2: Saisie du contenu */}
          {step === 'content' && contentType && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setStep('type')}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <h2 className="text-2xl font-bold">Importer votre contenu</h2>
                  <p className="text-muted-foreground">
                    L'IA analysera automatiquement votre contenu
                  </p>
                </div>
              </div>

              {contentType === 'text' && (
                <TextInput 
                  onSubmit={handleContentSubmit}
                  isProcessing={isProcessing}
                />
              )}

              {(contentType === 'pdf' || contentType === 'image') && (
                <FileUpload 
                  type={contentType}
                  onSubmit={handleContentSubmit}
                  isProcessing={isProcessing}
                />
              )}

              {contentType === 'url' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="url">URL du contenu</Label>
                    <Input
                      id="url"
                      placeholder="https://example.com/cours"
                      className="mt-1"
                    />
                  </div>
                  <Button className="w-full" onClick={() => handleContentSubmit("Contenu importé depuis URL")}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyser l'URL
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Étape 3: Détails de la leçon */}
          {step === 'details' && (
            <ContentAnalysisForm
              lessonTitle={lessonTitle}
              setLessonTitle={setLessonTitle}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              selectedChapter={selectedChapter}
              setSelectedChapter={setSelectedChapter}
              newSubjectName={newSubjectName}
              setNewSubjectName={setNewSubjectName}
              newChapterName={newChapterName}
              setNewChapterName={setNewChapterName}
              onSave={handleSaveLesson}
              isProcessing={isProcessing}
            />
          )}

          {/* Étape 4: Traitement en cours */}
          {step === 'processing' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Analyse en cours...</h2>
                <p className="text-muted-foreground mb-8">
                  L'IA génère vos QCM, flashcards et fiches de révision
                </p>
              </div>
              
              <ProcessingSteps currentStep={processingStep} />
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Cela peut prendre quelques secondes...
                </p>
              </div>
            </div>
          )}

          {/* Étape 5: Succès */}
          {step === 'success' && (
            <SuccessResults
              aiResults={aiResults}
              onAddAnother={resetForm}
              onGoHome={() => navigate('/')}
            />
          )}

          {/* Information sur l'IA */}
          <Alert className="mt-8">
            <Info className="h-4 w-4" />
            <AlertDescription>
              L'IA Gemini est configurée et prête à analyser vos cours pour générer automatiquement des QCM, flashcards et fiches de révision.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </Layout>
  );
}
