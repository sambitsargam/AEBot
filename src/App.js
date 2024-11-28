// src/App.js
import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import CodeConverterApp from './components/CodeConverterApp/App';
import ChatbotApp from './components/ChatbotApp/App';
import './App.css';
import './index.css';


const App = () => {
  const [selectedApp, setSelectedApp] = useState(null);

  const handleSelectApp = (app) => {
    setSelectedApp(app);
  };

  return (
    <div className="app-container">
      {selectedApp === null ? (
        <LandingPage onSelectApp={handleSelectApp} />
      ) : selectedApp === 'converter' ? (
        <CodeConverterApp />
      ) : selectedApp === 'chatbot' ? (
        <ChatbotApp />
      ) : null}
    </div>
  );
};

export default App;
