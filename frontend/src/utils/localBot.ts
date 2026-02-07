import knowledgeBase from '../data/knowledgeBase.json';

export interface BotResponse {
  response: string;
  intent?: string;
}

/**
 * Local bot logic to process messages without a backend
 */
export class LocalBot {
  /**
   * Process a user message and return a response
   * @param {string} message - User input
   * @returns {Promise<BotResponse>}
   */
  static async processMessage(message: string): Promise<BotResponse> {
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 600));

    const normalizedInput = message.toLowerCase().trim();
    
    // Simple keyword matching
    for (const intent of knowledgeBase.intents) {
      for (const pattern of intent.patterns) {
        if (normalizedInput.includes(pattern.toLowerCase())) {
          // Select a random response from the matches
          const randomIndex = Math.floor(Math.random() * intent.responses.length);
          return {
            response: intent.responses[randomIndex],
            intent: intent.tag
          };
        }
      }
    }

    // Return fallback if no match found
    return {
      response: knowledgeBase.fallback
    };
  }
}
