/**
 * @module Chat
 * @category React Components
 * @description Chat Component to display the Chat-Output and Input-Field
 * @children {@linkcode ChatOutput} {@linkcode ChatInput}
 * @props {@linkcode ChatProps}
 */

import React from 'react'
import ChatInput from './ChatInput';
import ChatOutput from './ChatOutput';
import { SendsMessagesProps } from '../../../types/misc';
export interface ChatProps { }

const Chat: React.FC<ChatProps & SendsMessagesProps> = ({ messageCallback }) => {
    return (
        <>
            <ChatOutput/>
            <ChatInput messageCallback={messageCallback} />
        </>
    )
}

export default Chat;    