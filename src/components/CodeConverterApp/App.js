import React, { useState, useEffect } from "react";
import Prism from "prismjs"; // Import Prism.js
import "prismjs/themes/prism-tomorrow.css"; // Import Prism theme
import "./App.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { motion } from "framer-motion"; // For animations
import { AeSdk, CompilerHttp, Node, MemoryAccount, Contract } from "@aeternity/aepp-sdk";

const CodeConverterApp = () => {
  const [sourceCode, setSourceCode] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("Erlang");
  const [convertedCode, setConvertedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [contractAddress, setContractAddress] = useState("");

  const ACCOUNT_SECRET_KEY = "sk_2CuofqWZHrABCrM7GY95YSQn8PyFvKQadnvFnpwhjUnDCFAWmf"; // Replace with your key
  const NODE_URL = "https://testnet.aeternity.io";
  const COMPILER_URL = "https://v8.compiler.aepps.com";

  useEffect(() => {
    Prism.highlightAll(); // Highlight all code blocks when the component renders/updates
  }, [convertedCode]);

  const handleConvert = async () => {
    if (!sourceCode || !sourceLanguage) {
      setError("Please provide both the source code and select a source language.");
      return;
    }
    setError("");
    setConvertedCode("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceCode,
          sourceLanguage,
        }),
      });
      const data = await response.json();
      setConvertedCode(data.translatedCode || "No translated code available.");
    } catch (err) {
      setError("Failed to convert code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deployContract = async () => {
    if (!convertedCode) {
      setError("No Sophia code available to deploy.");
      return;
    }

    setError("");
    setLoading(true);
    setContractAddress("");

    try {
      // Initialize AE SDK
      const account = new MemoryAccount(ACCOUNT_SECRET_KEY);
      const node = new Node(NODE_URL);
      const aeSdk = new AeSdk({
        nodes: [{ name: "testnet", instance: node }],
        accounts: [account],
        onCompiler: new CompilerHttp(COMPILER_URL),
      });

      // Deploy the Sophia contract
      const contract = await Contract.initialize({
        ...aeSdk.getContext(),
        sourceCode: convertedCode,
      });

      // Compile and deploy
      await contract.$compile();
      const deployInfo = await contract.$deploy([5]); // Adjust initialization args as needed
      setContractAddress(deployInfo.address);
      alert(`Contract successfully deployed at: ${deployInfo.address}`);
    } catch (err) {
      console.error("Deployment Error:", err);
      setError("Failed to deploy contract. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Code to Sophia Converter</h1>
      </header>
      <motion.main
        className="main-container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="form-group">
          <label>Source Language:</label>
          <select
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value)}
          >
            <option value="Erlang">Erlang</option>
            <option value="Go">Go</option>
            <option value="Elixir">Elixir</option>
            <option value="Lisp">Lisp</option>
            <option value="Lua">Lua</option>
            <option value="Solidity">Solidity</option>
          </select>
        </div>

        <div className="form-group">
          <label>Source Code:</label>
          <textarea
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
            placeholder="Paste your source code here..."
          ></textarea>
        </div>

        <motion.button
          onClick={handleConvert}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="convert-button"
        >
          {loading ? "Converting..." : "Convert to Sophia"}
        </motion.button>

        {error && <p className="error">{error}</p>}

        {convertedCode && (
  <motion.div
    className="output"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2>Converted Sophia Code (Editable):</h2>
    <textarea
      value={convertedCode}
      onChange={(e) => setConvertedCode(e.target.value)}
      placeholder="Edit Sophia code here before deployment..."
      rows={10}
    />
    <div className="copy-button-container">
      <CopyToClipboard text={convertedCode} onCopy={handleCopy}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="copy-button"
        >
          {copied ? "Copied!" : "Copy Code"}
        </motion.button>
      </CopyToClipboard>
      <motion.button
        onClick={deployContract}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="deploy-button"
      >
        {loading ? "Deploying..." : "Deploy Contract"}
      </motion.button>
    </div>
    {contractAddress && <p>Contract Address: {contractAddress}</p>}
  </motion.div>
)}
      </motion.main>
    </div>
  );
};

export default CodeConverterApp;
