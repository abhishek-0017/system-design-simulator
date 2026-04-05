import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [question] = useState("Design a URL Shortener System");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [sessions, setSessions] = useState([]);

  // 🎨 Canvas setup
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  const startDrawing = (e) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  // ✅ Fetch sessions
  const fetchSessions = async () => {
    const res = await axios.get('http://localhost:5000/sessions');
    setSessions(res.data);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // ✅ Submit answer + diagram
  const handleSubmit = async () => {
    try {
      const canvas = canvasRef.current;
      const image = canvas.toDataURL();

      const res = await axios.post('http://localhost:5000/answer', {
        question,
        answer,
        diagram: image
      });

      setFeedback(JSON.stringify(res.data.result, null, 2));
      fetchSessions();

    } catch (err) {
      setFeedback("Error getting feedback");
    }
  };

  // ✅ Clear canvas
  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>System Design Interview Simulator</h1>

      <h3>Question:</h3>
      <p>{question}</p>

      <textarea
        rows="6"
        cols="80"
        placeholder="Type your answer..."
        value={answer}
        onChange={e => setAnswer(e.target.value)}
      />

      <br/><br/>
      <button onClick={handleSubmit}>Submit Answer</button>

      <h3>AI Feedback:</h3>
      <pre>{feedback}</pre>

      <h3>Draw Your System Design:</h3>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        style={{ border: "1px solid black" }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
      />

      <br/>
      <button onClick={clearCanvas}>Clear Canvas</button>

      <h3>Interview History:</h3>
      <ul>
        {sessions.map((s) => (
          <li key={s.id}>
            <strong>{s.question}</strong> → Score: {s.result.score}

            <br/>
            <img 
              src={s.diagram} 
              alt="diagram" 
              width="200" 
              style={{ border: "1px solid black", marginTop: "10px" }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
