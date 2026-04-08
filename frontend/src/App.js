import React, { useState } from "react";

function App() {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState("");

  // 🎤 Voice Input
  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      setAnswer(event.results[0][0].transcript);
    };

    recognition.start();
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        "https://system-design-backend-zju7.onrender.com/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ answer })
        }
      );

      const data = await res.json();
      setResult(data.result);

    } catch (error) {
      setResult("❌ Error connecting to backend");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🚀 System Design Interview Simulator</h1>

      <h3>Question: Design a URL Shortener</h3>

      <textarea
        rows="8"
        cols="60"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Write your answer..."
      />

      <br /><br />

      <button onClick={startListening}>🎤 Speak</button>

      <br /><br />

      <button onClick={handleSubmit}>Submit</button>

      <h3>AI Feedback:</h3>
      <pre>{result}</pre>
    </div>
  );
}

export default App;
