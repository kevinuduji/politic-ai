import React from "react";
import "./App.css";
import DebateTTS from "./components/debate-tts/DebateTTS";
import ErrorBoundary from "./ErrorBoundary";

function App() {
  console.log("App component rendering...");

  return (
    <div className="App">
      <header className="App-header">
        <h1>Politic AI</h1>
        <p>AI-Powered Political Debate Platform</p>
      </header>
      <main>
        <ErrorBoundary>
          <DebateTTS />
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;
