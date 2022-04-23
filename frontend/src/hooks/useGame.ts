import React from 'react';

import { GameContext } from 'src/contexts/GameContext';


export function useGame() {
    return React.useContext(GameContext);
}