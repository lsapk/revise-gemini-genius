
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from '@/contexts/AppContext';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import AddContent from '@/pages/AddContent';
import SubjectDetail from '@/pages/SubjectDetail';
import LessonDetail from '@/pages/LessonDetail';
import Stats from '@/pages/Stats';
import Settings from '@/pages/Settings';
import Assistant from '@/pages/Assistant';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/add" element={<AddContent />} />
            <Route path="/subject/:id" element={<SubjectDetail />} />
            <Route path="/lesson/:id" element={<LessonDetail />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
