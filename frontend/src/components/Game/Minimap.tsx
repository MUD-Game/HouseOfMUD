/**
 * @module Minimap
 * @category React Components
 * @description Minimap Component to display the currently visible Minimap
 * @props {@linkcode MinimapProps}
 */

import React from 'react'
export interface MinimapProps {
    mapData: any;
}

const Minimap: React.FC<MinimapProps> = ({ mapData }) => {
    return (
        <div>
            <p>MINIMAP</p>
        </div>
    )
}

export default Minimap;    