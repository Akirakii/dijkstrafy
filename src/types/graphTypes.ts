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
}

export interface Graph {
    nodes: Node[];
    edges: Edge[];
}

export type GraphConfig = {
    startNode: number | null;
    endNode: number | null;
  };
export type AlgorithmType = 'dijkstra' | 'astar' | 'bfs';