/**
 * @module DungeonMaster-Minimap
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
        <div className="minimap drawn-border mb-2">
            <p className='text-center pt-5'>MINIMAP</p>
        </div>
    )
}

export default Minimap;    