require("dotenv").config();

const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;


app.use(cors());
app.use(express.json());



app.post("/mood", async (req, res) => {
  const moodText = req.body.text;

  if (!moodText) {
    res.status(400).json({ error: "No mood text provided" });
    return;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text:
                    "From this sentence, return ONLY ONE movie genre like comedy, drama, action, romance, or horror. No explanation: " +
                    moodText
                }
              ]
            }
          ]
        })
      }
    );

    
const data = await response.json();

if (!response.ok) {
  console.error("Gemini API status:", response.status);
  console.error("Gemini API response:", data);

  return res.status(response.status).json({
    error: "Gemini API request failed",
    details: data
  });
}

const genre =
  data.candidates?.[0]?.content?.parts?.[0]?.text
    ?.trim()
    ?.toLowerCase();

if (!genre) {
  console.error("Unexpected Gemini response:", data);
  return res.status(502).json({
    error: "Gemini returned no genre"
  });
}

res.json({ genre });

 } catch (error) {
  console.error("Actual backend error:", error);

  res.status(500).json({
    error: "Gemini API failed",
    details: error.message
  });
}
});


app.listen(3000, () => {
  console.log("Backend running at http://localhost:3000");
});
