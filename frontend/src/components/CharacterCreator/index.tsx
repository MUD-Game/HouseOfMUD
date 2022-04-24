/**
 * @module CharacterCreator
 * @category React Components
 * @description Component to handle Character-Creation and to join a dungeon.
 * @children {@linkcode CreateNewCharacter}, {@linkcode AvailableCharacters}
 * @props {@linkcode CharacterCreatorProps}
 * ```jsx
 * <>
 *  <CreateNewCharacter />
 *  <AvailableCharacters />
 * </>
 * ```
 */

import React from 'react'
import { useEffect } from 'react'
import { useGame } from 'src/hooks/useGame'
import { supervisor } from 'src/services/supervisor';
import { useAuth } from 'src/hooks/useAuth';
import { GetCharactersRequest, GetCharacterAttributesResponse } from '@supervisor/api';
import CreateNewCharacter from './CreateNewCharacter';
import AvailableCharacters from './AvailableCharacters';
import { Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useMudConsole } from '../../hooks/useMudConsole';
import { CharactersResponseData } from '@supervisor/api';
export interface CharacterCreatorProps { }


const CharacterCreator: React.FC<CharacterCreatorProps> = (props) => {

    const game = useGame();
    const auth = useAuth();
    const homsole = useMudConsole();
    let dungeon = game.dungeon;
    let user = auth.user;
    const [characters, setCharacters] = React.useState<CharactersResponseData[]>([] as CharactersResponseData[]);
    const [dungeonData, setDungeonData] = React.useState<GetCharacterAttributesResponse>({} as GetCharacterAttributesResponse);
    useEffect(() => {
        if (!dungeon) return;
        let requestBody: GetCharactersRequest = {
            user: user,
        }
        supervisor.getCharacterAttributes(dungeon, requestBody, setDungeonData, homsole.supervisorerror);
        supervisor.getCharacters(dungeon, requestBody, setCharacters, homsole.supervisorerror);
    }, []);


    const fetchNewCharacters = () => {
        let requestBody: GetCharactersRequest = {
            user: user,
        }
        supervisor.getCharacters(dungeon, requestBody, setCharacters, homsole.supervisorerror);
    }

    if (!game.isAbleToPickCharacter()) return <Navigate to="/dashboard" />;
    return (
        <Container className="mb-5">
            <h2>{dungeon}</h2>
            {Object.keys(dungeonData).length !== 0 ? <CreateNewCharacter onCreate={fetchNewCharacters} {...dungeonData} /> : null}
            <br /><hr /><br />
            {characters !== [] ? <AvailableCharacters characters={characters} /> : null}
        </Container>
    )
}

export default CharacterCreator;    