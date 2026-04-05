import { useState } from "react";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("Design a URL Shortener");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setFeedback("");

    try {
      const res = await fetch(
        "https://system-design-backend-zju7.onrender.com/api/answer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answer }),
        }
      );

      const data = await res.json();
      setFeedback(data.feedback);
    } catch (err) {
      setFeedback("Error getting feedback");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>🚀 System Design Interview Simulator</h1>

      <div className="card">
        <h2>Question</h2>
        <p>{question}</p>
      </div>

      <div className="card">
        <h2>Your Answer</h2>
        <textarea
          placeholder="Write your system design answer..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <button onClick={handleSubmit}>
          {loading ? "Analyzing..." : "Submit Answer"}
        </button>
      </div>

      {feedback && (
        <div className="card">
          <h2>AI Feedback</h2>
          <pre>{feedback}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
