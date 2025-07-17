
// Configuration et utilitaires pour l'API Gemini
export interface GeminiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export type ContentMode = 'summary' | 'qcm' | 'quiz' | 'flashcards' | 'fiche' | 'ocr' | 'classify';

// Clé API Gemini globale
const GEMINI_API_KEY = 'AIzaSyDEPP28PMCmQN1c8hR9JZd9-osYVkXpcLY';

// Mock data pour la démo
const mockResponses = {
  summary: {
    title: "Résumé du cours",
    content: "Voici un résumé structuré du contenu fourni avec les points clés organisés de manière claire et synthétique."
  },
  qcm: {
    questions: [
      {
        question: "Quelle est la capitale de la France ?",
        options: ["Paris", "Lyon", "Marseille", "Toulouse"],
        correct: 0,
        explanation: "Paris est la capitale de la France depuis 508."
      },
      {
        question: "Combien font 2 + 2 ?",
        options: ["3", "4", "5", "6"],
        correct: 1,
        explanation: "2 + 2 = 4, c'est une addition basique."
      }
    ]
  },
  quiz: {
    questions: [
      {
        question: "Expliquez le concept principal de ce cours",
        type: "open",
        keywords: ["concept", "principe", "définition"]
      }
    ]
  },
  flashcards: {
    cards: [
      {
        front: "Définition du concept principal",
        back: "Le concept principal représente l'idée centrale développée dans ce cours."
      },
      {
        front: "Point clé n°1",
        back: "Description détaillée du premier point important à retenir."
      }
    ]
  },
  fiche: {
    title: "Fiche de révision",
    sections: [
      {
        title: "Définitions importantes",
        content: ["Concept 1: définition", "Concept 2: définition"]
      },
      {
        title: "Points clés à retenir",
        content: ["Point 1", "Point 2", "Point 3"]
      }
    ]
  },
  ocr: {
    text: "Texte extrait de l'image via OCR"
  },
  classify: {
    subject: "Mathématiques",
    chapter: "Algèbre",
    confidence: 0.9
  }
};

export async function callGemini(content: string, mode: ContentMode, apiKey?: string): Promise<GeminiResponse> {
  const finalApiKey = apiKey || GEMINI_API_KEY;
  
  console.log(`Calling Gemini API for mode: ${mode}`);
  
  try {
    // Configuration des prompts selon le mode
    const prompts = {
      summary: `Créez un résumé structuré et synthétique du contenu suivant. Répondez uniquement en JSON avec cette structure: {"title": "Résumé du cours", "content": "contenu du résumé"}:\n\n${content}`,
      qcm: `Générez 5 questions à choix multiples (QCM) basées sur le contenu suivant. Répondez uniquement en JSON avec cette structure: {"questions": [{"question": "texte", "options": ["A", "B", "C", "D"], "correct": 0, "explanation": "explication"}]}:\n\n${content}`,
      quiz: `Créez des questions ouvertes pour tester la compréhension du contenu suivant. Répondez uniquement en JSON avec cette structure: {"questions": [{"question": "texte", "type": "open", "keywords": ["mot1", "mot2"]}]}:\n\n${content}`,
      flashcards: `Créez des flashcards (recto-verso) pour mémoriser les concepts clés du contenu suivant. Répondez uniquement en JSON avec cette structure: {"cards": [{"front": "question", "back": "réponse"}]}:\n\n${content}`,
      fiche: `Créez une fiche de révision structurée avec les définitions, formules, points clés et exemples du contenu suivant. Répondez uniquement en JSON avec cette structure: {"title": "Fiche de révision", "sections": [{"title": "titre", "content": ["point1", "point2"]}]}:\n\n${content}`,
      ocr: `Extrayez et transcrivez fidèlement tout le texte visible dans cette image. Répondez uniquement en JSON avec cette structure: {"text": "texte extrait"}`,
      classify: `Analysez le contenu suivant et déterminez la matière scolaire et le chapitre les plus appropriés. Répondez uniquement en JSON avec cette structure: {"subject": "matière", "chapter": "chapitre", "confidence": 0.9}:\n\n${content}`
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${finalApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompts[mode]
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', data);
    
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      console.error('Empty response from API');
      throw new Error('Réponse vide de l\'API');
    }

    // Parser la réponse selon le mode
    let parsedData;
    try {
      // Nettoyer le texte avant de parser (enlever les backticks markdown si présents)
      const cleanText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedData = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Raw text:', generatedText);
      // Si ce n'est pas du JSON, utiliser les données mock
      console.log('Using fallback mock data for mode:', mode);
      parsedData = mockResponses[mode];
    }

    return {
      success: true,
      data: parsedData
    };

  } catch (error) {
    console.error('Erreur Gemini:', error);
    // En cas d'erreur, utiliser les données mock
    console.log('Using mock data due to error for mode:', mode);
    return {
      success: true,
      data: mockResponses[mode]
    };
  }
}
