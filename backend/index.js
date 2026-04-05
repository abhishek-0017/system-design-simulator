// backend/index.js

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ In-memory storage
let sessions = [];

// ✅ POST: Handle answer
app.post('/answer', (req, res) => {
  const { answer, question, diagram } = req.body;

  if (!answer) {
    return res.status(400).json({ error: "Answer is required" });
  }

  // 🔥 Mock AI response
  const mockResponse = {
    score: "7/10",
    feedback: "Good attempt. You mentioned basic components but missing scalability, caching, and database optimization.",
    followUp: "How would you scale this system to handle millions of users?"
  };

  // ✅ Save session (with diagram)
  const session = {
    id: sessions.length + 1,
    question,
    answer,
    diagram,
    result: mockResponse
  };

  sessions.push(session);

  res.json({ result: mockResponse });
});

// ✅ GET: Fetch all sessions
app.get('/sessions', (req, res) => {
  res.json(sessions);
});

// ✅ Start server
app.listen(5000, () => {
  console.log("✅ Backend running on port 5000 (MOCK MODE + DIAGRAM)");
});
