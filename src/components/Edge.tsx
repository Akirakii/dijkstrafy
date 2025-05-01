import React from 'react';
import { Edge } from '../types/graphTypes';
import { Node } from '../types/graphTypes';

interface EdgeProps {
  edge: Edge;
  nodes: Node[];
  isTemp?: boolean;
}

const EdgeComponent: React.FC<EdgeProps> = ({ edge, nodes, isTemp = false }) => {
  const sourceNode = nodes.find(n => n.id === edge.source);
  const targetNode = nodes.find(n => n.id === edge.target);

  if (!sourceNode || !targetNode) return null;

  return (
    <svg className={`edge ${isTemp ? 'temp-edge' : ''}`}>
      <line
        x1={sourceNode.x}
        y1={sourceNode.y}
        x2={targetNode.x}
        y2={targetNode.y}
        stroke={isTemp ? '#3498db' : '#7f8c8d'}
        strokeWidth={2}
        strokeDasharray={isTemp ? '5,5' : undefined}
        markerEnd="url(#arrowhead)"
      />
    </svg>
  );
};

export default EdgeComponent;