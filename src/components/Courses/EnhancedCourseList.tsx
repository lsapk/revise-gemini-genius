import { useState } from 'react';
import { Search, Filter, BookOpen, Calendar, Clock, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ModernButton } from '@/components/ui/modern-button';
import { Badge } from '@/components/ui/badge';
import { ProfessionalCard, ProfessionalCardContent, ProfessionalCardHeader } from '@/components/ui/professional-card';
import { Link } from 'react-router-dom';

interface Lesson {
  id: string;
  title: string;
  subject_id: string;
  type: string;
  difficulty: string;
  created_at: string;
  data?: any;
}

interface Subject {
  id: string;
  name: string;
  color: string;
}

interface EnhancedCourseListProps {
  lessons: Lesson[];
  subjects: Subject[];
}

export function EnhancedCourseList({ lessons, subjects }: EnhancedCourseListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  // Filtrer et trier les cours
  const filteredLessons = lessons
    .filter(lesson => {
      const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = selectedSubject === 'all' || lesson.subject_id === selectedSubject;
      const matchesType = selectedType === 'all' || lesson.type === selectedType;
      
      return matchesSearch && matchesSubject && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'recent':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const getSubjectInfo = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId) || { name: 'Matière inconnue', color: '#gray' };
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'document': return '📄';
      case 'text': return '📝';
      case 'url': return '🔗';
      default: return '📚';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-xl border">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un cours..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Matière" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              {subjects.map(subject => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="video">Vidéo</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="text">Texte</SelectItem>
              <SelectItem value="url">Lien</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Tri" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Récent</SelectItem>
              <SelectItem value="oldest">Ancien</SelectItem>
              <SelectItem value="alphabetical">A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Liste des cours */}
      <div className="grid gap-4">
        {filteredLessons.length === 0 ? (
          <ProfessionalCard className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <BookOpen className="w-12 h-12 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold">Aucun cours trouvé</h3>
                <p className="text-muted-foreground">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            </div>
          </ProfessionalCard>
        ) : (
          filteredLessons.map(lesson => {
            const subject = getSubjectInfo(lesson.subject_id);
            return (
              <ProfessionalCard key={lesson.id} className="hover:shadow-lg transition-shadow">
                <ProfessionalCardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: subject.color + '20' }}
                      >
                        {getTypeIcon(lesson.type)}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{lesson.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {subject.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(lesson.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(lesson.difficulty)}>
                        {lesson.difficulty === 'easy' ? 'Facile' : 
                         lesson.difficulty === 'medium' ? 'Moyen' : 
                         lesson.difficulty === 'hard' ? 'Difficile' : lesson.difficulty}
                      </Badge>
                    </div>
                  </div>
                </ProfessionalCardHeader>
                
                <ProfessionalCardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {lesson.data?.summary && (
                        <Badge variant="secondary">Résumé</Badge>
                      )}
                      {lesson.data?.quiz && (
                        <Badge variant="secondary">QCM</Badge>
                      )}
                      {lesson.data?.flashcards && (
                        <Badge variant="secondary">Flashcards</Badge>
                      )}
                    </div>
                    
                    <ModernButton asChild size="sm">
                      <Link to={`/lesson/${lesson.id}`}>
                        Étudier
                      </Link>
                    </ModernButton>
                  </div>
                </ProfessionalCardContent>
              </ProfessionalCard>
            );
          })
        )}
      </div>
      
      {/* Statistiques */}
      <div className="text-center text-sm text-muted-foreground">
        {filteredLessons.length} cours sur {lessons.length} au total
      </div>
    </div>
  );
}