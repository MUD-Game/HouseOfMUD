/**
 * @module ChatQueue
 * @category React Components
 * @description ChatQueue which shows the enqueued commands
 * @props {@linkcode ChatQueueProps}
 */

import React from 'react'
import { Row } from 'react-bootstrap';
import { Send } from 'react-bootstrap-icons';
export interface ChatQueueProps {
    commandQueue: string[];
    onSendQueue:VoidFunction;
}

const ChatQueue: React.FC<ChatQueueProps> = ({ commandQueue, onSendQueue }) => {
    return (
        <div className="chatqueue drawn-border mb-2 p-2 ps-0">
            <div className="chatqueue-wrap h-100 pe-1">
                <ul className='ps-4'>
                    {commandQueue.map((command, index) =>
                        <li key={index}>{ command }</li>
                    )}
                </ul>
                { commandQueue !== [] ?
                <div className="p-2">
                    <button className='btn drawn-border btn-green w-100' onClick={ onSendQueue }>
                        <Send />
                    </button>
                </div>
                : "" }
            </div>
        </div>
    )
}

export default ChatQueue;    