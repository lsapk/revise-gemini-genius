
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout/Layout';
import { ContentTypeSelector } from '@/components/Add/ContentTypeSelector';
import { TextInput } from '@/components/Add/TextInput';
import { FileUpload } from '@/components/Add/FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { callGemini } from '@/lib/gemini';
import { storage } from '@/lib/storage';
import { useApp } from '@/contexts/AppContext';
import { Sparkles, CheckCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AddContent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshSubjects } = useApp();
  
  const [step, setStep] = useState<'type' | 'content' | 'details' | 'processing' | 'success'>('type');
  const [contentType, setContentType] = useState<'text' | 'pdf' | 'image' | 'url' | null>(null);
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lessonTitle, setLessonTitle] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newChapterName, setNewChapterName] = useState('');
  const [aiResults, setAiResults] = useState<any>(null);

  const subjects = storage.getSubjects();

  const handleContentTypeSelect = (type: 'text' | 'pdf' | 'image' | 'url') => {
    setContentType(type);
    setStep('content');
  };

  const handleContentSubmit = async (submittedContent: string) => {
    setContent(submittedContent);
    setIsProcessing(true);

    try {
      // Classifier automatiquement le contenu
      const classificationResult = await callGemini(submittedContent, 'classify');
      
      if (classificationResult.success && classificationResult.data) {
        setSelectedSubject(classificationResult.data.subject || '');
        setSelectedChapter(classificationResult.data.chapter || '');
      }

      // Générer un titre automatique
      if (!lessonTitle) {
        const words = submittedContent.split(' ').slice(0, 8).join(' ');
        setLessonTitle(words + (submittedContent.split(' ').length > 8 ? '...' : ''));
      }

      setStep('details');
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
        // Créer une matière par défaut si aucune n'est sélectionnée
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
        // Créer un chapitre par défaut si aucun n'est sélectionné
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

      // Générer le contenu IA en arrière-plan
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
  };

  return (
    <Layout title="Ajouter un cours" showBack>
      <div className="p-4 max-w-2xl mx-auto space-y-6">
        {/* Étape 1: Sélection du type de contenu */}
        {step === 'type' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Quel type de contenu voulez-vous ajouter ?</h2>
              <p className="text-gray-600 dark:text-gray-400">
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
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setStep('type')}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h2 className="text-xl font-bold">Importer votre contenu</h2>
                <p className="text-gray-600 dark:text-gray-400">
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
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Organiser votre cours</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Ajoutez les détails pour bien classer votre cours
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Informations de base</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre de la leçon *</Label>
                  <Input
                    id="title"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    placeholder="Ex: Les fonctions en mathématiques"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Matière</Label>
                  <select
                    id="subject"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800"
                  >
                    <option value="">Sélectionner une matière existante</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                {!selectedSubject && (
                  <div>
                    <Label htmlFor="newSubject">Ou créer une nouvelle matière</Label>
                    <Input
                      id="newSubject"
                      value={newSubjectName}
                      onChange={(e) => setNewSubjectName(e.target.value)}
                      placeholder="Ex: Mathématiques"
                      className="mt-1"
                    />
                  </div>
                )}

                {selectedSubject && (
                  <div>
                    <Label htmlFor="chapter">Chapitre</Label>
                    <select
                      id="chapter"
                      value={selectedChapter}
                      onChange={(e) => setSelectedChapter(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800"
                    >
                      <option value="">Sélectionner un chapitre existant</option>
                      {subjects.find(s => s.id === selectedSubject)?.chapters.map((chapter) => (
                        <option key={chapter.id} value={chapter.id}>
                          {chapter.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {(selectedSubject || newSubjectName) && !selectedChapter && (
                  <div>
                    <Label htmlFor="newChapter">Ou créer un nouveau chapitre</Label>
                    <Input
                      id="newChapter"
                      value={newChapterName}
                      onChange={(e) => setNewChapterName(e.target.value)}
                      placeholder="Ex: Fonctions et équations"
                      className="mt-1"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Button 
              onClick={handleSaveLesson}
              disabled={isProcessing || !lessonTitle}
              className="w-full"
              size="lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Sauvegarder et analyser avec l'IA
            </Button>
          </div>
        )}

        {/* Étape 4: Traitement en cours */}
        {step === 'processing' && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Analyse en cours...</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              L'IA génère vos QCM, flashcards et fiches de révision
            </p>
            <div className="max-w-sm mx-auto space-y-2">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-pulse" style={{ width: '75%' }} />
              </div>
              <p className="text-sm text-gray-500">Cela peut prendre quelques secondes...</p>
            </div>
          </div>
        )}

        {/* Étape 5: Succès */}
        {step === 'success' && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Cours ajouté avec succès !</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Votre cours a été analysé et les contenus de révision ont été générés
            </p>

            {aiResults && (
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-6">
                <div className={`p-3 rounded-lg ${aiResults.summary ? 'bg-green-50 dark:bg-green-950/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                  <p className="text-sm font-medium">Résumé</p>
                  <p className="text-xs text-gray-600">{aiResults.summary ? '✓ Généré' : '✗ Échec'}</p>
                </div>
                <div className={`p-3 rounded-lg ${aiResults.qcm ? 'bg-green-50 dark:bg-green-950/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                  <p className="text-sm font-medium">QCM</p>
                  <p className="text-xs text-gray-600">{aiResults.qcm ? '✓ Généré' : '✗ Échec'}</p>
                </div>
                <div className={`p-3 rounded-lg ${aiResults.flashcards ? 'bg-green-50 dark:bg-green-950/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                  <p className="text-sm font-medium">Flashcards</p>
                  <p className="text-xs text-gray-600">{aiResults.flashcards ? '✓ Générées' : '✗ Échec'}</p>
                </div>
                <div className={`p-3 rounded-lg ${aiResults.fiche ? 'bg-green-50 dark:bg-green-950/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                  <p className="text-sm font-medium">Fiche</p>
                  <p className="text-xs text-gray-600">{aiResults.fiche ? '✓ Générée' : '✗ Échec'}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <Button 
                variant="outline" 
                onClick={resetForm}
                className="flex-1"
              >
                Ajouter un autre cours
              </Button>
              <Button 
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Retour à l'accueil
              </Button>
            </div>
          </div>
        )}

        {/* Information sur l'IA */}
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertDescription>
            L'IA Gemini est configurée et prête à analyser vos cours pour générer automatiquement des QCM, flashcards et fiches de révision.
          </AlertDescription>
        </Alert>
      </div>
    </Layout>
  );
}
