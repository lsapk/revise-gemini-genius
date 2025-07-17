
import { useState, useRef } from 'react';
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FileUploadProps {
  type: 'pdf' | 'image';
  onSubmit: (content: string) => void;
  isProcessing: boolean;
}

export function FileUpload({ type, onSubmit, isProcessing }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = type === 'pdf' ? '.pdf' : 'image/*';
  const maxSize = type === 'pdf' ? 10 * 1024 * 1024 : 5 * 1024 * 1024; // 10MB pour PDF, 5MB pour images

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError('');
    
    if (!selectedFile) return;

    // Vérifier la taille
    if (selectedFile.size > maxSize) {
      setError(`Le fichier est trop volumineux (max ${Math.round(maxSize / (1024 * 1024))}MB)`);
      return;
    }

    // Vérifier le type
    if (type === 'pdf' && selectedFile.type !== 'application/pdf') {
      setError('Seuls les fichiers PDF sont acceptés');
      return;
    }

    if (type === 'image' && !selectedFile.type.startsWith('image/')) {
      setError('Seules les images sont acceptées');
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file) return;

    if (type === 'pdf') {
      // Pour les PDF, on simule l'extraction de texte
      setTimeout(() => {
        onSubmit(`Contenu extrait du PDF "${file.name}": 

Ceci est un exemple de contenu extrait d'un fichier PDF. Dans une vraie implémentation, vous pourriez utiliser une bibliothèque comme PDF.js pour extraire le texte réel du PDF.

Le fichier "${file.name}" a été traité avec succès.`);
      }, 2000);
    } else {
      // Pour les images, on simule l'OCR
      setTimeout(() => {
        onSubmit(`Texte extrait de l'image "${file.name}" via OCR:

Ceci est un exemple de texte extrait d'une image. Dans une vraie implémentation, vous utiliseriez l'API Gemini Vision pour extraire le texte réel de l'image.

L'image "${file.name}" a été analysée avec succès.`);
      }, 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          onChange={handleFileChange}
          className="hidden"
          disabled={isProcessing}
        />
        
        {file ? (
          <div className="space-y-3">
            <FileText className="w-12 h-12 mx-auto text-primary" />
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / (1024 * 1024)).toFixed(1)} MB
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
            >
              Changer de fichier
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="w-12 h-12 mx-auto text-gray-400" />
            <div>
              <p className="font-medium">
                Cliquez pour {type === 'pdf' ? 'importer un PDF' : 'sélectionner une image'}
              </p>
              <p className="text-sm text-gray-500">
                ou glissez-déposez votre fichier ici
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
            >
              Parcourir
            </Button>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!file || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {type === 'pdf' ? 'Extraction du texte...' : 'Analyse de l\'image...'}
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            {type === 'pdf' ? 'Extraire le texte' : 'Analyser l\'image'}
          </>
        )}
      </Button>
    </div>
  );
}
