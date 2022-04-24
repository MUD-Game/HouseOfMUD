/**
 * @module AllDungeonLi
 * @category React Components
 * @description A list item for the AllDungeon-List
 * @props {@linkcode AllDungeonLiProps}
 * ```jsx
 * ...
 * ```
 */


import React from "react"
import { Row } from "react-bootstrap";
import { CloudCheck, CloudSlash, Lock, Unlock } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useGame } from "src/hooks/useGame";



export interface AllDungeonLiProps {
    id: string;
    name: string;
    description: string;
    maxPlayers: number;
    currentPlayers: number;
    status: "online" | "offline";
    isPrivate: boolean;
}

const AllDungeonLi: React.FC<AllDungeonLiProps> = ({ id, name, description, currentPlayers, maxPlayers, isPrivate, status }) => {

    const game = useGame();
    const navigate = useNavigate();

    let joinDungeon = () => {
        game.setDungeon(id);
        game.setDungeonName(name);
        navigate("/select-character");
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
                {/* <Unlock size={25} className="mx-1" /> */}
                {status === "online" ? '' : ''}                
                <CloudSlash size={25} style={{color: "red"}} className="mx-1" />
                {/* <CloudCheck size={25} style={{color: "green"}} className="mx-1" /> */}
            </div>
            <div className="col-2">         
                {status === 'online' && <button className="btn drawn-border btn-standard" onClick={joinDungeon}>Join</button>}
            </div>
        </Row>
    )
}

export default AllDungeonLi;