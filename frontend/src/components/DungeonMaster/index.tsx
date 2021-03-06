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
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useRabbitMQ } from 'src/hooks/useRabbitMQ';
import { Container, Row } from 'react-bootstrap';
import Chat from './Chat';
import OnlinePlayers from './OnlinePlayers';
import ChatQueue from './ChatQueue';
import PlayerInfo from './PlayerInfo';
import { useTranslation } from 'react-i18next';
import Alert from '../Custom/Alert';
import { MinimapProps } from './Minimap';
import ChatFilter from './ChatFilter';
import { DashboardLocationState } from '../Dashboard';
import DungeonMasterLeaveModal from '../Modals/Game/DungeonMasterLeaveModal';
export interface GameProps { }

const Game: React.FC<GameProps> = () => {
    const {t} = useTranslation();
    let navigate = useNavigate();

    const rabbit = useRabbitMQ();
    const location = useLocation();
    const [messageQueue, setMessageQueue] = useState<string[]>([]);
    const { isAbleToJoinGame } = useGame();
    const [error, setError] = React.useState<string>("");
    const [miniMapData, setMiniMapData] = React.useState<MinimapProps | null>(null);
    const [selectedRooms, setSelectedRooms] = React.useState<string[]>([]);
    const [showLeaveModal, setShowLeaveModal] = React.useState<boolean>(false);

    const [playerList, setPlayerList] = React.useState<string[]>([]);
    const onUnload = (e: any) => {
        e.preventDefault();
        rabbit.logout(() => { }, (error) => {
            setError("rabbitmq.logout")
        });
    }
    const kickSubscriber = (message: any) => {
        if (message.kickMessage === undefined || message.kickMessage === "") {
            message.kickMessage = t(`alert.${message.type}.default`);
        }
        navigate('/', {
            state: {
                message: message.kickMessage,
                title: t(`alert.${message.type}.title`),
                time: new Date()
            } as DashboardLocationState
        });
    }

    const miniMapSubscriber = (roomData: MinimapProps) => {
        setMiniMapData(roomData);
    }

    

    useEffect(() => {
        window.addEventListener('unload', onUnload);
        const delay = (location.state as {delay?:number})?.delay ?? 0;
        if (isAbleToJoinGame()) {
            rabbit.setErrorSubscriber(console.error);
            rabbit.setMiniMapSubscriber(miniMapSubscriber);
            rabbit.setKickSubscriber(kickSubscriber);
            setTimeout(()=>rabbit.login(() => {
                // Success
            }, (error) => {
                setError("rabbitmq.login")
            }),delay);
        }
        return () => {
            window.removeEventListener('unload', onUnload);
            rabbit.logout(() => { }, (error) => {
                setError("rabbitmq.logout")
            });
        }
    }, [isAbleToJoinGame, rabbit]);

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
            <DungeonMasterLeaveModal show={showLeaveModal} onDmGiveUp={(character)=>{
                rabbit.sendDmGiveUp(character, ()=>{}, ()=>{})
            }} onHide={()=>setShowLeaveModal(false)} onShutdown={()=>{
                navigate("/?board=my", {state:{delay:1000, time:new Date()}});
            }}  playerList={playerList}/>
            <Row className="game-header align-items-center">
                <div className="col text-end">
                    <button className="btn drawn-border btn-xpadding btn-red" onClick={()=>{
                        setShowLeaveModal(true);
                    }}>{t("game.leave")}</button>
                </div>
            </Row>
            <Row className="game-body">
                <div className="col col-md-3 col-lg-2">
                    {miniMapData && <Minimap {...miniMapData} />}
                    <OnlinePlayers selectedRooms={selectedRooms} setPlayers={setPlayerList} />
                    {miniMapData && <ChatFilter selectedRooms={selectedRooms} setSelectedRooms={setSelectedRooms} allRooms={ Object.values(miniMapData.rooms).map( room => room.name) } />}
                    <Alert type='error' message={error} setMessage={setError} />
                </div>
                <div className="col col-md-6 col-lg-8">
                    <Chat selectedRooms={selectedRooms} onSendCommand={addMessage} messageCallback={setError}/>
                </div>
                <div className="col col-md-3 col-lg-2">
                    <ChatQueue commandQueue={messageQueue} setCommandQueue={setMessageQueue} onSendQueue={sendQueue} />
                    <PlayerInfo />
                </div>
            </Row>
        </Container>
    )
}

export default Game;    