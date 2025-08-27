
import { TrendingUp, BookOpen, Clock, Award, Target, Zap } from 'lucide-react';
import { ProfessionalCard, ProfessionalCardContent } from '@/components/ui/professional-card';

interface StatsGridProps {
  stats?: {
    totalStudyTime: number;
    sessionsCompleted: number;
    averageScore: number;
    subjectStats: Record<string, any>;
  };
}

export function ModernStatsGrid({ stats }: StatsGridProps) {
  // Provide default values if stats is undefined
  const safeStats = stats || {
    totalStudyTime: 0,
    sessionsCompleted: 0,
    averageScore: 0,
    subjectStats: {}
  };

  const statsData = [
    {
      icon: Clock,
      label: 'Temps d\'étude',
      value: `${Math.floor(safeStats.totalStudyTime / 60)}h ${safeStats.totalStudyTime % 60}min`,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20'
    },
    {
      icon: Target,
      label: 'Sessions complétées',
      value: safeStats.sessionsCompleted.toString(),
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20'
    },
    {
      icon: Award,
      label: 'Score moyen',
      value: `${safeStats.averageScore}%`,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20'
    },
    {
      icon: BookOpen,
      label: 'Matières actives',
      value: Object.keys(safeStats.subjectStats).length.toString(),
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <ProfessionalCard key={index} className={`${stat.bgColor} border-0 hover:scale-105 transition-all duration-300`}>
          <ProfessionalCardContent className="p-6 text-center">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
              <stat.icon className="w-7 h-7 text-white" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.label}</p>
            </div>
          </ProfessionalCardContent>
        </ProfessionalCard>
      ))}
    </div>
  );
}
