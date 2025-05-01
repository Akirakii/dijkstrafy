export interface Node {
  id: string;
  x: number;
  y: number;
  number: number;
}

export interface Edge {
  id: string;
  source: string; // Node ID
  target: string; // Node ID
  weight: number;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

export interface DragState {
  sourceId: string | null;
  tempTarget: { x: number; y: number } | null;
}

export type GraphConfig = {
  startNode: number | null;
  endNode: number | null;
};

export type AlgorithmType = 'dijkstra' | 'bellman ford' | 'spfa' ;

export type VisualizationState =
  | 'unvisited'
  | 'visited'
  | 'path'
  | 'start'
  | 'end';

export type VisualizationStateSet = {
  visited: Set<string>;       // Node IDs
  visitedEdges: Set<string>;  // Edge IDs
  path: Set<string>;
  pathEdges: Set<string>;
}

export interface VisualizationColors {
  node: string;
  edge: string;
}

export const VISUALIZATION_THEME: Record<VisualizationState, VisualizationColors> = {
  unvisited: { node: '#3498db', edge: '#7f8c8d' },
  visited: { node: '#f1c40f', edge: '#f39c12' },       // Yellow shades
  path: { node: '#2ecc71', edge: '#27ae60' },          // Green shades
  start: { node: '#2ecc71', edge: '#27ae60' },         // Green (same as path)
  end: { node: '#e74c3c', edge: '#c0392b' }            // Red shades
};