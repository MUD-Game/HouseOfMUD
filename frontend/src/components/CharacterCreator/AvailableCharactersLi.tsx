import React from 'react';
import { CreateCharacterRequest, CreateCharacterResponse, GetCharactersResponseData } from 'src/types/supervisor';
import { supervisor } from 'src/services/supervisor';
import { useAuth } from '../../hooks/useAuth';
import { LoginRequest } from '../../types/supervisor';
import { useGame } from '../../hooks/useGame';

interface AvailableCharactersLiProps {
    character: GetCharactersResponseData
}

const AvailableCharactersLi: React.FC<AvailableCharactersLiProps> = ({ character }) => {

    const { user, token } = useAuth();
    const onJoin = () => {

        let body: LoginRequest = {
            user: user,
            character: character.character,
            authToken: token
        }

        // supervisor.login()
    }

    return (
        <div>
            <p>{character.name} | {character.class}</p>
            <button onClick={onJoin}>Join</button>
        </div>
    )
}

export default AvailableCharactersLi;