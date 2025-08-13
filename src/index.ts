// Explicitly import React to ensure proper resolution
import React from 'react';

// Export the main Chatbot component
export { Chatbot } from './components/Chatbot';

// Export the CompanySetup component
export { CompanySetup } from './components/CompanySetup';

// Export the Supabase service utilities
export { createSupabaseService, SupabaseService } from './utils/supabase';

// Export types
export type { Message, ChatbotConfig, Company, FAQ, ChatMessage } from './types';

// Re-export React to ensure it's available
export { default as React } from 'react';
