/**
 * @module Game
 * @category React Components
 * @description Game Component to display the Chat, HUD, Inventory and Minimap
 * @children {@linkcode DungeonMaster-Minimap}, {@linkcode CharQueue} {@linkcode DungeonMaster-Chat}, {@linkcode OnlinePlayers}, {@linkcode PlayerInfo}
 * @props {@linkcode GameProps}
 */

import React, { useState } from 'react'
import Minimap from './Minimap';
import { useEffect } from 'react';
import { useGame } from 'src/hooks/useGame';
import { Navigate, useNavigate } from 'react-router-dom';
import { useRabbitMQ } from 'src/hooks/useRabbitMQ';
import { Container, Row } from 'react-bootstrap';
import Chat from './Chat';
import OnlinePlayers from './OnlinePlayers';
import ChatQueue from './ChatQueue';
import PlayerInfo from './PlayerInfo';
import { useTranslation } from 'react-i18next';
import Alert from '../Custom/Alert';
import { MinimapProps } from './Minimap';
export interface GameProps { }

const Game: React.FC<GameProps> = ({ }) => {
    const {t} = useTranslation();
    let navigate = useNavigate();

    const rabbit = useRabbitMQ();
    const [messageQueue, setMessageQueue] = useState<string[]>([]);
    const { isAbleToJoinGame } = useGame();
    const [error, setError] = React.useState<string>("");
    const [miniMapData, setMiniMapData] = React.useState<MinimapProps | null>(null);

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
            rabbit.login(() => {
                // Success
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

    const addMessage = (queueMessage:string) => {
        setMessageQueue([...messageQueue,queueMessage])
    }

    const sendQueue = () => {
        messageQueue.forEach(queueMessage => {
            rabbit.sendDmMessage(queueMessage, ()=>{}, setError);
        });
        setMessageQueue([])
    }



    return (
        <Container fluid className="game-wrapper">
            <Row className="game-header align-items-center">
                <div className="col text-end">
                    <button className="btn drawn-border btn-xpadding btn-red" onClick={() => navigate("/")}>{t("game.leave")}</button>
                </div>
            </Row>
            <Row className="game-body">
                <div className="col col-md-3 col-lg-2">
                    {miniMapData && <Minimap {...miniMapData} />}
                    <OnlinePlayers players={null} />
                    <Alert type='error' message={error} setMessage={setError} />
                </div>
                <div className="col col-md-6 col-lg-8">
                    <Chat onSendCommand={addMessage} messageCallback={setError}/>
                </div>
                <div className="col col-md-3 col-lg-2">
                    <ChatQueue commandQueue={messageQueue} onSendQueue={sendQueue} />
                    <PlayerInfo player={null} />
                </div>
            </Row>
        </Container>
    )
}

export default Game;    