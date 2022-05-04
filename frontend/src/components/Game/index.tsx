/**
 * @module Game
 * @category React Components
 * @description Game Component to display the Chat, HUD, Inventory and Minimap
 * @children {@linkcode Minimap}, {@linkcode HUD}, {@linkcode Inventory} {@linkcode Chat}
 * @props {@linkcode GameProps}
 * ```jsx
 * <Minimap />
 * <HUD />
 * <Inventory />
 * <Chat />
 * ```
 */

import React from 'react'
import Chat from './Chat';
import HUD, { HUDProps } from './HUD';
import Inventory, { InventoryProps } from './Inventory';
import Minimap, { MinimapProps } from './Minimap';
import { useEffect } from 'react';
import { useGame } from 'src/hooks/useGame';
import { Navigate, useNavigate } from 'react-router-dom';
import { useRabbitMQ } from 'src/hooks/useRabbitMQ';
import { Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Alert from '../Custom/Alert';
export interface GameProps { }

const Game: React.FC<GameProps> = ({ }) => {

    const {t} = useTranslation();
    const navigate = useNavigate();
    const rabbit = useRabbitMQ();
    const { isAbleToJoinGame } = useGame();

    const [error, setError] = React.useState<string>("");
    const [miniMapData, setMiniMapData] = React.useState<MinimapProps | null>(null);
    const [inventoryData, setInventoryData] = React.useState<InventoryProps["inventoryData"]>([]);
    const [hudData, setHudData] = React.useState<HUDProps | null>(null);

    const onUnload = (e: any) => {
        e.preventDefault();
        rabbit.logout(() => { }, (error) => {
            setError("rabbitmq.logout")
        });
    }

    const miniMapSubscriber = (roomData: MinimapProps) => {
        setMiniMapData(roomData);
    }

    useEffect(() => {
        window.addEventListener('unload', onUnload);
        if (isAbleToJoinGame()) {
            rabbit.setErrorSubscriber(console.error);
            rabbit.setMiniMapSubscriber(miniMapSubscriber);
            rabbit.setInventorySubscriber(setInventoryData);
            rabbit.login(() => {
                
            }, (error) => {
                setError("rabbitmq.login")
            });
        }
        return () => {
            window.removeEventListener('unload', onUnload);
            rabbit.logout(() => { }, (error) => {
                setError("rabbitmq.logout")
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
                    <button className="btn drawn-border btn-xpadding btn-red" onClick={() => navigate("/")}>{t("game.leave")}</button>
                </div>
            </Row>
            <Row className="game-body">
                <div className="col col-4 col-md-3 col-lg-2">
                    {miniMapData ? <Minimap {...miniMapData} /> : null}
                    <Inventory inventoryData={inventoryData} />
                    {hudData && <HUD {...hudData} />}
                    <Alert type="error" message={error} setMessage={setError} />
                </div>
                <div className="col col-8 col-md-9 col-lg-10">
                    <Chat messageCallback={setError}/>
                </div>
            </Row>
        </Container>
    )
}

export default Game;    