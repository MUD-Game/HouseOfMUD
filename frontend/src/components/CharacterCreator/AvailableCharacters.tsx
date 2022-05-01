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
import {  CharactersResponseData, GetCharacterAttributesResponse } from '@supervisor/api';
import AvailableCharactersLi from './AvailableCharactersLi';
import { useTranslation } from 'react-i18next';

export interface AvailableCharactersProps {
    characters: CharactersResponseData[];
    characterAttributes: GetCharacterAttributesResponse;
    fetchCharacters: ()=>void;
}

const AvailableCharacters: React.FC<AvailableCharactersProps> = ({ characters, characterAttributes, fetchCharacters }) => {

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
                let resolvedCharacterAttributes = {
                    characterClass: characterAttributes?.classes?.find(characterClass => characterClass.id === character.characterClass)?.name || "undefined",
                    characterGender: characterAttributes?.genders?.find(characterGender => characterGender.id === character.characterGender)?.name || "undefined",
                    characterSpecies: characterAttributes?.species?.find(characterSpecies => characterSpecies.id === character.characterSpecies)?.name || "undefined",
                }
                // Resolve right character attributes
                return <AvailableCharactersLi character={character} characterAttributes={resolvedCharacterAttributes} key={index} fetchCharacters={fetchCharacters} />
            }
            )}
        </>
    )
}

export default AvailableCharacters;