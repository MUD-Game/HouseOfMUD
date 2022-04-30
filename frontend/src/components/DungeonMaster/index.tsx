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
import Minimap from './Minimap';
import { useEffect } from 'react';
import { useGame } from 'src/hooks/useGame';
import { Navigate } from 'react-router-dom';
import { useRabbitMQ } from 'src/hooks/useRabbitMQ';
import { useMudConsole } from 'src/hooks/useMudConsole';
import { Container, Row } from 'react-bootstrap';
import Chat from './Chat';
import OnlinePlayers from './OnlinePlayers';
import ChatQueue from './ChatQueue';
import PlayerInfo from './PlayerInfo';
import { useTranslation } from 'react-i18next';
export interface GameProps { }

const Game: React.FC<GameProps> = ({ }) => {
    const {t} = useTranslation();
    let homsole = useMudConsole();

    const rabbit = useRabbitMQ();
    const { isAbleToJoinGame } = useGame();
    useEffect(() => {
        if (isAbleToJoinGame()) {
            rabbit.setErrorSubscriber(console.error);
            rabbit.login(() => {
                homsole.log("Successful login");
            }, (error) => {
                homsole.error(error, "RabbitMQ");
            });
        }
        return () => {
            rabbit.logout(() => { }, (error) => {
                homsole.error(error, "RabbitMQ");
            });
        }
    }, [])

    if (!isAbleToJoinGame()) {
        return <Navigate to="/" />
    }




    return (
        <Container fluid className="game-wrapper">
            <Row className="game-header align-items-center">
                <div className="col text-end">
                    <button className="btn drawn-border btn-xpadding btn-red">{t("game.leave")}</button>
                </div>
            </Row>
            <Row className="game-body">
                <div className="col col-md-3 col-lg-2">
                    <Minimap mapData={null} />
                    <OnlinePlayers players={null} />
                </div>
                <div className="col col-md-6 col-lg-8">
                    <Chat />
                </div>
                <div className="col col-md-3 col-lg-2">
                    <ChatQueue commands={null} />
                    <PlayerInfo player={null} />
                </div>
            </Row>
        </Container>
    )
}

export default Game;    