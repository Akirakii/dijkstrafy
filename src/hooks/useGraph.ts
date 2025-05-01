import { useState } from 'react';
import { Graph, Node } from '../types/graphTypes';

export const useGraph = () => {
    const [graph, setGraph] = useState<Graph>({
        nodes: [],
        edges: []
    });

    const getNextNodeNumber = () => {
        if (graph.nodes.length === 0) return 0;
        const maxNumber = Math.max(...graph.nodes.map(node => node.number));
        return maxNumber + 1;
    };

    const [isDeleting, setIsDeleting] = useState(false);

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
        setGraph(prev => ({
            nodes: prev.nodes.filter(node => node.id !== nodeId),
            edges: prev.edges.filter(edge =>
                edge.source !== nodeId && edge.target !== nodeId
            ),
        }));
    };

    return {
        graph, addNode, deleteNode, isDeleting, setIsDeleting, isPositionOccupied, setStartNode: (num: number) => {
            setGraph(prev => ({ ...prev, startNode: num }));
        },
        setEndNode: (num: number) => {
            setGraph(prev => ({ ...prev, endNode: num }));
        },
    };
};