
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2, FileText, Zap } from 'lucide-react';

interface ModernTextInputProps {
  onSubmit: (content: string) => void;
  isProcessing: boolean;
}

export function ModernTextInput({ onSubmit, isProcessing }: ModernTextInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim());
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Saisir votre contenu</h2>
          <p className="text-muted-foreground">
            Collez ou tapez le contenu de votre cours que l'IA va analyser
          </p>
        </div>
      </div>

      <Card className="shadow-xl border-2 border-border/50">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            Contenu du cours
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="space-y-3">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Collez ici le contenu de votre cours, notes, chapitre ou tout autre matériel d'apprentissage..."
              className="min-h-[300px] resize-none text-base leading-relaxed border-2 focus:border-primary transition-colors"
              disabled={isProcessing}
            />
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                {text.length} caractères
              </span>
              <span className="text-muted-foreground">
                {text.length > 100 ? "Contenu suffisant pour l'analyse" : "Ajoutez plus de contenu"}
              </span>
            </div>
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={!text.trim() || text.length < 50 || isProcessing}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-3" />
                Démarrer l'analyse IA
              </>
            )}
          </Button>

          {text.length > 0 && text.length < 50 && (
            <p className="text-amber-600 text-sm text-center">
              Ajoutez au moins 50 caractères pour une analyse optimale
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
