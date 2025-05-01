// src/components/Node.tsx
import React from 'react';
import { Node } from '../types/graphTypes';

interface NodeProps {
    node: Node;
    isDeleting: boolean;
    isStart: boolean;
    isEnd: boolean;
}

const NodeComponent: React.FC<NodeProps> = ({ node, isDeleting, isStart, isEnd }) => {
    return (
        <div
            className={`
            graph-node 
            ${isDeleting ? 'delete-mode' : ''}
            ${isStart ? 'start-node' : ''} 
            ${isEnd ? 'end-node' : ''}
          `}
            style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
            }}
        >
            <span className="node-number">{node.number}</span>
        </div>
    );
};

export default NodeComponent;