/**
 * @module DungeonMaster-ChatOutput
 * @category React Components
 * @description ChatOutput Component to display the Chat-Feedback from RabbitMQ
 * @children
 * @props {@linkcode ChatOutputProps}
 */

import React, { useRef, useState } from 'react'
import { useRabbitMQ } from 'src/hooks/useRabbitMQ';
import { useEffect } from 'react';
import { Row } from 'react-bootstrap';
import { default as AnsiUp } from 'ansi_up';

const RESET = '\x1b[0m';

export interface ChatOutputProps {
    selectedRooms: string[];
}

const ChatOutput: React.FC<ChatOutputProps> = ({ selectedRooms }) => {

    const ansi_up = new AnsiUp();

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

    useEffect(() => {
        console.log(selectedRooms);
        return () => {console.log(selectedRooms)}
    }, [selectedRooms]);

    return (
        <Row className="chat-output-wrap">
            <div className="col">
                <div className="chat drawn-border p-2 ps-3 pe-3 pt-lg-3 pe-lg-4">
                    <div className="chat-content">
                        {messages.map((message, index) => {
                            return (
                                <span key={index} className={"chat-message channel-global"}>
                                    <span dangerouslySetInnerHTML={{__html: ansi_up.ansi_to_html(RESET + message)}}></span>
                                    <br />
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