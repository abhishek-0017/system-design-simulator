import React, { useState } from "react";

function App() {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async () => {
    setResult("⏳ Generating feedback...");

    try {
      const res = await fetch("https://system-design-backend-zju7.onrender.com/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ answer })
      });

      const data = await res.json();

      setResult(data.result || "No response");

    } catch (err) {
      console.error(err);
      setResult("❌ Error connecting to backend");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>🚀 System Design Interview Simulator</h1>

      <h3>Question:</h3>
      <p>Design a URL Shortener</p>

      <textarea
        rows="10"
        cols="80"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Write your answer..."
      />

      <br /><br />

      <button onClick={handleSubmit}>Submit</button>

      <h3>AI Feedback:</h3>
      <pre>{result}</pre>
    </div>
  );
}

export default App;
