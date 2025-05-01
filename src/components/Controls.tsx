import React, { useState } from 'react';
import { FaPlay, FaStop, FaTrash } from 'react-icons/fa';
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
  const [validationTriggered, setValidationTriggered] = useState(false);

  const isStartValid = config.startNode != null &&
    graph.nodes.some(n => n.number === config.startNode);
  const isEndValid = config.endNode != null &&
    graph.nodes.some(n => n.number === config.endNode);

  return (
    <>
      {graph.edges.length > 0 ? (
        <div className="controls-container">
          {/* Icon Buttons Row */}
          <div className="controls-icon-row">
            <button
              className="control-button run-button"
              onClick={() => {
                setValidationTriggered(true);
                if (!isStartValid || !isEndValid) return;
                const select = document.getElementById('algorithm') as HTMLSelectElement;
                onRunAlgorithm(select.value as AlgorithmType);
              }}
              disabled={isVisualizing}
            >
              ▶
            </button>

            <button
              className="control-button stop-button"
              onClick={onStop}
              disabled={!isVisualizing}
            >
              ⏹
            </button>

            <button
              className="control-button clear-button"
              onClick={onClearGraph}
              disabled={isVisualizing}
            >
              🗑️
            </button>
          </div>

          {/* Algorithm Selection */}
          <div className="input-group">
            <label className="input-label">Algorithm:</label>
            <select
              id="algorithm"
              className="algorithm-select"
              disabled={isVisualizing}
            >
              <option value="dijkstra">Dijkstra's</option>
              <option value="bellman ford">Bellman Ford</option>
              <option value="spfa">SPFA</option>
            </select>
          </div>

          {/* Node Inputs */}
          <div className="node-inputs">
            <div className={`input-group ${validationTriggered && !isStartValid ? 'invalid' : ''}`}>
              <label className="input-label">Start Node Number:</label>
              <input
                disabled={isVisualizing}
                type="number"
                min="0"
                className="node-input"
                value={config.startNode ?? ''}
                onChange={(e) => {
                  setValidationTriggered(false);
                  const value = e.target.value;
                  setStartNode(value === '' ? null : parseInt(value));
                }}
              />
            </div>

            <div className={`input-group ${validationTriggered && !isEndValid ? 'invalid' : ''}`}>
              <label className="input-label">End Node Number:</label>
              <input
                disabled={isVisualizing}
                type="number"
                min="0"
                className="node-input"
                value={config.endNode ?? ''}
                onChange={(e) => {
                  setValidationTriggered(false);
                  const value = e.target.value;
                  setEndNode(value === '' ? null : parseInt(value));
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-graph-message">
          <p className="title">This is <strong>Dijkstrafy</strong></p>
          {graph.nodes.length > 1 ? (<p>Click and drag one node to another to create a connection!</p>) : <p>Click on the board to create some nodes and try to connect them!</p>}
        </div>
      )}
    </>
  );
};

export default Controls;