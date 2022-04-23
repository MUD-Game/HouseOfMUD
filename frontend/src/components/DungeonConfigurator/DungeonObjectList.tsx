import React, { ButtonHTMLAttributes, DetailedHTMLProps, MouseEvent } from "react";
import { Row, Table } from 'react-bootstrap';
import { Pencil, Trash } from "react-bootstrap-icons";
import { MudCharacterClass, MudItem } from "src/types/dungeon";
import { MudActionElement } from '../../types/dungeon';
import DungeonObjectListElement from './DungeonObjectListElement';

import './index.css'

export type AcceptedTypes = MudCharacterClass | MudItem | MudActionElement;
export interface DungeonObjectListProps {
    title: string;
    buttonText?: string;
    identifier: string;
    onAdd?: (event: MouseEvent<HTMLButtonElement>) => void;
    onEditElement: (key: number) => void;
    onDeleteElement: (key: number) => void;
    data: AcceptedTypes[];
    displayKeys: { [key: string]: string };
}

const DungeonObjectList: React.FC<DungeonObjectListProps> = (props) => {

    return (
        <>
            <Row>
                <h1 className="col-md-10">{props.title}</h1>
                <button className="btn drawn-border col-md-2" onClick={props.onAdd}>{props.buttonText}</button>
            </Row>
            <Table responsive hover variant="mud">
                <thead>
                    <tr>

                        {Object.keys(props.displayKeys).map((key, index) => {
                            return (
                                <th key={index}>
                                    {props.displayKeys[key]}
                                </th>
                            )
                        })}
                        <th>

                        </th>
                    </tr>
                </thead>
                <tbody>

                    {props.data.length > 0 && props.data.map((item: any, index) => {
                        return (
                            <DungeonObjectListElement key={index} item={props.data[item.id]} {...props} />
                        )
                    })}


                </tbody>
            </Table>
        </>
    )
}

export default DungeonObjectList;