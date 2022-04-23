/**
 * @module useRabbitMQ
 * @category React Hooks
 */

import React from 'react';

import { RabbitMQContext } from 'src/contexts/RabbitMQContext';

export function useRabbitMQ() {
    return React.useContext(RabbitMQContext);
}
