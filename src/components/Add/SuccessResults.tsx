
import { CheckCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SuccessResultsProps {
  aiResults: {
    summary: boolean;
    qcm: boolean;
    flashcards: boolean;
    fiche: boolean;
  } | null;
  onAddAnother: () => void;
  onGoHome: () => void;
}

export function SuccessResults({ aiResults, onAddAnother, onGoHome }: SuccessResultsProps) {
  const resultItems = [
    { key: 'summary', label: 'Résumé généré', icon: '📝' },
    { key: 'qcm', label: 'QCM créé', icon: '❓' },
    { key: 'flashcards', label: 'Flashcards générées', icon: '🃏' },
    { key: 'fiche', label: 'Fiche de révision', icon: '📋' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold mb-3 text-green-600 dark:text-green-400">
          Cours ajouté avec succès !
        </h2>
        <p className="text-muted-foreground mb-8">
          Votre cours a été analysé et les contenus de révision ont été générés par l'IA
        </p>
      </div>

      {aiResults && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contenu généré par l'IA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resultItems.map((item) => {
                const success = aiResults[item.key as keyof typeof aiResults];
                return (
                  <div key={item.key} className={`p-4 rounded-lg border ${
                    success 
                      ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
                      : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className={`text-xs ${
                          success 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {success ? '✓ Généré avec succès' : '✗ Échec de génération'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          variant="outline" 
          onClick={onAddAnother}
          className="flex-1 h-12"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Ajouter un autre cours
        </Button>
        <Button 
          onClick={onGoHome}
          className="flex-1 h-12"
        >
          Voir mes cours
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
