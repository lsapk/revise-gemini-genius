
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RotateCcw, ChevronLeft, ChevronRight, Eye, EyeOff, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Flashcard {
  front: string;
  back: string;
}

interface FlashcardViewProps {
  cards: Flashcard[];
  onComplete: (easyCoun: number, hardCount: number) => void;
  title?: string;
}

export function FlashcardView({ cards, onComplete, title = "Flashcards" }: FlashcardViewProps) {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [easyCards, setEasyCards] = useState<number[]>([]);
  const [hardCards, setHardCards] = useState<number[]>([]);
  const [studiedCards, setStudiedCards] = useState<Set<number>>(new Set());

  const progress = (studiedCards.size / cards.length) * 100;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleDifficulty = (isEasy: boolean) => {
    const cardIndex = currentCard;
    
    if (isEasy) {
      setEasyCards([...easyCards, cardIndex]);
    } else {
      setHardCards([...hardCards, cardIndex]);
    }

    setStudiedCards(new Set([...studiedCards, cardIndex]));

    // Passer à la carte suivante ou terminer
    if (currentCard < cards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    } else {
      onComplete(easyCards.length + 1, hardCards.length + (isEasy ? 0 : 1));
    }
  };

  const goToPrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
    }
  };

  const goToNext = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    }
  };

  const resetCards = () => {
    setCurrentCard(0);
    setIsFlipped(false);
    setEasyCards([]);
    setHardCards([]);
    setStudiedCards(new Set());
  };

  const currentCardData = cards[currentCard];

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      {/* Header avec progression */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{title}</h1>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {currentCard + 1} / {cards.length}
          </div>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Faciles: {easyCards.length}</span>
          <span>Difficiles: {hardCards.length}</span>
        </div>
      </div>

      {/* Carte principale */}
      <div className="relative h-80">
        <Card 
          className={cn(
            "absolute inset-0 cursor-pointer transition-all duration-500 preserve-3d",
            isFlipped ? "rotate-y-180" : ""
          )}
          onClick={handleFlip}
        >
          {/* Face avant */}
          <CardContent className={cn(
            "absolute inset-0 p-6 flex flex-col items-center justify-center text-center backface-hidden",
            isFlipped ? "opacity-0" : "opacity-100"
          )}>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium leading-relaxed">
                {currentCardData.front}
              </h3>
              <p className="text-sm text-gray-500">Cliquez pour voir la réponse</p>
            </div>
          </CardContent>

          {/* Face arrière */}
          <CardContent className={cn(
            "absolute inset-0 p-6 flex flex-col items-center justify-center text-center backface-hidden rotate-y-180",
            isFlipped ? "opacity-100" : "opacity-0"
          )}>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                <EyeOff className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-lg font-medium leading-relaxed text-green-700 dark:text-green-400">
                {currentCardData.back}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={goToPrevious}
          disabled={currentCard === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Précédent
        </Button>

        <Button
          variant="outline"
          onClick={resetCards}
          className="px-3"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          onClick={goToNext}
          disabled={currentCard === cards.length - 1}
        >
          Suivant
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Boutons de difficulté (seulement si la carte est retournée) */}
      {isFlipped && (
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => handleDifficulty(false)}
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
          >
            <X className="w-4 h-4 mr-2" />
            Difficile
          </Button>
          <Button
            onClick={() => handleDifficulty(true)}
            className="flex-1 bg-green-500 hover:bg-green-600"
          >
            <Check className="w-4 h-4 mr-2" />
            Facile
          </Button>
        </div>
      )}

      {/* Instructions */}
      {!isFlipped && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <p>• Cliquez sur la carte pour voir la réponse</p>
          <p>• Évaluez votre niveau de maîtrise</p>
          <p>• Les cartes difficiles reviendront plus souvent</p>
        </div>
      )}
    </div>
  );
}

// Styles CSS pour l'effet de retournement 3D
const styles = `
.preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}
`;

// Injecter les styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
