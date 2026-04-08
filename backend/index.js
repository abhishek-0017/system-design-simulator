const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

// ✅ ENV CHECK
console.log("ENV CHECK:", process.env.OPENAI_API_KEY ? "FOUND ✅" : "NOT FOUND ❌");

app.post("/analyze", async (req, res) => {
  try {
    const { answer } = req.body;

    // ✅ Using built-in fetch (Node 18+)
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
            content: `Evaluate this system design answer and give score out of 10 with improvements:\n\n${answer}`
          }
        ]
      })
    });

    const data = await response.json();

    console.log("📦 API RESPONSE:", data);

    res.json({
      result: data.choices?.[0]?.message?.content || "No response from AI"
    });

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
