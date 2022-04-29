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
import { useTranslation } from 'react-i18next';

export interface AvailableCharactersProps {
    characters: CharactersResponseData[];
}

const AvailableCharacters: React.FC<AvailableCharactersProps> = ({ characters }) => {

    const {t} = useTranslation();

    return (
        <>
            <p className="headline">{t("character_creator.pick_character")}</p>
            <Row className="py-2">
                <div className="col">
                    <b><u>{t("dungeon_keys.name")}</u></b>
                </div>
                <div className="col">
                    <b><u>{t("dungeon_keys.class")}</u></b>
                </div>
                <div className="col">
                    <b><u>{t("dungeon_keys.gender")}</u></b>
                </div>
                <div className="col">  
                    <b><u>{t("dungeon_keys.species")}</u></b>
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