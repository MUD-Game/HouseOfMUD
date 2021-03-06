import React, { MouseEvent } from "react";
import { Row } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { MudCharacterClass, MudItem, MudCharacterSpecies } from 'src/types/dungeon';
import { MudActionElement, MudCharacterGender } from '../../types/dungeon';
import DungeonObjectListElement from './DungeonObjectListElement';
import "./index.css";

export type AcceptedTypes = MudCharacterClass | MudItem | MudActionElement | MudCharacterGender | MudCharacterSpecies;
export interface DungeonObjectListProps {
    title: string;
    buttonText?: string;
    identifier: string;
    onAdd?: (event: MouseEvent<HTMLButtonElement>) => void;
    onEditElement: (key: number) => void;
    onDeleteElement: (key: number) => void;
    data: AcceptedTypes[];
    displayKeys: string[];
    disabled?: boolean;
}

const DungeonObjectList: React.FC<DungeonObjectListProps> = (props) => {

    const {t} = useTranslation();

    return (
        <div className={props.disabled ? "disabled": ""}>
            <Row className="mt-5">
                <hr />
                <div className="col-md-7">
                    <span className="headline">{props.title}</span>
                </div>
                <div className="col-md-5">
                    <button className="btn drawn-border btn-standard col-md-2" onClick={props.onAdd}>{props.buttonText}</button>
                </div>
            </Row>
            <Row className="py-2">
                {props.displayKeys.map((key, index) => {
                            return (
                                <div className="col" key={index}>
                                    <b><u>{t(`dungeon_keys.${key}`)}</u></b>
                                </div>
                            )
                        })}
                <div className="col"></div>
            </Row>

            {props.data.length > 0 && props.data.map((item: any, index) => {

                return (
                    <DungeonObjectListElement key={`${props.title}-li-${item[props.identifier]}`} item={item} {...props} />
                )
            })}

        </div>
    )
}

export default DungeonObjectList;