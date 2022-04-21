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
        console.log(`Joining ${id}`)
        game.setDungeon(id);
        navigate("/select-character");

    }

    return (
        <div>
            <h2>{name}</h2>
            <p>{description}</p>
            <p>{playercount}/{maxplayercount}</p>
            <p>{isPrivate ? 'Private' : 'Public'}</p>
            <p>{status}</p>
            {status === 'online' && <button onClick={joinDungeon}>Join</button>}
        </div>
    )
}

export default AllDungeonLi;