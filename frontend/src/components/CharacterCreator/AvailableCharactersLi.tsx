import React from 'react';
import { GetCharactersResponse, GetCharactersResponseData } from 'src/types/supervisor';

interface AvailableCharactersLiProps {
    character: GetCharactersResponseData
}

const AvailableCharactersLi: React.FC<AvailableCharactersLiProps> = ({ character }) => {

    const onJoin = () => {
        console.log(character.character);
    }

    return (
        <div>
            <p>{character.name} | {character.class}</p>
            <button onClick={onJoin}>Join</button>
        </div>
    )
}

export default AvailableCharactersLi;