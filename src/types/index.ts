/**
 * Message interface for chat messages
 */
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

/**
 * PDF Document interface
 */
export interface PDFDocument {
  id: string;
  name: string;
  content: string;
  uploadedAt: Date;
  size: number;
}

/**
 * Chatbot configuration interface
 */
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

/**
 * Company interface
 */
export interface Company {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

/**
 * FAQ interface
 */
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

/**
 * Chat message interface for database storage
 */
export interface ChatMessage {
  id: string;
  company_id: string;
  session_id: string;
  message: string;
  response: string;
  created_at: string;
}
