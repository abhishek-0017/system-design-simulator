const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 DEBUG LOGS (VERY IMPORTANT)
console.log("🔥 SERVER STARTED NEW VERSION");
console.log("ENV VALUE:", process.env.OPENROUTER_API_KEY);

// Test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// MAIN API
app.post("/api/answer", async (req, res) => {
  const { answer } = req.body;

  if (!answer || answer.trim() === "") {
    return res.json({
      feedback: "❌ Please write an answer.",
    });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a system design interviewer. Give score out of 10, strengths, weaknesses, and suggestions.",
          },
          {
            role: "user",
            content: answer,
          },
        ],
      }),
    });

    const data = await response.json();

    console.log("📦 API RESPONSE:", data);

    if (!data.choices) {
      return res.json({
        feedback: "⚠️ API error: " + JSON.stringify(data),
      });
    }

    const feedback = data.choices[0].message.content;

    res.json({ feedback });

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.json({
      feedback: "⚠️ Server error",
    });
  }
});

// START SERVER
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
