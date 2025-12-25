
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import "./App.css";

function App() {
  // const [input, setInput] = useState("");
  // const [messages, setMessages] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
const [chatInput, setChatInput] = useState("");

const [chatSessionId, setChatSessionId] = useState(0);

const [awaitingAnswer, setAwaitingAnswer] = useState(false);


const [interviewMessages, setInterviewMessages] = useState([]);
const [interviewInput, setInterviewInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("chat"); 
  const [showInterviewSetup, setShowInterviewSetup] = useState(false);
  const [seconds, setSeconds] = useState(0);
const [timerRunning, setTimerRunning] = useState(false);
const [showExitConfirm, setShowExitConfirm] = useState(false);
const [search, setSearch] = useState("");


useEffect(() => {
  let interval;
  if (timerRunning) {
    interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
  }
  return () => clearInterval(interval);
}, [timerRunning]);

const startStopwatch = () => {
  setSeconds(0);
  setTimerRunning(true);
};

const stopStopwatch = () => {
  setTimerRunning(false);
};
const formatTime = (s) => {
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};


const [interviewConfig, setInterviewConfig] = useState({
  jobTitle: "",
  experience: ""
});
// "chat" | "interview"



const startNewChat = () => {
  setMode("chat");
  setChatMessages([]);
  setChatInput("");
  setLoading(false);
  setChatSessionId((prev) => prev + 1);
};



//   
const sendMessage = async () => {
  if (loading) return;

  const currentInput =
    mode === "chat" ? chatInput : interviewInput;

  if (!currentInput.trim()) return;

  setLoading(true);

  const res = await fetch("http://localhost:5000/chat/public", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: currentInput,
      mode,
      jobTitle: interviewConfig.jobTitle,
      experience: interviewConfig.experience
    })
  });

  const data = await res.json();

  if (mode === "chat") {
    setChatMessages((prev) => [
      ...prev,
      { from: "user", text: currentInput },
      { from: "ai", text: data.reply }
    ]);
    setChatInput("");
  } else {
    setInterviewMessages((prev) => [
      ...prev,
      { from: "user", text: currentInput },
      { from: "ai", text: data.reply }
    ]);
    setInterviewInput("");
  }

  setLoading(false);
};

  return (
    <div className="app-container">
      <div className="layout">  

      {/* HISTORY PANEL */}
      {mode === "chat" && (
      <div className="history-panel">
         <button
  className="new-chat-btn"
  onClick={() => startNewChat("chat")}
>
  💬 AI Assistance
</button>
   <button
  className="interview-mode-btn"
 onClick={() => setShowInterviewSetup(true)}
>
  🎯 Interview Mode
</button>
        <div className="history-header">History</div>
        <input
  className="history-search"
  placeholder="Search chats..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

        <div className="history-list">
         
          
          </div> 
          

<button
  className="new-chat-btn"
  onClick={() => startNewChat("chat")}
>
  + New Chat
</button>
  
          
        
        
        
      </div>
)}


        {mode === "chat" && (
  <div className="chat-box">
    <div className="chat-header">AI Robo Interview Coach</div>

    <div className="chat-messages">
     {chatMessages.map((m, i) => (
  <div className={`message ${m.from}`}>
  {m.from === "ai" ? (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {m.text}
    </ReactMarkdown>
  ) : (
    m.text
  )}
</div>

))}


      {loading && (
        <div className="message ai thinking">
          ...
        </div>
      )}
    </div>

  <div className="interview-input-wrapper">
 <input
  value={chatInput}
  onChange={(e) => setChatInput(e.target.value)}
  placeholder="Ask the question..."
  disabled={loading}
  onKeyDown={(e) => {
    if (e.key === "Enter") sendMessage();
  }}
/>
  <button onClick={sendMessage} disabled={loading}>
    {loading ? "…" : "➤"}
  </button>
</div>
  </div>
)}




{/* INterviewwwwwwwww */}


{mode === "interview" && (
  <div className="interview-container">

    {/* HEADER */}
    <div className="interview-header">
  <div className="interview-title">
    {interviewConfig.jobTitle} Interview
  </div>

  <div className="interview-timer">
    ⏱ {formatTime(seconds)}
  </div>

  <button
    className="exit-interview-btn"
  onClick={() => setShowExitConfirm(true)}
>
  Exit Interview
  </button>
</div>

    {/* BODY */}
    <div className="interview-body">

      {/* AVATAR PANEL */}
      <div className="avatar-panel">
        <div className="avatar-placeholder">
          3D Avatar Area
        </div>

        <div className="avatar-status">
          Idle
        </div>
      </div>

      {/* INTERVIEW CHAT PANEL */}
      <div className="interview-chat-panel">

       <div className="interview-messages">
  {interviewMessages.map((m, i) => (
 <div className={`message ${m.from}`}>
  {m.from === "ai" ? (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {m.text}
    </ReactMarkdown>
  ) : (
    m.text
  )}
</div>

))}

  {loading && (
    <div className="interview-message ai thinking">
      AI is thinking...
    </div>
  )}
</div>

        <div className="interview-input-wrapper">
  <input
  value={interviewInput}
  onChange={(e) => setInterviewInput(e.target.value)}
  placeholder="Answer the question..."
  disabled={loading}
  onKeyDown={(e) => {
    if (e.key === "Enter") sendMessage();
  }}
/>

  <button onClick={sendMessage} disabled={loading}>
    {loading ? "…" : "➤"}
  </button>
</div>

      </div>
    </div>

  </div>
)}
{showExitConfirm && (
  <div className="modal-overlay">
    <div className="exit-confirm-modal">

      <h3>Exit Interview?</h3>
      <p>Your current interview progress will be lost.</p>

      <div className="exit-confirm-actions">
        <button
          className="cancel-btn"
          onClick={() => setShowExitConfirm(false)}
        >
          Cancel
        </button>

        <button
          className="confirm-exit-btn"
          onClick={() => {
            stopStopwatch();
            setShowExitConfirm(false);
            setMode("chat");
          }}
        >
          Exit
        </button>
      </div>

    </div>
  </div>
)}
{showInterviewSetup && (
  <div className="modal-overlay">
    <div className="interview-modal">

      {/* CLOSE BUTTON */}
      <button
        className="modal-close-btn"
        onClick={() => setShowInterviewSetup(false)}
        aria-label="Close interview setup"
      >
        ✕
      </button>

      <h3>Interview Setup</h3>

      <input
        placeholder="Job Title (e.g. Frontend Developer)"
        value={interviewConfig.jobTitle}
        onChange={(e) =>
          setInterviewConfig({
            ...interviewConfig,
            jobTitle: e.target.value
          })
        }
      />

      <select
        value={interviewConfig.experience}
        onChange={(e) =>
          setInterviewConfig({
            ...interviewConfig,
            experience: e.target.value
          })
        }
      >
        <option value="">Select Experience</option>
        <option value="0-1">0–1 Years</option>
        <option value="2-3">2–3 Years</option>
        <option value="4-6">4–6 Years</option>
        <option value="7+">7+ Years</option>
      </select>

      <button
  className="start-interview-btn"
  onClick={() => {
    if (!interviewConfig.jobTitle || !interviewConfig.experience) return;

    setShowInterviewSetup(false);
    setMode("interview");

    // RESET INTERVIEW STATE
    setInterviewMessages([
      {
        from: "ai",
        text: "Introduce yourself."
      }
    ]);

    setAwaitingAnswer(true);
    setInterviewInput("");
    startStopwatch();
  }}
>
  Start Interview
</button>

    </div>
  </div>
)}


    </div>
    </div>
  );
}

export default App;
