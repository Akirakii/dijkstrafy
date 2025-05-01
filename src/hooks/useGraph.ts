import { useCallback, useState } from 'react';
import { Graph, GraphConfig, Node } from '../types/graphTypes';

export const useGraph = () => {
    const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [] });
    const [config, setConfig] = useState<GraphConfig>({
        startNode: null,
        endNode: null
    });

    const getNextNodeNumber = () => {
        if (graph.nodes.length === 0) return 0;
        const maxNumber = Math.max(...graph.nodes.map(node => node.number));
        return maxNumber + 1;
    };

    const [isDeleting, setIsDeleting] = useState(false);

    const isValidNodeNumber = useCallback((num: number) => {
        console.log("graph in isValidNodeNumber", graph.nodes);
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
        graph, config, setStartNode, setEndNode, addNode, deleteNode, isDeleting, setIsDeleting, isPositionOccupied,
    };
};