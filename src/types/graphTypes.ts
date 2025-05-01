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
    startNode?: number; // Number of start node
    endNode?: number;   // Number of end node
}
export type AlgorithmType = 'dijkstra' | 'astar' | 'bfs';