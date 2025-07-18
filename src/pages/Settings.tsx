
import { useState } from 'react';
import { Layout } from '@/components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Sparkles, 
  Moon, 
  Settings as SettingsIcon,
  Bell,
  Key,
  User,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode, geminiApiKey, setGeminiApiKey } = useApp();
  const { toast } = useToast();
  
  const [apiKey, setApiKey] = useState(geminiApiKey);
  const [notifications, setNotifications] = useState(true);

  const handleSaveApiKey = async () => {
    await setGeminiApiKey(apiKey);
    toast({
      title: "Clé API sauvegardée",
      description: "Votre clé API Gemini a été enregistrée avec succès.",
    });
  };

  const getDisplayName = () => {
    if (user?.user_metadata?.display_name) {
      return user.user_metadata.display_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Utilisateur';
  };

  return (
    <Layout title="Paramètres" showBack>
      <div className="p-4 max-w-2xl mx-auto space-y-6">
        
        {/* Profil utilisateur */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profil utilisateur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {getDisplayName().substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-lg">{getDisplayName()}</p>
                <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              </div>
            </div>
            
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Vos données sont sécurisées et chiffrées. Seul vous avez accès à vos informations.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

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
                  Ajoutez votre clé API Gemini pour utiliser l'assistant IA et générer du contenu automatiquement.
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
                <span className="font-mono">2.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Développé avec</span>
                <span>React + Supabase</span>
              </div>
              <div className="flex justify-between">
                <span>IA</span>
                <span>Google Gemini</span>
              </div>
              <div className="flex justify-between">
                <span>Stockage</span>
                <span>Supabase (sécurisé)</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                ReviseGenius - Application de révision intelligente avec authentification et stockage sécurisé
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
