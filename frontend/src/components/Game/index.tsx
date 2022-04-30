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
import { Navigate, useNavigate } from 'react-router-dom';
import { useRabbitMQ } from 'src/hooks/useRabbitMQ';
import { useMudConsole } from 'src/hooks/useMudConsole';
import { Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
export interface GameProps { }

const Game: React.FC<GameProps> = ({ }) => {
    const {t} = useTranslation();
    let homsole = useMudConsole();
    let navigate = useNavigate();

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
    const hudMock: HUDProps = {
        health: 50,
        maxHealth: 100,
        mana: 100,
        maxMana: 100,
        damage: 10,
        maxDamage: 100
    }




    return (
        <Container fluid className="game-wrapper">
            <Row className="game-header align-items-center">
                <div className="col text-end">
                    <button className="btn drawn-border btn-xpadding btn-red" onClick={() => navigate("/")}>{t("game.leave")}</button>
                </div>
            </Row>
            <Row className="game-body">
                <div className="col col-4 col-md-3 col-lg-2">
                    <Minimap mapData={null} />
                    <Inventory items={null} />
                    <HUD {...hudMock} />
                </div>
                <div className="col col-8 col-md-9 col-lg-10">
                    <Chat />
                </div>
            </Row>
        </Container>
    )
}

export default Game;    