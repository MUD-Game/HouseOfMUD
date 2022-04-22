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
import Inventory from './Inventory';
import Minimap from './Minimap';
import { useEffect } from 'react';
import { useGame } from 'src/hooks/useGame';
import { Navigate } from 'react-router-dom';
import { useRabbitMQ } from 'src/hooks/useRabbitMQ';
import { IMessage } from '@stomp/stompjs';
export interface GameProps { }

const Game: React.FC<GameProps> = ({ }) => {
    
    const rabbit = useRabbitMQ();
    const {isAbleToJoinGame} = useGame();
    useEffect(() => {
        if(isAbleToJoinGame()){
            rabbit.setErrorSubscriber(console.error);
            rabbit.login(() => {
                console.log('Login succesful');
            }, (error: string) => {
                console.log(error);
            });
        }
        return () => {
            rabbit.logout(() => { }, (error) => {
                console.log(error);
            });
        }
    }, [])
    
    if (!isAbleToJoinGame()){
        return <Navigate to="/" />
    }
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
            <Inventory items={null} />
            <HUD {...hudMock} />
            <Chat />
        </div>
    )
}

export default Game;    