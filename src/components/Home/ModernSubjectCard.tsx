
import { Link } from 'react-router-dom';
import { Clock, Trophy, Target, BookOpen, MoreVertical, Trash2, Edit } from 'lucide-react';
import { ModernCard, ModernCardContent } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { Subject } from '@/lib/storage';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ModernSubjectCardProps {
  subject: Subject;
  stats?: {
    studyTime: number;
    averageScore: number;
    sessionsCount: number;
  };
  onDelete?: (id: string) => void;
  onEdit?: (subject: Subject) => void;
}

export function ModernSubjectCard({ subject, stats, onDelete, onEdit }: ModernSubjectCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete && confirm('Êtes-vous sûr de vouloir supprimer cette matière et tous ses contenus ?')) {
      onDelete(subject.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit(subject);
    }
  };

  return (
    <ModernCard className="group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
      {/* Menu dropdown en haut à droite */}
      <div className="absolute top-3 right-3 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white shadow-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleDelete} 
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Link to={`/subject/${subject.id}`} className="block">
        <ModernCardContent className="p-4 sm:p-6">
          {/* Header avec couleur de la matière */}
          <div className="flex items-start gap-3 mb-4">
            <div 
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
              style={{ backgroundColor: subject.color }}
            >
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            
            <div className="flex-1 min-w-0 pr-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate mb-1">
                {subject.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subject.chapters.length} chapitre{subject.chapters.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Statistiques - Layout mobile optimisé */}
          {stats && (
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4">
              <div className="text-center p-2 sm:p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-blue-600">{stats.studyTime}min</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Temps</p>
              </div>
              
              <div className="text-center p-2 sm:p-3 bg-green-50 dark:bg-green-950/30 rounded-xl">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-green-600">{Math.round(stats.averageScore)}%</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Score</p>
              </div>
              
              <div className="text-center p-2 sm:p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Target className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-purple-600">{stats.sessionsCount}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Sessions</p>
              </div>
            </div>
          )}

          {/* Progression des chapitres */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Progression
              </span>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {subject.chapters.length} chapitres
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  backgroundColor: subject.color,
                  width: subject.chapters.length > 0 ? '65%' : '0%'
                }}
              />
            </div>
          </div>
        </ModernCardContent>
      </Link>
    </ModernCard>
  );
}
