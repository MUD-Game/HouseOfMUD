/**
 * @module DungeonMaster-ChatInput
 * @category React Components
 * @description ChatInput Component to get the input from the user
 * @children
 * @props {@linkcode ChatInputProps}
 */

import React, { FormEvent } from 'react'
import $ from "jquery";
import { Row } from 'react-bootstrap';
import { CloudArrowUp, Send } from 'react-bootstrap-icons';
import { useRabbitMQ } from "src/hooks/useRabbitMQ";
import { SendsMessagesProps } from '../../../types/misc';
export interface ChatInputProps { }

const ChatInput: React.FC<ChatInputProps & SendsMessagesProps> = ({ messageCallback}) => {

    const { sendMessage } = useRabbitMQ();
    const sendInput = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        let formData = new FormData(evt.currentTarget);
        let message = formData.get('message') as string;
        sendMessage(message, () => {
            // Success
        }, (error) => {
            messageCallback("rabbitmq.send");
        })
        $("#chat-input").val("");
    }

    return (
        <form className="chat-input-wrap " onSubmit={sendInput}>
            <Row className="h-100 mt-3">
                <div className="col-10">
                    <input type="text" name="message" id="chat-input" required autoComplete='off' />
                </div>
                <div className="col-1">
                    <button className="btn px-0 w-100 drawn-border btn-blue" type="submit">
                        <CloudArrowUp />
                    </button>
                </div>
                <div className="col-1">
                    <button className="btn px-0 w-100 drawn-border btn-green" type="submit">
                        <Send/>
                    </button>
                </div>
            </Row>
        </form>
    )
}

export default ChatInput;    