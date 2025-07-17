
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { storage } from '@/lib/storage';
import { Sparkles, Plus } from 'lucide-react';

interface ContentAnalysisFormProps {
  lessonTitle: string;
  setLessonTitle: (title: string) => void;
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
  selectedChapter: string;
  setSelectedChapter: (chapter: string) => void;
  newSubjectName: string;
  setNewSubjectName: (name: string) => void;
  newChapterName: string;
  setNewChapterName: (name: string) => void;
  onSave: () => void;
  isProcessing: boolean;
}

export function ContentAnalysisForm({
  lessonTitle,
  setLessonTitle,
  selectedSubject,
  setSelectedSubject,
  selectedChapter,
  setSelectedChapter,
  newSubjectName,
  setNewSubjectName,
  newChapterName,
  setNewChapterName,
  onSave,
  isProcessing
}: ContentAnalysisFormProps) {
  const subjects = storage.getSubjects();
  const selectedSubjectData = subjects.find(s => s.id === selectedSubject);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Organiser votre cours</h2>
        <p className="text-muted-foreground">
          Ajoutez les détails pour bien classer votre cours analysé par l'IA
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Informations du cours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Titre de la leçon */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Titre de la leçon *
            </Label>
            <Input
              id="title"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              placeholder="Ex: Les fonctions en mathématiques"
              className="w-full"
            />
          </div>

          {/* Sélection de matière */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Matière</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une matière existante" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Nouvelle matière */}
          {!selectedSubject && (
            <div className="space-y-2">
              <Label htmlFor="newSubject" className="text-sm font-medium flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Créer une nouvelle matière
              </Label>
              <Input
                id="newSubject"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="Ex: Mathématiques"
                className="w-full"
              />
            </div>
          )}

          {/* Sélection de chapitre */}
          {(selectedSubject || newSubjectName) && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Chapitre</Label>
              {selectedSubjectData && selectedSubjectData.chapters.length > 0 ? (
                <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un chapitre existant" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedSubjectData.chapters.map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id}>
                        {chapter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Aucun chapitre existant
                </p>
              )}
            </div>
          )}

          {/* Nouveau chapitre */}
          {(selectedSubject || newSubjectName) && !selectedChapter && (
            <div className="space-y-2">
              <Label htmlFor="newChapter" className="text-sm font-medium flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Créer un nouveau chapitre
              </Label>
              <Input
                id="newChapter"
                value={newChapterName}
                onChange={(e) => setNewChapterName(e.target.value)}
                placeholder="Ex: Fonctions et équations"
                className="w-full"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Button 
        onClick={onSave}
        disabled={isProcessing || !lessonTitle}
        className="w-full h-12 text-base"
        size="lg"
      >
        <Sparkles className="w-5 h-5 mr-2" />
        {isProcessing ? 'Sauvegarde en cours...' : 'Sauvegarder et analyser avec l\'IA'}
      </Button>
    </div>
  );
}
