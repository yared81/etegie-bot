interface Company {
    id: string;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}
interface FAQ {
    id: string;
    company_id: string;
    question: string;
    answer: string;
    keywords?: string[];
    category?: string;
    created_at: string;
    updated_at: string;
}
interface ChatMessage {
    id: string;
    company_id: string;
    session_id: string;
    message: string;
    response: string;
    created_at: string;
}
export declare class SupabaseService {
    private supabase;
    constructor(supabaseUrl: string, supabaseKey: string);
    createCompany(name: string, description?: string): Promise<Company>;
    getCompany(companyId: string): Promise<Company>;
    addFAQs(companyId: string, faqs: Partial<FAQ>[]): Promise<FAQ[]>;
    findFAQAnswer(question: string, companyId: string): Promise<string | null>;
    logChatMessage(companyId: string, sessionId: string, message: string, response: string): Promise<ChatMessage>;
    getChatHistory(sessionId: string, companyId: string): Promise<ChatMessage[]>;
    findMatchingFAQ(message: string, companyId: string): Promise<FAQ | null>;
    logMessage(message: string, sender: string, companyId: string, sessionId: string): Promise<ChatMessage>;
}
export declare function createSupabaseService(supabaseUrl: string, supabaseKey: string): SupabaseService;
export {};
//# sourceMappingURL=supabase.d.ts.map