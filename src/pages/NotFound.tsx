
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FuturisticCard, FuturisticCardContent } from "@/components/ui/futuristic-card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-6">
      <FuturisticCard className="max-w-md w-full text-center">
        <FuturisticCardContent className="p-8">
          {/* Logo futuriste */}
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary-500/30">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          
          {/* Code d'erreur */}
          <div className="mb-6">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent mb-2">
              404
            </h1>
            <h2 className="text-2xl font-semibold text-white mb-3">
              🛸 Page introuvable
            </h2>
            <p className="text-gray-400 mb-2">
              La page que vous recherchez n'existe pas dans notre univers.
            </p>
            <p className="text-sm text-gray-500">
              Route demandée : <code className="bg-gray-800 px-2 py-1 rounded text-primary-300">{location.pathname}</code>
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button asChild className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg shadow-primary-600/30">
              <Link to="/" className="flex items-center justify-center gap-2">
                <Home className="w-5 h-5" />
                🏠 Retour à l'accueil
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              ⬅️ Page précédente
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500">
              ✨ ReviseGenius • Révision Futuriste
            </p>
          </div>
        </FuturisticCardContent>
      </FuturisticCard>
    </div>
  );
};

export default NotFound;
