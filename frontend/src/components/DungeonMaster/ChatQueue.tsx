/**
 * @module ChatQueue
 * @category React Components
 * @description ChatQueue which shows the enqueued commands
 * @props {@linkcode ChatQueueProps}
 */

import React from 'react'
export interface ChatQueueProps {
    commands: any;
}

const ChatQueue: React.FC<ChatQueueProps> = ({ commands }) => {
    return (
        <div className="chatqueue drawn-border mb-2">
            <p className='text-center pt-5'>Chat-Queue</p>
        </div>
    )
}

export default ChatQueue;    