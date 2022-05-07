/**
 * @module ChatFilter
 * @category React Components
 * @description ChatFilter Component to filter the Chat for DM
 * @children
 * @props {@linkcode ChatFilterProps}
 */

import React from 'react'
export interface ChatFilterProps {
    filter: any; //TODO: define item data
}

const ChatFilter: React.FC<ChatFilterProps> = ({ filter }) => {
    return (
        <input className="input-standard drawn-border" type="text" name="filter" id="chatfilter-input" autoComplete='off' placeholder="Raum-Filter" />
    )
}

export default ChatFilter;    