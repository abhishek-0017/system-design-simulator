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

  // 🎤 FINAL VOICE INPUT (ROBUST)
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
    recognition.continuous = false;

    recognition.onstart = () => {
      console.log("🎤 Listening... Speak now!");
      alert("🎤 Speak now...");
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      console.log("You said:", transcript);
      setAnswer(transcript); // ✅ fills textarea
    };

    recognition.onerror = (event) => {
      console.error("Error:", event.error);

      if (event.error === "no-speech") {
        alert("❌ No speech detected. Try again and speak clearly.");
      } else {
        alert("❌ Mic error: " + event.error);
      }
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
