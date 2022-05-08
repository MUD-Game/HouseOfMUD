/**
 * @module OnlinePlayers
 * @category React Components
 * @description OnlinePlayers Component to show the players online
 * @children
 * @props {@linkcode OnlinePlayersProps}
 */

import React from 'react'
export interface OnlinePlayersProps {
    players: string[]; //TODO: define item data
}

const OnlinePlayers: React.FC<OnlinePlayersProps> = ({ players }) => {
    return (
        <div className="onlineplayers drawn-border mb-2">
            <p className='text-center'>Players online</p>
            <ul className='ps-4'>
                    {players.filter(player => player !== 'dungeonmaster').map((player) =>
                        <li key={player}>{ player }</li>
                    )}
                </ul>
        </div>
    )
}

export default OnlinePlayers;    