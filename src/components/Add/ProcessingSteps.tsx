
import { CheckCircle, Clock, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ProcessingStepsProps {
  currentStep: number;
}

export function ProcessingSteps({ currentStep }: ProcessingStepsProps) {
  const steps = [
    { id: 1, name: 'Analyse du contenu', icon: Sparkles },
    { id: 2, name: 'Génération du résumé', icon: Clock },
    { id: 3, name: 'Création des QCM', icon: Clock },
    { id: 4, name: 'Génération des flashcards', icon: Clock },
    { id: 5, name: 'Création de la fiche', icon: Clock },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            
            return (
              <div key={step.id} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isCurrent 
                      ? 'bg-primary text-primary-foreground animate-pulse' 
                      : 'bg-muted text-muted-foreground'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  isCompleted 
                    ? 'text-green-600 dark:text-green-400' 
                    : isCurrent 
                      ? 'text-primary' 
                      : 'text-muted-foreground'
                }`}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
