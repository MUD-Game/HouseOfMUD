/**
 * @module ChatOutput
 * @category React Components
 * @description ChatOutput Component to display the Chat-Feedback from RabbitMQ
 * @children {@linkcode ChatOutputOutput} {@linkcode ChatOutputInput}
 * @props {@linkcode ChatOutputProps}
 */

import React from 'react'
export interface ChatOutputProps {
    messages: any; //TODO: define correct message type
}

const ChatOutput: React.FC<ChatOutputProps> = ({ messages }) => {
    return (
        <div>
            <p>CHAT-OUTPUT</p>
            {/* TODO:Do something with the messages that are passed in here */}
        </div>
    )
}

export default ChatOutput;    