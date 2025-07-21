
import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Brain, Sparkles, Zap, BookOpen } from 'lucide-react';
import { Layout } from '@/components/Layout/Layout';
import { FuturisticCard, FuturisticCardContent } from '@/components/ui/futuristic-card';
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
      content: `# 🧠 Bonjour ! Votre Assistant IA Personnel

🎯 **Je suis votre compagnon d'apprentissage intelligent pour ReviseGenius.**

## 🚀 Mes capacités :

### 📚 **Analyse de Contenu**
- 🔍 Analyse approfondie de vos cours
- 📝 Création de résumés structurés
- 🎯 Identification des points clés

### ❓ **Génération de Questions**
- 🧩 Questions personnalisées basées sur VOS contenus
- 🎲 Quiz adaptatifs selon votre niveau
- 💡 Questions de compréhension et d'application

### 📊 **Suivi & Conseils**
- 📈 Analyse de vos statistiques d'apprentissage
- 🎯 Conseils personnalisés pour progresser
- ⚡ Stratégies d'optimisation des révisions

---

### 💬 **Comment puis-je vous aider aujourd'hui ?**

*N.B. : Je me base uniquement sur vos cours et données personnelles pour vous donner des conseils précis et pertinents.* ✨`,
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
          lessonsCount: c.lessons.length,
          lessons: c.lessons.map(l => ({
            name: l.name,
            contentPreview: l.content.substring(0, 200)
          }))
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
      const prompt = `Tu es un assistant IA spécialisé dans l'éducation pour ReviseGenius. Tu DOIS absolument respecter ces règles :

RÈGLES STRICTES :
1. 📝 TOUJOURS répondre en Markdown bien formaté
2. 🎯 Utiliser des emojis pertinents dans TOUTE ta réponse
3. ⚠️ NE JAMAIS inventer d'informations - utilise UNIQUEMENT les données fournies
4. 🎨 Structure ta réponse avec des titres, listes, et sections
5. 💡 Sois pédagogique et encourageant

DONNÉES UTILISATEUR DISPONIBLES :
${contextData}

QUESTION DE L'UTILISATEUR : ${inputValue}

INSTRUCTIONS POUR TA RÉPONSE :
- 🏗️ Structure avec des headers (##, ###)
- ✨ Utilise des emojis thématiques
- 📋 Crée des listes à puces quand approprié
- 🔗 Référence spécifiquement les matières/cours de l'utilisateur
- 💪 Propose des actions concrètes basées sur SES données
- 🚫 Si tu n'as pas d'informations spécifiques, dis-le clairement
- ⭐ Reste positif et motivant

Ta réponse doit être en français, complètement en Markdown, avec des emojis, et basée uniquement sur les données réelles de l'utilisateur.`;

      const response = await callGemini(prompt, 'summary', geminiApiKey);

      if (response.success && response.data) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.data.content || response.data.title || '## ⚠️ Erreur\n\nDésolé, je n\'ai pas pu traiter votre demande. 🔧',
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
        content: `## ⚠️ Erreur de Communication

🔧 **Problème technique détecté**

Désolé, je n'ai pas pu traiter votre demande pour les raisons suivantes :

### 🔍 **Causes possibles :**
- 🔑 Clé API Gemini manquante ou invalide
- 🌐 Problème de connexion
- ⚡ Surcharge temporaire du service

### 💡 **Solutions :**
1. 🔧 Vérifiez votre clé API dans les paramètres
2. 🔄 Réessayez dans quelques instants
3. 📞 Contactez le support si le problème persiste

---
*Je reste à votre disposition pour vous aider !* ✨`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMarkdown = (content: string) => {
    // Conversion Markdown améliorée avec emojis préservés
    return content
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mb-4 text-gray-100 border-b border-gray-800 pb-2">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-medium mb-3 text-primary-300">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-primary-200">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>')
      .replace(/^- (.*$)/gm, '<div class="flex items-start gap-3 mb-2"><span class="text-primary-400 mt-1">•</span><span class="text-gray-300">$1</span></div>')
      .replace(/^---$/gm, '<hr class="border-gray-800 my-6">')
      .replace(/\n\n/g, '<div class="mb-4"></div>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <Layout 
      title="🧠 Assistant IA" 
      headerActions={
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">{subjects.length} matières</span>
          </div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      }
    >
      <div className="max-w-5xl mx-auto h-full flex flex-col">
        {/* Header avec statistiques */}
        <FuturisticCard className="mb-6">
          <FuturisticCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-1">Assistant IA Personnel</h2>
                <p className="text-gray-400">
                  🎯 {subjects.length} matières • ⚡ {stats.sessionsCompleted} sessions • 📊 {stats.averageScore}% moyenne
                </p>
              </div>
              <div className="flex items-center gap-2 text-primary-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="text-sm font-medium">IA Active</span>
              </div>
            </div>
          </FuturisticCardContent>
        </FuturisticCard>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-6 mb-6 max-h-[calc(100vh-300px)]">
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
                  "max-w-4xl rounded-2xl p-6 relative",
                  message.role === 'user'
                    ? "bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-600/30"
                    : "bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-gray-800/50 backdrop-blur-sm"
                )}
              >
                {message.role === 'assistant' ? (
                  <div 
                    className="prose prose-lg max-w-none prose-invert"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                  />
                ) : (
                  <p className="text-white font-medium">{message.content}</p>
                )}
                <div className={cn(
                  "text-xs mt-4 opacity-70 flex items-center gap-2",
                  message.role === 'user' ? "text-primary-100 justify-end" : "text-gray-500"
                )}>
                  {message.role === 'assistant' && <Zap className="w-3 h-3" />}
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-primary-400" />
                  <span className="text-gray-300">🧠 L'IA analyse vos données...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input moderne */}
        <FuturisticCard>
          <FuturisticCardContent className="p-4">
            <div className="flex gap-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="💬 Posez votre question à l'assistant IA..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
                className="flex-1 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500/20"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 shadow-lg shadow-primary-600/30"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </FuturisticCardContent>
        </FuturisticCard>
      </div>
    </Layout>
  );
}
