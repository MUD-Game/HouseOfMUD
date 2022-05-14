/**
 * @module ChatQueue
 * @category React Components
 * @description ChatQueue which shows the enqueued commands
 * @props {@linkcode ChatQueueProps}
 */

import React from 'react'
import { Row } from 'react-bootstrap';
import { Send, Trash } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
export interface ChatQueueProps {
    commandQueue: string[];
    setCommandQueue: any;
    onSendQueue: VoidFunction;
}

const ChatQueue: React.FC<ChatQueueProps> = ({ commandQueue, onSendQueue, setCommandQueue }) => {
    const { t } = useTranslation();

    const deleteQueue = () => {
        setCommandQueue ([]);
    }

    return (
        <div className="chatqueue drawn-border mb-2 p-2">
            <div className="chatqueue-wrap h-100 p-1 pt-0">
                <p className='m-0'><u>{t("game.queue")}</u></p>
                {commandQueue.length !== 0 ?
                <Row className="my-2">
                    <div className="col-6">
                        <button className='btn drawn-border btn-red w-100' onClick={deleteQueue}><Trash /></button>
                    </div>
                    <div className="col-6">
                        <button className='btn drawn-border btn-green w-100' onClick={onSendQueue}><Send /></button>
                    </div>
                </Row>
                    : ""}
                <ul className='ps-4'>
                    {commandQueue.map((command, index) =>
                        <li key={index}>{command}</li>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default ChatQueue;    