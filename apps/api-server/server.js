const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// ==========================================
// CLIENT FACING ENDPOINT (The Chat Widget)
// ==========================================
app.post('/api/chat', (req, res) => {
  const { message, companyId, sessionId } = req.body;
  console.log(`[API] Received message from ${companyId || 'Unknown'}: ${message}`);

  const normalizedMessage = message.toLowerCase();
  
  try {
    // Basic exact-match/LIKE fallback query (Phase 1)
    // We search the keywords and questions to find the best match
    const stmt = db.prepare(`
      SELECT answer FROM faqs 
      WHERE LOWER(question) LIKE ? 
      OR LOWER(keywords) LIKE ?
      LIMIT 1
    `);
    
    const searchTerm = `%${normalizedMessage}%`;
    const match = stmt.get(searchTerm, searchTerm);
    
    const response = match 
      ? match.answer 
      : "I received your message on the Node.js backend! But I don't have a specific answer for that yet in my database.";

    res.json({
      response: response,
      sessionId: sessionId || "session_" + Date.now()
    });
  } catch (error) {
    console.error(error);
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
