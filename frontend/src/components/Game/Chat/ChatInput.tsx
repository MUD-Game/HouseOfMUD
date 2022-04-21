/**
 * @module ChatInput
 * @category React Components
 * @description ChatInput Component to get the input from the user
 * @children {@linkcode ChatInputOutput} {@linkcode ChatInputInput}
 * @props {@linkcode ChatInputProps}
 */

import React, { FormEvent } from 'react'
export interface ChatInputProps { }

const ChatInput: React.FC<ChatInputProps> = ({ }) => {

    const sendInput = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        let formData = new FormData(evt.currentTarget);
        let message = formData.get('message');
        console.log(message);
        //TODO: send message to RabbitMQ
    }

    return (
        <div>
            <form onSubmit={sendInput}>
                <input type="text" name="message" autoComplete='off' />
                <button type="submit">Send</button>
            </form>
        </div>
    )
}

export default ChatInput;    