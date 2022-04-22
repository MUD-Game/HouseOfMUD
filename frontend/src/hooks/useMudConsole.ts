import React from 'react';

import { ConsoleContext } from 'src/contexts/ConsoleContext';


export function useConsole() {
    return React.useContext(ConsoleContext);
}