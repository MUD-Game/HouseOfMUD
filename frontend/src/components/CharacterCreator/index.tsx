import React from 'react'
import { useEffect } from 'react'
import { useGame } from 'src/hooks/useGame'
import Lama from '../../assets/Lama.png'
import { supervisor } from 'src/services/supervisor';
import { useAuth } from 'src/hooks/useAuth';
import { GetCharactersRequest, GetCharactersResponse } from 'src/types/supervisor';
type CharacterCreatorProps = {}

const CharacterCreator: React.FC<CharacterCreatorProps> = (props) => {

    let game = useGame();
    let auth = useAuth();
    let dungeon = game.dungeon;
    let user = auth.user;
    const [character, setCharacter] = React.useState<GetCharactersResponse>([] as GetCharactersResponse);
    useEffect(() => {
        let requestBody: GetCharactersRequest = {
            user: user,
            auth: auth.token,
            dungeon: dungeon
        }
        supervisor.getCharacters(requestBody, setCharacter, console.log);
    }, []);

    return (
        <div>
            <img id="lama" src={Lama} alt="Lama" />
        </div>
    )
}

export default CharacterCreator;    