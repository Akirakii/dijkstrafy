import React from 'react';
import { FaPlay, FaTrash, FaPause } from 'react-icons/fa';
import { AlgorithmType } from '../types/graphTypes';
import './Controls.css';

interface ControlsProps {
  onRunAlgorithm: (algorithm: AlgorithmType) => void;
  onClearGraph: () => void;
  onPause: () => void;
  isVisualizing: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  onRunAlgorithm,
  onClearGraph,
  onPause,
  isVisualizing
}) => {
  return (
    <div className="controls-container">
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
            onClick={onPause}
          >
            {/* <FaPause /> Pause */}
            Pause
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