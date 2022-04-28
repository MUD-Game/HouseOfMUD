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
import { Row } from 'react-bootstrap';
import {  CharactersResponseData } from '@supervisor/api';
import AvailableCharactersLi from './AvailableCharactersLi';

export interface AvailableCharactersProps {
    characters: CharactersResponseData[];
}

const AvailableCharacters: React.FC<AvailableCharactersProps> = ({ characters }) => {
    return (
        <>
            <p className="headline">Charakter auswählen</p>
            <Row className="py-2">
                <div className="col">
                    <b><u>Name</u></b>
                </div>
                <div className="col">
                    <b><u>Klasse</u></b>         
                </div>
                <div className="col">
                    <b><u>Geschlecht</u></b>      
                </div>
                <div className="col">  
                    <b><u>Spezies</u></b>
                </div>
                <div className="col"></div>           
            </Row>
            {characters.map((character, index) => {
                return <AvailableCharactersLi character={character} key={index} />
            }
            )}
        </>
    )
}

export default AvailableCharacters;