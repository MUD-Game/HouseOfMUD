/**
 * @module ChatOutput
 * @category React Components
 * @description ChatOutput Component to display the Chat-Feedback from RabbitMQ
 * @children {@linkcode ChatOutputOutput} {@linkcode ChatOutputInput}
 * @props {@linkcode ChatOutputProps}
 */

import { IMessage } from '@stomp/stompjs';
import React, { useState } from 'react'
import { useRabbitMQ } from '../../../hooks/useRabbitMQ';
import { useEffect } from 'react';
export interface ChatOutputProps {}

const ChatOutput: React.FC<ChatOutputProps> = ({ }) => {

    const [messages, setMessages] = useState("Mock");
    const {setChatSubscriber} = useRabbitMQ();

    setChatSubscriber((message:string)=>{
        setMessages(message)
    });
    
    return (
        <>
            <p>CHAT-OUTPUT</p>
            <div>{messages}</div>      
        </>
    )
}

export default ChatOutput;    