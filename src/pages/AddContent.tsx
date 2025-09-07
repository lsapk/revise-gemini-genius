
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
import { toast } from 'sonner';
import { storage } from '@/lib/storage';

type ContentType = 'text' | 'pdf' | 'image' | 'url' | null;
type Step = 'select' | 'input' | 'form' | 'processing' | 'success';

export default function AddContent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { subjects, addSubject, addChapter, refreshSubjects } = useApp();
  
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

  const handleFormSave = async () => {
    if (!lessonTitle.trim()) {
      toast.error('Le titre du cours est requis');
      return;
    }

    setCurrentStep('processing');
    setProcessingStep(1);

    try {
      let subjectId = selectedSubject;
      let chapterId = selectedChapter;

      // Créer la matière si nécessaire
      if (newSubjectName.trim()) {
        const newSubject = await addSubject(newSubjectName.trim(), '', '#3B82F6');
        subjectId = newSubject?.id || '';
        toast.success(`Matière "${newSubjectName}" créée !`);
      }

      // Créer le chapitre si nécessaire
      if (newChapterName.trim() && subjectId) {
        const newChapter = await addChapter(subjectId, newChapterName.trim());
        chapterId = newChapter?.id || '';
        toast.success(`Chapitre "${newChapterName}" créé !`);
      }

      // Si pas de chapitre, créer un chapitre par défaut
      if (!chapterId && subjectId) {
        const defaultChapter = await addChapter(subjectId, 'Cours général');
        chapterId = defaultChapter?.id || '';
      }

      if (!subjectId || !chapterId) {
        throw new Error('Impossible de créer ou trouver la matière/chapitre');
      }

      // Simuler le processus d'analyse IA et sauvegarder
      const interval = setInterval(async () => {
        setProcessingStep(prev => {
          if (prev >= stepNames.length) {
            clearInterval(interval);
            
            // Sauvegarder le cours avec useSupabaseStorage
            try {
              const success = storage.addLesson(chapterId, {
                title: lessonTitle.trim(),
                content: content,
                type: selectedType as 'text' | 'pdf' | 'image' | 'url',
                aiGenerated: {
                  summary: { 
                    content: 'Résumé généré automatiquement à partir du contenu du cours...',
                    keyPoints: ['Point clé 1', 'Point clé 2', 'Point clé 3']
                  },
                  qcm: { 
                    questions: [
                      {
                        question: 'Question exemple générée par l\'IA',
                        options: ['Option A', 'Option B', 'Option C', 'Option D'],
                        correct: 0
                      }
                    ]
                  },
                  flashcards: { 
                    cards: [
                      { front: 'Question flashcard', back: 'Réponse flashcard' }
                    ]
                  },
                  fiche: { 
                    content: 'Fiche de révision générée automatiquement...',
                    sections: ['Section 1', 'Section 2']
                  }
                }
              });

              if (success) {
                toast.success('Cours créé avec succès !');
                // Refresh pour synchroniser les données
                refreshSubjects();
                setCurrentStep('success');
              } else {
                throw new Error('Erreur lors de la sauvegarde');
              }
            } catch (error) {
              console.error('Erreur sauvegarde:', error);
              toast.error('Erreur lors de la sauvegarde du cours');
              setCurrentStep('form');
            }
            
            return prev;
          }
          return prev + 1;
        });
      }, 1200);

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
