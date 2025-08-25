
import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Brain, Sparkles, Zap, BookOpen, Maximize2, Minimize2 } from 'lucide-react';
import { Layout } from '@/components/Layout/Layout';
import { ProfessionalCard, ProfessionalCardContent } from '@/components/ui/professional-card';
import { ModernButton } from '@/components/ui/modern-button';
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
  const [isExpanded, setIsExpanded] = useState(false);
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
        chaptersCount: s.chapters?.length || 0,
        chapters: s.chapters?.map(c => ({
          name: c.name,
          lessonsCount: c.lessons?.length || 0,
          lessons: c.lessons?.map(l => ({
            name: l.name,
            contentPreview: l.content?.substring(0, 200) || ''
          })) || []
        })) || []
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
    return content
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mb-4 text-foreground border-b border-border pb-2">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-medium mb-3 text-primary">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-primary">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-muted-foreground">$1</em>')
      .replace(/^- (.*$)/gm, '<div class="flex items-start gap-3 mb-2"><span class="text-primary mt-1">•</span><span class="text-foreground">$1</span></div>')
      .replace(/^---$/gm, '<hr class="border-border my-6">')
      .replace(/\n\n/g, '<div class="mb-4"></div>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <Layout 
      title="🧠 Assistant IA" 
      headerActions={
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">{subjects.length} matières</span>
          </div>
          <ModernButton
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            icon={isExpanded ? <Minimize2 /> : <Maximize2 />}
          >
            <span className="hidden sm:inline">
              {isExpanded ? 'Réduire' : 'Agrandir'}
            </span>
          </ModernButton>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      }
      className={cn(
        "transition-all duration-300",
        isExpanded ? "fixed inset-0 z-50 bg-background" : ""
      )}
    >
      <div className={cn(
        "mx-auto h-full flex flex-col",
        isExpanded ? "max-w-full p-4" : "max-w-6xl"
      )}>
        {/* Header avec statistiques */}
        <ProfessionalCard className="mb-6">
          <ProfessionalCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-card-foreground mb-1">Assistant IA Personnel</h2>
                <p className="text-muted-foreground text-sm md:text-base">
                  🎯 {subjects.length} matières • ⚡ {stats.sessionsCompleted} sessions • 📊 {stats.averageScore}% moyenne
                </p>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="text-sm font-medium hidden sm:inline">IA Active</span>
              </div>
            </div>
          </ProfessionalCardContent>
        </ProfessionalCard>

        {/* Messages container avec hauteur adaptative */}
        <div className={cn(
          "flex-1 overflow-y-auto space-y-4 mb-6 px-2",
          isExpanded 
            ? "max-h-[calc(100vh-200px)]" 
            : "max-h-[calc(100vh-350px)] md:max-h-[calc(100vh-300px)]"
        )}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex animate-fade-in",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "rounded-2xl p-4 md:p-6 relative max-w-[85%] md:max-w-4xl",
                  message.role === 'user'
                    ? "bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg"
                    : "bg-card border border-border text-card-foreground shadow-md"
                )}
              >
                {message.role === 'assistant' ? (
                  <div 
                    className="prose prose-sm md:prose-lg max-w-none text-card-foreground"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                  />
                ) : (
                  <p className="text-white font-medium text-sm md:text-base">{message.content}</p>
                )}
                <div className={cn(
                  "text-xs mt-3 opacity-70 flex items-center gap-2",
                  message.role === 'user' ? "text-primary-100 justify-end" : "text-muted-foreground"
                )}>
                  {message.role === 'assistant' && <Zap className="w-3 h-3" />}
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-card border border-border rounded-2xl p-4 md:p-6 text-card-foreground">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="text-sm md:text-base">🧠 L'IA analyse vos données...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input optimisé responsive */}
        <ProfessionalCard className="sticky bottom-0 bg-card/95 backdrop-blur-sm">
          <ProfessionalCardContent className="p-3 md:p-4">
            <div className="flex gap-2 md:gap-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="💬 Posez votre question à l'assistant IA..."
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                disabled={isLoading}
                className="flex-1 bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary/20 text-sm md:text-base"
              />
              <ModernButton
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                variant="gradient"
                loading={isLoading}
                icon={<Send />}
                className="px-3 md:px-6"
              >
                <span className="hidden sm:inline">Envoyer</span>
              </ModernButton>
            </div>
          </ProfessionalCardContent>
        </ProfessionalCard>
      </div>
    </Layout>
  );
}
