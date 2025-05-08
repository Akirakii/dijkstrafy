import React, { useState } from 'react';
import NodeComponent from './Node';
import './Graph.css';
import { DragState, Graph, GraphConfig, VisualizationState, VisualizationStateSet } from '../types/graphTypes';
import EdgeComponent from './Edge';

interface GraphProps {
  graph: Graph;
  config: GraphConfig;
  isDeleting: boolean;
  isVisualizing: boolean;
  dragState: DragState;
  visualizationStateSet: VisualizationStateSet;

  updateEdgeWeight: (edgeId: string, newWeight: number) => void;
  startDrag: (nodeId: string) => void;
  updateTempTarget: (x: number, y: number) => void;
  completeDrag: (targetId: string | null) => void;
  deleteEdge: (edgeId: string) => void;

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
  dragState,
  visualizationStateSet,

  updateEdgeWeight,
  startDrag,
  updateTempTarget,
  completeDrag,
  deleteEdge,

  addNode,
  deleteNode,
  setIsDeleting,
  isPositionOccupied,
}) => {
  const [invalidPosition, setInvalidPosition] = useState<{ x: number, y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isVisualizing) return;
    
    // Right click handling
    if (e.button === 2) {
      e.preventDefault();
      
      // Get click position
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
  
      // Find node at click position
      const nodeToDelete = graph.nodes.find(node => {
        const distance = Math.sqrt(
          Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)
        );
        return distance < 15; // Match node radius
      });
  
      if (nodeToDelete) {
        // Delete immediately if clicking on node
        deleteNode(nodeToDelete.id);
      } else {
        // Enter drag-to-delete mode for empty areas
        setIsDeleting(true);
      }
      return;
    }
  
    // Left click handling (existing code)
    if (e.button === 0) {
      const target = e.target as HTMLElement;
      if (!target?.classList?.contains('graph-container')) return;
      
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
  
      if (isPositionOccupied(x, y)) {
        setInvalidPosition({ x, y });
        setTimeout(() => setInvalidPosition(null), 1000);
        return;
      }
  
      addNode(x, y);
    }
  };

  const handleMouseUp = () => {
    setIsDeleting(false);
    completeDrag(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isVisualizing) return;
    if (isDeleting) {
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
    }

    if (dragState.sourceId) {
      const rect = e.currentTarget.getBoundingClientRect();
      updateTempTarget(
        e.clientX - rect.left,
        e.clientY - rect.top
      );
    }
  };

  const getNodeVisualizationState = (nodeId: string): VisualizationState => {
    // Priority: Path > Visited > Default
    if (visualizationStateSet.path.has(nodeId)) return 'path';
    if (visualizationStateSet.visited.has(nodeId)) return 'visited';
    return 'unvisited';
  };

  const getEdgeVisualizationState = (edgeId: string): VisualizationState => {
    // Priority: Path > Visited > Default
    if (visualizationStateSet.pathEdges.has(edgeId)) return 'path';
    if (visualizationStateSet.visitedEdges.has(edgeId)) return 'visited';
    return 'unvisited';
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
      {/* Render permanent edges */}
      {graph.edges.map(edge => (
        <EdgeComponent
          key={edge.id}
          edge={edge}
          nodes={graph.nodes}
          isVisualizing={isVisualizing}
          visualizationState={getEdgeVisualizationState(edge.id)}
          onWeightChange={updateEdgeWeight} />
      ))}

      {/* Render temporary drag line */}
      {dragState.sourceId && dragState.tempTarget && (
        <EdgeComponent
          edge={{
            id: 'temp',
            source: dragState.sourceId,
            target: 'temp',
            weight: 0
          }}
          nodes={[
            ...graph.nodes,
            { id: 'temp', x: dragState.tempTarget.x, y: dragState.tempTarget.y, number: -1 }
          ]}
          visualizationState={'end'}
          isTemp
        />
      )}

      {/* Render nodes */}
      {graph.nodes.map(node => (
        <NodeComponent
          key={node.id}
          node={node}
          onMouseDown={() => { if (!isVisualizing) startDrag(node.id) }}
          onMouseUp={() => { if (!isVisualizing) completeDrag(node.id) }}
          isDeleting={isDeleting}
          isStart={node.number === config.startNode}
          isEnd={node.number === config.endNode}
          visualizationState={getNodeVisualizationState(node.id)} // Your state logic
          isVisualizing={isVisualizing}
        />
      ))}
    </div>
  );
};

export default GraphComponent;