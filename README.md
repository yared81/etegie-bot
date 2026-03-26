# 🤖 Etegie Chatbot Suite

> **A professional, full-stack chatbot ecosystem for modern web applications.**

This repository contains the complete Etegie Bot system, including the core library and a fully functional demonstration application.

## 📦 Project Structure

```text
etegie-chatbot/
├── packages/
│   └── etegie-bot/         # Core Chatbot System (Frontend & Backend)
├── examples/
│   └── testing-bot/        # Sample Next.js project showing implementation
├── docs/
│   └── setup-guide.md      # Detailed local development instructions
└── LICENSE                 # MIT License details
```

## 🚀 Quick Start

### 1. Core Package
The core package is divided into a **React/Next.js Frontend** and an **Express Backend**.

```bash
cd packages/etegie-bot
# See individual READMEs inside for configuration
```

### 2. Testing App (Demo)
We have included a pre-configured Next.js app to help you get started quickly.

```bash
cd examples/testing-bot
cp .env.example .env     # Then add your Supabase credentials
npm install
npm run dev
```

## 🛠️ Tech Stack
-   **Frontend**: React 18+, TypeScript, Tailwind CSS, Lucide React
-   **Backend**: Node.js, Express, Supabase (optional integration)
-   **Routing**: Next.js App Router (Library) & Pages Router (Demo)

## 📄 License
This project is licensed under the **MIT License**.

---

Developed with ❤️ by the Etegie Team.
