
// Configuration et utilitaires pour l'API Gemini - VERSION RÉELLE
export interface GeminiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export type ContentMode = 'summary' | 'qcm' | 'quiz' | 'flashcards' | 'fiche' | 'ocr' | 'classify';

// Clé API Gemini - Utilisation de la vraie API
const GEMINI_API_KEY = 'AIzaSyDEPP28PMCmQN1c8hR9JZd9-osYVkXpcLY';

// Prompts optimisés pour chaque type de contenu
const getPrompt = (content: string, mode: ContentMode): string => {
  const prompts = {
    summary: `Tu es un expert en éducation. Analyse le contenu suivant et crée un résumé structuré, clair et pédagogique.

CONTENU À ANALYSER:
${content}

INSTRUCTIONS:
- Créer un résumé de 300-500 mots
- Structurer en points clés hiérarchisés
- Identifier les concepts principaux
- Utiliser un langage clair et accessible
- Garder l'information essentielle

Réponds UNIQUEMENT en JSON avec cette structure:
{
  "title": "Résumé du cours",
  "content": "Contenu du résumé formaté en markdown avec ## pour les sections"
}`,

    qcm: `Tu es un expert en création de questions pédagogiques. Génère 8 questions QCM pertinentes basées sur le contenu fourni.

CONTENU À ANALYSER:
${content}

INSTRUCTIONS:
- Créer 8 questions de difficulté progressive
- 4 choix de réponse par question (A, B, C, D)
- Questions couvrant différents aspects du contenu
- Inclure des explications détaillées pour chaque bonne réponse
- Mélanger questions de mémorisation et de compréhension

Réponds UNIQUEMENT en JSON avec cette structure:
{
  "questions": [
    {
      "question": "Texte de la question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Explication détaillée de pourquoi cette réponse est correcte"
    }
  ]
}`,

    flashcards: `Tu es un expert en mémorisation et apprentissage. Crée des flashcards efficaces pour mémoriser les concepts clés.

CONTENU À ANALYSER:
${content}

INSTRUCTIONS:
- Créer 12-15 flashcards couvrant tous les concepts importants
- Face (front): Question, terme ou concept à retenir
- Dos (back): Définition, explication ou réponse claire
- Varier les types: définitions, exemples, applications
- Utiliser des formulations concises mais complètes

Réponds UNIQUEMENT en JSON avec cette structure:
{
  "cards": [
    {
      "front": "Question ou terme à mémoriser",
      "back": "Réponse ou définition complète"
    }
  ]
}`,

    fiche: `Tu es un expert en création de supports de révision. Crée une fiche de révision complète et bien structurée.

CONTENU À ANALYSER:
${content}

INSTRUCTIONS:
- Structurer en sections logiques (définitions, concepts clés, formules, exemples)
- Inclure tous les éléments importants pour réviser
- Format clair avec points et sous-points
- Ajouter des exemples concrets
- Organiser de manière pédagogique

Réponds UNIQUEMENT en JSON avec cette structure:
{
  "title": "Fiche de révision",
  "sections": [
    {
      "title": "Nom de la section",
      "content": ["Point 1", "Point 2", "Point 3"]
    }
  ]
}`,

    ocr: `Extrait et transcrit fidèlement tout le texte visible dans cette image. Réponds UNIQUEMENT en JSON avec cette structure: {"text": "texte extrait"}`,

    classify: `Analyse le contenu suivant et détermine la matière scolaire et le chapitre les plus appropriés.

CONTENU:
${content}

Réponds UNIQUEMENT en JSON avec cette structure:
{
  "subject": "matière scolaire appropriée",
  "chapter": "chapitre ou thème spécifique",
  "confidence": 0.9
}`
  };

  return prompts[mode];
};

// Fonction pour nettoyer et parser la réponse JSON
const parseGeminiResponse = (text: string): any => {
  try {
    // Nettoyer le texte (enlever les backticks markdown et autres artifacts)
    let cleanText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/^[^{]*({.*})[^}]*$/s, '$1') // Extraire uniquement le JSON
      .trim();

    // Fix common JSON issues
    cleanText = cleanText
      .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
      .replace(/([}\]]),?\s*$/g, '$1') // Clean up ending
      .replace(/\n\s*\n/g, '\n') // Remove double line breaks
      .replace(/\r\n/g, '\n'); // Normalize line endings

    // Parser le JSON
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Erreur de parsing JSON:', error);
    console.error('Texte reçu:', text);
    
    // Try to extract and fix the JSON more aggressively
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        let fixedJson = jsonMatch[0]
          .replace(/,(\s*[}\]])/g, '$1')
          .replace(/([}\]]),?\s*$/g, '$1');
        return JSON.parse(fixedJson);
      }
    } catch (secondError) {
      console.error('Tentative de réparation échouée:', secondError);
    }
    
    throw new Error('Réponse invalide de l\'IA');
  }
};

export async function callGemini(content: string, mode: ContentMode, apiKey?: string): Promise<GeminiResponse> {
  const finalApiKey = apiKey || GEMINI_API_KEY;
  
  if (!finalApiKey) {
    throw new Error('Clé API Gemini manquante');
  }

  console.log(`🤖 Appel API Gemini pour le mode: ${mode}`);
  console.log(`📝 Contenu (${content.length} caractères):`, content.substring(0, 100) + '...');
  
  try {
    const prompt = getPrompt(content, mode);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${finalApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3, // Plus déterministe pour un contenu éducatif
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 4096, // Augmenté pour plus de contenu
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erreur API Gemini (${response.status}):`, errorText);
      throw new Error(`Erreur API Gemini: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📡 Réponse API Gemini reçue');
    
    // Vérifier la structure de la réponse
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('❌ Structure de réponse invalide:', data);
      throw new Error('Réponse API invalide');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    
    if (!generatedText) {
      console.error('❌ Contenu vide de l\'API');
      throw new Error('Contenu vide reçu de l\'IA');
    }

    console.log('📄 Contenu généré:', generatedText.substring(0, 200) + '...');

    // Parser la réponse JSON
    const parsedData = parseGeminiResponse(generatedText);
    console.log('✅ Données parsées avec succès:', Object.keys(parsedData));

    // Validation spécifique selon le mode
    if (mode === 'qcm' && (!parsedData.questions || !Array.isArray(parsedData.questions))) {
      throw new Error('Format QCM invalide');
    }
    if (mode === 'flashcards' && (!parsedData.cards || !Array.isArray(parsedData.cards))) {
      throw new Error('Format flashcards invalide');
    }
    if (mode === 'fiche' && (!parsedData.sections || !Array.isArray(parsedData.sections))) {
      throw new Error('Format fiche invalide');
    }

    return {
      success: true,
      data: parsedData
    };

  } catch (error) {
    console.error('💥 Erreur lors de l\'appel Gemini:', error);
    
    // Retourner une erreur claire au lieu de données factices
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue lors de la génération IA'
    };
  }
}

// Fonction utilitaire pour tester la connexion API
export async function testGeminiConnection(apiKey?: string): Promise<boolean> {
  try {
    const result = await callGemini('Test de connexion', 'summary', apiKey);
    return result.success;
  } catch {
    return false;
  }
}
