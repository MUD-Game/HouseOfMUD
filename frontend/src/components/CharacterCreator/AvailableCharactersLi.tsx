import React from 'react';
import { GetCharactersResponseData, LoginRequest } from 'src/types/supervisor';
import { supervisor } from 'src/services/supervisor';
import { useAuth } from '../../hooks/useAuth';
import { useGame } from '../../hooks/useGame';
import { useNavigate } from 'react-router-dom';

interface AvailableCharactersLiProps {
    character: GetCharactersResponseData
}

const AvailableCharactersLi: React.FC<AvailableCharactersLiProps> = ({ character }) => {

    const { user, token } = useAuth();
    const { dungeon, setCharacterID } = useGame();
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
            navigate("/game");
        }, (error) => {
            // TODO: handle error in a better way
            alert(error);
        });
    }

    return (
        <div>
            <p>{character.name} | {character.class}</p>
            <button onClick={onJoin}>Join</button>
            <button onClick={onDelete}>Delete</button>
        </div>
    )
}

export default AvailableCharactersLi;