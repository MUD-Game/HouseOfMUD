import React, { ButtonHTMLAttributes, DetailedHTMLProps, MouseEvent } from "react";
import { Row } from 'react-bootstrap';
import { Pencil, Trash } from "react-bootstrap-icons";
import { MudCharacterClass } from "src/types/dungeon";

export interface DungeonObjectListProps {
    title: string;
    buttonText?: string;
    onAdd?: (event: MouseEvent<HTMLButtonElement>) => void;
    onEditElement: (key: number) => void;
    onDeleteElement: (key: number) => void;
    data: MudCharacterClass[]; //TODO: Change to the right objects
    displayKeys: { [key: string]: string };
}

const DungeonObjectList: React.FC<DungeonObjectListProps> = ({ title, buttonText, data, displayKeys, onAdd, onEditElement, onDeleteElement }) => {
    const keyColumns = Object.keys(displayKeys).length;
    const keyColumnSize = Math.floor(10 / keyColumns);
    return (
        <div>
            <Row>
                <h1 className="col-md-10">{title}</h1>
                <button className="btn drawn-border col-md-2" onClick={onAdd}>{buttonText}</button>
            </Row>
            <Row>
                {Object.keys(displayKeys).map((key, index) => {
                    return (
                        <div key={index} className={`col-md-${keyColumnSize}`}>
                            <h3>{displayKeys[key]}</h3>
                        </div>
                    )
                })}
                {data.length > 0 && data.map((item: any, index) => {
                    return (
                        <Row key={index} className="align-items-center">
                            {Object.keys(displayKeys).map((key, iindex) => {
                                return (
                                    <div key={iindex} className={`col-md-${keyColumnSize}`}>
                                        {item[key]}
                                    </div>
                                )
                            })}
                            <div className="col-md-2 text-end">
                                <Trash data-key={index} onClick={() => onDeleteElement(index)} style={{ cursor: "pointer" }} />
                                <Pencil data-key={index} onClick={() => onEditElement(index)} style={{ cursor: "pointer" }} />
                            </div>
                        </Row>
                    )
                })}


            </Row>
        </div>
    )
}

export default DungeonObjectList;