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
import { useNavigate } from "react-router-dom";
import { useGame } from "src/hooks/useGame";



export interface AllDungeonLiProps {
    id: string;
    name: string;
    description: string;
    maxplayercount: number;
    playercount: number;
    status: "online" | "offline";
    isPrivate: boolean;
}

const AllDungeonLi: React.FC<AllDungeonLiProps> = ({ id, name, description, playercount, maxplayercount, isPrivate, status }) => {

    const game = useGame();
    const navigate = useNavigate();

    let joinDungeon = () => {
        game.setDungeon(id);
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
                {playercount}/{maxplayercount}          
            </div>
            <div className="col-1 text-center">        
                {isPrivate ? '' : '🔒'}
                {status === "online" ? '🟢' : '🔴'}
            </div>
            <div className="col-2">         
                {status === 'online' && <button className="btn drawn-border btn-standard" onClick={joinDungeon}>Join</button>}
            </div>
        </Row>
    )
}

export default AllDungeonLi;