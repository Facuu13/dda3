// src/App.js
import React from 'react';
import './App.css';
import NodeInfo from './components/NodeInfo';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Dashboard de Sensores</h1>
      </header>
      <main>
        <NodeInfo />
      </main>
    </div>
  );
}

export default App;