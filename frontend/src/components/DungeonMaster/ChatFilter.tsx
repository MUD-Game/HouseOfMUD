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

export interface ChatFilterProps{ 
    allRooms: string[];
    selectedRooms: string[];
    setSelectedRooms: (rooms:string[]) => void;
}

const ChatFilter: React.FC<ChatFilterProps> = ({allRooms, selectedRooms, setSelectedRooms }) => {

    const {t} = useTranslation();

    return (
        <MudTypeahead
            colmd={12}
            title=""
            id={"room-actions-typeahead"}
            labelKey={(option: any) => `${option}`}
            options={allRooms}
            multiple
            onChange={ (e: any) => {                
                setSelectedRooms(e);
            }}
            placeholder={t(`game.filter`)}
            selected={selectedRooms}
        />
    )
}

export default ChatFilter;