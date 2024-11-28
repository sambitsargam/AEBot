import React from 'react';
import './LandingPage.css'; // Optional for styling

const LandingPage = ({ onSelectApp }) => {
  return (
    <div className="landing-page">
      <h1>Welcome to ÆBot Blockchain Apps</h1>
      <p>Choose an app to start:</p>
      <div className="app-selection">
        <button onClick={() => onSelectApp('converter')}>Code Converter</button>
        <button onClick={() => onSelectApp('chatbot')}>Blockchain Chatbot</button>
      </div>
    </div>
  );
};

export default LandingPage;