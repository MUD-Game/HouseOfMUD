/**
 * @module DungeonMaster-Chat
 * @category React Components
 * @description Chat Component to display the Chat-Output and Input-Field
 * @children {@linkcode DungeonMaster-ChatOutput} {@linkcode DungeonMaster-ChatInput}
 * @props {@linkcode ChatProps}
 */

import React from 'react'
import ChatInput from './ChatInput';
import ChatOutput from './ChatOutput';
import { SendsMessagesProps } from '../../../types/misc';
export interface ChatProps {
    onSendCommand: (command:string) => void;
    selectedRooms: string[];
}

const Chat: React.FC<ChatProps & SendsMessagesProps> = ({ selectedRooms, messageCallback, onSendCommand }) => {
    return (
        <>
            <ChatOutput selectedRooms={selectedRooms} />
            <ChatInput onSendCommand={onSendCommand} messageCallback={messageCallback} />
        </>
    )
}

export default Chat;    