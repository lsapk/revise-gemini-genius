import { useState } from 'react';
import { Layout } from '@/components/Layout/Layout';
import { ModernContentTypeSelector } from '@/components/Add/ModernContentTypeSelector';
import { ModernTextInput } from '@/components/Add/ModernTextInput';
import { ModernFileUpload } from '@/components/Add/ModernFileUpload';
import { ModernProcessingView } from '@/components/Add/ModernProcessingView';
import { ModernSuccessView } from '@/components/Add/ModernSuccessView';
import { ContentAnalysisForm } from '@/components/Add/ContentAnalysisForm';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useAIGeneration } from '@/hooks/useAIGeneration';
import { toast } from 'sonner';

type ContentType = 'text' | 'pdf' | 'image' | 'url' | null;
type Step = 'select' | 'input' | 'form' | 'processing' | 'success';

export default function AddContent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { subjects, addSubject, addLesson } = useApp();
  const { generateAllContent } = useAIGeneration();
  
  const initialType = searchParams.get('type') as ContentType;
  const [selectedType, setSelectedType] = useState<ContentType>(initialType);
  const [currentStep, setCurrentStep] = useState<Step>(initialType ? 'input' : 'select');
  const [content, setContent] = useState('');
  const [processingStep, setProcessingStep] = useState(0);
  const [lessonTitle, setLessonTitle] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');

  const stepNames = [
    'Analyse du contenu',
    'Génération du résumé', 
    'Création des QCM',
    'Génération des flashcards',
    'Création de la fiche'
  ];

  const handleTypeSelect = (type: ContentType) => {
    setSelectedType(type);
    setCurrentStep('input');
  };

  const handleContentSubmit = (submittedContent: string) => {
    setContent(submittedContent);
    setCurrentStep('form');
  };

  const handleFormSave = async () => {
    if (!lessonTitle.trim()) {
      toast.error('Le titre du cours est requis');
      return;
    }

    setCurrentStep('processing');
    setProcessingStep(1);

    try {
      let subjectId = selectedSubject;

      // Créer la matière si nécessaire
      if (newSubjectName.trim()) {
        const newSubject = await addSubject(newSubjectName.trim(), '', '#3B82F6');
        subjectId = newSubject?.id || '';
        toast.success(`Matière "${newSubjectName}" créée !`);
      }

      // Si pas de matière sélectionnée, utiliser la première disponible ou en créer une
      if (!subjectId) {
        if (subjects.length > 0) {
          subjectId = subjects[0].id;
        } else {
          const defaultSubject = await addSubject('Matière générale', 'Matière créée automatiquement');
          subjectId = defaultSubject?.id || '';
        }
      }

      if (!subjectId) {
        throw new Error('Impossible de créer ou trouver la matière');
      }

      // Génération IA réelle avec l'API Gemini optimisée
      const generateAIContent = async () => {
        try {
          setProcessingStep(1);
          
          // Génération de tout le contenu IA
          const aiData = await generateAllContent(content);
          
          // Progression vers l'étape finale
          setProcessingStep(stepNames.length);

          // Sauvegarder le cours avec les vraies données IA
          const result = await addLesson(
            subjectId,
            lessonTitle.trim(),
            content,
            selectedType || 'lesson',
            aiData
          );

          if (result) {
            toast.success('Cours créé avec succès !');
            setCurrentStep('success');
          } else {
            throw new Error('Erreur lors de la sauvegarde');
          }

        } catch (error) {
          console.error('Erreur génération IA:', error);
          toast.error('Erreur lors de la génération IA : ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
          setCurrentStep('form');
          setProcessingStep(0);
        }
      };

      generateAIContent();

    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast.error('Erreur lors de la création du cours');
      setCurrentStep('form');
    }
  };

  const handleAddAnother = () => {
    setSelectedType(null);
    setCurrentStep('select');
    setContent('');
    setProcessingStep(0);
    setLessonTitle('');
    setSelectedSubject('');
    setNewSubjectName('');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Layout 
      title={currentStep === 'select' ? "Ajouter un nouveau cours" : "Nouveau cours"}
      className="max-w-6xl mx-auto"
    >
      <div className="min-h-[70vh] flex items-center justify-center">
        {currentStep === 'select' && (
          <ModernContentTypeSelector
            selectedType={selectedType}
            onSelect={handleTypeSelect}
          />
        )}

        {currentStep === 'input' && selectedType === 'text' && (
          <ModernTextInput
            onSubmit={handleContentSubmit}
            isProcessing={false}
          />
        )}

        {currentStep === 'input' && (selectedType === 'pdf' || selectedType === 'image') && (
          <ModernFileUpload
            type={selectedType}
            onSubmit={handleContentSubmit}
            isProcessing={false}
          />
        )}

        {currentStep === 'form' && (
          <div className="w-full max-w-2xl">
            <ContentAnalysisForm
              lessonTitle={lessonTitle}
              setLessonTitle={setLessonTitle}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              selectedChapter=""
              setSelectedChapter={() => {}}
              newSubjectName={newSubjectName}
              setNewSubjectName={setNewSubjectName}
              newChapterName=""
              setNewChapterName={() => {}}
              onSave={handleFormSave}
              isProcessing={false}
            />
          </div>
        )}

        {currentStep === 'processing' && (
          <ModernProcessingView
            currentStep={processingStep}
            stepNames={stepNames}
          />
        )}

        {currentStep === 'success' && (
          <ModernSuccessView
            aiResults={{
              summary: true,
              qcm: true,
              flashcards: true,
              fiche: true
            }}
            onAddAnother={handleAddAnother}
            onGoHome={handleGoHome}
          />
        )}
      </div>
    </Layout>
  );
}