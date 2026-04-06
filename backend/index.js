const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// AI Feedback Route
app.post("/api/answer", async (req, res) => {
  const { answer } = req.body;

  if (!answer || answer.trim() === "") {
    return res.json({
      feedback: "❌ Please write an answer before submitting.",
    });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "System Design Simulator"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a system design interviewer. Give score out of 10, strengths, weaknesses, and suggestions."
          },
          {
            role: "user",
            content: `Evaluate this answer:\n${answer}`
          }
        ]
      }),
    });

    const data = await response.json();

    const feedback =
      data.choices?.[0]?.message?.content || "No feedback generated";

    res.json({ feedback });

  } catch (err) {
    console.error(err);
    res.json({
      feedback: "⚠️ Error getting AI feedback",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
