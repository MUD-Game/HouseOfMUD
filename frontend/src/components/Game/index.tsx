/**
 * @module Game
 * @category React Components
 * @description Game Component to display the Chat, HUD, Inventory and Minimap
 * @children {@linkcode Minimap}, {@linkcode HUD}, {@linkcode Inventory} {@linkcode Chat}
 * @props {@linkcode GameProps}
 * ```jsx
 * <Minimap />
 * ```
 */

import React from 'react'
import Chat from './Chat';
import HUD, { HUDProps } from './HUD';
import Minimap from './Minimap';
export interface GameProps { }

const Game: React.FC<GameProps> = ({ }) => {

    const hudMock: HUDProps = {
        health: 100,
        maxHealth: 100,
        mana: 100,
        maxMana: 100,
        damage: 100,
        maxDamage: 100
    }

    return (
        <div>
            <Minimap mapData={null} />
            <HUD {...hudMock} />
            <Chat />
        </div>
    )
}

export default Game;    