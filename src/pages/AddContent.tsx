
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout/Layout';
import { ModernStepIndicator } from '@/components/Add/ModernStepIndicator';
import { ModernContentTypeSelector } from '@/components/Add/ModernContentTypeSelector';
import { ModernTextInput } from '@/components/Add/ModernTextInput';
import { ModernFileUpload } from '@/components/Add/ModernFileUpload';
import { ContentAnalysisForm } from '@/components/Add/ContentAnalysisForm';
import { ModernProcessingView } from '@/components/Add/ModernProcessingView';
import { ModernSuccessView } from '@/components/Add/ModernSuccessView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { callGemini } from '@/lib/gemini';
import { storage } from '@/lib/storage';
import { useApp } from '@/contexts/AppContext';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Step = 'type' | 'content' | 'processing' | 'details' | 'success';

export default function AddContent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshSubjects } = useApp();
  
  const [step, setStep] = useState<Step>('type');
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
  const [urlInput, setUrlInput] = useState('');

  const stepNames = ['Type', 'Contenu', 'Analyse', 'Organisation', 'Terminé'];
  const stepMapping: Record<Step, number> = {
    type: 1,
    content: 2,
    processing: 3,
    details: 4,
    success: 5
  };

  const handleContentTypeSelect = (type: 'text' | 'pdf' | 'image' | 'url') => {
    setContentType(type);
    setStep('content');
  };

  const handleContentSubmit = async (submittedContent: string) => {
    setContent(submittedContent);
    setStep('processing');
    setIsProcessing(true);
    setProcessingStep(1);

    try {
      // Étape 1: Analyse du contenu
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProcessingStep(2);
      
      // Générer un titre automatique basé sur le contenu
      const words = submittedContent.split(' ').slice(0, 10).join(' ');
      const autoTitle = words.length > 50 ? words.substring(0, 50) + '...' : words;
      setLessonTitle(autoTitle);

      // Étape 2-5: Génération IA en parallèle
      const aiPromises = [
        { mode: 'summary' as const, step: 2 },
        { mode: 'qcm' as const, step: 3 },
        { mode: 'flashcards' as const, step: 4 },
        { mode: 'fiche' as const, step: 5 }
      ];

      const results = await Promise.allSettled(
        aiPromises.map(async ({ mode, step }) => {
          setProcessingStep(step);
          await new Promise(resolve => setTimeout(resolve, 1000));
          const result = await callGemini(submittedContent, mode);
          return { mode, result };
        })
      );

      // Traiter les résultats
      const aiData: any = {};
      const aiSuccess: any = {};

      results.forEach((result, index) => {
        const mode = aiPromises[index].mode;
        if (result.status === 'fulfilled' && result.value.result.success) {
          aiData[mode] = result.value.result.data;
          aiSuccess[mode] = true;
        } else {
          console.error(`Erreur génération ${mode}:`, result);
          aiSuccess[mode] = false;
          
          // Afficher un toast pour les erreurs
          toast({
            title: `Erreur ${mode}`,
            description: result.status === 'fulfilled' 
              ? result.value.result.error || 'Erreur inconnue'
              : 'Échec de la génération',
            variant: "destructive"
          });
        }
      });

      // Sauvegarder les données IA temporairement
      setAiResults(aiSuccess);
      
      // Stocker les données générées pour l'étape suivante
      (window as any).__tempAiData = aiData;

      setStep('details');
      toast({
        title: "Analyse terminée",
        description: "Votre contenu a été analysé par l'IA. Organisez maintenant votre cours.",
      });

    } catch (error) {
      console.error('Erreur lors du traitement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter le contenu. Veuillez réessayer.",
        variant: "destructive"
      });
      setStep('content');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      const simulatedContent = `Contenu importé depuis l'URL: ${urlInput}

Ce contenu a été extrait automatiquement depuis la page web. Dans une implémentation réelle, vous utiliseriez un service de scraping web pour extraire le contenu textuel de la page.

URL source: ${urlInput}
Date d'extraction: ${new Date().toLocaleDateString()}

Le contenu extrait serait ici analysé par l'IA pour générer vos outils de révision.`;
      
      handleContentSubmit(simulatedContent);
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

    try {
      // Créer ou récupérer la matière
      let subjectId = selectedSubject;
      if (!subjectId && newSubjectName) {
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
      const lesson = storage.addLesson(chapterId, {
        title: lessonTitle,
        content: content,
        type: contentType || 'text'
      });

      // Récupérer et sauvegarder les données IA
      const aiData = (window as any).__tempAiData || {};
      storage.updateLesson(lesson.id, {
        aiGenerated: aiData
      });

      // Nettoyer les données temporaires
      delete (window as any).__tempAiData;

      refreshSubjects();
      setStep('success');

      toast({
        title: "Succès !",
        description: "Votre cours a été créé et analysé par l'IA.",
      });

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le cours. Veuillez réessayer.",
        variant: "destructive"
      });
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
    setUrlInput('');
    delete (window as any).__tempAiData;
  };

  const handleBack = () => {
    if (step === 'content') {
      setStep('type');
    } else if (step === 'details') {
      setStep('type'); // Retour direct au début si on veut changer de contenu
    } else {
      navigate(-1);
    }
  };

  return (
    <Layout 
      title="Ajouter un cours" 
      showBack={false}
      headerActions={
        step !== 'type' ? (
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        ) : undefined
      }
    >
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
        <div className="container mx-auto px-4 py-8">
          {/* Indicateur d'étapes moderne */}
          <ModernStepIndicator 
            currentStep={stepMapping[step]} 
            totalSteps={5}
            stepNames={stepNames}
          />

          {/* Étape 1: Sélection du type de contenu */}
          {step === 'type' && (
            <ModernContentTypeSelector 
              selectedType={contentType}
              onSelect={handleContentTypeSelect}
            />
          )}

          {/* Étape 2: Saisie du contenu */}
          {step === 'content' && contentType && (
            <>
              {contentType === 'text' && (
                <ModernTextInput 
                  onSubmit={handleContentSubmit}
                  isProcessing={isProcessing}
                />
              )}

              {(contentType === 'pdf' || contentType === 'image') && (
                <ModernFileUpload 
                  type={contentType}
                  onSubmit={handleContentSubmit}
                  isProcessing={isProcessing}
                />
              )}

              {contentType === 'url' && (
                <div className="max-w-4xl mx-auto space-y-8">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <LinkIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Importer depuis une URL</h2>
                      <p className="text-muted-foreground">
                        Entrez l'URL de la page web contenant votre cours
                      </p>
                    </div>
                  </div>

                  <div className="bg-card p-8 rounded-2xl border-2 shadow-xl space-y-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium">URL du contenu</label>
                      <Input
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://example.com/cours"
                        className="h-12 text-lg border-2 focus:border-primary"
                      />
                    </div>
                    <Button 
                      onClick={handleUrlSubmit}
                      disabled={!urlInput.trim() || isProcessing}
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                          Analyse en cours...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-3" />
                          Analyser l'URL
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Étape 3: Traitement IA */}
          {step === 'processing' && (
            <ModernProcessingView currentStep={processingStep} />
          )}

          {/* Étape 4: Détails de la leçon */}
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

          {/* Étape 5: Succès */}
          {step === 'success' && (
            <ModernSuccessView
              aiResults={aiResults}
              onAddAnother={resetForm}
              onGoHome={() => navigate('/')}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
