const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 10000;

console.log("ENV CHECK:", process.env.OPENAI_API_KEY ? "FOUND ✅" : "NOT FOUND ❌");

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.post("/analyze", async (req, res) => {
  try {
    const { answer } = req.body;

    console.log("USER INPUT:", answer);

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
            content: "You are a system design interviewer. Give score, strengths, weaknesses, suggestions."
          },
          {
            role: "user",
            content: answer || "Design a URL shortener"
          }
        ]
      })
    });

    const data = await response.json();

    console.log("OPENAI FULL RESPONSE:", JSON.stringify(data, null, 2));

    // 🚨 HANDLE ERROR PROPERLY
    if (!response.ok) {
      return res.json({
        result: "❌ OpenAI API Error: " + (data.error?.message || "Unknown error")
      });
    }

    // 🚨 HANDLE EMPTY RESPONSE
    if (!data.choices || data.choices.length === 0) {
      return res.json({
        result: "❌ No choices returned from OpenAI"
      });
    }

    res.json({
      result: data.choices[0].message.content
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.json({ result: "❌ Server crashed" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
