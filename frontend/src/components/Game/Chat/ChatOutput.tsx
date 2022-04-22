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

    const [messages, setMessages] = useState(["Mock-Message"]);
    const {setChatSubscriber} = useRabbitMQ();

    setChatSubscriber((message:IMessage)=>{
        setMessages([...messages, message.body])
    });
    
    return (
        <>
            <p>CHAT-OUTPUT</p>
            {messages.map((msg,index)=>{
                <div key={index}>{msg}</div>
            })}            
        </>
    )
}

export default ChatOutput;    