/**
 * @module HUD
 * @category React Components
 * @description HUD Component to display the Chat, HUD and Minimap
 * @children {@linkcode ResourceBar}
 * @props {@linkcode HUDProps}
 * ```jsx
 * <ResourceBar variant='health'/>
 * <ResourceBar variant='mana'/>
 * <ResourceBar variant='damage'/> 
 * ```
 */
import React from 'react'
import ResourceBar from './ResourceBar';

export interface HUDProps {
    currentStats: {hp:number, mana:number, dmg:number};
    maxStats: {hp:number, mana:number, dmg:number};
}

const HUD: React.FC<HUDProps> = ({currentStats, maxStats }) => {
    return (
        <div>
            <ResourceBar variant='health' now={currentStats.hp} max={maxStats.hp} label='HP' />
            <ResourceBar variant='mana' now={currentStats.mana} max={maxStats.mana} label='Mana' />
            <ResourceBar variant='damage' now={currentStats.dmg} max={maxStats.dmg} label='Damage' />
        </div>
    )
}

export default HUD;    