import React, { useState } from 'react';
import { useGraph } from '../hooks/useGraph';
import NodeComponent from './Node';
import './Graph.css';
import { Graph, GraphConfig } from '../types/graphTypes';

interface GraphProps {
  graph: Graph;
  config: GraphConfig;
  isDeleting: boolean;
  isVisualizing: boolean;
  addNode: (x: number, y: number) => void;
  deleteNode: (nodeId: string) => void;
  isPositionOccupied: (x: number, y: number) => boolean;
  setIsDeleting: (val: boolean) => void;
}

const GraphComponent: React.FC<GraphProps> = ({
  graph,
  config,
  isDeleting,
  isVisualizing,
  addNode,
  deleteNode,
  setIsDeleting,
  isPositionOccupied,
}) => {
  const [invalidPosition, setInvalidPosition] = useState<{ x: number, y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isVisualizing) return;
    if (e.button === 2) { // Right click
      setIsDeleting(true);
      e.preventDefault();
    }
    if (e.button == 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (isPositionOccupied(x, y)) {
        setInvalidPosition({ x, y });
        setTimeout(() => setInvalidPosition(null), 1000); // Clear after 1sec
        return;
      }

      addNode(x, y);
    }
  };

  const handleMouseUp = () => {
    setIsDeleting(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDeleting) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find node under cursor
    const nodeToDelete = graph.nodes.find(node => {
      const distance = Math.sqrt(
        Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)
      );
      return distance < 15; // Node radius
    });

    if (nodeToDelete) {
      deleteNode(nodeToDelete.id);
    }
  };

  return (
    <div
      className="graph-container"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onContextMenu={(e) => e.preventDefault()}
    >
      {graph.nodes.map(node => (
        <NodeComponent
          key={node.id}
          node={node}
          isDeleting={isDeleting}
          isStart={node.number === config.startNode}
          isEnd={node.number === config.endNode}
        />
      ))}
    </div>
  );
};

export default GraphComponent;