/**
 * @module AllDungeonLi
 * @category React Components
 * @description A list item for the AllDungeon-List
 * @props {@linkcode MyDungeonsLiProps}
 * ```jsx
 * ...
 * ```
 */

import React from "react"
import { Row } from "react-bootstrap";
import { CloudCheck, CloudSlash, Lock, Pencil, Play, Stop, Trash, Unlock } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Busy from "src/components/Busy";
import ConfirmationDialog from "src/components/Modals/BasicModals/ConfirmationDialog";
import { useGame } from "src/hooks/useGame";
import { supervisor } from "src/services/supervisor";
import "./index.css"


const DUNGEON_MASTER_NAME = "dungeonmaster";

export interface MyDungeonsLiProps {
    id: string;
    name: string;
    description: string;
    maxPlayers: number;
    currentPlayers: number;
    status: "online" | "offline";
    isPrivate: boolean;
    fetchMyDungeons: () => void;
}

const MyDungeonsLi: React.FC<MyDungeonsLiProps> = ({ id, name, description, currentPlayers, maxPlayers, isPrivate, status, fetchMyDungeons }) => {

    const game = useGame();
    const navigate = useNavigate();
    const {t} = useTranslation();

    const [isBusy, setIsBusy] = React.useState(false);
    const [showConfirmationDialog, setShowConfirmationDialog] = React.useState<{ show: boolean, message: string, title: string, onConfirm: () => void }>({ show: false, message: "", title: "", onConfirm: () => { } });

    const showConfirmation = (title: string, message: string, onConfirm: () => void) => {
        setShowConfirmationDialog({
            show: true, message, title, onConfirm
        });
    }

    const join = ()=>{

        supervisor.login(id, {}, (data) => {
            game.setCharacter(DUNGEON_MASTER_NAME);
            game.setVerifyToken(data.verifyToken);
            game.setDungeon(id);
            game.setDungeonName(name);
            navigate("/game");
        }, (error) => {
            // TODO: handle error in a better way
        });

    }

    const startAndJoin = () => {
        supervisor.startDungeon(id, {}, (data) => {
            join();
        }, (error) => {
        });
    } 

    return (
        <>
            <Row className={`dashboard-list ${isBusy ? " disabled" : ""} align-items-center pt-1 pb-2 mb-2`}>
            <ConfirmationDialog onHide={() => { setShowConfirmationDialog({ show: false, message: "", title: "", onConfirm: () => { } }) }} {...showConfirmationDialog} />
            <div className="col-3">
                <b>{name}</b>
            </div>
            <div className="col-5">
                {description}
            </div>
            <div className="col-1">
                {currentPlayers}/{maxPlayers}
            </div>
            <div className="col-1 text-center">
                {isPrivate ? <Lock size={25} className="mx-1" /> : <Unlock size={25} className="mx-1" />}
                {status === "online" ? <CloudCheck size={25} style={{ color: "green" }} className="mx-1" /> : <CloudSlash size={25} style={{ color: "red" }} className="mx-1" />}

            </div>
                {isBusy ?  <div className="col-2 text-end"> <Busy className="list-busy" /> </div>: <div className="col-2 text-end">
                {status=== "offline" ?
                <div className="">
                    <Play size={45} id="joinIcon" className="ms-1" onClick={startAndJoin} />
                    <Pencil size={30} id="editIcon" className="me-1" onClick={()=>{ navigate("/dungeon-configurator", {state: {dungeonId: id}}); }} />
                    <Trash size={30} id="deleteIcon" className="mx-1" onClick={()=>{
                        showConfirmation(t("dashboard.delete_dungeon.confirmation.title"), t("dashboard.delete_dungeon.confirmation.text"),
                        ()=>{
                            setIsBusy(true);
                            supervisor.deleteDungeon(id, {}, (data)=>{
                            setIsBusy(false);
                            fetchMyDungeons();
                        }, (error)=>{}); })
                    }} />
                    
                </div>
                :
                <div>
                    <Stop size={30} id="deleteIcon" className="mx-1" onClick={() => {
                        setIsBusy(true);
                        supervisor.stopDungeon(id, {}, (data) => {
                            // setIsBusy(false);
                            setIsBusy(false);
                            fetchMyDungeons();
                            // TODO: handle error correctly
                        }, (error) => {alert(error.error)})
                    }} />
                </div>
                }
            </div>}
        </Row>
        </>
    )
}

export default MyDungeonsLi;