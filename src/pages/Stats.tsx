
import { Layout } from '@/components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/AppContext';
import { BarChart3, Clock, Target, TrendingUp, Trophy, Brain, Zap } from 'lucide-react';
import { storage } from '@/lib/storage';

export default function Stats() {
  const { subjects, stats } = useApp();
  const sessions = storage.getStudySessions();

  // Calculer les statistiques par matière
  const subjectStats = subjects.map(subject => {
    const subjectSessions = sessions.filter(session => {
      const lesson = storage.getLesson(session.lessonId);
      return lesson && lesson.subjectId === subject.id;
    });

    const totalTime = subjectSessions.reduce((sum, session) => sum + session.duration, 0);
    const averageScore = subjectSessions.length > 0 
      ? subjectSessions.reduce((sum, session) => sum + (session.score / session.totalQuestions * 100), 0) / subjectSessions.length
      : 0;

    return {
      subject,
      sessionsCount: subjectSessions.length,
      totalTime: Math.round(totalTime / 60), // en minutes
      averageScore: Math.round(averageScore)
    };
  }).sort((a, b) => b.totalTime - a.totalTime);

  // Statistiques récentes (7 derniers jours)
  const recentSessions = sessions.filter(session => {
    const sessionDate = new Date(session.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessionDate >= weekAgo;
  });

  const recentStudyTime = Math.round(recentSessions.reduce((sum, session) => sum + session.duration, 0) / 60);

  return (
    <Layout title="Mes statistiques" showBack>
      <div className="p-4 space-y-6">
        {/* Statistiques globales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{stats.totalStudyTime}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Minutes étudiées</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{Math.round(stats.averageScore)}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Score moyen</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">{stats.sessionsCompleted}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sessions totales</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">{recentStudyTime}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Minutes (7j)</p>
            </CardContent>
          </Card>
        </div>

        {/* Progression par matière */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Progression par matière
            </CardTitle>
          </CardHeader>
          <CardContent>
            {subjectStats.length > 0 ? (
              <div className="space-y-4">
                {subjectStats.map(({ subject, sessionsCount, totalTime, averageScore }) => (
                  <div key={subject.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: subject.color }}
                        />
                        <span className="font-medium">{subject.name}</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {totalTime}min • {sessionsCount} sessions • {averageScore}%
                      </div>
                    </div>
                    <Progress value={averageScore} className="h-2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Aucune donnée de progression disponible</p>
                <p className="text-sm">Commencez à réviser pour voir vos statistiques</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activité récente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Activité récente (7 derniers jours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentSessions.length > 0 ? (
              <div className="space-y-3">
                {recentSessions.slice(-5).reverse().map((session) => {
                  const lesson = storage.getLesson(session.lessonId);
                  const subject = subjects.find(s => s.id === lesson?.subjectId);
                  const score = Math.round((session.score / session.totalQuestions) * 100);
                  
                  return (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          {session.type === 'qcm' ? <Brain className="w-5 h-5 text-primary" /> :
                           session.type === 'quiz' ? <Zap className="w-5 h-5 text-primary" /> :
                           <Target className="w-5 h-5 text-primary" />}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{lesson?.title || 'Leçon inconnue'}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {subject?.name} • {session.type.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-orange-600' : 'text-red-600'}`}>
                          {score}%
                        </p>
                        <p className="text-xs text-gray-500">
                          {Math.round(session.duration / 60)}min
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Aucune activité récente</p>
                <p className="text-sm">Vos dernières sessions apparaîtront ici</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conseils personnalisés */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="text-lg">💡 Conseils personnalisés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {stats.averageScore < 60 && (
                <p className="text-orange-600">
                  • Votre score moyen est de {Math.round(stats.averageScore)}%. Concentrez-vous sur la relecture des cours avant les quiz.
                </p>
              )}
              {stats.totalStudyTime < 60 && (
                <p className="text-blue-600">
                  • Essayez d'étudier au moins 15 minutes par jour pour améliorer vos résultats.
                </p>
              )}
              {recentStudyTime === 0 && (
                <p className="text-purple-600">
                  • Vous n'avez pas étudié cette semaine. Maintenez une routine de révision régulière !
                </p>
              )}
              {stats.averageScore >= 80 && (
                <p className="text-green-600">
                  • Excellent ! Continuez sur cette lancée et challengez-vous avec des sujets plus avancés.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
