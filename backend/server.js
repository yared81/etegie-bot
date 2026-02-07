const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Mock FAQ database
const faqs = [
  { question: "What is etegie bot", answer: "Etegie Bot is a professional chatbot system for modern websites." },
  { question: "How to install", answer: "You can install it using npm install etegie-bot." },
  { question: "How to migrate to nodejs", answer: "You are doing it right now! Just set up this Express server and point your apiUrl to it." }
];

// Chat endpoint
app.post('/api/chat', (req, res) => {
  const { message, companyId, sessionId } = req.body;
  console.log(`Received message from ${companyId}: ${message}`);

  const normalizedMessage = message.toLowerCase();
  
  // Simple matching logic for the demo
  const match = faqs.find(faq => normalizedMessage.includes(faq.question.toLowerCase()));
  
  const response = match 
    ? match.answer 
    : "I received your message on the Node.js backend! But I don't have a specific answer for that yet.";

  res.json({
    response: response,
    sessionId: sessionId || "session_" + Date.now()
  });
});

app.listen(PORT, () => {
  console.log(`Etegie Backend running on http://localhost:${PORT}`);
});
