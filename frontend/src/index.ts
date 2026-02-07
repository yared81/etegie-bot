// Explicitly import React to ensure proper resolution
import React from 'react';

// Export the main Chatbot component
export { Chatbot } from './components/Chatbot';

// Export the CompanySetup component
export { CompanySetup } from './components/CompanySetup';

// Export utilities
export { PDFHandler } from './utils/pdfHandler';
export { LocalBot } from './utils/localBot';

// Export types
export type {
  Message,
  ChatbotConfig,
  Company,
  FAQ,
  ChatMessage,
  PDFDocument
} from './types';

// Re-export React to ensure it's available
export { default as React } from 'react';
