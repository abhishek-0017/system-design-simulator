const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// MAIN API (IMPORTANT)
app.post("/api/answer", (req, res) => {
  const { answer } = req.body;

  const feedback = `
Score: 7/10

Strengths:
- Good basic understanding
- Mentions key components

Weakness:
- Missing scalability discussion
- No database design
- No caching strategy

Suggestion:
- Talk about load balancer
- Add database sharding
- Mention caching (Redis)
`;

  res.json({ feedback });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
