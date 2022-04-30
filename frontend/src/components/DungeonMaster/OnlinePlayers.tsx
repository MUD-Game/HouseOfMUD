/**
 * @module OnlinePlayers
 * @category React Components
 * @description OnlinePlayers Component to show the players online
 * @children
 * @props {@linkcode OnlinePlayersProps}
 */

import React from 'react'
export interface OnlinePlayersProps {
    players: any; //TODO: define item data
}

const OnlinePlayers: React.FC<OnlinePlayersProps> = ({ players }) => {
    return (
        <div className="onlineplayers drawn-border mb-2">
            <p className='text-center pt-5'>Players online</p>
        </div>
    )
}

export default OnlinePlayers;    