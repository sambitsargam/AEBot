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
You are an expert in programming languages and the Sophia smart contract language for the Æternity blockchain. Your task is to translate the following code written in ${sourceLanguage} into a fully functional, syntactically correct, and compilable Sophia smart contract for the Æternity blockchain. 

Source Code:
${sourceCode}

### Instructions:
- Translate the provided ${sourceLanguage} code into a working Sophia smart contract.
- The Sophia code must strictly follow the syntax and best practices of the Sophia language, adhering to the lexical rules as outlined below.
- Ensure that the translated code is fully compilable, syntactically correct, and can run on the Æternity blockchain without errors.
- Use the correct Sophia keywords, such as 'contract', 'entrypoint', 'state', 'let', 'type', 'record', 'datatype', 'switch', 'if', 'else', and 'function' as appropriate.
- Ensure that identifiers are properly named using the naming conventions:
  - Identifiers (Id) should start with a lowercase letter.
  - Constructors (Con) should start with an uppercase letter.
  - Type variables (TVar) should be prefixed with a single quote (e.g., 'a, 'b).
- Types should follow Sophias type system, including 'unit', 'int', 'bool', 'address', 'list', 'tuple', and custom types such as 'record' and 'datatype'.
- Be mindful of layout rules:
  - Use proper indentation to mark blocks, as Sophia uses Python-style layout rules.
  - Ensure that all statements within a block are properly indented.
  - Statements that span multiple lines must begin on a new line and be indented accordingly.
- Implement proper use of constants, records, data types, and functions in the generated Sophia code.
- Avoid adding comments, explanations, or any extra text in the response. Only return the translated Sophia code.
- Ensure the translated code uses the correct operators and respects operator precedence as defined for arithmetic, logical, comparison, and functional operators in Sophia.

Return only the Sophia smart contract code as output, without any additional commentary or formatting.

### Sophia Lexical Rules Recap:
- Comments: Use // for single-line comments and /* */ for block comments (which can be nested).
- Keywords: Ensure the use of appropriate keywords like 'contract', 'entrypoint', 'let', 'switch', 'type', 'record', 'datatype', 'if', 'else', 'stateful', 'payable', 'true', 'false', and more.
- Tokens: Follow the naming rules for identifiers, constructors, and other tokens (e.g., Id, Con, Int, String, etc.).
- Types: Use standard types such as 'int', 'unit', 'bool', 'address', and custom types defined using 'type', 'record', and 'datatype'.
- Layout: Ensure the code adheres to the indentation and layout rules for blocks in Sophia.
- Expressions: Handle expressions as per Sophias syntax for binary operators, unary operators, and function calls.

Example Sophia Code:

contract Example =
  type t = int
  record point = { x : int, y : int }
  entrypoint add (x : t, y : t) : t = x + y
  entrypoint create_point (x : int, y : int) : point = point(x, y)
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
