/**
 * @module ChatInput
 * @category React Components
 * @description ChatInput Component to get the input from the user
 * @props {@linkcode ChatInputProps}
 */

import React, { FormEvent } from 'react'
import { Row } from 'react-bootstrap';
import { Send } from 'react-bootstrap-icons';
import { useRabbitMQ } from "src/hooks/useRabbitMQ";
import { SendsMessagesProps } from '../../../types/misc';
export interface ChatInputProps { }

const ChatInput: React.FC<ChatInputProps & SendsMessagesProps> = ({ messageCallback}) => {

    
    const { sendCharacterMessage: sendMessage } = useRabbitMQ();

    const [input, setInput] = React.useState("");

    const sendInput = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        sendMessage(input, () => {
            // On Success
        }, (error) => {
            messageCallback("rabbitmq.send");
        })
        setInput("");
    }

    return (
        <form className="chat-input-wrap " onSubmit={sendInput}>
            <Row className="h-100 mt-3">
                <div className="col-10">
                    <input type="text" name="message" id="chat-input" className="input-standard drawn-border" required autoComplete='off' value={input} onChange={event => setInput(event.target.value)} />
                </div>
                <div className="col-2">
                    <button className="btn w-100 drawn-border btn-green" type="submit">
                        <Send/>
                    </button>
                </div>
            </Row>
        </form>
    )
}

export default ChatInput;    