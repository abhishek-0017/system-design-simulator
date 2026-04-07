import React, { useState } from "react";

function App() {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async () => {
    setFeedback("⏳ Generating feedback...");

    try {
      const res = await fetch("https://system-design-backend-zju7.onrender.com/api/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answer }),
      });

      const data = await res.json();

      console.log("FRONTEND RESPONSE:", data); // 🔥 DEBUG

      if (data.feedback) {
        setFeedback(data.feedback);
      } else {
        setFeedback("❌ No feedback received from server");
      }

    } catch (err) {
      console.error(err);
      setFeedback("❌ Error connecting to server");
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>🚀 System Design Interview Simulator</h1>

      <h3>Question:</h3>
      <p>Design a URL Shortener</p>

      <textarea
        rows="10"
        cols="80"
        placeholder="Write your answer here..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSubmit}>Submit</button>

      <h3>AI Feedback:</h3>
      <pre>{feedback}</pre>
    </div>
  );
}

export default App;
