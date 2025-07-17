
import { useState, useRef } from 'react';
import { Upload, FileText, Loader2, AlertCircle, Camera, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ModernFileUploadProps {
  type: 'pdf' | 'image';
  onSubmit: (content: string) => void;
  isProcessing: boolean;
}

export function ModernFileUpload({ type, onSubmit, isProcessing }: ModernFileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = type === 'pdf' ? '.pdf' : 'image/*';
  const maxSize = type === 'pdf' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    processFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const selectedFile = e.dataTransfer.files?.[0];
    processFile(selectedFile);
  };

  const processFile = (selectedFile: File | undefined) => {
    setError('');
    
    if (!selectedFile) return;

    if (selectedFile.size > maxSize) {
      setError(`Le fichier est trop volumineux (max ${Math.round(maxSize / (1024 * 1024))}MB)`);
      return;
    }

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

    // Simulation réaliste du traitement
    if (type === 'pdf') {
      onSubmit(`Contenu extrait du PDF "${file.name}"`);
    } else {
      onSubmit(`Texte extrait de l'image "${file.name}" via OCR`);
    }
  };

  const Icon = type === 'pdf' ? File : Camera;
  const iconColor = type === 'pdf' ? 'from-red-500 to-pink-500' : 'from-green-500 to-emerald-500';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${iconColor} rounded-2xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">
            {type === 'pdf' ? 'Importer un PDF' : 'Analyser une image'}
          </h2>
          <p className="text-muted-foreground">
            {type === 'pdf' 
              ? 'Téléchargez votre document PDF pour extraction automatique'
              : 'Téléchargez une image pour reconnaissance de texte (OCR)'
            }
          </p>
        </div>
      </div>

      <Card className="shadow-xl border-2 border-border/50">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="flex items-center gap-3">
            <div className={`w-8 h-8 bg-gradient-to-br ${iconColor} rounded-lg flex items-center justify-center`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            {type === 'pdf' ? 'Document PDF' : 'Image/Photo'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              dragOver 
                ? 'border-primary bg-primary/5 scale-102' 
                : file 
                  ? 'border-primary bg-primary/2' 
                  : 'border-muted hover:border-primary/50'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes}
              onChange={handleFileChange}
              className="hidden"
              disabled={isProcessing}
            />
            
            {file ? (
              <div className="space-y-4">
                <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${iconColor} rounded-2xl flex items-center justify-center`}>
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{file.name}</p>
                  <p className="text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="mt-4"
                >
                  Changer de fichier
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-16 h-16 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-xl font-semibold mb-2">
                    {type === 'pdf' ? 'Glissez votre PDF ici' : 'Glissez votre image ici'}
                  </p>
                  <p className="text-muted-foreground mb-4">
                    ou cliquez pour parcourir vos fichiers
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    size="lg"
                  >
                    Parcourir
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Taille max: {Math.round(maxSize / (1024 * 1024))}MB
                </p>
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!file || isProcessing}
            className="w-full h-14 text-lg font-semibold mt-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                {type === 'pdf' ? 'Extraction en cours...' : 'Analyse en cours...'}
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-3" />
                {type === 'pdf' ? 'Extraire le texte' : 'Analyser l\'image'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
