import React from 'react';

import { ConsoleContext } from 'src/contexts/ConsoleContext';

export function useMudConsole() {
    return React.useContext(ConsoleContext);
}
