import React, { ButtonHTMLAttributes, DetailedHTMLProps, MouseEvent } from "react";

export interface DungeonObjectListProps {
    title: string;
    buttonText?: string;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

const DungeonObjectList: React.FC<DungeonObjectListProps> = ({ title, buttonText, onClick }) => {

    return (
        <div>
            <h1>{title}</h1>
            <button onClick={onClick}>{buttonText}</button>
        </div>
    )
}

export default DungeonObjectList;