import { useState } from 'react';
import { callGemini, ContentMode } from '@/lib/gemini';
import { toast } from 'sonner';

export interface AIGenerationResult {
  summary?: any;
  qcm?: any;
  flashcards?: any;
  fiche?: any;
}

export function useAIGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const generateAllContent = async (content: string): Promise<AIGenerationResult> => {
    setIsGenerating(true);
    setCurrentStep(0);
    setProgress(0);

    const results: AIGenerationResult = {};
    const steps: { mode: ContentMode; key: keyof AIGenerationResult; name: string }[] = [
      { mode: 'summary', key: 'summary', name: 'Génération du résumé' },
      { mode: 'qcm', key: 'qcm', name: 'Création des QCM' },
      { mode: 'flashcards', key: 'flashcards', name: 'Génération des flashcards' },
      { mode: 'fiche', key: 'fiche', name: 'Création de la fiche' }
    ];

    try {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        setCurrentStep(i + 1);
        setProgress(((i + 1) / steps.length) * 100);

        console.log(`🔄 Génération ${step.name}...`);
        
        const result = await callGemini(content, step.mode);
        
        if (result.success && result.data) {
          results[step.key] = result.data;
          console.log(`✅ ${step.name} générée avec succès`);
        } else {
          console.warn(`⚠️ Échec de la génération pour ${step.name}:`, result.error);
          toast.error(`Erreur lors de la génération de ${step.name}`);
        }

        // Petite pause pour l'UX
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      console.log('🎉 Génération IA terminée:', Object.keys(results));
      return results;

    } catch (error) {
      console.error('💥 Erreur lors de la génération IA:', error);
      toast.error('Erreur lors de la génération IA');
      throw error;
    } finally {
      setIsGenerating(false);
      setCurrentStep(0);
      setProgress(0);
    }
  };

  return {
    isGenerating,
    currentStep,
    progress,
    generateAllContent
  };
}