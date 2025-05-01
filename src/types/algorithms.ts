import { Edge, Node } from "./graphTypes";

export enum AlgorithmType {
    DIJKSTRA = "DIJKSTRA",
    BFS = "BFS",
    DFS = "DFS",
    ASTAR = "ASTAR"
}

export type Heuristic = (current: Node, end: Node) => number;

export const reconstructPath = (
    previous: Map<string, string>,
    edges: Edge[],
    startId: string,
    endId: string
) => {
    const pathNodes = new Set<string>();
    const pathEdges = new Set<string>();
    let currentId = endId;

    while (currentId !== startId) {
        pathNodes.add(currentId);
        const prevId = previous.get(currentId);
        if (!prevId) break;

        const edge = edges.find(e => e.source === prevId && e.target === currentId);
        if (edge) pathEdges.add(edge.id);

        currentId = prevId;
    }

    pathNodes.add(startId);
    return { pathNodes, pathEdges };
};

// BFS Implementation
export const bfs = (
    nodes: Node[],
    edges: Edge[],
    startId: string,
    endId: string
) => {
    const visitedNodes = new Set<string>();
    const visitedEdges = new Set<string>();
    const queue: [string, string | null][] = [[startId, null]];
    const previous = new Map<string, string>();

    while (queue.length > 0) {
        const [currentId, parentId] = queue.shift()!;

        if (visitedNodes.has(currentId)) continue;
        visitedNodes.add(currentId);

        // Track edge from parent
        if (parentId) {
            const edge = edges.find(e => e.source === parentId && e.target === currentId);
            if (edge) visitedEdges.add(edge.id);
        }

        if (currentId === endId) break;

        edges
            .filter(edge => edge.source === currentId)
            .forEach(edge => {
                if (!visitedNodes.has(edge.target)) {
                    previous.set(edge.target, currentId);
                    queue.push([edge.target, currentId]);
                }
            });
    }

    return { visitedNodes, visitedEdges, ...reconstructPath(previous, edges, startId, endId) };
};

// DFS Implementation
export const dfs = (
    nodes: Node[],
    edges: Edge[],
    startId: string,
    endId: string
) => {
    const visitedNodes = new Set<string>();
    const visitedEdges = new Set<string>();
    const stack: [string, string | null][] = [[startId, null]];
    const previous = new Map<string, string>();

    while (stack.length > 0) {
        const [currentId, parentId] = stack.pop()!;

        if (visitedNodes.has(currentId)) continue;
        visitedNodes.add(currentId);

        if (parentId) {
            const edge = edges.find(e => e.source === parentId && e.target === currentId);
            if (edge) visitedEdges.add(edge.id);
        }

        if (currentId === endId) break;

        edges
            .filter(edge => edge.source === currentId)
            .reverse() // To maintain order
            .forEach(edge => {
                if (!visitedNodes.has(edge.target)) {
                    previous.set(edge.target, currentId);
                    stack.push([edge.target, currentId]);
                }
            });
    }

    return { visitedNodes, visitedEdges, ...reconstructPath(previous, edges, startId, endId) };
};

// A* Implementation
export const astar = (
    nodes: Node[],
    edges: Edge[],
    startId: string,
    endId: string,
    heuristic: Heuristic
) => {
    const visitedNodes = new Set<string>();
    const visitedEdges = new Set<string>();
    const openSet = new PriorityQueue<string>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();
    const previous = new Map<string, string>();

    nodes.forEach(node => {
        gScore.set(node.id, Infinity);
        fScore.set(node.id, Infinity);
    });

    gScore.set(startId, 0);
    fScore.set(startId, heuristic(nodes.find(n => n.id === startId)!, nodes.find(n => n.id === endId)!));
    openSet.enqueue(startId, fScore.get(startId)!);

    while (!openSet.isEmpty()) {
        const currentId = openSet.dequeue()!;
        visitedNodes.add(currentId);

        if (currentId === endId) break;

        edges
            .filter(edge => edge.source === currentId)
            .forEach(edge => {
                const tentativeGScore = gScore.get(currentId)! + edge.weight;

                if (tentativeGScore < gScore.get(edge.target)!) {
                    previous.set(edge.target, currentId);
                    gScore.set(edge.target, tentativeGScore);
                    fScore.set(edge.target, tentativeGScore + heuristic(
                        nodes.find(n => n.id === edge.target)!,
                        nodes.find(n => n.id === endId)!
                    ));

                    visitedEdges.add(edge.id);

                    if (!openSet.contains(edge.target)) {
                        openSet.enqueue(edge.target, fScore.get(edge.target)!);
                    }
                }
            });
    }

    return { visitedNodes, visitedEdges, ...reconstructPath(previous, edges, startId, endId) };
};

// Priority Queue Implementation
class PriorityQueue<T> {
    private elements: [T, number][] = [];

    enqueue(item: T, priority: number): void {
        this.elements.push([item, priority]);
        this.elements.sort((a, b) => a[1] - b[1]);
    }

    dequeue(): T | undefined {
        return this.elements.shift()?.[0];
    }

    isEmpty(): boolean {
        return this.elements.length === 0;
    }

    contains(item: T): boolean {
        return this.elements.some(([element]) => element === item);
    }
}

export const dijkstra = (
    nodes: Node[],
    edges: Edge[],
    startId: string,
    endId: string
  ) => {
    const visitedNodes = new Set<string>();
    const visitedEdges = new Set<string>();
    const distances = new Map<string, number>();
    const previous = new Map<string, string>();
    const priorityQueue = new PriorityQueue<string>();
  
    // Initialize distances
    nodes.forEach(node => {
      distances.set(node.id, Infinity);
    });
    distances.set(startId, 0);
    priorityQueue.enqueue(startId, 0);
  
    while (!priorityQueue.isEmpty()) {
      const currentId = priorityQueue.dequeue()!;
      
      if (visitedNodes.has(currentId)) continue;
      visitedNodes.add(currentId);
  
      if (currentId === endId) break;
  
      edges
        .filter(edge => edge.source === currentId)
        .forEach(edge => {
          const neighborId = edge.target;
          const alt = distances.get(currentId)! + edge.weight;
  
          if (alt < distances.get(neighborId)!) {
            distances.set(neighborId, alt);
            previous.set(neighborId, currentId);
            priorityQueue.enqueue(neighborId, alt);
            
            // Track visited edge
            visitedEdges.add(edge.id);
          }
        });
    }
  
    return { 
      visitedNodes, 
      visitedEdges,
      ...reconstructPath(previous, edges, startId, endId)
    };
  };