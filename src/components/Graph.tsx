import React, { useState } from 'react';
import NodeComponent from './Node';
import './Graph.css';
import { DragState, Edge, Graph, GraphConfig, VisualizationState, VisualizationStateSet } from '../types/graphTypes';
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
  updateNodePosition: (nodeId: string, x: number, y: number) => void;
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
  updateNodePosition
}) => {
  const [invalidPosition, setInvalidPosition] = useState<{ x: number, y: number } | null>(null);
  const [isMovingNode, setIsMovingNode] = useState(false);
const [nodeBeingMoved, setNodeBeingMoved] = useState<string | null>(null);

  const distanceToEdge = (px: number, py: number, x1: number, y1: number, x2: number, y2: number) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dpx = px - x1;
    const dpy = py - y1;
    const dot = dpx * dx + dpy * dy;
    const lenSq = dx * dx + dy * dy;
    let param = 0;

    if (lenSq !== 0) {
      param = Math.min(Math.max(dot / lenSq, 0), 1);
    }

    const xx = x1 + param * dx;
    const yy = y1 + param * dy;
    return Math.sqrt((px - xx) ** 2 + (py - yy) ** 2);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isVisualizing) return;

    if (e.button === 0 && e.altKey) {  // Button 1 is middle mouse
      e.preventDefault();
      
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
  
      const nodeToMove = graph.nodes.find(node => {
        const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2));
        return distance < 15;
      });
  
      if (nodeToMove) {
        setIsMovingNode(true);
        setNodeBeingMoved(nodeToMove.id);
        return;
      }
    }

    // Right click handling
    if (e.button === 2) {
      e.preventDefault();

      // Get click position
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Find node at click position
      const nodeToDelete = graph.nodes.find(node => {
        const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2));
        return distance < 15;
      });

      if (nodeToDelete) {
        deleteNode(nodeToDelete.id);
        return;
      }

      const edgesUnderCursor = graph.edges.filter(edge => {
        const sourceNode = graph.nodes.find(n => n.id === edge.source);
        const targetNode = graph.nodes.find(n => n.id === edge.target);
        if (!sourceNode || !targetNode) return false;

        const distance = distanceToEdge(x, y, sourceNode.x, sourceNode.y, targetNode.x, targetNode.y);
        return distance < 15; // Edge hit radius
      });

      if (edgesUnderCursor.length > 0) {
        deleteEdge(edgesUnderCursor[0].id);
      } else {
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
    setIsMovingNode(false);
    setNodeBeingMoved(null);
    completeDrag(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isVisualizing) return;

    if (isMovingNode && nodeBeingMoved) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      updateNodePosition(nodeBeingMoved, x, y);
      return;
    }

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

      const edgesToDelete = graph.edges.filter(edge => {
        const sourceNode = graph.nodes.find(n => n.id === edge.source);
        const targetNode = graph.nodes.find(n => n.id === edge.target);
        if (!sourceNode || !targetNode) return false;

        const distance = distanceToEdge(x, y, sourceNode.x, sourceNode.y, targetNode.x, targetNode.y);
        return distance < 5;
      });

      edgesToDelete.forEach(edge => deleteEdge(edge.id));
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