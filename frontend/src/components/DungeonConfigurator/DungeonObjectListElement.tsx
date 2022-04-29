import React, { ButtonHTMLAttributes, DetailedHTMLProps, MouseEvent } from "react";
import { Row } from 'react-bootstrap';
import { Pencil, Trash } from "react-bootstrap-icons";
import { MudCharacterClass, MudItem } from "src/types/dungeon";
import { MudActionElement } from '../../types/dungeon';
import { AcceptedTypes } from './DungeonObjectList';

export interface DungeonObjectListElementProps {
    item: AcceptedTypes;
    onEditElement: (key: number) => void;
    onDeleteElement: (key: number) => void;
    displayKeys: string[];
}

const DungeonObjectListElement: React.FC<DungeonObjectListElementProps> = ({ item, onEditElement, onDeleteElement, displayKeys }) => {

    return (
        <Row className="mb-2 py-1 configurator-item">
            {displayKeys.map((key: string, iindex) => {
                return (
                    <div className="col" key={iindex}>
                        {(item as any)[key]}
                    </div>
                )
            })}
            <div className="col text-end">
                <Pencil size={30} id="editIcon" className="mx-1" style={{ cursor: "pointer" }} onClick={() => onEditElement(parseInt(item.id))} />
                <Trash size={30} id="deleteIcon" className="mx-1" onClick={() => onDeleteElement(parseInt(item.id))} style={{ cursor: "pointer", color: "red" }} />
            </div>
        </Row>
    )
}

export default DungeonObjectListElement;