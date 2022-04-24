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
    health: number;
    maxHealth: number;
    mana: number;
    maxMana: number;
    damage: number;
    maxDamage: number;
}

const HUD: React.FC<HUDProps> = ({ health, maxHealth, mana, maxMana, damage, maxDamage }) => {
    return (
        <div>
            <ResourceBar variant='health' now={health} max={maxHealth} label='HP' />
            <ResourceBar variant='mana' now={mana} max={maxMana} label='Mana' />
            <ResourceBar variant='damage' now={damage} max={maxDamage} label='Damage' />
        </div>
    )
}

export default HUD;    