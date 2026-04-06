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

  // 🎤 FIXED VOICE INPUT
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("❌ Browser does not support speech recognition");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("🎤 Listening...");
    };

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      console.log("You said:", speechText);
      setAnswer(speechText); // ✅ fills textarea
    };

    recognition.onerror = (event) => {
      console.error("Error:", event.error);
      alert("❌ Mic error: " + event.error);
    };

    recognition.onend = () => {
      console.log("🎤 Stopped listening");
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
