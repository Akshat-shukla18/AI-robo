import { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const res = await fetch("http://localhost:5000/chat/public", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { from: "user", text: input },
      { from: "ai", text: data.reply }
    ]);

    setInput("");
  };

  return (
    <div className="app-container">
      <div className="chat-box">
        <div className="chat-header">AI Robo Interview Coach</div>

        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.from}`}>
              {m.text}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
