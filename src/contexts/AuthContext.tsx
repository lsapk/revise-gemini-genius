
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔧 Configuration du gestionnaire d\'authentification...');
    
    // Configuration du listener d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Changement d\'état d\'authentification:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Vérification de la session existante
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('❌ Erreur lors de la récupération de la session:', error);
      } else {
        console.log('📋 Session existante:', session?.user?.email || 'Aucune session');
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('🧹 Nettoyage du listener d\'authentification');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    console.log('📝 Tentative d\'inscription pour:', email);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName
          }
        }
      });

      if (error) {
        console.error('❌ Erreur d\'inscription:', error);
        return { error };
      }

      console.log('✅ Inscription réussie:', {
        user: data.user?.email,
        session: !!data.session,
        needsConfirmation: !data.session && data.user && !data.user.email_confirmed_at
      });

      return { error: null };
    } catch (err) {
      console.error('💥 Erreur inattendue lors de l\'inscription:', err);
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔑 Tentative de connexion pour:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Erreur de connexion:', error);
        return { error };
      }

      console.log('✅ Connexion réussie:', {
        user: data.user?.email,
        session: !!data.session
      });

      return { error: null };
    } catch (err) {
      console.error('💥 Erreur inattendue lors de la connexion:', err);
      return { error: err };
    }
  };

  const signOut = async () => {
    console.log('👋 Déconnexion...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
    } else {
      console.log('✅ Déconnexion réussie');
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut
  };

  console.log('🔍 État actuel de l\'authentification:', {
    user: user?.email || 'Non connecté',
    loading,
    sessionExists: !!session
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}
