import { useCallback, useState } from 'react';
import { DragState, Edge, Graph, GraphConfig, Node } from '../types/graphTypes';

export const useGraph = () => {
    const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [] });
    const [config, setConfig] = useState<GraphConfig>({
        startNode: null,
        endNode: null
    });

    const [dragState, setDragState] = useState<DragState>({ sourceId: null, tempTarget: null });

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

    return {
        graph, config, isDeleting, dragState, updateEdgeWeight, startDrag, updateTempTarget, completeDrag, setStartNode, setEndNode, addNode, deleteNode, setIsDeleting, isPositionOccupied, clearGraph,
    };
};