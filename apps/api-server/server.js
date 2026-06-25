const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Initialize Gemini (Will use GEMINI_API_KEY from .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "missing_key");

// ==========================================
// CLIENT FACING ENDPOINT (The Chat Widget)
// ==========================================
app.post('/api/chat', async (req, res) => {
  const { message, companyId, sessionId } = req.body;
  console.log(`[API] Received message from ${companyId || 'Unknown'}: ${message}`);

  const normalizedMessage = message.toLowerCase();
  
  try {
    // 1. Fetch context from Database (RAG - Retrieval)
    const faqs = db.prepare('SELECT question, answer FROM faqs').all();
    const contextText = faqs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n');
    
    let responseText = "";

    try {
      if (!process.env.GEMINI_API_KEY) throw new Error("No Gemini API Key provided");

      // 2. Generate Content using Gemini (RAG - Generation)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
You are a professional customer support assistant.
Answer the user's question using ONLY the following FAQ database.
If the answer is not in the database, politely say you don't know and offer to connect them with human support.
Be concise and helpful. Do not invent information.

FAQ Database:
${contextText}

User Question: ${message}
`;
      const result = await model.generateContent(prompt);
      responseText = result.response.text();

    } catch (aiError) {
      console.warn("⚠️ Gemini API failed or missing key, falling back to local DB search...");
      
      // 3. Fallback logic: Deterministic DB matching if AI fails
      const stmt = db.prepare(`
        SELECT answer FROM faqs 
        WHERE LOWER(question) LIKE ? 
        OR LOWER(keywords) LIKE ?
        LIMIT 1
      `);
      
      const searchTerm = `%${normalizedMessage}%`;
      const match = stmt.get(searchTerm, searchTerm);
      
      responseText = match 
        ? match.answer 
        : "I'm currently operating in offline mode and don't have a specific answer for that yet.";
    }

    res.json({
      response: responseText,
      sessionId: sessionId || "session_" + Date.now()
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// ==========================================
// ADMIN DASHBOARD ENDPOINTS
// ==========================================

// Get all FAQs
app.get('/api/faqs', (req, res) => {
  try {
    const faqs = db.prepare('SELECT * FROM faqs ORDER BY created_at DESC').all();
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch FAQs" });
  }
});

// Create a new FAQ
app.post('/api/faqs', (req, res) => {
  const { question, answer, keywords } = req.body;
  
  if (!question || !answer) {
    return res.status(400).json({ error: "Question and answer are required" });
  }

  try {
    const stmt = db.prepare('INSERT INTO faqs (question, answer, keywords) VALUES (?, ?, ?)');
    const info = stmt.run(question, answer, keywords || '');
    
    res.status(201).json({ 
      id: info.lastInsertRowid,
      question,
      answer,
      keywords,
      message: "FAQ created successfully"
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create FAQ" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Etegie API Server running on http://localhost:${PORT}`);
});
