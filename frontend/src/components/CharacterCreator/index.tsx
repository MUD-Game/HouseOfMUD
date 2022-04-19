import React from 'react'
import { useEffect } from 'react'
import { useGame } from 'src/hooks/useGame'
import Lama from '../../assets/Lama.png'
import {Character, supervisor } from 'src/services/supervisor';
import { useAuth } from 'src/hooks/useAuth';
type CharacterCreatorProps = {}

const CharacterCreator: React.FC<CharacterCreatorProps> = (props) => {

    let game = useGame();
    let auth = useAuth();
    let dungeon = game.dungeon;
    let user = auth.user;
    const [character, setCharacter] = React.useState<Character[]>([] as Character[]);
    useEffect(() => {
        // supervisor.getAllCharacters(user, dungeon, setCharacter, console.log);
        console.log("dd");
    }, []);
    
    return (
        <div>
            <img id="lama" src={Lama} alt="Lama" />
        </div>
    )
}

export default CharacterCreator;    