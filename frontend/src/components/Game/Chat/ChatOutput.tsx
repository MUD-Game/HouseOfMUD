/**
 * @module ChatOutput
 * @category React Components
 * @description ChatOutput Component to display the Chat-Feedback from RabbitMQ
 * @children {@linkcode ChatOutputOutput} {@linkcode ChatOutputInput}
 * @props {@linkcode ChatOutputProps}
 */

import { IMessage } from '@stomp/stompjs';
import React from 'react'
import { useRabbitMQ } from '../../../hooks/useRabbitMQ';
import { useEffect } from 'react';
export interface ChatOutputProps {
    messages: any; //TODO: define correct message type
}

const ChatOutput: React.FC<ChatOutputProps> = ({ messages }) => {

    const rabbit = useRabbitMQ();


    rabbit.setChatSubscriber((message: IMessage) => {
        console.log(message.body);
    });

    useEffect(() => {
        rabbit.login(() => {
            console.log('login success lulw');
        }, (error: string) => {
            console.log(error);
        });
        return () => {
            rabbit.logout(() => { }, (error) => {
                console.log(error);
            });
        }
    }, [])
    return (
        <div>
            <p>CHAT-OUTPUT</p>
            {/* TODO:Do something with the messages that are passed in here */}
        </div>
    )
}

export default ChatOutput;    