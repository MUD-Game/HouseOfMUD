/**
 * @module AvailableCharacters
 * @category React Components
 * @description Lists all available characters to a user.
 * @children {@linkcode AvailableCharactersLi}
 * @props {@linkcode AvailableCharactersProps}
 * ```jsx
 * <>
 *  <AvailableCharactersLi/>[]
 * </>
 * ```
 */

import React from 'react';
import { GetCharactersResponse, GetCharacterAttributesResponse } from 'src/types/supervisor';
import AvailableCharactersLi from './AvailableCharactersLi';

export interface AvailableCharactersProps {
    characters: GetCharactersResponse
}

const AvailableCharacters: React.FC<AvailableCharactersProps> = ({ characters }) => {

    return (
        <div>
            <h1>Charakter auswählen</h1>
            {characters.map((character, index) => {
                return <AvailableCharactersLi character={character} key={index} />
            }
            )}
        </div>
    )
}

export default AvailableCharacters;