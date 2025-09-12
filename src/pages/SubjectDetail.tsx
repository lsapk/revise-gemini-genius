
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout/Layout';
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { 
  BookOpen, 
  Plus, 
  FileText, 
  Clock, 
  TrendingUp,
  Edit,
  Trash2,
  Play
} from 'lucide-react';

export default function SubjectDetail() {
  const { id: subjectId } = useParams();
  const { subjects, lessons, deleteSubject, getSubjectById } = useApp();
  const [subject, setSubject] = useState<any>(null);
  const subjectLessons = lessons.filter(lesson => lesson.subject_id === subjectId);

  useEffect(() => {
    const foundSubject = getSubjectById(subjectId || '');
    setSubject(foundSubject);
  }, [subjectId, getSubjectById]);

  const handleDeleteSubject = async () => {
    if (subject && window.confirm(`Êtes-vous sûr de vouloir supprimer la matière "${subject.name}" ?`)) {
      await deleteSubject(subject.id);
      window.history.back();
    }
  };

  if (!subject) {
    return (
      <Layout title="Matière introuvable">
        <div className="max-w-4xl mx-auto p-4">
          <ModernCard>
            <ModernCardContent className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Matière introuvable</h3>
              <p className="text-muted-foreground mb-6">
                La matière que vous cherchez n'existe pas ou a été supprimée.
              </p>
              <Link to="/">
                <Button>Retour à l'accueil</Button>
              </Link>
            </ModernCardContent>
          </ModernCard>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={subject.name} showBack>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        
        {/* En-tête de la matière */}
        <ModernCard>
          <ModernCardHeader>
            <div className="flex items-start justify-between">
              <div>
                <ModernCardTitle className="flex items-center gap-3">
                  <div 
                    className="w-3 h-8 rounded-full" 
                    style={{ backgroundColor: subject.color }}
                  />
                  {subject.name}
                </ModernCardTitle>
                {subject.description && (
                  <p className="text-muted-foreground mt-2">{subject.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => window.alert('Fonctionnalité à venir')}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleDeleteSubject}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </ModernCardHeader>
          <ModernCardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{subjectLessons.length}</p>
                <p className="text-sm text-muted-foreground">Cours</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">--</p>
                <p className="text-sm text-muted-foreground">Progression</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
                <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">--</p>
                <p className="text-sm text-muted-foreground">Temps d'étude</p>
              </div>
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Actions rapides - SANS les boutons de révision */}
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle>Actions</ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to={`/add?subject=${subjectId}`}>
                <Button className="w-full h-16 flex flex-col gap-2">
                  <Plus className="w-5 h-5" />
                  <span className="text-sm">Ajouter un cours</span>
                </Button>
              </Link>
              <Link to="/stats">
                <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm">Voir les statistiques</span>
                </Button>
              </Link>
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Liste des cours */}
        <ModernCard>
          <ModernCardHeader>
            <div className="flex items-center justify-between">
              <ModernCardTitle>Cours</ModernCardTitle>
              <Badge variant="secondary">{subjectLessons.length} cours</Badge>
            </div>
          </ModernCardHeader>
          <ModernCardContent>
            {subjectLessons.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun cours</h3>
                <p className="text-muted-foreground mb-6">
                  Commencez par ajouter votre premier cours à cette matière.
                </p>
                <Link to="/add">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un cours
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {subjectLessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="p-4 border rounded-xl hover:shadow-md transition-all hover:border-primary/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-medium">{lesson.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {lesson.type} • Ajouté le {new Date(lesson.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <Link to={`/lesson/${lesson.id}`}>
                        <Button size="sm" className="gap-2">
                          <Play className="w-4 h-4" />
                          Étudier
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ModernCardContent>
        </ModernCard>
      </div>
    </Layout>
  );
}
