const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Main API
app.post("/api/answer", (req, res) => {
  const { answer } = req.body;

  if (!answer || answer.trim() === "") {
    return res.json({
      feedback: "❌ Please write an answer before submitting.",
    });
  }

  let score = 5;
  let strengths = [];
  let weaknesses = [];

  if (answer.toLowerCase().includes("database")) {
    strengths.push("Mentions database");
    score += 1;
  } else {
    weaknesses.push("Missing database design");
  }

  if (answer.toLowerCase().includes("cache")) {
    strengths.push("Includes caching");
    score += 1;
  } else {
    weaknesses.push("No caching strategy");
  }

  if (answer.toLowerCase().includes("load balancer")) {
    strengths.push("Includes load balancing");
    score += 1;
  } else {
    weaknesses.push("Missing load balancing");
  }

  const feedback = `
Score: ${score}/10

Strengths:
${strengths.length ? strengths.join("\n") : "Basic attempt"}

Weaknesses:
${weaknesses.join("\n")}

Suggestion:
- Think about scalability
- Add system components
- Improve architecture explanation
`;

  res.json({ feedback });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
