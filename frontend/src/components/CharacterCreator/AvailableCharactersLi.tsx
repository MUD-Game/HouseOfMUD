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
    character: CharactersResponseData;
    characterAttributes:{characterClass: string, characterGender: string, characterSpecies: string};
    fetchCharacters: () => void;
}

const AvailableCharactersLi: React.FC<AvailableCharactersLiProps> = ({ character, characterAttributes, fetchCharacters }) => {

    const { user, token } = useAuth();
    const { dungeon, setVerifyToken, setCharacter } = useGame();
    const navigate = useNavigate();

    const homosole = useMudConsole();

    const onDelete = () => {
        supervisor.deleteCharacter(dungeon, { _id: character._id }, (data) => {
            fetchCharacters();
        }, (error) => {
            homosole.error(error.error);
        })
    }

    const onJoin = () => {

        let body: LoginRequest = {
            character: character.id,
        }

        supervisor.login(dungeon, body, (data) => {
            setCharacter(character.name);
            setVerifyToken(data.verifyToken);
            navigate("/game");
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
                {characterAttributes.characterClass}            
            </div>
            <div className="col">
                {characterAttributes.characterGender}
            </div>
            <div className="col">        
                {characterAttributes.characterSpecies}
            </div>
            <div className="col text-end">
                <Trash size={30} id="deleteIcon" className="mx-1" onClick={onDelete} style={{ cursor: "pointer", color: "red" }} />
                <Play size={45} id="joinIcon" className="mx-1" onClick={onJoin} style={{ cursor: "pointer", color: "green" }} />
            </div>        
        </Row>
    )
}

export default AvailableCharactersLi;