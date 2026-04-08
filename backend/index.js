const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // ✅ FIX CORS

const PORT = process.env.PORT || 10000;

// ✅ Check API key
console.log("ENV CHECK:", process.env.OPENAI_API_KEY ? "FOUND ✅" : "NOT FOUND ❌");

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

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
            content:
              "You are a strict system design interviewer. Give output in this format:\n\nScore: X/10\n\nStrengths:\n- ...\n\nWeaknesses:\n- ...\n\nSuggestions:\n- ..."
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
