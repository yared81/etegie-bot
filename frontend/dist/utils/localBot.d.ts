export interface BotResponse {
    response: string;
    intent?: string;
}
export declare class LocalBot {
    static processMessage(message: string): Promise<BotResponse>;
}
//# sourceMappingURL=localBot.d.ts.map