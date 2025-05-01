import React, { useState } from 'react';
import Graph from './components/Graph';
import Controls from './components/Controls';
import './styles/App.css';
import { AlgorithmType } from './types/graphTypes';

const App: React.FC = () => {
  const [isVisualizing, setIsVisualizing] = useState(false);

  const handleRunAlgorithm = (algorithm: AlgorithmType) => {
    setIsVisualizing(true);
    // Add your algorithm execution logic here
    console.log(`Running ${algorithm}`);
  };

  const handleClearGraph = () => {
    // Add graph clearing logic
    console.log('Clearing graph');
  };

  const handlePause = () => {
    setIsVisualizing(false);
    // Add pause logic
  };
  return (
    <div className="app">
      <header className="app-header">
        <h1>Pathfinding Visualizer</h1>
        <Controls
          onRunAlgorithm={handleRunAlgorithm}
          onClearGraph={handleClearGraph}
          onPause={handlePause}
          isVisualizing={isVisualizing}
        />
      </header>

      <main className="app-content">
        <Graph />
      </main>

      <footer className="app-footer">
        <p>Left-click: Add node | Drag between nodes: Create edge | Right-click: Delete</p>
      </footer>
    </div>
  );
};

export default App;