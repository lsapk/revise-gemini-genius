
import { Clock, BookOpen, Brain, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StudySession } from '@/lib/storage';
import { useApp } from '@/contexts/AppContext';
import { Link } from 'react-router-dom';

export function RecentActivity() {
  const { subjects } = useApp();
  
  // Simuler des activités récentes
  const recentActivities = [
    {
      id: '1',
      type: 'quiz',
      lesson: 'Les fonctions en mathématiques',
      subject: 'Mathématiques',
      score: 85,
      time: '2 heures',
      icon: Brain
    },
    {
      id: '2',
      type: 'flashcards',
      lesson: 'La révolution française',
      subject: 'Histoire',
      score: 92,
      time: '1 jour',
      icon: Zap
    },
    {
      id: '3',
      type: 'study',
      lesson: 'Les réactions chimiques',
      subject: 'Chimie',
      score: 78,
      time: '3 jours',
      icon: BookOpen
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Activité récente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentActivities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <activity.icon className="w-5 h-5 text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{activity.lesson}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{activity.subject}</p>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-medium text-green-600">{activity.score}%</p>
              <p className="text-xs text-gray-500">il y a {activity.time}</p>
            </div>
          </div>
        ))}
        
        {recentActivities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucune activité récente</p>
            <p className="text-sm">Commencez à réviser pour voir vos progrès ici</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
