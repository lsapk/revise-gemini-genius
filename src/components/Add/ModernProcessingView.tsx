
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Sparkles, Brain, FileText, HelpCircle, CreditCard } from 'lucide-react';

interface ModernProcessingViewProps {
  currentStep: number;
  stepNames: string[];
}

const defaultProcessingSteps = [
  { 
    id: 1, 
    name: 'Analyse du contenu', 
    icon: Brain,
    description: 'L\'IA analyse votre contenu',
    duration: 3000
  },
  { 
    id: 2, 
    name: 'Génération du résumé', 
    icon: FileText,
    description: 'Création d\'un résumé structuré',
    duration: 4000
  },
  { 
    id: 3, 
    name: 'Création des QCM', 
    icon: HelpCircle,
    description: 'Génération de questions à choix multiples',
    duration: 5000
  },
  { 
    id: 4, 
    name: 'Génération des flashcards', 
    icon: CreditCard,
    description: 'Création de cartes de révision',
    duration: 4000
  },
  { 
    id: 5, 
    name: 'Finalisation', 
    icon: CheckCircle,
    description: 'Sauvegarde et organisation',
    duration: 2000
  },
];

export function ModernProcessingView({ currentStep, stepNames }: ModernProcessingViewProps) {
  const [progress, setProgress] = useState(0);

  // Use provided stepNames or fall back to default
  const processingSteps = stepNames.map((name, index) => ({
    ...defaultProcessingSteps[index],
    id: index + 1,
    name: name
  }));

  useEffect(() => {
    const totalSteps = processingSteps.length;
    const stepProgress = ((currentStep - 1) / totalSteps) * 100;
    setProgress(stepProgress);
  }, [currentStep, processingSteps.length]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Analyse IA en cours...
          </h2>
          <p className="text-muted-foreground text-lg mt-2">
            L'intelligence artificielle traite votre contenu et génère vos outils de révision
          </p>
        </div>
      </div>

      <Card className="shadow-xl border-2 border-border/50">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            Progression de l'analyse
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progression globale</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="grid gap-4">
            {processingSteps.map((step) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              const isPending = currentStep < step.id;
              
              return (
                <div 
                  key={step.id} 
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-500 ${
                    isCompleted 
                      ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' 
                      : isCurrent 
                        ? 'bg-primary/5 border-primary animate-pulse shadow-lg shadow-primary/10' 
                        : 'bg-muted/30 border-border'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isCurrent 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : isCurrent ? (
                      <Icon className="w-6 h-6 animate-pulse" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      isCompleted 
                        ? 'text-green-700 dark:text-green-400' 
                        : isCurrent 
                          ? 'text-primary' 
                          : 'text-muted-foreground'
                    }`}>
                      {step.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    {isCompleted && (
                      <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                        ✓ Terminé
                      </span>
                    )}
                    {isCurrent && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-primary text-sm font-medium">
                          En cours...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center p-6 bg-muted/30 rounded-xl">
            <p className="text-sm text-muted-foreground">
              L'analyse peut prendre quelques minutes selon la taille du contenu
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
