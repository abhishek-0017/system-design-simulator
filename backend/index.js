const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());

// ✅ VERY IMPORTANT (fixes your error)
const cors = require("cors");
app.use(cors());

const PORT = process.env.PORT || 5000;

console.log("ENV CHECK:", process.env.OPENAI_API_KEY ? "FOUND ✅" : "NOT FOUND ❌");

app.post("/analyze", async (req, res) => {
  try {
    const { answer } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a system design interviewer. Give score, strengths, weaknesses, and improvements."
          },
          {
            role: "user",
            content: answer
          }
        ]
      })
    });

    const data = await response.json();

    res.json({
      result: data.choices?.[0]?.message?.content || "No response"
    });

  } catch (err) {
    console.error(err);
    res.json({ result: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
