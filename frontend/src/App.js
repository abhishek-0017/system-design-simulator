import React, { useState } from "react";

function App() {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const question = "Design a URL Shortener";

  const handleSubmit = async () => {
    if (!answer || answer.trim() === "") {
      setFeedback("❌ Please write an answer before submitting.");
      return;
    }

    try {
      const res = await fetch("https://system-design-backend-zju7.onrender.com/api/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answer }),
      });

      const data = await res.json();
      setFeedback(data.feedback);
    } catch (err) {
      setFeedback("⚠️ Server error. Try again.");
    }
  };

  // 🎤 Voice Input
  const startListening = () => {
    if (!window.webkitSpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setAnswer(speechText);
    };

    recognition.start();
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🚀 System Design Interview Simulator</h1>

      <h3>Question:</h3>
      <p>{question}</p>

      <textarea
        rows="6"
        cols="60"
        placeholder="Write your system design answer..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <br /><br />

      <button onClick={startListening}>🎤 Speak Answer</button>

      <br /><br />

      <button onClick={handleSubmit}>Submit Answer</button>

      <h3>AI Feedback:</h3>
      <pre>{feedback}</pre>
    </div>
  );
}

export default App;
