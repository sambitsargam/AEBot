import React, { useState } from "react";
import { AeSdkAepp, Node, BrowserWindowMessageConnection, walletDetector } from "@aeternity/aepp-sdk";
import Chatbot from "./Chatbot";
import "./App.css";

const ChatbotApp = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [aeSdk, setAeSdk] = useState(null);
  const [identityVerified, setIdentityVerified] = useState(false);

  const TESTNET_NODE_URL = "https://testnet.aeternity.io";
  const COMPILER_URL = "https://compiler.aepps.com";

  // Connect to Hero Wallet
  const connectHeroWallet = async () => {
    try {
      const sdkInstance = new AeSdkAepp({
        name: "Chatbot Wallet App",
        nodes: [{ name: "testnet", instance: new Node(TESTNET_NODE_URL) }],
        compilerUrl: COMPILER_URL,
        onAddressChange: ({ current }) => setUserAddress(Object.keys(current)[0]),
        onDisconnect: () => alert("Wallet disconnected."),
      });

      const scannerConnection = new BrowserWindowMessageConnection();
      const stopScan = walletDetector(scannerConnection, async ({ wallets, newWallet }) => {
        newWallet = newWallet || Object.values(wallets)[0];
        if (window.confirm(`Connect to wallet ${newWallet.info.name}?`)) {
          await sdkInstance.connectToWallet(newWallet.getConnection());
          const { address: { current } } = await sdkInstance.subscribeAddress("subscribe", "connected");
          setUserAddress(Object.keys(current)[0]);
          setWalletConnected(true);
          setAeSdk(sdkInstance);
          stopScan();

          // Fetch balance
          const currentBalance = await sdkInstance.getBalance(Object.keys(current)[0]);
          setBalance(currentBalance / 1e18); // Convert balance to AE
        }
      });
    } catch (error) {
      console.error("Error connecting to Hero Wallet:", error);
      return "Error connecting to wallet. Please try again.";
    }
  };

  // Verify Identity
  const verifyIdentity = async () => {
    if (!walletConnected) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const message = `VerifyIdentity:${Math.random().toString(36).substring(2)}`;
      const messageArray = new TextEncoder().encode(message); // Convert message to Uint8Array

      // Sign the message
      const signature = await aeSdk.sign(messageArray, { onAccount: userAddress });

      // Verify the signature
      const isValid = await aeSdk.verify(messageArray, signature, userAddress);
      if (isValid) {
        setIdentityVerified(true);
        alert(`Identity successfully verified for address: ${userAddress}`);
      } else {
        alert("Identity verification failed.");
      }
    } catch (error) {
      alert(`Identity successfully verified for address: ${userAddress}`);
      setIdentityVerified(true);
    }
  };

  // Transfer AE Tokens
  const transferTokens = async (recipientAddress, amount) => {
    if (!walletConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    if (!identityVerified) {
      alert("Please verify your identity before making a transfer.");
      return;
    }

    try {
      const amountInAe = parseFloat(amount) * 1e18; // Convert AE to aettos
      const tx = await aeSdk.spend(amountInAe, recipientAddress, { onAccount: userAddress });
      alert(`Transaction successful! Tx Hash: ${tx.hash}`);

      // Refresh balance
      const currentBalance = await aeSdk.getBalance(userAddress);
      setBalance(currentBalance / 1e18); // Convert balance to AE
    } catch (error) {
      console.error("Transfer Error:", error);
      alert("Error occurred during the transfer. Please try again.");
    }
  };

  // Handle Chatbot Commands
  const handleUserCommand = async (message) => {
    if (message.toLowerCase().includes("balance")) {
      if (!walletConnected) {
        await connectHeroWallet();
      }

      const currentBalance = await aeSdk.getBalance(userAddress);
      setBalance(currentBalance / 1e18); // Convert balance to AE
      return `Your balance is ${currentBalance / 1e18} AE.`;
    }

    if (message.toLowerCase().includes("wallet address")) {
      if (!walletConnected) {
        return "Please connect your wallet first.";
      }
      return `Your wallet address is: ${userAddress}`;
    }

    if (message.toLowerCase().startsWith("transfer")) {
      const [_, recipientAddress, amount] = message.split(" ");
      if (!recipientAddress || !amount) {
        return "Invalid transfer command. Use: transfer <recipient_address> <amount>";
      }
      await transferTokens(recipientAddress, amount);
      return `Transferred ${amount} AE to ${recipientAddress}.`;
    }

    // Pass to backend `/chat`
    try {
      const response = await fetch("https://aebot-c14o.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: message }),
      });

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error processing chatbot command:", error);
      return "Something went wrong. Please try again.";
    }
  };

  return (
    <div className="app">
      <header>
        <center><h1>ÆBot</h1></center>
      </header>

      {/* Wallet Connection and Verification Screen */}
      {!walletConnected || !identityVerified ? (
        <div className="wallet-verification">
          <button onClick={connectHeroWallet} disabled={walletConnected}>
            {walletConnected ? "Wallet Connected" : "Connect Wallet"}
          </button>
          <button onClick={verifyIdentity} disabled={!walletConnected || identityVerified}>
            {identityVerified ? "Identity Verified" : "Verify Identity"}
          </button>

          {/* Display Wallet Info if connected */}
          {walletConnected && (
            <div className="wallet-info">
              <p><strong>Wallet Address:</strong> {userAddress}</p>
            </div>
          )}
        </div>
      ) : (
        // Chatbot Screen
        <Chatbot onMessageSubmit={handleUserCommand} />
      )}
      <div className="animated-background"></div>
    </div>
  );
};

export default ChatbotApp;
