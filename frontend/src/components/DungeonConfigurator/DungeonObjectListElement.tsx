import React from "react";
import { Row } from 'react-bootstrap';
import { Pencil, Trash } from "react-bootstrap-icons";
import { AcceptedTypes } from './DungeonObjectList';

export interface DungeonObjectListElementProps {
    item: AcceptedTypes;
    onEditElement: (key: number) => void;
    onDeleteElement: (key: number) => void;
    displayKeys: string[];
}

const DungeonObjectListElement: React.FC<DungeonObjectListElementProps> = ({ item, onEditElement, onDeleteElement, displayKeys }) => {

    const [isFromServer] = React.useState((item as any).from_server || false);

    return (
        <Row className="mb-2 py-1 configurator-item">
            {displayKeys?.map((key: string, iindex) => {
                return (
                    <div className="col" key={iindex}>
                        {item && (item as any)[key]}
                    </div>
                )
            })}
            <div className="col text-end">
                <Pencil size={30} id="editIcon" className="mx-1" onClick={() => onEditElement(parseInt(item.id))} />
                {isFromServer ? null : <Trash size={30} id="deleteIcon" className="mx-1" onClick={() => onDeleteElement(parseInt(item.id))} />}
            </div>
        </Row>
    )
}

export default DungeonObjectListElement;