export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}
export interface PDFDocument {
    id: string;
    name: string;
    content: string;
    uploadedAt: Date;
    size: number;
}
export interface ChatbotConfig {
    apiUrl: string;
    companyId: string;
    botName?: string;
    welcomeMessage?: string;
    showAvatars?: boolean;
    showTimestamps?: boolean;
    theme?: 'light' | 'dark' | 'auto';
    primaryColor?: string;
    maxMessages?: number;
    className?: string;
    style?: React.CSSProperties;
    enablePDFUpload?: boolean;
    enableLocalStorage?: boolean;
}
export interface Company {
    id: string;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}
export interface FAQ {
    id: string;
    company_id: string;
    question: string;
    answer: string;
    keywords?: string[];
    category?: string;
    created_at: string;
    updated_at: string;
}
export interface ChatMessage {
    id: string;
    company_id: string;
    session_id: string;
    message: string;
    response: string;
    created_at: string;
}
//# sourceMappingURL=index.d.ts.map