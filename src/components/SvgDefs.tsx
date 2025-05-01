import React from 'react';

const SvgDefs = () => (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
            <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="18"
                refY="3.5"
                orient="auto"
            >
                <polygon points="0 0, 10 3.5, 0 7" fill="#7f8c8d" />
            </marker>
        </defs>
    </svg>
);

export default SvgDefs;