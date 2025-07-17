
import { useState } from 'react';
import { Layout } from '@/components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useApp } from '@/contexts/AppContext';
import { storage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { 
  Sparkles, 
  Moon, 
  Download, 
  Upload, 
  Trash2, 
  Settings as SettingsIcon,
  Bell,
  Key,
  Database,
  AlertTriangle
} from 'lucide-react';

export default function Settings() {
  const { isDarkMode, toggleDarkMode, geminiApiKey, setGeminiApiKey } = useApp();
  const { toast } = useToast();
  
  const [apiKey, setApiKey] = useState(geminiApiKey);
  const [notifications, setNotifications] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleSaveApiKey = () => {
    setGeminiApiKey(apiKey);
    toast({
      title: "Clé API sauvegardée",
      description: "Votre clé API Gemini a été enregistrée avec succès.",
    });
  };

  const handleExportData = () => {
    try {
      const data = storage.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `revise-genius-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Données exportées",
        description: "Vos données ont été exportées avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les données.",
        variant: "destructive"
      });
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        storage.importData(data);
        toast({
          title: "Données importées",
          description: "Vos données ont été importées avec succès. Rechargez la page.",
        });
      } catch (error) {
        toast({
          title: "Erreur d'import",
          description: "Format de fichier invalide.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteAllData = () => {
    if (showConfirmDelete) {
      localStorage.clear();
      toast({
        title: "Données supprimées",
        description: "Toutes vos données ont été supprimées. Rechargez la page.",
        variant: "destructive"
      });
      setShowConfirmDelete(false);
    } else {
      setShowConfirmDelete(true);
    }
  };

  return (
    <Layout title="Réglages" showBack>
      <div className="p-4 max-w-2xl mx-auto space-y-6">
        
        {/* Configuration IA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Intelligence Artificielle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Clé API Google AI Studio (Gemini)</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Entrez votre clé API Gemini..."
              />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Obtenez votre clé gratuite sur{' '}
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>
            
            <Button onClick={handleSaveApiKey} className="w-full">
              <Key className="w-4 h-4 mr-2" />
              Sauvegarder la clé API
            </Button>

            {!geminiApiKey && (
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertDescription>
                  Sans clé API, l'application fonctionne en mode démonstration avec des données d'exemple.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Apparence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="w-5 h-5" />
              Apparence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mode sombre</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Activer le thème sombre de l'application
                </p>
              </div>
              <Switch 
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Rappels de révision</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Recevoir des notifications pour réviser
                </p>
              </div>
              <Switch 
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sauvegarde et restauration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Sauvegarde des données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button variant="outline" onClick={handleExportData}>
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
              
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                  id="import-file"
                />
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('import-file')?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Importer
                </Button>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Exportez vos données pour les sauvegarder ou les transférer vers un autre appareil.
            </p>
          </CardContent>
        </Card>

        {/* Zone dangereuse */}
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Zone dangereuse
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium text-red-600 dark:text-red-400">Supprimer toutes les données</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Cette action est irréversible. Toutes vos matières, cours et statistiques seront perdus.
              </p>
              
              {showConfirmDelete && (
                <Alert variant="destructive" className="mb-3">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Êtes-vous sûr ? Cette action ne peut pas être annulée.
                  </AlertDescription>
                </Alert>
              )}
              
              <Button 
                variant="destructive" 
                onClick={handleDeleteAllData}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {showConfirmDelete ? 'Confirmer la suppression' : 'Supprimer toutes les données'}
              </Button>
              
              {showConfirmDelete && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowConfirmDelete(false)}
                  className="w-full mt-2"
                >
                  Annuler
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Informations de l'application */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              À propos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Version</span>
                <span className="font-mono">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Développé avec</span>
                <span>React + Tailwind CSS</span>
              </div>
              <div className="flex justify-between">
                <span>IA</span>
                <span>Google Gemini</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                ReviseGenius - Application de révision intelligente pour lycéens
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
