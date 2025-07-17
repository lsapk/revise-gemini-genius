
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Clock, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizViewProps {
  questions: Question[];
  onComplete: (score: number, totalQuestions: number, duration: number) => void;
  title?: string;
}

export function QuizView({ questions, onComplete, title = "Quiz" }: QuizViewProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean[]>(new Array(questions.length).fill(false));
  const [startTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes par défaut

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleQuizComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswered = [...answered];
    newAnswered[currentQuestion] = true;
    setAnswered(newAnswered);

    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    onComplete(score, questions.length, duration);
  };

  const showAnswer = () => {
    setShowResult(true);
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + (answered[currentQuestion] ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      {/* Header avec progression */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span className={cn(
                "font-mono",
                timeLeft < 60 ? "text-red-500" : ""
              )}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {currentQuestion + 1} sur {questions.length}</span>
              <span>Score: {score}/{currentQuestion + (answered[currentQuestion] ? 1 : 0)}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Question actuelle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium leading-relaxed">
            {currentQ.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQ.options.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === index ? "default" : "outline"}
              className={cn(
                "w-full justify-start text-left h-auto p-4 transition-all",
                selectedAnswer === index && "ring-2 ring-primary ring-offset-2",
                showResult && index === currentQ.correct && "bg-green-500 hover:bg-green-600 text-white",
                showResult && selectedAnswer === index && index !== currentQ.correct && "bg-red-500 hover:bg-red-600 text-white"
              )}
              onClick={() => !showResult && handleAnswerSelect(index)}
              disabled={showResult}
            >
              <span className="flex-1">{option}</span>
              {showResult && index === currentQ.correct && (
                <CheckCircle className="w-5 h-5 ml-2" />
              )}
              {showResult && selectedAnswer === index && index !== currentQ.correct && (
                <XCircle className="w-5 h-5 ml-2" />
              )}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Explication (si réponse affichée) */}
      {showResult && (
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4">
            <h4 className="font-medium mb-2">Explication :</h4>
            <p className="text-gray-700 dark:text-gray-300">{currentQ.explanation}</p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!showResult ? (
          <>
            <Button
              variant="outline"
              onClick={showAnswer}
              disabled={selectedAnswer === null}
              className="flex-1"
            >
              Voir la réponse
            </Button>
            <Button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="flex-1"
            >
              {currentQuestion === questions.length - 1 ? 'Terminer' : 'Suivant'}
            </Button>
          </>
        ) : (
          <Button
            onClick={handleNextQuestion}
            className="w-full"
          >
            {currentQuestion === questions.length - 1 ? (
              <>
                <Trophy className="w-4 h-4 mr-2" />
                Voir les résultats
              </>
            ) : (
              'Question suivante'
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
