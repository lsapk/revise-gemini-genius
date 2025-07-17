
import { FileText, Upload, Camera, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ContentTypeSelectorProps {
  selectedType: 'text' | 'pdf' | 'image' | 'url' | null;
  onSelect: (type: 'text' | 'pdf' | 'image' | 'url') => void;
}

const contentTypes = [
  {
    type: 'text' as const,
    icon: FileText,
    title: 'Texte',
    description: 'Coller du texte directement',
    color: 'bg-blue-500'
  },
  {
    type: 'pdf' as const,
    icon: Upload,
    title: 'PDF',
    description: 'Importer un fichier PDF',
    color: 'bg-red-500'
  },
  {
    type: 'image' as const,
    icon: Camera,
    title: 'Image/Photo',
    description: 'Prendre une photo ou importer une image',
    color: 'bg-green-500'
  },
  {
    type: 'url' as const,
    icon: LinkIcon,
    title: 'Lien web',
    description: 'Importer depuis une URL',
    color: 'bg-purple-500'
  }
];

export function ContentTypeSelector({ selectedType, onSelect }: ContentTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {contentTypes.map((type) => (
        <Card 
          key={type.type}
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedType === type.type 
              ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-900' 
              : 'hover:scale-[1.02]'
          }`}
          onClick={() => onSelect(type.type)}
        >
          <CardContent className="p-4 text-center">
            <div className={`${type.color} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3`}>
              <type.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-1">{type.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{type.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
