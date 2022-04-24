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
    displayKeys: { [key: string]: string };
}

const DungeonObjectListElement: React.FC<DungeonObjectListElementProps> = ({ item, onEditElement, onDeleteElement, displayKeys }) => {

    return (
        <tr>
            {Object.keys(displayKeys).map((key: string, iindex) => {
                return (
                    <td key={iindex}>
                        {(item as any)[key]}
                    </td>
                )
            })}
            <td className="text-end">
                <Pencil size={30} id="editIcon" style={{ cursor: "pointer" }} onClick={() => onEditElement(parseInt(item.id))} />
                <Trash size={30} id="deleteIcon" onClick={() => onDeleteElement(parseInt(item.id))} style={{ cursor: "pointer", color: "red" }} />
            </td>
        </tr>
    )
}

export default DungeonObjectListElement;