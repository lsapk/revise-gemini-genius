
import { useState } from 'react';
import { Layout } from '@/components/Layout/Layout';
import { ProfessionalCard, ProfessionalCardContent, ProfessionalCardHeader, ProfessionalCardTitle, ProfessionalCardDescription } from '@/components/ui/professional-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useApp } from '@/contexts/AppContext';
import { Settings2, Key, Moon, Bell, User, Palette, Shield, HelpCircle, Save } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Settings() {
  const { isDarkMode, geminiApiKey, toggleDarkMode, setGeminiApiKey } = useApp();
  const [tempApiKey, setTempApiKey] = useState(geminiApiKey);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSaveApiKey = async () => {
    await setGeminiApiKey(tempApiKey);
  };

  return (
    <Layout title="Paramètres" className="max-w-4xl mx-auto space-y-8">
      {/* Profil utilisateur */}
      <ProfessionalCard>
        <ProfessionalCardHeader>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <ProfessionalCardTitle>Profil utilisateur</ProfessionalCardTitle>
              <ProfessionalCardDescription>
                Gérez vos informations personnelles
              </ProfessionalCardDescription>
            </div>
          </div>
        </ProfessionalCardHeader>
        <ProfessionalCardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" placeholder="Votre nom" defaultValue="Étudiant" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="votre@email.com" />
            </div>
          </div>
          <ModernButton variant="default" icon={<Save />}>
            Sauvegarder le profil
          </ModernButton>
        </ProfessionalCardContent>
      </ProfessionalCard>

      {/* Configuration IA */}
      <ProfessionalCard>
        <ProfessionalCardHeader>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center">
              <Key className="w-6 h-6 text-white" />
            </div>
            <div>
              <ProfessionalCardTitle>Configuration IA</ProfessionalCardTitle>
              <ProfessionalCardDescription>
                Configurez l'accès à l'intelligence artificielle
              </ProfessionalCardDescription>
            </div>
          </div>
        </ProfessionalCardHeader>
        <ProfessionalCardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="apikey">Clé API Gemini</Label>
            <div className="flex gap-3">
              <Input
                id="apikey"
                type="password"
                placeholder="Entrez votre clé API Gemini..."
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                className="flex-1"
              />
              <ModernButton 
                onClick={handleSaveApiKey} 
                disabled={tempApiKey === geminiApiKey}
                variant="outline"
              >
                Sauvegarder
              </ModernButton>
            </div>
            <p className="text-sm text-muted-foreground">
              Obtenez votre clé API gratuitement sur{' '}
              <a 
                href="https://makersuite.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>
        </ProfessionalCardContent>
      </ProfessionalCard>

      {/* Préférences */}
      <ProfessionalCard>
        <ProfessionalCardHeader>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <Settings2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <ProfessionalCardTitle>Préférences</ProfessionalCardTitle>
              <ProfessionalCardDescription>
                Personnalisez votre expérience utilisateur
              </ProfessionalCardDescription>
            </div>
          </div>
        </ProfessionalCardHeader>
        <ProfessionalCardContent className="space-y-6">
          {/* Mode sombre */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                <Moon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold">Mode sombre</p>
                <p className="text-sm text-muted-foreground">Interface avec thème sombre</p>
              </div>
            </div>
            <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
          </div>

          <Separator />

          {/* Notifications */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold">Notifications</p>
                <p className="text-sm text-muted-foreground">Recevoir des rappels de révision</p>
              </div>
            </div>
            <Switch 
              checked={notificationsEnabled} 
              onCheckedChange={setNotificationsEnabled} 
            />
          </div>
        </ProfessionalCardContent>
      </ProfessionalCard>

      {/* Autres options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfessionalCard className="hover:scale-105 transition-all duration-300">
          <ProfessionalCardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Aide & Support</h3>
              <p className="text-muted-foreground text-sm">
                Consultez notre documentation et contactez le support
              </p>
            </div>
            <ModernButton variant="outline" className="w-full">
              Accéder à l'aide
            </ModernButton>
          </ProfessionalCardContent>
        </ProfessionalCard>

        <ProfessionalCard className="hover:scale-105 transition-all duration-300">
          <ProfessionalCardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Confidentialité</h3>
              <p className="text-muted-foreground text-sm">
                Gérez vos données et votre confidentialité
              </p>
            </div>
            <ModernButton variant="outline" className="w-full">
              Voir les paramètres
            </ModernButton>
          </ProfessionalCardContent>
        </ProfessionalCard>
      </div>
    </Layout>
  );
}
