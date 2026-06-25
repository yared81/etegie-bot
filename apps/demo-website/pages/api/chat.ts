import { NextApiRequest, NextApiResponse } from 'next';

// Simple demo FAQ data
const demoFAQs = [
  {
    question: "What is Etegie Bot?",
    answer: "Etegie Bot is a professional-grade chatbot system designed for modern web applications. It provides beautiful UI, easy integration, and powerful features for customer support automation.",
    keywords: ["what", "is", "etegie", "bot", "chatbot", "system"]
  },
  {
    question: "How do I install Etegie Bot?",
    answer: "Installing Etegie Bot is simple! Just run 'npm install etegie-bot' and then import it in your component. It takes only 3 lines of code to integrate!",
    keywords: ["how", "install", "npm", "setup", "integration"]
  },
  {
    question: "What features does Etegie Bot have?",
    answer: "Etegie Bot includes beautiful UI, theme switching, responsive design, TypeScript support, Supabase integration, company setup wizard, session management, and much more!",
    keywords: ["features", "ui", "theme", "responsive", "typescript", "supabase"]
  },
  {
    question: "How do I customize the chatbot?",
    answer: "You can customize colors, themes, bot names, welcome messages, show/hide avatars and timestamps, and much more through props. Check the documentation for all options!",
    keywords: ["customize", "colors", "themes", "props", "options"]
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, companyId, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Simple keyword matching for demo
    const userMessage = message.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;

    for (const faq of demoFAQs) {
      const keywords = faq.keywords;
      let score = 0;
      
      for (const keyword of keywords) {
        if (userMessage.includes(keyword)) {
          score += 1;
        }
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = faq;
      }
    }

    // Generate response
    let response = "I'm sorry, I don't have specific information about that. Try asking about Etegie Bot features, installation, or customization options!";
    
    if (bestMatch && bestScore > 0) {
      response = bestMatch.answer;
    }

    // Add some personality to responses
    if (userMessage.includes('hello') || userMessage.includes('hi')) {
      response = "Hello! I'm your Etegie Bot demo assistant. How can I help you learn about the system today?";
    }

    if (userMessage.includes('thank')) {
      response = "You're welcome! I'm here to help you explore all the amazing features of Etegie Bot. Is there anything specific you'd like to know?";
    }

    // Generate session ID if not provided
    const finalSessionId = sessionId || `demo_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Simulate some processing time for realistic feel
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    return res.status(200).json({
      response,
      sessionId: finalSessionId
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      response: 'Sorry, I\'m having trouble processing your request right now. Please try again!'
    });
  }
}
