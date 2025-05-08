import React, { useState } from 'react';
import Graph from './components/Graph';
import ControlsComponent from './components/Controls';
import './styles/App.css';
import { AlgorithmType } from './types/graphTypes';
import { useGraph } from './hooks/useGraph';
import SvgDefs from './components/SvgDefs';

const App: React.FC = () => {
  const {
    graph,
    config,
    isDeleting,
    dragState,
    visualizationStateSet,
    isVisualizing,

    stopVisualization,
    visualizeDijkstra,
    visualizeBellmanFord,
    visualizeSPFA,

    updateEdgeWeight,
    startDrag,
    updateTempTarget,
    completeDrag,
    deleteEdge,

    setStartNode,
    setEndNode,
    addNode,
    deleteNode,
    setIsDeleting,
    isPositionOccupied,
    updateNodePosition,
    clearGraph,
  } = useGraph();

  const handleRunAlgorithm = (algorithm: AlgorithmType) => {
    if (algorithm == 'dijkstra') {
      visualizeDijkstra();
    }
    if (algorithm == 'bellman ford') {
      visualizeBellmanFord();
    }
    if (algorithm == 'spfa') {
      visualizeSPFA();
    }
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
      <a className="source" href="https://github.com/Akirakii/dijkstrafy">See the source code at github</a>

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
          deleteEdge={deleteEdge}

          addNode={addNode}
          deleteNode={deleteNode}
          setIsDeleting={setIsDeleting}
          isPositionOccupied={isPositionOccupied}
          updateNodePosition={updateNodePosition}
        />
      </main>

      <div className="guide">
        <ul>
          <li>🖱️ <strong>Left-click</strong> to create a node</li>
          <li>🔗 <strong>Drag</strong> from one node to another to create a directed edge</li>
          <li>✏️ <strong>Click</strong> on edge weight to edit it</li>
          <li>🗑️ <strong>Right-click & hold</strong> to delete nodes and edges</li>
          <li>🧲 <strong>Alt + Drag</strong> to move nodes</li>
        </ul>
      </div>

    </div>
  );
};

export default App;