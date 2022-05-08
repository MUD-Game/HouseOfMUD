/**
 * @module DungeonMaster-ChatInput
 * @category React Components
 * @description ChatInput Component to get the input from the user
 * @children
 * @props {@linkcode ChatInputProps}
 */

import React, { useState } from 'react'
import { Row } from 'react-bootstrap';
import { CloudArrowUp, Send } from 'react-bootstrap-icons';
import { useRabbitMQ } from "src/hooks/useRabbitMQ";
import { SendsMessagesProps } from '../../../types/misc';
export interface ChatInputProps {
    onSendCommand: (command: string) => void;
}


const ChatInput: React.FC<ChatInputProps & SendsMessagesProps> = ({ messageCallback, onSendCommand }) => {

    const { sendDmMessage: sendMessage } = useRabbitMQ();
    const sendInput = (evt: any) => {
        evt.preventDefault()
        sendMessage(message, () => {
            // Success
        }, (error) => {
            messageCallback("rabbitmq.send");
        })
        setMessage("");
    }
    const [message, setMessage] = useState<string>("");

    const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && message !== "") {
            sendInput(e);
        }
    }

    return (
        <Row onKeyDown={handleEnterKey} className="mt-3">
            <div className="col-10">
                <input className="input-standard drawn-border" value={message} onChange={event => setMessage(event.target.value)} type="text" name="message" id="chat-input" required autoComplete='off' />
            </div>
            <div className="col-1">
                <button className="btn px-0 w-100 drawn-border btn-blue" onClick={() => {
                    onSendCommand(message);
                    setMessage("");
                }}>
                    <CloudArrowUp />
                </button>
            </div>
            <div className="col-1">
                <button className="btn px-0 w-100 drawn-border btn-green" onClick={sendInput}>
                    <Send />
                </button>
            </div>
        </Row>
    )
}

export default ChatInput;    