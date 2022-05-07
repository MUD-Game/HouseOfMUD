/**
 * @module DungeonMaster-ChatOutput
 * @category React Components
 * @description ChatOutput Component to display the Chat-Feedback from RabbitMQ
 * @children
 * @props {@linkcode ChatOutputProps}
 */

import { IMessage } from '@stomp/stompjs';
import React, { useRef, useState } from 'react'
import { useRabbitMQ } from 'src/hooks/useRabbitMQ';
import { useEffect } from 'react';
import { Row } from 'react-bootstrap';

export interface ChatOutputProps { }


const ChatOutput: React.FC<ChatOutputProps> = () => {

    const [messages, setMessages] = useState<string[]>([]);

    const { setChatSubscriber } = useRabbitMQ();

    setChatSubscriber((data: any) => {
        setMessages((prevState) => {
            return [...prevState, data.message]
        });
    });

    const messagesEndRef = useRef<HTMLInputElement>(null);
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };
    useEffect(scrollToBottom, [messages]);

    return (
        <Row className="chat-output-wrap">
            <div className="col">
                <div className="chat drawn-border p-2 ps-3 pe-3 pt-lg-3 pe-lg-4">
                    <div className="chat-content">
                        {messages.map((message, index) => {
                            return (
                                <span key={index} className={"chat-message channel-global"}>
                                    {message} <br />
                                </span>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>
        </Row>
    )
}

export default ChatOutput;    