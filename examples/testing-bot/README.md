# Etegie Demo

This is a demo project showcasing the Etegie chatbot system.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   Create a `.env.local` file in the demo directory with your Supabase credentials:
   ```env
   SUPABASE_URL=https://fucccsiiezilodaywjrt.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1Y2Njc2lpZXppbG9kYXl3anJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjUzNDgsImV4cCI6MjA3MDMwMTM0OH0.fHAbAsY-aKeIe4-sMqu6rIhdZ_xHgWWkoCRfQOSK4WU
   ```

3. **Run the demo:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## Features Demonstrated

- ✅ Chatbot UI component
- ✅ Supabase integration
- ✅ FAQ matching
- ✅ Message logging
- ✅ Session management

## Test Questions

Try asking these questions in the chatbot:
- "What is Etegie?"
- "How do I install Etegie?"
- "What features does Etegie offer?"
- "Tell me about the chatbot system"

## Project Structure

```
demo/
├── pages/
│   ├── index.tsx          # Main demo page
│   ├── _app.tsx           # App wrapper
│   └── api/
│       └── chat.ts        # Chat API endpoint
├── styles/
│   └── globals.css        # Tailwind CSS
├── package.json           # Demo dependencies
├── tailwind.config.js     # Tailwind configuration
└── README.md              # This file
```

## Integration

This demo shows how to integrate the Etegie chatbot into a Next.js project:

1. Install the package: `npm install etegie`
2. Import the component: `import { Chatbot } from 'etegie'`
3. Use the component with your configuration
4. Create an API route to handle chat requests
