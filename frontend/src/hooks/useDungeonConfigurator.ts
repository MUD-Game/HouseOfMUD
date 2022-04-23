/**
 * @module useDungeonConfigurator
 * @category React Hooks
 */

import React from 'react';

import { DungeonConfiguratorContext } from 'src/contexts/DungeonConfiguratorContext';

export function useDungeonConfigurator() {
    return React.useContext(DungeonConfiguratorContext);
}
