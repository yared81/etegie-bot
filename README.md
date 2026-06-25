# 🤖 Etegie Chatbot Suite

> **A professional, full-stack chatbot ecosystem for modern web applications.**

This repository contains the complete Etegie Bot system, including the core library and a fully functional demonstration application.

## 📦 Project Structure

```text
etegie-chatbot/
├── apps/
│   ├── api-server/         # Express & SQLite Backend (RAG Engine)
│   └── demo-website/       # Next.js Application testing the widget
├── packages/
│   └── react-widget/       # Core Chatbot UI (NPM Package)
├── docs/
│   └── setup-guide.md      # Detailed local development instructions
└── LICENSE                 # MIT License details
```

## 🚀 Quick Start

This project uses NPM Workspaces. You can run all development servers with a single command once configured.

### 1. Installation

```bash
npm run install:all
```

### 2. Running the Development Environment

You can start the different parts of the suite using the NPM scripts in the root directory:

```bash
# Start the Backend API Server (Port 5000)
npm run dev:api

# Start the Next.js Demo Website (Port 3000)
npm run dev:demo

# Continuously build the React Widget package
npm run dev:widget
```

## 🛠️ Tech Stack
-   **Frontend**: React 18+, TypeScript, Tailwind CSS, Lucide React
-   **Backend**: Node.js, Express, SQLite, Google Gemini API
-   **Architecture**: NPM Workspaces Monorepo
