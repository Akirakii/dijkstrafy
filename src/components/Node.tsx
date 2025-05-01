// src/components/Node.tsx
import React from 'react';
import { Node } from '../types/graphTypes';

interface NodeProps {
    node: Node;
    isDeleting: boolean;
}

const NodeComponent: React.FC<NodeProps> = ({ node, isDeleting }) => {
    return (
        <div
            className={`graph-node ${isDeleting ? 'delete-mode' : ''}`}
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