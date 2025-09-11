
import { BookOpen, Play, FileText, Brain, MoreVertical, Trash2, Edit } from 'lucide-react';
import { ProfessionalCard, ProfessionalCardContent, ProfessionalCardHeader, ProfessionalCardTitle, ProfessionalCardDescription } from '@/components/ui/professional-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useApp } from '@/contexts/AppContext';
import { Link } from 'react-router-dom';
import { getSubjectAnalytics, StudySession, Lesson } from '@/components/Analytics/RealStatsCalculator';

interface Subject {
  id: string;
  name: string;
  description?: string;
  color: string;
  lessons_count: number;
  created_at: string;
}

interface ModernSubjectCardProps {
  subject: Subject;
  lessons?: Lesson[];
  studySessions?: StudySession[];
}

export function ModernSubjectCard({ subject, lessons = [], studySessions = [] }: ModernSubjectCardProps) {
  const { deleteSubject } = useApp();

  // Calculer les vraies analyses pour cette matière
  const analytics = getSubjectAnalytics(subject.id, lessons, studySessions);

  const handleDelete = async () => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la matière "${subject.name}" ?`)) {
      await deleteSubject(subject.id);
    }
  };

  return (
    <ProfessionalCard className="group hover:scale-105 transition-all duration-300">
      <ProfessionalCardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: subject.color + '20', border: `2px solid ${subject.color}40` }}
            >
              <BookOpen className="w-8 h-8" style={{ color: subject.color }} />
            </div>
            <div className="space-y-2">
              <ProfessionalCardTitle className="text-xl">{subject.name}</ProfessionalCardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {subject.lessons_count} cours
                </Badge>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ModernButton variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </ModernButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {subject.description && (
          <ProfessionalCardDescription className="mt-3">
            {subject.description}
          </ProfessionalCardDescription>
        )}
      </ProfessionalCardHeader>

      <ProfessionalCardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-muted/50 rounded-xl p-3">
            <FileText className="w-5 h-5 mx-auto mb-1 text-blue-600" />
            <p className="text-xs font-medium text-muted-foreground">Résumés</p>
            <p className="text-sm font-bold">{analytics.summariesCount}</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-3">
            <Brain className="w-5 h-5 mx-auto mb-1 text-green-600" />
            <p className="text-xs font-medium text-muted-foreground">QCM</p>
            <p className="text-sm font-bold">{analytics.quizzesCount}</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-3">
            <Play className="w-5 h-5 mx-auto mb-1 text-purple-600" />
            <p className="text-xs font-medium text-muted-foreground">Flash</p>
            <p className="text-sm font-bold">{analytics.flashcardsCount}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <ModernButton 
            asChild 
            variant="default" 
            size="sm" 
            className="flex-1"
            icon={<Play />}
          >
            <Link to={`/subject/${subject.id}`}>
              Réviser
            </Link>
          </ModernButton>
          
          <ModernButton 
            asChild 
            variant="outline" 
            size="sm"
            icon={<FileText />}
          >
            <Link to={`/subject/${subject.id}`}>
              Voir Cours
            </Link>
          </ModernButton>
        </div>
      </ProfessionalCardContent>
    </ProfessionalCard>
  );
}
