
import { FileText, Upload, Camera, Link as LinkIcon, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ModernContentTypeSelectorProps {
  selectedType: 'text' | 'pdf' | 'image' | 'url' | null;
  onSelect: (type: 'text' | 'pdf' | 'image' | 'url') => void;
}

const contentTypes = [
  {
    type: 'text' as const,
    icon: FileText,
    title: 'Texte brut',
    description: 'Coller directement votre contenu',
    gradient: 'from-blue-500 to-cyan-500',
    iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500'
  },
  {
    type: 'pdf' as const,
    icon: Upload,
    title: 'Document PDF',
    description: 'Importer un fichier PDF',
    gradient: 'from-red-500 to-pink-500',
    iconBg: 'bg-gradient-to-br from-red-500 to-pink-500'
  },
  {
    type: 'image' as const,
    icon: Camera,
    title: 'Image/Photo',
    description: 'Scanner une image ou photo',
    gradient: 'from-green-500 to-emerald-500',
    iconBg: 'bg-gradient-to-br from-green-500 to-emerald-500'
  },
  {
    type: 'url' as const,
    icon: LinkIcon,
    title: 'Lien web',
    description: 'Importer depuis une URL',
    gradient: 'from-purple-500 to-violet-500',
    iconBg: 'bg-gradient-to-br from-purple-500 to-violet-500'
  }
];

export function ModernContentTypeSelector({ selectedType, onSelect }: ModernContentTypeSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center shadow-lg">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Ajouter un nouveau cours
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Choisissez la source de votre contenu pour démarrer l'analyse IA
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {contentTypes.map((type) => (
          <Card 
            key={type.type}
            className={cn(
              "group cursor-pointer transition-all duration-300 hover:scale-105 border-2",
              selectedType === type.type 
                ? 'ring-2 ring-primary ring-offset-4 border-primary shadow-xl shadow-primary/20' 
                : 'border-border hover:border-primary/50 hover:shadow-lg'
            )}
            onClick={() => onSelect(type.type)}
          >
            <CardContent className="p-8 text-center space-y-4">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg",
                type.iconBg
              )}>
                <type.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{type.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {type.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
