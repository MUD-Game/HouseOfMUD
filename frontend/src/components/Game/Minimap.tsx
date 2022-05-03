/**
 * @module Minimap
 * @category React Components
 * @description Minimap Component to display the currently visible Minimap
 * @props {@linkcode MinimapProps}
 */
import React from 'react'
import { MudRoom } from 'src/types/dungeon';

export interface MiniMapData {
    rooms: {
        [key: string]: {
            xCoordinate: MudRoom['xCoordinate'],
            yCoordinate: MudRoom['yCoordinate'],
            connections: MudRoom['connections'],
            explored: boolean
        }
    };
}


export interface MinimapProps {
}

const Minimap: React.FC<MinimapProps> = () => {
    return (
        <div className="minimap drawn-border mb-2">
            <p className='text-center pt-5'>MINIMAP</p>
        </div>
    )
}

export default Minimap;    