/**
 * @module ChatFilter
 * @category React Components
 * @description ChatFilter Component to filter the Chat for DM
 * @children
 * @props {@linkcode ChatFilterProps}
 */

import React from 'react'
import { MudRoom } from 'src/types/dungeon';
import { useTranslation } from 'react-i18next';
import MudTypeahead from '../Custom/Typeahead';
export interface ChatFilterProps {
    // filter: any; //TODO: define item data
}

export interface Filter {
    rooms: string[];
}


export interface ChatFilterProps extends Filter { }

const ChatFilter: React.FC<ChatFilterProps> = (props) => {
    const [rooms, setRooms] = React.useState<Filter["rooms"]>(props.rooms);

    const {t} = useTranslation();

    return (
        <MudTypeahead
            colmd={12}
            title=""
            id={"room-actions-typeahead"}
            labelKey={(option: any) => `${option}`}
            options={rooms}
            multiple
            onChange={(e: any) => {
                // setSelectedRoomActions(e);
            }}
            placeholder={t(`game.filter`)}
            // selected={selectedRoomActions}
        />
    )
}

export default ChatFilter;