/**
 * @module useAuth
 * @category React Hooks
 */

import React from 'react';

import { AuthContext } from 'src/contexts/AuthContext';

export function useAuth() {
    return React.useContext(AuthContext);
}
