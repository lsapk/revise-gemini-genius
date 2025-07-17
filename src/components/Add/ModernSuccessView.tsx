
import { CheckCircle, ArrowRight, RotateCcw, Sparkles, FileText, HelpCircle, CreditCard, Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ModernSuccessViewProps {
  aiResults: {
    summary: boolean;
    qcm: boolean;
    flashcards: boolean;
    fiche: boolean;
  } | null;
  onAddAnother: () => void;
  onGoHome: () => void;
}

const resultItems = [
  { 
    key: 'summary', 
    label: 'Résumé intelligent', 
    icon: FileText,
    description: 'Synthèse claire et structurée',
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    key: 'qcm', 
    label: 'Questions QCM', 
    icon: HelpCircle,
    description: 'Quiz à choix multiples',
    color: 'from-green-500 to-emerald-500'
  },
  { 
    key: 'flashcards', 
    label: 'Cartes mémoire', 
    icon: CreditCard,
    description: 'Flashcards de révision',
    color: 'from-purple-500 to-violet-500'
  },
  { 
    key: 'fiche', 
    label: 'Fiche de révision', 
    icon: Clipboard,
    description: 'Guide de révision complet',
    color: 'from-orange-500 to-red-500'
  },
];

export function ModernSuccessView({ aiResults, onAddAnother, onGoHome }: ModernSuccessViewProps) {
  const successCount = aiResults ? Object.values(aiResults).filter(Boolean).length : 0;
  const totalCount = resultItems.length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-6">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl animate-bounce">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-4">
            Cours créé avec succès !
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Votre cours a été analysé par l'IA et {successCount} outils de révision ont été générés automatiquement
          </p>
        </div>
      </div>

      <Card className="shadow-xl border-2 border-green-200 dark:border-green-800">
        <CardHeader className="border-b bg-green-50 dark:bg-green-950/20">
          <CardTitle className="flex items-center gap-3 text-green-700 dark:text-green-400">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            Contenu généré par l'IA ({successCount}/{totalCount})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resultItems.map((item) => {
              const success = aiResults?.[item.key as keyof typeof aiResults];
              const Icon = item.icon;
              
              return (
                <div 
                  key={item.key} 
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    success 
                      ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800 shadow-lg' 
                      : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${item.color} shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{item.label}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                      <div className="flex items-center gap-2">
                        {success ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                              Généré avec succès
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                              <span className="text-white text-xs">✗</span>
                            </div>
                            <span className="text-red-600 dark:text-red-400 text-sm font-medium">
                              Échec de génération
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          variant="outline" 
          onClick={onAddAnother}
          className="flex-1 h-14 text-lg font-semibold border-2 hover:border-primary transition-colors"
          size="lg"
        >
          <RotateCcw className="w-5 h-5 mr-3" />
          Ajouter un autre cours
        </Button>
        <Button 
          onClick={onGoHome}
          className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          <ArrowRight className="w-5 h-5 mr-3" />
          Voir mes cours
        </Button>
      </div>
    </div>
  );
}
