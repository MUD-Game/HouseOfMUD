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
export interface ChatProps { }

const Chat: React.FC<ChatProps> = ({ }) => {
    return (
        <div>
            <ChatOutput messages={null!} />
            <ChatInput />
        </div>
    )
}

export default Chat;    