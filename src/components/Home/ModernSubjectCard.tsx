
import { Link } from 'react-router-dom';
import { BookOpen, FileText, Clock, TrendingUp, ChevronRight } from 'lucide-react';
import { ModernCard, ModernCardContent } from '@/components/ui/modern-card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Subject } from '@/lib/storage';

interface ModernSubjectCardProps {
  subject: Subject;
  stats?: {
    studyTime: number;
    averageScore: number;
    sessionsCount: number;
  };
}

export function ModernSubjectCard({ subject, stats }: ModernSubjectCardProps) {
  const totalLessons = subject.chapters.reduce((acc, chapter) => acc + chapter.lessons.length, 0);
  const progressPercentage = stats?.averageScore || Math.min(totalLessons * 15, 100);

  return (
    <Link to={`/subject/${subject.id}`}>
      <ModernCard className="group hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary-500 to-primary-400"></div>
        
        <ModernCardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                style={{ backgroundColor: subject.color }}
              >
                {subject.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                  {subject.name}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{subject.chapters.length} chapitre{subject.chapters.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>{totalLessons} leçon{totalLessons > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
          </div>

          {stats && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock className="w-3 h-3 text-blue-600" />
                  </div>
                  <p className="text-sm font-semibold text-blue-600">{stats.studyTime}min</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Temps</p>
                </div>
                
                <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-xl">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  </div>
                  <p className="text-sm font-semibold text-green-600">{Math.round(stats.averageScore)}%</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Score</p>
                </div>
                
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-xl">
                  <p className="text-sm font-semibold text-purple-600">{stats.sessionsCount}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Sessions</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Progression</span>
                  <span className="font-medium text-gray-900 dark:text-white">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </div>
          )}

          {!stats && totalLessons === 0 && (
            <div className="text-center py-4">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Aucune leçon pour le moment</p>
            </div>
          )}
        </ModernCardContent>
      </ModernCard>
    </Link>
  );
}
