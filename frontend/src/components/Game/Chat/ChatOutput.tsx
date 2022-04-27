/**
 * @module ChatOutput
 * @category React Components
 * @description ChatOutput Component to display the Chat-Feedback from RabbitMQ
 * @children {@linkcode ChatOutputOutput} {@linkcode ChatOutputInput}
 * @props {@linkcode ChatOutputProps}
 */

import { IMessage } from '@stomp/stompjs';
import React, { useRef, useState } from 'react'
import { useRabbitMQ } from 'src/hooks/useRabbitMQ';
import { useEffect } from 'react';
import { Row } from 'react-bootstrap';

export interface ChatOutputProps {}


const ChatOutput: React.FC<ChatOutputProps> = () => {

    const [messages, setMessages] = useState<string[]>([]);

    const {setChatSubscriber} = useRabbitMQ();

    let addMessage = (message: string) => {
        setMessages([...messages, message]);
    };

    setChatSubscriber((data: any)=>{
        addMessage(data.message);
    });


    const messagesEndRef = useRef<HTMLInputElement>(null);
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };
    useEffect(scrollToBottom, [messages]);

    
    return (
        <Row>
            <div className="col">
                <span>CHAT-OUTPUT</span>
                <div className="chat drawn-border p-2 pe-3">
                    <div className="chat-content">
                        {messages.map((message, index) => {
                            return (
                                <span key={index} className={"chat-message channel-global"}>
                                    {message} <br />
                                </span>
                            )
                        })}
                        <div id="messagesEndRef" ref={messagesEndRef} />
                    </div>
                </div>
            </div>
        </Row>
    )
}

export default ChatOutput;    