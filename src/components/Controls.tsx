import React from 'react';
import { FaPlay, FaTrash, FaPause } from 'react-icons/fa';
import { AlgorithmType, Graph, GraphConfig } from '../types/graphTypes';
import './Controls.css';

interface ControlsProps {
  graph: Graph;
  config: GraphConfig;
  setStartNode: (num: number | null) => void;
  setEndNode: (num: number | null) => void;
  onRunAlgorithm: (algorithm: AlgorithmType) => void;
  onClearGraph: () => void;
  onStop: () => void;
  isVisualizing: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  graph,
  config,
  onRunAlgorithm,
  setStartNode,
  setEndNode,
  onClearGraph,
  onStop,
  isVisualizing
}) => {
  const isStartValid = config.startNode === null ||
    graph.nodes.some(n => n.number === config.startNode);

  const isEndValid = config.endNode === null ||
    graph.nodes.some(n => n.number === config.endNode);
  return (
    <div className="controls-container">
      <div className="node-selection">
        <div className={`input-group ${!isStartValid ? 'invalid' : ''}`}>
          <label>Start Node:</label>
          <input
            type="number"
            min="0"
            value={config.startNode ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              setStartNode(value === '' ? null : parseInt(value));
            }}
          />
        </div>

        <div className={`input-group ${!isEndValid ? 'invalid' : ''}`}>
          <label>End Node:</label>
          <input
            type="number"
            min="0"
            value={config.endNode ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              setEndNode(value === '' ? null : parseInt(value));
            }}
          />
        </div>
      </div>
      <div className="algorithm-selector">
        <select
          id="algorithm"
          className="dropdown"
          disabled={isVisualizing}
        >
          <option value="dijkstra">Dijkstra's</option>
          <option value="astar">A* Search</option>
          <option value="bfs">Breadth-First Search</option>
        </select>

        <button
          className="control-button run-button"
          onClick={() => {
            const select = document.getElementById('algorithm') as HTMLSelectElement;
            onRunAlgorithm(select.value as AlgorithmType);
          }}
          disabled={isVisualizing}
        >
          {/* <FaPlay /> Run */}
          Run
        </button>

        {isVisualizing && (
          <button
            className="control-button pause-button"
            onClick={onStop}
          >
            {/* <FaPause /> Pause */}
            Stop
          </button>
        )}
      </div>

      <button
        className="control-button clear-button"
        onClick={onClearGraph}
        disabled={isVisualizing}
      >
        {/* <FaTrash /> Clear */}
        Clear
      </button>
    </div>
  );
};

export default Controls;