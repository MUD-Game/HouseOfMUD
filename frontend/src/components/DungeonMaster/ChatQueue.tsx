/**
 * @module ChatQueue
 * @category React Components
 * @description ChatQueue which shows the enqueued commands
 * @props {@linkcode ChatQueueProps}
 */

import React from 'react'
import { Send } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
export interface ChatQueueProps {
    commandQueue: string[];
    onSendQueue:VoidFunction;
}

const ChatQueue: React.FC<ChatQueueProps> = ({ commandQueue, onSendQueue }) => {
    const {t} = useTranslation();

    return (
        <div className="chatqueue drawn-border mb-2 p-2 ps-0">
            <div className="chatqueue-wrap h-100 p-1 pt-0">
                <p className='m-0'><u>{t("game.queue")}</u></p>
                <ul className='ps-4'>
                    {commandQueue.map((command, index) =>
                        <li key={index}>{ command }</li>
                    )}
                </ul>
                { commandQueue.length !== 0 ?
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