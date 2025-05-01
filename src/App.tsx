import React, { useState } from 'react';
import Graph from './components/Graph';
import ControlsComponent from './components/Controls';
import './styles/App.css';
import { AlgorithmType } from './types/graphTypes';
import { useGraph } from './hooks/useGraph';
import SvgDefs from './components/SvgDefs';

const App: React.FC = () => {
  const { graph, config, isDeleting, dragState, visualizationStateSet, isVisualizing, stopVisualization, visualizeDijkstra, updateEdgeWeight, startDrag, updateTempTarget, completeDrag, clearGraph, setStartNode, setEndNode, addNode, deleteNode, setIsDeleting, isPositionOccupied } = useGraph();

  const handleRunAlgorithm = (algorithm: AlgorithmType) => {
    visualizeDijkstra();
    console.log(`Running ${algorithm}`);
  };

  return (
    <div className="app">
      <SvgDefs />
      <header className="app-header">
        <ControlsComponent
          graph={graph}
          config={config}
          isVisualizing={isVisualizing}
          setStartNode={setStartNode}
          setEndNode={setEndNode}
          onRunAlgorithm={handleRunAlgorithm}
          onClearGraph={clearGraph}
          onStop={stopVisualization}
        />
      </header>

      <main className="app-content">
        <Graph
          graph={graph}
          config={config}
          isDeleting={isDeleting}
          isVisualizing={isVisualizing}
          visualizationStateSet={visualizationStateSet}
          dragState={dragState}
          updateEdgeWeight={updateEdgeWeight}
          startDrag={startDrag}
          updateTempTarget={updateTempTarget}
          completeDrag={completeDrag}
          addNode={addNode}
          deleteNode={deleteNode}
          setIsDeleting={setIsDeleting}
          isPositionOccupied={isPositionOccupied}
        />
      </main>

      <footer className="app-footer">
        <p>Left-click: Add node | Drag between nodes: Create edge | Right-click: Delete</p>
      </footer>
    </div>
  );
};

export default App;