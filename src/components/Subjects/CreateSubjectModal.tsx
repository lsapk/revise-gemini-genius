
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ModernButton } from '@/components/ui/modern-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, BookOpen, Palette } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

const SUBJECT_COLORS = [
  '#3B82F6', // Bleu
  '#10B981', // Vert
  '#F59E0B', // Orange
  '#EF4444', // Rouge
  '#8B5CF6', // Violet
  '#06B6D4', // Cyan
  '#F97316', // Orange foncé
  '#84CC16', // Lime
];

interface CreateSubjectModalProps {
  children?: React.ReactNode;
}

export function CreateSubjectModal({ children }: CreateSubjectModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(SUBJECT_COLORS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const { addSubject } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await addSubject(name.trim(), description.trim() || undefined, selectedColor);
      toast.success(`Matière "${name}" créée avec succès !`);
      setName('');
      setDescription('');
      setSelectedColor(SUBJECT_COLORS[0]);
      setOpen(false);
    } catch (error) {
      toast.error('Erreur lors de la création de la matière');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <ModernButton variant="gradient" icon={<Plus />}>
            Nouvelle matière
          </ModernButton>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-card-foreground">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            Créer une nouvelle matière
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-card-foreground">Nom de la matière *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Mathématiques, Histoire..."
              required
              className="bg-background border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-card-foreground">Description (optionnel)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez brièvement cette matière..."
              className="bg-background border-border text-foreground resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-card-foreground">
              <Palette className="w-4 h-4" />
              Couleur de la matière
            </Label>
            <div className="grid grid-cols-4 gap-3">
              {SUBJECT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-12 h-12 rounded-2xl transition-all duration-200 ${
                    selectedColor === color 
                      ? 'ring-4 ring-primary/50 scale-110' 
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <ModernButton
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Annuler
            </ModernButton>
            <ModernButton
              type="submit"
              loading={isLoading}
              disabled={!name.trim()}
              icon={<Plus />}
            >
              Créer la matière
            </ModernButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
