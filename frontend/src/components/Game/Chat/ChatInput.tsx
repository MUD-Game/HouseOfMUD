/**
 * @module ChatInput
 * @category React Components
 * @description ChatInput Component to get the input from the user
 * @children {@linkcode ChatInputOutput} {@linkcode ChatInputInput}
 * @props {@linkcode ChatInputProps}
 */

import React, { FormEvent } from 'react'
import { Row } from 'react-bootstrap';
import { Send } from 'react-bootstrap-icons';
import { useRabbitMQ } from "src/hooks/useRabbitMQ";
import { useMudConsole } from '../../../hooks/useMudConsole';
export interface ChatInputProps { }

const ChatInput: React.FC<ChatInputProps> = ({ }) => {

    const { sendMessage } = useRabbitMQ();
    const homsole = useMudConsole();
    const sendInput = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        let formData = new FormData(evt.currentTarget);
        let message = formData.get('message') as string;
        sendMessage(message, () => {
            homsole.log(message, "Message sent succesfully",);
        }, (error) => {
            homsole.error(error, "RabbitMQ");
        })
    }

    return (
        <form className="row mt-3" onSubmit={sendInput}>
            <div className="col-10">
                <input type="text" name="message" required autoComplete='off' />
            </div>
            <div className="col-2">
                <button className="btn w-100 drawn-border btn-green" type="submit">
                    <Send/>
                </button>
            </div>
        </form>
    )
}

export default ChatInput;    