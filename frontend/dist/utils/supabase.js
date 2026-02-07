import { createClient } from '@supabase/supabase-js';
export class SupabaseService {
    constructor(supabaseUrl, supabaseKey) {
        this.supabase = createClient(supabaseUrl, supabaseKey);
    }
    async createCompany(name, description) {
        const { data, error } = await this.supabase
            .from('companies')
            .insert([{ name, description }])
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async getCompany(companyId) {
        const { data, error } = await this.supabase
            .from('companies')
            .select('*')
            .eq('id', companyId)
            .single();
        if (error)
            throw error;
        return data;
    }
    async addFAQs(companyId, faqs) {
        const faqsWithCompany = faqs.map(function (faq) {
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
        if (error)
            throw error;
        return data;
    }
    async findFAQAnswer(question, companyId) {
        const questionLower = question.toLowerCase();
        const questionWords = questionLower.split(/\s+/).filter(function (word) {
            return word.length > 2;
        });
        const { data, error } = await this.supabase
            .from('faq')
            .select('*')
            .eq('company_id', companyId)
            .contains('keywords', questionWords);
        if (error)
            throw error;
        if (data && data.length > 0) {
            return data[0].answer;
        }
        const { data: similarityData, error: similarityError } = await this.supabase
            .rpc('search_faqs', {
            search_query: questionLower,
            company_uuid: companyId,
            similarity_threshold: 0.3
        });
        if (similarityError)
            throw similarityError;
        if (similarityData && similarityData.length > 0) {
            return similarityData[0].answer;
        }
        return null;
    }
    async logChatMessage(companyId, sessionId, message, response) {
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
        if (error)
            throw error;
        return data;
    }
    async getChatHistory(sessionId, companyId) {
        const { data, error } = await this.supabase
            .from('chat_messages')
            .select('*')
            .eq('session_id', sessionId)
            .eq('company_id', companyId)
            .order('created_at', { ascending: true });
        if (error)
            throw error;
        return data || [];
    }
    async findMatchingFAQ(message, companyId) {
        const answer = await this.findFAQAnswer(message, companyId);
        if (answer) {
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
    async logMessage(message, sender, companyId, sessionId) {
        const response = sender === 'user' ? '' : message;
        return this.logChatMessage(companyId, sessionId, message, response);
    }
}
export function createSupabaseService(supabaseUrl, supabaseKey) {
    return new SupabaseService(supabaseUrl, supabaseKey);
}
//# sourceMappingURL=supabase.js.map