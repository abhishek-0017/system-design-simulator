import React, { useState } from "react";
import "./App.css";

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
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("❌ Browser does not support speech recognition");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = true;

    recognition.onstart = () => {
      alert("🎤 Speak now...");
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setAnswer(transcript);
    };

    recognition.onerror = (event) => {
      if (event.error === "no-speech") {
        alert("❌ No speech detected");
      } else {
        alert("❌ Mic error");
      }
    };

    recognition.start();
  };

  return (
    <div className="container">
      <h1>🚀 System Design Interview Simulator</h1>

      <h3>Question:</h3>
      <p>{question}</p>

      <textarea
        rows="6"
        placeholder="Write your system design answer..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <br /><br />

      <button onClick={startListening}>🎤 Speak</button>
      <button onClick={handleSubmit}>Submit</button>

      <h3>AI Feedback:</h3>
      <pre>{feedback}</pre>
    </div>
  );
}

export default App;
