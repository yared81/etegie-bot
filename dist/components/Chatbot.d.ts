import React from 'react';
interface ChatbotProps {
    apiUrl: string;
    botName?: string;
    welcomeMessage?: string;
    companyId?: string;
    showAvatars?: boolean;
    showTimestamps?: boolean;
    theme?: 'light' | 'dark' | 'auto';
    primaryColor?: string;
    maxMessages?: number;
    className?: string;
    style?: React.CSSProperties;
}
export declare function Chatbot({ apiUrl, botName, welcomeMessage, companyId, showAvatars, showTimestamps, theme, primaryColor, maxMessages, className, style }: ChatbotProps): React.JSX.Element;
export {};
//# sourceMappingURL=Chatbot.d.ts.map