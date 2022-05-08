/**
 * @module AvailableCharactersLi
 * @category React Components
 * @description List item for the AvailableCharacters-List
 * @hooks {@linkcode useAuth}, {@linkcode useGame}
 * @props {@linkcode AvailableCharactersLiProps}
 */


import React from 'react';
import { CharactersResponseData, LoginRequest } from '@supervisor/api';
import { supervisor } from 'src/services/supervisor';
import { useGame } from '../../hooks/useGame';
import { useNavigate } from 'react-router-dom';
import { Row } from 'react-bootstrap';
import { Play, Trash } from 'react-bootstrap-icons';
import { SendsMessagesProps } from '../../types/misc';

export interface AvailableCharactersLiProps {
    character: CharactersResponseData;
    characterAttributes:{characterClass: string, characterGender: string, characterSpecies: string};

    fetchCharacters: () => void;
}

const AvailableCharactersLi: React.FC<AvailableCharactersLiProps & SendsMessagesProps> = ({ character, characterAttributes, fetchCharacters, messageCallback: sendMessage }) => {

    const navigate = useNavigate();
    const { dungeon, setVerifyToken, setCharacter } = useGame();

    const onDelete = () => {
        supervisor.deleteCharacter(dungeon, { _id: character._id }, (data) => {
            fetchCharacters();
        }, (error) => {
            sendMessage(error.error);
        })
    }

    const onJoin = () => {

        let body: LoginRequest = {
            character: character.name,
        }

        supervisor.login(dungeon, body, (data) => {
            setCharacter(character.name);
            setVerifyToken(data.verifyToken);
            navigate("/game");
        }, (error) => {
            sendMessage(error.error);
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