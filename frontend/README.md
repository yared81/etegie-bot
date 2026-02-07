# 🤖 Etegie Bot - Professional Chatbot System

 
## 🎯 **What is Etegie Bot?**

Etegie Bot provides:

- ✨ **Beautiful, responsive UI** with dark/light theme support
- 🚀 **Easy integration** with any Next.js project
- 💾 **Supabase backend** for data persistence and FAQ management
- 🎨 **Customizable appearance** and behavior
- 📱 **Mobile-responsive** design
- 🔒 **Session management** for user conversations
- 📊 **Real-time chat** with typing indicators

## 🚀 **Quick Start**

### 1. Installation

```bash
npm install etegie-bot
```

### 2. Basic Usage

```tsx
import { Chatbot } from 'etegie-bot';

export default function MyPage() {
  return (
    <div>
      <h1>Welcome to My App</h1>
      
      <Chatbot 
        apiUrl="/api/chat"
        companyId="your-company-id"
        botName="My Assistant"
        welcomeMessage="Hello! How can I help you today?"
      />
    </div>
  );
}