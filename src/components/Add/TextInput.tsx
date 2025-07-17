
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';

interface TextInputProps {
  onSubmit: (content: string) => void;
  isProcessing: boolean;
}

export function TextInput({ onSubmit, isProcessing }: TextInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim());
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Contenu du cours
        </label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Collez ici le contenu de votre cours..."
          className="min-h-[200px] resize-none"
          disabled={isProcessing}
        />
        <p className="text-xs text-gray-500 mt-1">
          {text.length} caractères
        </p>
      </div>

      <Button 
        onClick={handleSubmit}
        disabled={!text.trim() || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Traitement en cours...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Analyser avec l'IA
          </>
        )}
      </Button>
    </div>
  );
}
