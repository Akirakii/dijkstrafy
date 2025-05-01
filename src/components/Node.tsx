import React from 'react';
import { Node, VisualizationState, VISUALIZATION_THEME } from '../types/graphTypes';

interface NodeProps {
    node: Node;
    isDeleting: boolean;
    isStart: boolean;
    isEnd: boolean;
    visualizationState: VisualizationState;
    isVisualizing: boolean;
    onMouseDown: () => void;
    onMouseUp: () => void;
}

const NodeComponent: React.FC<NodeProps> = ({
    node,
    isDeleting,
    isStart,
    isEnd,
    visualizationState,
    isVisualizing,
    onMouseDown,
    onMouseUp,
}) => {
    const getVisualizationStyle = () => {
        if (isStart) return VISUALIZATION_THEME.start.node;
        if (isEnd) return VISUALIZATION_THEME.end.node;
        return VISUALIZATION_THEME[visualizationState].node;
    };

    return (
        <div
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            className={`graph-node ${!isVisualizing && isDeleting ? 'delete-mode' : ''
                }`}
            style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                // Apply visualization colors when animating
                ...(isVisualizing ? {
                    backgroundColor: getVisualizationStyle(),
                    borderColor: getVisualizationStyle(),
                } : {}),
                // Maintain existing styles when not animating
                ...(!isVisualizing && isStart ? {
                    backgroundColor: '#2ecc71',
                    borderColor: '#27ae60'
                } : {}),
                ...(!isVisualizing && isEnd ? {
                    backgroundColor: '#e74c3c',
                    borderColor: '#c0392b'
                } : {}),
            }}
        >
            <span className="node-number">{node.number}</span>
        </div>
    );
};

export default NodeComponent;