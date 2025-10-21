// const { GoogleGenAI } = require("@google/genai");
// const db = require("../db/dbConfig.js");

// const ai = new GoogleGenAI({});

// const askAI = async (req, res) => {
//   const { userid } = req.user;
//   const { question } = req.body;
//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: question,
//       config: {
//         systemInstruction:
//           "you are senior developer and answer the questions in only 3 sentences",
//         maxOutputTokens: 100,
//         thinkingConfig: {
//           thinkingBudget: 0,
//         },
//       },
//     });
//     const answer = response.text;

//     await db.query(
//       "INSERT INTO ai_questions (userid, question, answer) VALUES (?, ?, ?)",
//       [userid, question, answer]
//     );

//     res.json({ success: true, answer });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error fetching Gemini response" });
//   }
// };

// const getAIHistory = async (req, res) => {
//   const { userid } = req.user;
//   try {
//     const [rows] = await db.query(
//       "SELECT * FROM ai_questions WHERE userid = ? ORDER BY created_at DESC",
//       [userid]
//     );
//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch history" });
//   }
// };

// module.exports = { askAI, getAIHistory };

const { GoogleGenAI } = require("@google/genai");
const db = require("../db/dbConfig.js");

const ai = new GoogleGenAI({});

// ASK AI
const askAI = async (req, res) => {
  const { userid } = req.user;
  const { question } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: question,
      config: {
        systemInstruction:
          "You are a senior developer and answer the questions in only 3 sentences",
        maxOutputTokens: 100,
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });

    const answer = response.text;

    // Insert into PostgreSQL
    await db.query(
      "INSERT INTO ai_questions (userid, question, answer) VALUES ($1, $2, $3)",
      [userid, question, answer]
    );

    res.json({ success: true, answer });
  } catch (err) {
    console.error("Error in askAI:", err.message);
    res.status(500).json({
      message: "Error fetching Gemini response",
      details: err.message,
    });
  }
};

// GET AI HISTORY
const getAIHistory = async (req, res) => {
  const { userid } = req.user;

  try {
    const result = await db.query(
      "SELECT * FROM ai_questions WHERE userid = $1 ORDER BY created_at DESC",
      [userid]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error in getAIHistory:", err.message);
    res
      .status(500)
      .json({ message: "Failed to fetch history", details: err.message });
  }
};

module.exports = { askAI, getAIHistory };
