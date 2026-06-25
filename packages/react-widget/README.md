# 🤖 Etegie Bot - Professional Chatbot System

> **A beautiful, professional chatbot system for Next.js - Backend agnostic with local fallback support**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-13+-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

## 🎯 **What is Etegie Bot?**

Etegie Bot is a **professional-grade chatbot system** designed for modern web applications. It provides:

- ✨ **Beautiful, responsive UI** with dark/light theme support
- 🚀 **Easy integration** with any Next.js project
- 🧠 **Local Smart Logic** handles responses without a backend
- 🔌 **Backend Agnostic** works with any Node.js/REST API
- 🎨 **Customizable appearance** and behavior
- 📱 **Mobile-responsive** design
- 🔒 **Session management** for user conversations
- 📊 **Real-time chat** with typing indicators

## 🏆 **Key Features**

- **Modern React 18** with hooks and functional components
- **Local Fallback Engine** using pattern matching
- **TypeScript support** for better development experience
- **Tailwind CSS** for beautiful, responsive styling
- **Professional animations** and micro-interactions
- **Accessibility features** (ARIA labels, keyboard navigation)

## 🚀 **Quick Start**

### 1. Installation

```bash
npm install etegie-bot
```

### 2. Basic Offline Usage (Smart Mode)

By default, if no `apiUrl` is provided, the bot uses its internal pattern matcher.

```tsx
import { Chatbot } from "etegie-bot";

export default function MyPage() {
  return (
    <Chatbot
      botName="Smart Assistant"
      welcomeMessage="Hello! I'm working entirely in your browser."
    />
  );
}
```

### 3. Using a Custom Backend (Node.js/Express)

Connect the bot to your own API:

```tsx
<Chatbot apiUrl="https://your-api.com/api/chat" companyId="company-123" />
```

Your backend should handle a POST request with this structure:

```json
{
  "message": "User input",
  "companyId": "company-123",
  "sessionId": "optional-session-id"
}
```

## ⚙️ **Configuration Options**

| Prop             | Type                        | Default                      | Description                    |
| ---------------- | --------------------------- | ---------------------------- | ------------------------------ |
| `apiUrl`         | string                      | optional                     | API endpoint for chat messages |
| `companyId`      | string                      | optional                     | Company identifier             |
| `botName`        | string                      | "Etegie Assistant"           | Bot display name               |
| `welcomeMessage` | string                      | "Hello! I'm here to help..." | Welcome message                |
| `showAvatars`    | boolean                     | true                         | Show user/bot avatars          |
| `showTimestamps` | boolean                     | true                         | Show message timestamps        |
| `theme`          | 'light' \| 'dark' \| 'auto' | 'light'                      | UI theme preference            |
| `primaryColor`   | string                      | '#3b82f6'                    | Primary color for UI           |
| `maxMessages`    | number                      | 100                          | Maximum messages in memory     |

## 📦 **Package Structure**

```
etegie-bot/
├── src/
│   ├── components/
│   │   ├── Chatbot.tsx          # Main chatbot component
│   │   └── CompanySetup.tsx     # Company setup wizard
│   ├── utils/
│   │   ├── localBot.ts          # Local pattern matcher logic
│   │   └── pdfHandler.ts        # PDF processing utilities
│   ├── data/
│   │   └── knowledgeBase.json   # Customizable bot brain
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

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
