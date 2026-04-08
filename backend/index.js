const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(express.json());

// ✅ DEBUG
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
            role: "user",
            content: `Evaluate this system design answer:\n${answer}`
          }
        ]
      })
    });

    const data = await response.json();
    console.log("📦 API RESPONSE:", data);

    res.json({
      result: data.choices?.[0]?.message?.content || "No response"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
