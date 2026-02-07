import knowledgeBase from '../data/knowledgeBase.json';
export class LocalBot {
    static async processMessage(message) {
        await new Promise(resolve => setTimeout(resolve, 600));
        const normalizedInput = message.toLowerCase().trim();
        for (const intent of knowledgeBase.intents) {
            for (const pattern of intent.patterns) {
                if (normalizedInput.includes(pattern.toLowerCase())) {
                    const randomIndex = Math.floor(Math.random() * intent.responses.length);
                    return {
                        response: intent.responses[randomIndex],
                        intent: intent.tag
                    };
                }
            }
        }
        return {
            response: knowledgeBase.fallback
        };
    }
}
//# sourceMappingURL=localBot.js.map