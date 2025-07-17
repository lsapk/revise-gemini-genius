
import { Trophy, Target, Clock, TrendingUp, RotateCcw, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  duration: number; // en secondes
  onRetry?: () => void;
}

export function QuizResults({ score, totalQuestions, duration, onRetry }: QuizResultsProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}min ${secs}s`;
  };

  const getScoreMessage = () => {
    if (percentage >= 90) return { text: "Excellent travail !", color: "text-green-600", emoji: "🎉" };
    if (percentage >= 75) return { text: "Très bien !", color: "text-blue-600", emoji: "👏" };
    if (percentage >= 60) return { text: "Bien joué !", color: "text-orange-600", emoji: "👍" };
    if (percentage >= 40) return { text: "Il faut réviser", color: "text-yellow-600", emoji: "📚" };
    return { text: "Continuez vos efforts", color: "text-red-600", emoji: "💪" };
  };

  const scoreMessage = getScoreMessage();

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      {/* Résultat principal */}
      <Card className="text-center">
        <CardHeader className="pb-3">
          <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-2xl mb-2">Quiz terminé !</CardTitle>
          <p className={`text-lg font-medium ${scoreMessage.color}`}>
            {scoreMessage.emoji} {scoreMessage.text}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-center gap-2 text-3xl font-bold mb-2">
                <span>{score}</span>
                <span className="text-gray-400">/</span>
                <span>{totalQuestions}</span>
              </div>
              <Progress value={percentage} className="h-3 mb-2" />
              <p className="text-lg font-semibold">{percentage}% de réussite</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{score}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Bonnes réponses</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{formatDuration(duration)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Temps total</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">{Math.round(duration / totalQuestions)}s</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Par question</p>
          </CardContent>
        </Card>
      </div>

      {/* Analyse de performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Analyse de votre performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Précision</span>
            <span className="font-medium">{percentage}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Vitesse</span>
            <span className="font-medium">
              {duration < 180 ? 'Rapide' : duration < 300 ? 'Normal' : 'Lent'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Niveau</span>
            <span className="font-medium">
              {percentage >= 80 ? 'Maîtrisé' : percentage >= 60 ? 'En cours' : 'À revoir'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {onRetry && (
          <Button 
            variant="outline" 
            onClick={onRetry}
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Recommencer
          </Button>
        )}
        <Link to="/" className="flex-1">
          <Button className="w-full">
            <Home className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
        </Link>
      </div>

      {/* Conseils selon le score */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="pt-4">
          <h4 className="font-medium mb-2">💡 Conseil pour progresser :</h4>
          <p className="text-gray-700 dark:text-gray-300">
            {percentage >= 80 
              ? "Excellent ! Vous maîtrisez bien le sujet. Continuez à vous exercer régulièrement pour maintenir ce niveau."
              : percentage >= 60
              ? "Bon travail ! Revisez les points où vous avez fait des erreurs et refaites le quiz dans quelques jours."
              : "Il est important de revoir le cours avant de refaire le quiz. Concentrez-vous sur les concepts de base."
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
