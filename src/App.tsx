
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from '@/contexts/AppContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/Layout/AuthGuard';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import AddContent from '@/pages/AddContent';
import MyCourses from '@/pages/MyCourses';
import SubjectDetail from '@/pages/SubjectDetail';
import LessonDetail from '@/pages/LessonDetail';
import Stats from '@/pages/Stats';
import Settings from '@/pages/Settings';
import Assistant from '@/pages/Assistant';
import Planning from '@/pages/Planning';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Router>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={
                  <AuthGuard>
                    <Index />
                  </AuthGuard>
                } />
                <Route path="/add" element={
                  <AuthGuard>
                    <AddContent />
                  </AuthGuard>
                } />
                <Route path="/courses" element={
                  <AuthGuard>
                    <MyCourses />
                  </AuthGuard>
                } />
                <Route path="/subject/:id" element={
                  <AuthGuard>
                    <SubjectDetail />
                  </AuthGuard>
                } />
                <Route path="/lesson/:id" element={
                  <AuthGuard>
                    <LessonDetail />
                  </AuthGuard>
                } />
                <Route path="/stats" element={
                  <AuthGuard>
                    <Stats />
                  </AuthGuard>
                } />
                <Route path="/settings" element={
                  <AuthGuard>
                    <Settings />
                  </AuthGuard>
                } />
                <Route path="/assistant" element={
                  <AuthGuard>
                    <Assistant />
                  </AuthGuard>
                } />
                <Route path="/planning" element={
                  <AuthGuard>
                    <Planning />
                  </AuthGuard>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </Router>
          </div>
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
