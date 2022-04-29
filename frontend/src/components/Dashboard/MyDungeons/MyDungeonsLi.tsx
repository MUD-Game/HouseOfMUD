/**
 * @module AllDungeonLi
 * @category React Components
 * @description A list item for the AllDungeon-List
 * @props {@linkcode MyDungeonsLiProps}
 * ```jsx
 * ...
 * ```
 */


import { t } from "i18next";
import React from "react"
import { Row } from "react-bootstrap";
import { CloudCheck, CloudSlash, Lock, PencilFill, Play, Stop, Trash, Unlock } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useGame } from "src/hooks/useGame";
import { supervisor } from "src/services/supervisor";



export interface MyDungeonsLiProps {
    id: string;
    name: string;
    description: string;
    maxPlayers: number;
    currentPlayers: number;
    status: "online" | "offline";
    isPrivate: boolean;
    onDelete: () => void;
}

const MyDungeonsLi: React.FC<MyDungeonsLiProps> = ({ id, name, description, currentPlayers, maxPlayers, isPrivate, status, onDelete }) => {

    const game = useGame();
    const navigate = useNavigate();
    const {t} = useTranslation();

    let joinDungeon = () => {
        game.setDungeon(id);
        game.setDungeonName(name);
        navigate("/select-character");
    }

    let joinDemo = () => {
        game.setDungeon(id);
        game.setDungeonName(name);
        navigate("/demo-join");
    }

    let startDemo = () => {
        game.setDungeon(id);
        game.setDungeonName(name);
        navigate("/demo-start");
    }

    return (
        <Row className="dashboard-list align-items-center py-2">
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
                {isPrivate ? '' : ''}
                <Lock size={25} className="mx-1" />
                {status === "online" ? <CloudCheck size={25} style={{ color: "green" }} className="mx-1" /> : <CloudSlash size={25} style={{ color: "red" }} className="mx-1" />}

            </div>
            <div className="col-2">
                {/* {status === 'online' && <button className="btn drawn-border btn-standard" onClick={joinDungeon}>Join</button>} */}
                {status=== "offline" ?
                <div className="d-flex flex-row-reverse">
                        <button className="btn btn-danger p-2 mx-1" onClick={()=>{
                            supervisor.deleteDungeon(id, {}, (data)=>{onDelete()}, (error)=>{});
                            }}><Trash /></button>
                        <button className="btn btn-secondary p-2 mx-1"><PencilFill /></button>
                    <button className="btn btn-success p-2 mx-1" onClick={startDemo}><Play onClick={startDemo} /></button>
                </div>
                    : t("dashboard.already_in_dungeon")}
            </div>
        </Row>
    )
}

export default MyDungeonsLi;