import { createClient } from '@supabase/supabase-js';

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

/**
 * Supabase service class for handling database operations
 */
export class SupabaseService {
  private supabase: any;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Create a new company
   * @param {string} name - Company name
   * @param {string} description - Company description
   * @returns {Promise<Company>} Created company data
   */
  async createCompany(name: string, description?: string): Promise<Company> {
    const { data, error } = await this.supabase
      .from('companies')
      .insert([{ name, description }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get company by ID
   * @param {string} companyId - Company identifier
   * @returns {Promise<Company>} Company data
   */
  async getCompany(companyId: string): Promise<Company> {
    const { data, error } = await this.supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Add FAQ entries for a company
   * @param {string} companyId - Company identifier
   * @param {Array} faqs - Array of FAQ objects
   * @returns {Promise<FAQ[]>} Created FAQ data
   */
  async addFAQs(companyId: string, faqs: Partial<FAQ>[]): Promise<FAQ[]> {
    const faqsWithCompany = faqs.map(function(faq) {
      return {
        ...faq,
        company_id: companyId,
        keywords: faq.keywords || [],
        category: faq.category || 'General'
      };
    });

    const { data, error } = await this.supabase
      .from('faq')
      .insert(faqsWithCompany)
      .select();

    if (error) throw error;
    return data;
  }

  /**
   * Find FAQ answer based on user question
   * @param {string} question - User question
   * @param {string} companyId - Company identifier
   * @returns {Promise<string | null>} FAQ answer or null
   */
  async findFAQAnswer(question: string, companyId: string): Promise<string | null> {
    // Convert question to lowercase for better matching
    const questionLower = question.toLowerCase();
    
    // Split question into words
    const questionWords = questionLower.split(/\s+/).filter(function(word) {
      return word.length > 2; // Filter out very short words
    });

    // Search for FAQ with matching keywords
    const { data, error } = await this.supabase
      .from('faq')
      .select('*')
      .eq('company_id', companyId)
      .contains('keywords', questionWords);

    if (error) throw error;

    if (data && data.length > 0) {
      // Return the first match
      return data[0].answer;
    }

    // If no exact keyword match, try similarity search
    const { data: similarityData, error: similarityError } = await this.supabase
      .rpc('search_faqs', {
        search_query: questionLower,
        company_uuid: companyId,
        similarity_threshold: 0.3
      });

    if (similarityError) throw similarityError;

    if (similarityData && similarityData.length > 0) {
      return similarityData[0].answer;
    }

    return null;
  }

  /**
   * Log chat message
   * @param {string} companyId - Company identifier
   * @param {string} sessionId - Chat session identifier
   * @param {string} message - User message
   * @param {string} response - Bot response
   * @returns {Promise<ChatMessage>} Logged message data
   */
  async logChatMessage(companyId: string, sessionId: string, message: string, response: string): Promise<ChatMessage> {
    const { data, error } = await this.supabase
      .from('chat_messages')
      .insert([{
        company_id: companyId,
        session_id: sessionId,
        message,
        response
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get chat history for a session
   * @param {string} sessionId - Chat session identifier
   * @param {string} companyId - Company identifier
   * @returns {Promise<ChatMessage[]>} Chat history
   */
  async getChatHistory(sessionId: string, companyId: string): Promise<ChatMessage[]> {
    const { data, error } = await this.supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .eq('company_id', companyId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Find matching FAQ for a user message
   * @param {string} message - User message
   * @param {string} companyId - Company identifier
   * @returns {Promise<FAQ | null>} Matching FAQ or null
   */
  async findMatchingFAQ(message: string, companyId: string): Promise<FAQ | null> {
    const answer = await this.findFAQAnswer(message, companyId);
    if (answer) {
      // Return a mock FAQ object since we only have the answer
      return {
        id: 'temp',
        company_id: companyId,
        question: message,
        answer: answer,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    return null;
  }

  /**
   * Log a message (alias for logChatMessage for backward compatibility)
   * @param {string} message - Message content
   * @param {string} sender - Who sent the message
   * @param {string} companyId - Company identifier
   * @param {string} sessionId - Session identifier
   * @returns {Promise<ChatMessage>} Logged message data
   */
  async logMessage(message: string, sender: string, companyId: string, sessionId: string): Promise<ChatMessage> {
    const response = sender === 'user' ? '' : message;
    return this.logChatMessage(companyId, sessionId, message, response);
  }
}

/**
 * Create a Supabase service instance
 * @param {string} supabaseUrl - Supabase project URL
 * @param {string} supabaseKey - Supabase anonymous key
 * @returns {SupabaseService} Supabase service instance
 */
export function createSupabaseService(supabaseUrl: string, supabaseKey: string): SupabaseService {
  return new SupabaseService(supabaseUrl, supabaseKey);
}
