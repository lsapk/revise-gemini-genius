import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout/Layout';
import { ProfessionalCard, ProfessionalCardContent } from '@/components/ui/professional-card';
import { ModernButton } from '@/components/ui/modern-button';
import { BookOpen, Plus, ChevronRight, Clock, Eye } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { CreateSubjectModal } from '@/components/Subjects/CreateSubjectModal';

export default function MyCourses() {
  const { subjects, lessons, refreshSubjects, user } = useApp();
  const navigate = useNavigate();
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());

  useEffect(() => {
    refreshSubjects();
  }, [refreshSubjects]);

  const toggleSubject = (subjectId: string) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(subjectId)) {
      newExpanded.delete(subjectId);
    } else {
      newExpanded.add(subjectId);
    }
    setExpandedSubjects(newExpanded);
  };

  const getSubjectLessons = (subjectId: string) => {
    return lessons.filter(lesson => lesson.subject_id === subjectId);
  };

  const handleViewLesson = (lesson: any) => {
    navigate(`/lesson/${lesson.id}`);
  };

  if (!user) {
    return (
      <Layout title="Mes cours">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Mes cours</h1>
              <p className="text-muted-foreground">
                Vous devez être connecté pour voir vos cours
              </p>
            </div>
          </div>
          
          <ProfessionalCard>
            <ProfessionalCardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-muted to-muted/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">Connexion requise</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Connectez-vous pour accéder à vos cours et gérer votre contenu d'apprentissage.
              </p>
            </ProfessionalCardContent>
          </ProfessionalCard>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Mes cours">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Mes cours</h1>
            <p className="text-muted-foreground">
              Gérez et consultez tous vos cours par matière
            </p>
          </div>
          <div className="flex gap-3">
            <CreateSubjectModal>
              <ModernButton variant="outline" icon={<Plus />}>
                Nouvelle matière
              </ModernButton>
            </CreateSubjectModal>
            <ModernButton 
              variant="gradient" 
              icon={<Plus />}
              onClick={() => navigate('/add')}
            >
              Nouveau cours
            </ModernButton>
          </div>
        </div>

        {subjects.length === 0 ? (
          <ProfessionalCard>
            <ProfessionalCardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-muted to-muted/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">Aucun cours créé</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Commencez par créer votre première matière puis ajoutez des cours pour commencer vos révisions.
              </p>
              <div className="flex gap-3 justify-center">
                <CreateSubjectModal>
                  <ModernButton variant="outline" icon={<Plus />}>
                    Première matière
                  </ModernButton>
                </CreateSubjectModal>
                <ModernButton 
                  variant="gradient" 
                  icon={<Plus />}
                  onClick={() => navigate('/add')}
                >
                  Premier cours
                </ModernButton>
              </div>
            </ProfessionalCardContent>
          </ProfessionalCard>
        ) : (
          <div className="space-y-6">
            {subjects.map((subject: any) => {
              const isExpanded = expandedSubjects.has(subject.id);
              const subjectLessons = getSubjectLessons(subject.id);
              
              return (
                <ProfessionalCard key={subject.id}>
                  <ProfessionalCardContent className="p-6">
                    <div 
                      className="flex items-center justify-between cursor-pointer p-4 rounded-xl hover:bg-muted/50 transition-colors"
                      onClick={() => toggleSubject(subject.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: subject.color }}
                        >
                          {subject.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-card-foreground">
                            {subject.name}
                          </h3>
                          <p className="text-muted-foreground">
                            {subjectLessons.length} cours
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Link to={`/subject/${subject.id}`}>
                          <ModernButton variant="outline" size="sm" icon={<Eye />}>
                            Voir détail
                          </ModernButton>
                        </Link>
                        <ChevronRight 
                          className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        />
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pl-16 space-y-3">
                        {subjectLessons.length === 0 ? (
                          <p className="text-muted-foreground py-4">
                            Aucun cours créé pour cette matière.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {subjectLessons.map((lesson: any) => (
                              <div 
                                key={lesson.id}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-background/80 transition-colors group border border-border"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 bg-secondary/20 rounded flex items-center justify-center">
                                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-card-foreground text-sm">
                                      {lesson.title}
                                    </h5>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(lesson.created_at).toLocaleDateString()}
                                      </span>
                                      {lesson.type && (
                                        <span className="px-2 py-1 bg-primary/10 text-primary rounded uppercase">
                                          {lesson.type}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {lesson.data && (
                                    <div className="flex items-center gap-1">
                                      {lesson.data.qcm && (
                                        <div className="w-2 h-2 bg-green-500 rounded-full" title="QCM disponible"></div>
                                      )}
                                      {lesson.data.flashcards && (
                                        <div className="w-2 h-2 bg-blue-500 rounded-full" title="Flashcards disponibles"></div>
                                      )}
                                      {lesson.data.summary && (
                                        <div className="w-2 h-2 bg-purple-500 rounded-full" title="Résumé disponible"></div>
                                      )}
                                    </div>
                                  )}
                                  <ModernButton 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleViewLesson(lesson)}
                                  >
                                    Voir
                                  </ModernButton>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </ProfessionalCardContent>
                </ProfessionalCard>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}