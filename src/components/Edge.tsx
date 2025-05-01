import React, { useState, useRef, useEffect } from 'react';
import { Edge } from '../types/graphTypes';
import { Node } from '../types/graphTypes';

interface EdgeProps {
  edge: Edge;
  nodes: Node[];
  isVisualizing?: boolean;
  isTemp?: boolean;
  onWeightChange?: (edgeId: string, newWeight: number) => void;
}

const EdgeComponent: React.FC<EdgeProps> = ({
  edge,
  nodes,
  isVisualizing = false,
  isTemp = false,
  onWeightChange = () => { }
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempWeight, setTempWeight] = useState(edge.weight.toString());
  const inputRef = useRef<HTMLInputElement>(null);
  const sourceNode = nodes.find(n => n.id === edge.source);
  const targetNode = nodes.find(n => n.id === edge.target);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (!sourceNode || !targetNode) return null;

  const midX = (sourceNode.x + targetNode.x) / 2;
  const midY = (sourceNode.y + targetNode.y) / 2;

  const handleWeightSubmit = () => {
    const newWeight = Math.max(1, parseInt(tempWeight) || 1);
    onWeightChange(edge.id, newWeight);
    setIsEditing(false);
  };

  return (
    <svg
      className={`edge-container ${isTemp ? 'temp-edge' : ''}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible'
      }}
    >
      {/* Edge line */}
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

      {/* Weight label - only for non-temporary edges */}
      {!isTemp && (
        <g
          transform={`translate(${midX}, ${midY})`}
          onClick={(e) => {
            if (isVisualizing) return;
            e.stopPropagation(); // Prevent event from reaching graph container
            if (!isEditing) setIsEditing(true);
          }}
          style={{ cursor: 'pointer' }}
        >
          <circle
            r="10"
            fill="white"
            stroke={isEditing ? '#3498db' : '#7f8c8d'}
            strokeWidth={isEditing ? 2 : 1}
            className="weight-circle"
          />

          {isEditing ? (
            <foreignObject x="-15" y="-10" width="30" height="20">
              <div
                onClick={(e) => e.stopPropagation()}
                style={{ pointerEvents: 'auto' }}>
                <input
                  ref={inputRef}
                  type="number"
                  value={tempWeight}
                  onChange={(e) => setTempWeight(e.target.value)}
                  onBlur={handleWeightSubmit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleWeightSubmit();
                    if (e.key === 'Escape') setIsEditing(false);
                  }}
                  className="weight-input"
                  onMouseDown={(e) => e.stopPropagation()}
                  min="1"
                />
              </div>
            </foreignObject>
          ) : (
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              className="weight-text"
              fill="#2c3e50"
            >
              {edge.weight}
            </text>
          )}
        </g>
      )}
    </svg>
  );
};

export default EdgeComponent;