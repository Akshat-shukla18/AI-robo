import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// app.post("/chat/public", async (req, res) => {
//   const { message } = req.body;

//   if (!message) {
//     return res.status(400).json({ error: "Message required" });
//   }

//   // Backend just replies
//   res.json({
//     reply: "Backend is connected. AI not wired yet."
//   });
// });

app.post("/chat/public", async (req, res) => {
  const { message, mode, jobTitle, experience } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message required" });
  }

  let systemPrompt = "";

  if (mode === "interview") {
    systemPrompt = `
You are a professional interviewer.

Interview context:
- Job role: ${jobTitle}
- Experience level: ${experience}

Rules:
- Ask ONLY one interview question at a time.
- Questions must match the job role and experience.
- After the user's answer, give brief feedback (1–2 lines).
- Then ask the next question.
- Be strict, professional, and realistic.
- Do NOT explain concepts unless asked.
- Do NOT break interview character.
`;
  } else {
    systemPrompt = `
You are a helpful AI career assistant.

You help users with:
- Career guidance
- Job preparation
- Skill advice
- Work-related doubts

Be clear, friendly, and concise.
`;
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.AI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      console.error("OpenRouter bad response:", data);
      return res.status(500).json({ reply: "AI returned no response." });
    }

    const reply = data.choices[0].message.content;
    res.json({ reply });

  } catch (err) {
    console.error("AI FETCH ERROR:", err);
    res.status(500).json({ reply: "AI request failed." });
  }
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
console.log("AI KEY LOADED:", !!process.env.AI_API_KEY);

