
import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MessageCircle, Brain, Database } from 'lucide-react';
import { Layout } from '@/components/Layout/Layout';
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { callGemini } from '@/lib/gemini';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `# Bonjour ! 👋

Je suis votre **assistant IA personnel** pour ReviseGenius. 

## Ce que je peux faire :
- 📚 **Analyser vos cours** et créer des résumés
- ❓ **Générer des questions** basées sur vos contenus
- 🎯 **Vous aider à réviser** efficacement
- 📊 **Analyser vos statistiques** d'apprentissage
- 💡 **Donner des conseils** personnalisés

### Comment puis-je vous aider aujourd'hui ?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { subjects, stats, geminiApiKey } = useApp();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getContextualData = () => {
    const context = {
      subjects: subjects.map(s => ({
        name: s.name,
        chaptersCount: s.chapters.length,
        chapters: s.chapters.map(c => ({
          name: c.name,
          lessonsCount: c.lessons.length
        }))
      })),
      stats: {
        totalStudyTime: stats.totalStudyTime,
        sessionsCompleted: stats.sessionsCompleted,
        averageScore: stats.averageScore,
        subjectsCount: subjects.length
      }
    };
    return JSON.stringify(context, null, 2);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const contextData = getContextualData();
      const prompt = `Tu es un assistant IA pour une application de révision. L'utilisateur a accès aux données suivantes :

DONNÉES UTILISATEUR:
${contextData}

QUESTION DE L'UTILISATEUR: ${inputValue}

INSTRUCTIONS:
- Réponds TOUJOURS en Markdown formaté
- Utilise les données de l'utilisateur pour personnaliser ta réponse
- Sois pédagogique et encourageant
- Propose des actions concrètes basées sur leurs données
- Utilise des emojis et une mise en forme claire
- Si tu ne trouves pas d'informations spécifiques, propose des conseils généraux d'apprentissage

Ta réponse doit être en français et bien structurée en Markdown.`;

      const response = await callGemini(prompt, 'summary', geminiApiKey);

      if (response.success && response.data) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.data.content || response.data.title || 'Désolé, je n\'ai pas pu traiter votre demande.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(response.error || 'Erreur lors de la génération de la réponse');
      }
    } catch (error) {
      console.error('Erreur assistant:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '## ⚠️ Erreur\n\nDésolé, je n\'ai pas pu traiter votre demande. Veuillez vérifier votre clé API Gemini dans les paramètres.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMarkdown = (content: string) => {
    // Simple conversion Markdown vers JSX pour l'affichage
    return content
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/^\- (.*$)/gm, '<div class="flex items-start gap-2 mb-1"><span class="text-primary-500 mt-1">•</span><span>$1</span></div>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <Layout 
      title="Assistant IA" 
      showBack
      headerActions={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <Database className="w-4 h-4" />
            <span className="hidden sm:inline">{subjects.length} matières</span>
          </div>
        </div>
      }
    >
      <div className="max-w-4xl mx-auto p-4 h-full flex flex-col">
        {/* Header avec info */}
        <div className="mb-4">
          <ModernCard>
            <ModernCardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">Assistant IA Personnel</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Accès à {subjects.length} matières • {stats.sessionsCompleted} sessions
                  </p>
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl px-4 py-3",
                  message.role === 'user'
                    ? "bg-primary-500 text-white"
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                )}
              >
                {message.role === 'assistant' ? (
                  <div 
                    className="prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }}
                  />
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
                <p className={cn(
                  "text-xs mt-2 opacity-70",
                  message.role === 'user' ? "text-white" : "text-gray-500"
                )}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">L'assistant réfléchit...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Posez votre question à l'assistant..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              className="px-4"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
