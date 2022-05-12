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
import { GetCharacterAttributesResponse } from '@supervisor/api';
import CreateNewCharacter from './CreateNewCharacter';
import AvailableCharacters from './AvailableCharacters';
import { Navigate, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { CharactersResponseData } from '@supervisor/api';
import Alert from '../Custom/Alert';
import { ChevronLeft } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
export interface CharacterCreatorProps { }


const CharacterCreator: React.FC<CharacterCreatorProps> = (props) => {

    const { dungeon, dungeonName, isAbleToPickCharacter } = useGame();
    const navigate = useNavigate();
    const [error, setError] = React.useState<string>("");
    const {t} = useTranslation();
    const [characters, setCharacters] = React.useState<CharactersResponseData[]>([] as CharactersResponseData[]);
    const [dungeonData, setDungeonData] = React.useState<GetCharacterAttributesResponse>({} as GetCharacterAttributesResponse);
    useEffect(() => {
        if(dungeon){
            supervisor.getCharacterAttributes(dungeon, {}, setDungeonData, error => setError(error.error));
            supervisor.getCharacters(dungeon, {}, setCharacters, error => setError(error.error));
        }
    }, [dungeon]);


    const fetchNewCharacters = () => {
        supervisor.getCharacters(dungeon, {}, setCharacters, error => setError(error.error));
    }

    if (!isAbleToPickCharacter()) return <Navigate to="/dashboard" />;
    return (
        <Container className="mb-5">
            <div id="backbutton" onClick={()=>navigate("/")} ><ChevronLeft size={30} /><span>{t("common.back")}</span></div>

            <h2>{dungeonName}</h2>
            <Alert message={error} setMessage={setError} type="error" />
            {Object.keys(dungeonData).length !== 0 ? <CreateNewCharacter messageCallback={setError} onCreate={fetchNewCharacters} {...dungeonData} /> : null}
            <br /><hr /><br />
            {characters !== [] ? <AvailableCharacters messageCallback={setError} characters={characters} fetchCharacters={fetchNewCharacters} characterAttributes={dungeonData}/> : null}
        </Container>
    )
}

export default CharacterCreator;    