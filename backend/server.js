const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// OpenAI API details
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// Supported languages for conversion
const SUPPORTED_LANGUAGES = ['Go', 'Erlang', 'Elixir', 'Lisp', 'Lua', 'Solidity', 'Rust'];

// Health check endpoint
app.get('/status', (req, res) => {
    res.send({ status: 'Server is running!' });
});

// GET endpoint to list supported languages
app.get('/languages', (req, res) => {
    res.send({ supportedLanguages: SUPPORTED_LANGUAGES });
});

// POST endpoint for code conversion
app.post('/convert', async (req, res) => {
    const { sourceCode, sourceLanguage } = req.body;

    // Validate input
    if (!sourceCode || !sourceLanguage) {
        return res.status(400).send({ error: 'Source code and source language are required.' });
    }
    if (!SUPPORTED_LANGUAGES.includes(sourceLanguage)) {
        return res.status(400).send({ 
            error: `Unsupported source language: ${sourceLanguage}. Supported languages are ${SUPPORTED_LANGUAGES.join(', ')}.` 
        });
    }

    try {
        // Construct the prompt for OpenAI to return only the Sophia code
        const prompt = `
        You are an expert in programming languages and the Sophia smart contract language for the Æternity blockchain. Translate the following ${sourceLanguage} code into a fully functional, compilable Sophia smart contract:
        
        Source Code:
        ${sourceCode}
        
        ### Sophia Smart Contract
        - Adhere strictly to Sophia's syntax and best practices.
        - Ensure the generated code is syntactically correct and fully compilable.
        - Include appropriate types, annotations, and functions relevant to Sophia.
        - Do not include any explanations, comments, or extra text outside of the Sophia contract.
        
        Only return the Sophia smart contract as output.
        `;
        

        // Call OpenAI API
        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You are a code translator capable of converting code from various languages into Sophia smart contracts for the Æternity blockchain." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 1500,
            },
            {
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Extract translated Sophia code
        const translatedCode = response.data.choices[0].message.content.trim();

        // Respond with the translated code
        res.send({ translatedCode });
    } catch (error) {
        console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
        res.status(500).send({ error: 'Code conversion failed. Please try again later.' });
    }
});

app.post("/chat", async (req, res) => {
    const { prompt } = req.body;
  
    if (!prompt) {
      return res.status(400).send({ error: "Prompt is required." });
    }
  
    try {
      const response = await axios.post(OPENAI_API_URL, {
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful assistant for Sophia smart contract development helper bot." },
          { role: "user", content: prompt },
        ],
        max_tokens: 500,
      }, {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      });
  
      const reply = response.data.choices[0].message.content.trim();
      res.send({ response: reply });
    } catch (error) {
      console.error("Chatbot Error:", error.message);
      res.status(500).send({ error: "Failed to process your query." });
    }
  });
  
// Error handler for unknown routes
app.use((req, res, next) => {
    res.status(404).send({ error: 'Route not found' });
});

app.use(cors({
    origin: 'https://aebot-web.vercel.app', // Allow only this domain
    methods: ['GET', 'POST'], // Define allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Define allowed headers
}));


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
