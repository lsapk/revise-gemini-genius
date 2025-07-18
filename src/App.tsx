
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppProvider } from '@/contexts/AppContext';
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import AddContent from '@/pages/AddContent';
import SubjectDetail from '@/pages/SubjectDetail';
import LessonDetail from '@/pages/LessonDetail';
import Stats from '@/pages/Stats';
import Settings from '@/pages/Settings';
import Assistant from '@/pages/Assistant';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <Router>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/add" element={
                <ProtectedRoute>
                  <AddContent />
                </ProtectedRoute>
              } />
              <Route path="/subject/:id" element={
                <ProtectedRoute>
                  <SubjectDetail />
                </ProtectedRoute>
              } />
              <Route path="/lesson/:id" element={
                <ProtectedRoute>
                  <LessonDetail />
                </ProtectedRoute>
              } />
              <Route path="/stats" element={
                <ProtectedRoute>
                  <Stats />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/assistant" element={
                <ProtectedRoute>
                  <Assistant />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
