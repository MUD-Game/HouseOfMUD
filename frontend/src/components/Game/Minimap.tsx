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
            <span>MINIMAP</span>
            <div className="mock-placeholder minimap drawn-border mb-3">
                <p className='text-center p-5'>MINIMAP</p>
            </div>
        </div>
    )
}

export default Minimap;    