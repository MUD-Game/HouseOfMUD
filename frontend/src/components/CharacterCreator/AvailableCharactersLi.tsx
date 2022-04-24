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

export interface AvailableCharactersLiProps {
    character: CharactersResponseData
}

const AvailableCharactersLi: React.FC<AvailableCharactersLiProps> = ({ character }) => {

    const { user, token } = useAuth();
    const { dungeon, setCharacterID, setVerifyToken, setCharacter } = useGame();
    const navigate = useNavigate();

    const onDelete = () => {
        supervisor.deleteCharacter(dungeon, { user, authToken: token, character: character.character }, (data) => {
            navigate("/characters");
        }, (error) => {
            // TODO: handle error in a better way
            alert(error);
        })
    }

    const onJoin = () => {

        let body: LoginRequest = {
            user: user,
            character: character.character,
            authToken: token
        }

        supervisor.login(dungeon, body, (data) => {
            setCharacterID(character.character);
            setCharacter(character.name);
            setVerifyToken(data.verifyToken);
            navigate("/game");
        }, (error) => {
            // TODO: handle error in a better way
            alert(error);
        });
    }

    return (
        <Row className="character-list align-items-center py-2">
            <div className="col-2">
                <b>{character.name}</b>
            </div>
            <div className="col-2">
                {character.class}            
            </div>
            <div className="col-2">
                GeschlechtX{/* {character.gender} */}
            </div>
            <div className="col-2">        
                SpeziesY{/* {character.species} */}
            </div>
            <div className="col-2">                            
                <button className="btn w-100 drawn-border btn-red" onClick={onDelete}>Löschen</button>
            </div>
            <div className="col-2">         
                <button className="btn w-100 drawn-border btn-green" onClick={onJoin}>Beitreten</button>    
            </div>           
        </Row>
    )
}

export default AvailableCharactersLi;