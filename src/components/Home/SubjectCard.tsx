
import { BookOpen, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Subject } from '@/lib/storage';
import { Link } from 'react-router-dom';

interface SubjectCardProps {
  subject: Subject;
  stats?: {
    studyTime: number;
    averageScore: number;
    sessionsCount: number;
  };
}

export function SubjectCard({ subject, stats }: SubjectCardProps) {
  const lessonsCount = subject.chapters.reduce((total, chapter) => total + chapter.lessons.length, 0);
  
  return (
    <Link to={`/subject/${subject.id}`}>
      <Card className="transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: subject.color }}
              />
              <h3 className="font-semibold text-lg">{subject.name}</h3>
            </div>
            <BookOpen className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{subject.chapters.length} chapitres</span>
              <span>{lessonsCount} leçons</span>
            </div>
            
            {stats && (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{stats.studyTime}min étudiées</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progression</span>
                    <span className="font-medium">{Math.round(stats.averageScore)}%</span>
                  </div>
                  <Progress value={stats.averageScore} className="h-2" />
                </div>
                
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>{stats.sessionsCount} sessions</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
