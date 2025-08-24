
import { useState } from 'react';
import { Layout } from '@/components/Layout/Layout';
import { ModernContentTypeSelector } from '@/components/Add/ModernContentTypeSelector';
import { ModernTextInput } from '@/components/Add/ModernTextInput';
import { ModernFileUpload } from '@/components/Add/ModernFileUpload';
import { ModernProcessingView } from '@/components/Add/ModernProcessingView';
import { ModernSuccessView } from '@/components/Add/ModernSuccessView';
import { ContentAnalysisForm } from '@/components/Add/ContentAnalysisForm';
import { useNavigate, useSearchParams } from 'react-router-dom';

type ContentType = 'text' | 'pdf' | 'image' | 'url' | null;
type Step = 'select' | 'input' | 'form' | 'processing' | 'success';

export default function AddContent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const initialType = searchParams.get('type') as ContentType;
  const [selectedType, setSelectedType] = useState<ContentType>(initialType);
  const [currentStep, setCurrentStep] = useState<Step>(initialType ? 'input' : 'select');
  const [content, setContent] = useState('');
  const [processingStep, setProcessingStep] = useState(0);
  const [lessonTitle, setLessonTitle] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newChapterName, setNewChapterName] = useState('');

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

  const handleFormSave = () => {
    setCurrentStep('processing');
    setProcessingStep(1);

    // Simuler le processus d'analyse IA
    const interval = setInterval(() => {
      setProcessingStep(prev => {
        if (prev >= stepNames.length) {
          clearInterval(interval);
          setCurrentStep('success');
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
  };

  const handleAddAnother = () => {
    setSelectedType(null);
    setCurrentStep('select');
    setContent('');
    setProcessingStep(0);
    setLessonTitle('');
    setSelectedSubject('');
    setSelectedChapter('');
    setNewSubjectName('');
    setNewChapterName('');
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
              selectedChapter={selectedChapter}
              setSelectedChapter={setSelectedChapter}
              newSubjectName={newSubjectName}
              setNewSubjectName={setNewSubjectName}
              newChapterName={newChapterName}
              setNewChapterName={setNewChapterName}
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
