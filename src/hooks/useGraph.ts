import { useCallback, useRef, useState } from 'react';
import { DragState, Edge, Graph, GraphConfig, Node, VisualizationStateSet } from '../types/graphTypes';

export const useGraph = () => {
    const [isVisualizing, setIsVisualizing] = useState(false);
    const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [] });
    const [dragState, setDragState] = useState<DragState>({ sourceId: null, tempTarget: null });
    const [config, setConfig] = useState<GraphConfig>({
        startNode: null,
        endNode: null
    });
    const [visualizationStateSet, setVisualizationState] = useState<VisualizationStateSet>({
        visited: new Set(),
        visitedEdges: new Set(),
        path: new Set(),
        pathEdges: new Set()
    });
    const visualizationActive = useRef(false);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const stopVisualization = () => {
        visualizationActive.current = false;
        setIsVisualizing(false);
        setVisualizationState({
            visited: new Set(),
            visitedEdges: new Set(),
            path: new Set(),
            pathEdges: new Set()
        });
    };

    const updateNodePosition = (nodeId: string, x: number, y: number) => {
        setGraph(prev => ({
          ...prev,
          nodes: prev.nodes.map(node => 
            node.id === nodeId ? { ...node, x, y } : node
          )
        }));
      };

    const visualizeDijkstra = async () => {
        // 1. Initialize tracking
        visualizationActive.current = true;
        setIsVisualizing(true);
        console.log('Visualization started (ref):', visualizationActive.current);

        // 2. Validate inputs
        if (config.startNode == null || config.endNode == null) {
            stopVisualization();
            return;
        }

        // 3. Reset visualization
        setVisualizationState({
            visited: new Set(),
            visitedEdges: new Set(),
            path: new Set(),
            pathEdges: new Set()
        });

        try {
            // 4. Algorithm setup
            const { nodes, edges } = graph;
            const distances = new Map<string, number>();
            const previous = new Map<string, string>();
            const unvisited = new Set(nodes.map(n => n.id));

            // Initialize distances
            nodes.forEach(node => {
                distances.set(node.id, node.number === config.startNode ? 0 : Infinity);
            });

            // 5. Main algorithm loop
            while (unvisited.size > 0 && visualizationActive.current) {
                const currentId = Array.from(unvisited).reduce((a, b) =>
                    distances.get(a)! < distances.get(b)! ? a : b
                );

                // Update visited nodes
                setVisualizationState(prev => ({
                    ...prev,
                    visited: new Set(prev.visited).add(currentId)
                }));

                await sleep(300);
                if (!visualizationActive.current) break;

                // Check if reached end node
                if (currentId === nodes.find(n => n.number === config.endNode)?.id) break;

                // Process neighbors
                edges
                    .filter(edge => edge.source === currentId)
                    .forEach(edge => {
                        const neighborId = edge.target;
                        const alt = distances.get(currentId)! + edge.weight;

                        if (alt < distances.get(neighborId)!) {
                            distances.set(neighborId, alt);
                            previous.set(neighborId, currentId);

                            setVisualizationState(prev => ({
                                ...prev,
                                visitedEdges: new Set(prev.visitedEdges).add(edge.id)
                            }));
                        }
                    });

                unvisited.delete(currentId);
            }

            // 6. Path reconstruction (if not cancelled)
            if (visualizationActive.current) {
                let currentId = nodes.find(n => n.number === config.endNode)?.id;
                while (currentId && previous.has(currentId)) {
                    const prevId = previous.get(currentId)!;
                    const edge = edges.find(e => e.source === prevId && e.target === currentId);

                    if (edge) {
                        setVisualizationState(prev => ({
                            ...prev,
                            path: new Set(prev.path).add(currentId!),
                            pathEdges: new Set(prev.pathEdges).add(edge.id)
                        }));
                        await sleep(100);
                        if (!visualizationActive.current) break;
                    }
                    currentId = prevId;
                }
            }
        } catch (error) {
            console.error("Visualization error:", error);
            stopVisualization();
        } finally {
        }
    };

    const visualizeBellmanFord = async () => {
        visualizationActive.current = true;
        setIsVisualizing(true);
        console.log('Visualization started (ref):', visualizationActive.current);

        if (config.startNode == null || config.endNode == null) {
            stopVisualization();
            return;
        }

        setVisualizationState({
            visited: new Set(),
            visitedEdges: new Set(),
            path: new Set(),
            pathEdges: new Set()
        });

        try {
            const { nodes, edges } = graph;
            const distances = new Map<string, number>();
            const previous = new Map<string, string>();

            nodes.forEach(node => {
                distances.set(node.id, node.number === config.startNode ? 0 : Infinity);
            });

            const V = nodes.length;

            for (let i = 0; i < V - 1; i++) {
                if (!visualizationActive.current) break;

                for (const edge of edges) {
                    const { source, target, weight, id } = edge;
                    const alt = distances.get(source)! + weight;

                    if (alt < distances.get(target)!) {
                        distances.set(target, alt);
                        previous.set(target, source);

                        setVisualizationState(prev => ({
                            ...prev,
                            visitedEdges: new Set(prev.visitedEdges).add(id)
                        }));

                        await sleep(300);
                        if (!visualizationActive.current) break;
                    }
                }
            }

            // Optional: Detect negative weight cycle
            for (const edge of edges) {
                const { source, target, weight } = edge;
                if (distances.get(source)! + weight < distances.get(target)!) {
                    console.warn("Negative weight cycle detected");
                    throw new Error("Negative weight cycle detected");
                }
            }

            // Reconstruct path
            if (visualizationActive.current) {
                let currentId = nodes.find(n => n.number === config.endNode)?.id;
                while (currentId && previous.has(currentId)) {
                    const prevId = previous.get(currentId)!;
                    const edge = edges.find(e => e.source === prevId && e.target === currentId);

                    if (edge) {
                        setVisualizationState(prev => ({
                            ...prev,
                            path: new Set(prev.path).add(currentId!),
                            pathEdges: new Set(prev.pathEdges).add(edge.id)
                        }));
                        await sleep(100);
                        if (!visualizationActive.current) break;
                    }
                    currentId = prevId;
                }
            }

        } catch (error) {
            console.error("Visualization error:", error);
            stopVisualization();
        }
    }

    const visualizeSPFA = async () => {
        visualizationActive.current = true;
        setIsVisualizing(true);
        console.log('Visualization started (ref):', visualizationActive.current);

        if (config.startNode == null || config.endNode == null) {
            stopVisualization();
            return;
        }

        setVisualizationState({
            visited: new Set(),
            visitedEdges: new Set(),
            path: new Set(),
            pathEdges: new Set()
        });

        try {
            const { nodes, edges } = graph;
            const distances = new Map<string, number>();
            const previous = new Map<string, string>();
            const inQueue = new Set<string>();
            const queue: string[] = [];

            // Initialize distances
            nodes.forEach(node => {
                const isStart = node.number === config.startNode;
                distances.set(node.id, isStart ? 0 : Infinity);
                if (isStart) {
                    queue.push(node.id);
                    inQueue.add(node.id);
                }
            });

            while (queue.length > 0 && visualizationActive.current) {
                const currentId = queue.shift()!;
                inQueue.delete(currentId);

                setVisualizationState(prev => ({
                    ...prev,
                    visited: new Set(prev.visited).add(currentId)
                }));

                await sleep(200);
                if (!visualizationActive.current) break;

                for (const edge of edges.filter(e => e.source === currentId)) {
                    const { target, weight, id } = edge;
                    const alt = distances.get(currentId)! + weight;

                    if (alt < distances.get(target)!) {
                        distances.set(target, alt);
                        previous.set(target, currentId);

                        setVisualizationState(prev => ({
                            ...prev,
                            visitedEdges: new Set(prev.visitedEdges).add(id)
                        }));

                        if (!inQueue.has(target)) {
                            queue.push(target);
                            inQueue.add(target);
                        }

                        await sleep(100);
                        if (!visualizationActive.current) break;
                    }
                }
            }

            // Reconstruct path
            if (visualizationActive.current) {
                let currentId = nodes.find(n => n.number === config.endNode)?.id;
                while (currentId && previous.has(currentId)) {
                    const prevId = previous.get(currentId)!;
                    const edge = edges.find(e => e.source === prevId && e.target === currentId);

                    if (edge) {
                        setVisualizationState(prev => ({
                            ...prev,
                            path: new Set(prev.path).add(currentId!),
                            pathEdges: new Set(prev.pathEdges).add(edge.id)
                        }));
                        await sleep(100);
                        if (!visualizationActive.current) break;
                    }
                    currentId = prevId;
                }
            }

        } catch (error) {
            console.error("Visualization error:", error);
            stopVisualization();
        }
    };

    const updateEdgeWeight = (edgeId: string, newWeight: number) => {
        setGraph(prev => ({
            ...prev,
            edges: prev.edges.map(edge =>
                edge.id === edgeId ? { ...edge, weight: newWeight } : edge
            )
        }));
    };

    const startDrag = (nodeId: string) => {
        setDragState({ sourceId: nodeId, tempTarget: null });
    };

    const updateTempTarget = (x: number, y: number) => {
        if (!dragState.sourceId) return;
        setDragState(prev => ({ ...prev, tempTarget: { x, y } }));
    };

    const completeDrag = (targetId: string | null) => {
        if (!dragState.sourceId || !targetId) {
            setDragState({ sourceId: null, tempTarget: null });
            return;
        }

        // Prevent self-linking
        if (dragState.sourceId === targetId) {
            setDragState({ sourceId: null, tempTarget: null });
            return;
        }

        // Check if edge already exists
        const edgeExists = graph.edges.some(
            edge =>
                (edge.source === dragState.sourceId && edge.target === targetId) ||
                (edge.source === targetId && edge.target === dragState.sourceId)
        );

        if (!edgeExists) {
            const newEdge: Edge = {
                id: `edge-${Date.now()}`,
                source: dragState.sourceId,
                target: targetId,
                weight: 1 // Default weight
            };

            setGraph(prev => ({
                ...prev,
                edges: [...prev.edges, newEdge]
            }));
        }

        setDragState({ sourceId: null, tempTarget: null });
    };

    const clearGraph = () => {
        setGraph(prev => ({
            ...prev,
            nodes: []
        }));
    }

    const getNextNodeNumber = () => {
        if (graph.nodes.length === 0) return 0;
        const maxNumber = Math.max(...graph.nodes.map(node => node.number));
        return maxNumber + 1;
    };

    const [isDeleting, setIsDeleting] = useState(false);

    const isValidNodeNumber = useCallback((num: number) => {
        return graph.nodes.some(node => node.number === num);
    }, [graph]);

    const setStartNode = useCallback((num: number | null) => {
        if (num === null || isValidNodeNumber(num)) {
            setConfig(prev => ({ ...prev, startNode: num }));
        }
    }, [isValidNodeNumber]);

    const setEndNode = useCallback((num: number | null) => {
        if (num === null || isValidNodeNumber(num)) {
            setConfig(prev => ({ ...prev, endNode: num }));
        }
    }, [isValidNodeNumber]);


    const isPositionOccupied = (x: number, y: number): boolean => {
        const NODE_RADIUS = 15; // Should match your CSS node size
        return graph.nodes.some(node => {
            const distance = Math.sqrt(
                Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)
            );
            return distance < NODE_RADIUS * 2; // Minimum spacing (2 node widths)
        });
    };

    const addNode = (x: number, y: number) => {
        if (isPositionOccupied(x, y)) return;

        const newNode: Node = {
            id: `node-${Date.now()}`,
            x,
            y,
            number: getNextNodeNumber() // Assign the next number
        };

        setGraph(prev => ({
            ...prev,
            nodes: [...prev.nodes, newNode]
        }));
    };

    const deleteNode = (nodeId: string) => {
        setGraph(prev => {
            const deletedNode = prev.nodes.find(n => n.id === nodeId);
            const newNodes = prev.nodes.filter(n => n.id !== nodeId);

            if (deletedNode) {
                if (deletedNode.number === config.startNode) setStartNode(null);
                if (deletedNode.number === config.endNode) setEndNode(null);
            }

            return {
                nodes: newNodes,
                edges: prev.edges.filter(e =>
                    e.source !== nodeId && e.target !== nodeId
                )
            };
        });
    };

    const deleteEdge = (edgeId: string) => {
        setGraph(prev => ({
            nodes: prev.nodes, 
            edges: prev.edges.filter(e => e.id !== edgeId)
        }));
    };

    return {
        graph, 
        config, 
        isDeleting, 
        dragState, 
        visualizationStateSet, 
        isVisualizing,

        stopVisualization, 
        visualizeDijkstra, 
        visualizeBellmanFord, 
        visualizeSPFA,

        updateEdgeWeight, 
        startDrag, 
        updateTempTarget, 
        completeDrag, 
        deleteEdge,

        setStartNode,
        setEndNode, 
        addNode, 
        deleteNode, 
        setIsDeleting, 
        isPositionOccupied, 
        updateNodePosition,
        clearGraph,
    };
};