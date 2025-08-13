# 🤖 Etegie Bot - Professional Chatbot System

> **A beautiful, professional chatbot system for Next.js with Supabase backend**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-13+-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

## 🎯 **What is Etegie Bot?**

Etegie Bot is a **professional-grade chatbot system** designed for modern web applications. It provides:

- ✨ **Beautiful, responsive UI** with dark/light theme support
- 🚀 **Easy integration** with any Next.js project
- 💾 **Supabase backend** for data persistence and FAQ management
- 🎨 **Customizable appearance** and behavior
- 📱 **Mobile-responsive** design
- 🔒 **Session management** for user conversations
- 📊 **Real-time chat** with typing indicators

## 🏆 **Hackathon Features**

- **Modern React 18** with hooks and functional components
- **TypeScript support** for better development experience
- **Tailwind CSS** for beautiful, responsive styling
- **Supabase integration** for scalable backend
- **Professional animations** and micro-interactions
- **Accessibility features** (ARIA labels, keyboard navigation)

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
```

### 3. API Setup

Create an API route at `/api/chat`:

```typescript
import { createSupabaseService } from 'etegie-bot';

export default async function handler(req, res) {
  const { message, companyId, sessionId } = req.body;
  
  const supabaseService = createSupabaseService(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
  
  // Find matching FAQ
  const matchingFAQ = await supabaseService.findMatchingFAQ(message, companyId);
  
  const response = matchingFAQ ? matchingFAQ.answer : 'Sorry, I don\'t have info on that.';
  
  res.json({ response, sessionId });
}
```

## ⚙️ **Configuration Options**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiUrl` | string | **required** | API endpoint for chat messages |
| `companyId` | string | **required** | Company identifier |
| `botName` | string | "Etegie Assistant" | Bot display name |
| `welcomeMessage` | string | "Hello! I'm here to help..." | Welcome message |
| `showAvatars` | boolean | true | Show user/bot avatars |
| `showTimestamps` | boolean | true | Show message timestamps |
| `theme` | 'light' \| 'dark' \| 'auto' | 'light' | UI theme preference |
| `primaryColor` | string | '#3b82f6' | Primary color for UI |
| `maxMessages` | number | 100 | Maximum messages in memory |

## 🎨 **Customization Examples**

### Custom Theme
```tsx
<Chatbot 
  apiUrl="/api/chat"
  companyId="company-123"
  theme="dark"
  primaryColor="#10b981"
  botName="Green Bot"
/>
```

### Minimal Design
```tsx
<Chatbot 
  apiUrl="/api/chat"
  companyId="company-123"
  showAvatars={false}
  showTimestamps={false}
  className="custom-chatbot"
/>
```

## 🗄️ **Database Setup (Supabase)**

### Required Tables

1. **companies** - Company information
2. **faq** - FAQ entries with keywords
3. **chat_messages** - Chat history

### SQL Schema

```sql
-- Companies table
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQ table
CREATE TABLE faq (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'General',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  session_id TEXT NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 **Advanced Features**

### Company Setup Component
```tsx
import { CompanySetup } from 'etegie-bot';

<CompanySetup 
  onSetupComplete={(data) => {
    console.log('Company setup complete:', data);
  }}
/>
```

### Supabase Service
```tsx
import { createSupabaseService } from 'etegie-bot';

const supabaseService = createSupabaseService(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Add FAQs
await supabaseService.addFAQs(companyId, [
  {
    question: "What is your return policy?",
    answer: "We offer 30-day returns on all products.",
    keywords: ["return", "policy", "refund"]
  }
]);

// Find FAQ answers
const answer = await supabaseService.findFAQAnswer("How do I return something?", companyId);
```

## 📱 **Responsive Design**

The chatbot automatically adapts to different screen sizes:
- **Desktop**: Full chat window (384px width)
- **Tablet**: Responsive width with mobile-friendly layout
- **Mobile**: Optimized for touch interaction

## 🎭 **Animation Features**

- **Bounce animation** on the floating chat button
- **Slide-up animation** when opening the chat window
- **Typing indicators** with animated dots
- **Smooth scrolling** to new messages
- **Hover effects** and transitions

## 🔒 **Security Features**

- **Session management** for user conversations
- **Company isolation** - each company sees only their data
- **Input validation** and sanitization
- **Rate limiting** support through API configuration

## 🚀 **Performance Features**

- **Message limiting** to prevent memory issues
- **Lazy loading** of chat components
- **Optimized re-renders** with React hooks
- **Efficient state management**

## 📦 **Package Structure**

```
etegie-bot/
├── src/
│   ├── components/
│   │   ├── Chatbot.tsx          # Main chatbot component
│   │   └── CompanySetup.tsx     # Company setup wizard
│   ├── utils/
│   │   └── supabase.ts          # Supabase service utilities
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   └── index.ts                 # Main export file
├── package.json
├── tsconfig.json
└── README.md
```

## 🧪 **Testing**

The package includes comprehensive TypeScript types and is tested with:
- React 18+
- Next.js 13+
- TypeScript 5.0+
- Supabase 2.x

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 **Support**

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the examples

---

**Built with ❤️ for the hackathon community**
