/**
 * @module ChatInput
 * @category React Components
 * @description ChatInput Component to get the input from the user
 * @children {@linkcode ChatInputOutput} {@linkcode ChatInputInput}
 * @props {@linkcode ChatInputProps}
 */

import React, { FormEvent } from 'react'
import {useRabbitMQ} from "src/hooks/useRabbitMQ";
export interface ChatInputProps { }

const ChatInput: React.FC<ChatInputProps> = ({ }) => {

    const {sendMessage} = useRabbitMQ();

    const sendInput = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        let formData = new FormData(evt.currentTarget);
        let message = formData.get('message') as string;
        sendMessage(message, ()=>{
            console.log("Send Message:", message);
        }, (error)=>{
            console.error(error);
        })
    }

    return (
        <div>
            <form onSubmit={sendInput}>
                <input type="text" name="message" required autoComplete='off' />
                <button type="submit">Send</button>
            </form>
        </div>
    )
}

export default ChatInput;    