

const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();


app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = "AIzaSyCMmJXub5fLR0gjvlmXVTYWR7qNRGNRZfo";


app.post("/mood", async (req, res) => {
  const moodText = req.body.text;

  if (!moodText) {
    res.status(400).json({ error: "No mood text provided" });
    return;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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

    const genre =
      data.candidates[0].content.parts[0].text.trim().toLowerCase();

    res.json({ genre });
  } catch (error) {
    res.status(500).json({ error: "Gemini API failed" });
  }
});


app.listen(3000, () => {
  console.log("Backend running at http://localhost:3000");
});
