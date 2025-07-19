
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Auth() {
  const { user, signIn, signUp, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirection si déjà authentifié
  if (user && !authLoading) {
    console.log('🔄 Utilisateur connecté, redirection vers la page principale');
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Soumission du formulaire:', { isLogin, email, displayName });
    
    if (!email || !password) {
      setError('Email et mot de passe requis');
      return;
    }

    if (!isLogin && !displayName) {
      setError('Nom d\'affichage requis pour l\'inscription');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        console.log('🔑 Mode connexion');
        const { error } = await signIn(email, password);
        
        if (error) {
          console.error('❌ Échec de la connexion:', error);
          
          if (error.message?.includes('Invalid login credentials')) {
            setError('Email ou mot de passe incorrect');
          } else if (error.message?.includes('Email not confirmed')) {
            setError('Veuillez confirmer votre email avant de vous connecter');
          } else {
            setError(`Erreur de connexion: ${error.message}`);
          }
        } else {
          console.log('✅ Connexion réussie');
          toast({
            title: "Connexion réussie !",
            description: "Bienvenue dans ReviseGenius",
          });
        }
      } else {
        console.log('📝 Mode inscription');
        const { error } = await signUp(email, password, displayName);

        if (error) {
          console.error('❌ Échec de l\'inscription:', error);
          
          if (error.message?.includes('User already registered')) {
            setError('Un compte existe déjà avec cet email');
          } else if (error.message?.includes('Password should be at least')) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
          } else {
            setError(`Erreur d'inscription: ${error.message}`);
          }
        } else {
          console.log('✅ Inscription réussie');
          toast({
            title: "Inscription réussie !",
            description: "Votre compte a été créé. Vous pouvez maintenant vous connecter.",
          });
          
          // Basculer vers le mode connexion
          setIsLogin(true);
          setDisplayName('');
          setError('');
        }
      }
    } catch (err) {
      console.error('💥 Erreur inattendue:', err);
      setError('Une erreur inattendue s\'est produite');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
          <span className="text-gray-600 dark:text-gray-400">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-6">
        
        {/* Logo et titre */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                ReviseGenius
              </h1>
            </div>
          </Link>
          <p className="text-gray-600 dark:text-gray-400">
            Révision intelligente avec IA
          </p>
        </div>

        <Card className="border-gray-200/50 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {isLogin ? 'Connexion' : 'Inscription'}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin 
                ? 'Connectez-vous à votre compte' 
                : 'Créez votre compte ReviseGenius'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="displayName">Nom d'affichage *</Label>
                  <Input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Votre nom"
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {!isLogin && (
                  <p className="text-xs text-gray-500">
                    Minimum 6 caractères
                  </p>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isLogin ? 'Se connecter' : 'S\'inscrire'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  console.log('🔄 Basculement de mode:', isLogin ? 'vers inscription' : 'vers connexion');
                  setIsLogin(!isLogin);
                  setError('');
                  setDisplayName('');
                }}
                className="text-sm text-primary hover:underline"
              >
                {isLogin 
                  ? 'Pas encore de compte ? S\'inscrire'
                  : 'Déjà un compte ? Se connecter'
                }
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Test simple : créez un compte puis connectez-vous</p>
        </div>
      </div>
    </div>
  );
}
