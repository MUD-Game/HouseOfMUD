/**
 * @module AvailableCharactersLi
 * @category React Components
 * @description List item for the AvailableCharacters-List
 * @props {@linkcode AvailableCharactersLiProps}
 */


import React from 'react';
import { CharactersResponseData, LoginRequest } from '@supervisor/api';
import { supervisor } from 'src/services/supervisor';
import { useAuth } from '../../hooks/useAuth';
import { useGame } from '../../hooks/useGame';
import { useNavigate } from 'react-router-dom';
import { Row } from 'react-bootstrap';
import { useMudConsole } from 'src/hooks/useMudConsole';
import { Play, PlayCircle, Trash } from 'react-bootstrap-icons';

export interface AvailableCharactersLiProps {
    character: CharactersResponseData
}

const AvailableCharactersLi: React.FC<AvailableCharactersLiProps> = ({ character }) => {

    const { user, token } = useAuth();
    const { dungeon, setCharacterID, setVerifyToken, setCharacter } = useGame();
    const navigate = useNavigate();

    const homosole = useMudConsole();

    const onDelete = () => {
        supervisor.deleteCharacter(dungeon, { user, character: character.character }, (data) => {
            navigate("/characters");
        }, (error) => {
            homosole.error(error.error);

        })
    }

    const onJoin = () => {

        let body: LoginRequest = {
            user: user,
            character: character.character,
        }

        supervisor.login(dungeon, body, (data) => {
            setCharacterID(character.character);
            setCharacter(character.name);
            setVerifyToken(data.verifyToken);
            navigate("/dungeon-master");
        }, (error) => {
            // TODO: handle error in a better way
            homosole.error(error.error);
        });
    }

    return (
        <Row className="character-item align-items-center py-2">
            <div className="col">
                <b>{character.name}</b>
            </div>
            <div className="col">
                {character.class}            
            </div>
            <div className="col">
                GeschlechtX{/* {character.gender} */}
            </div>
            <div className="col">        
                SpeziesY{/* {character.species} */}
            </div>
            <div className="col text-end">
                <Trash size={30} id="deleteIcon" className="mx-1" onClick={onDelete} style={{ cursor: "pointer", color: "red" }} />
                <Play size={45} id="joinIcon" className="mx-1" onClick={onJoin} style={{ cursor: "pointer", color: "green" }} />
            </div>        
        </Row>
    )
}

export default AvailableCharactersLi;