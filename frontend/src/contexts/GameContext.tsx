import React from 'react';

type GameContextType = {
  dungeon: string, // DungeonID
  setDungeon: (dungeonId: string) => void,
  character: string, // CharacterID
  setCharacter: (characterId: string) => void,
  characterID: string, // CharacterID
  setCharacterID: (characterId: string) => void,
  verifyToken: string, // CharacterID
  setVerifyToken: (characterId: string) => void,
  isAbleToJoinGame: ()=>boolean;
  isAbleToPickCharacter: ()=>boolean;
}

let GameContext = React.createContext<GameContextType>({} as GameContextType);

function GameProvider({ children }: { children: React.ReactNode }) {
  let [dungeon, setDungeon] = React.useState<string>('');
  let [character, setCharacter] = React.useState<string>('');
  let [characterID, setCharacterID] = React.useState<string>('');
  let [verifyToken, setVerifyToken] = React.useState<string>('');


  const isAbleToPickCharacter = ()=>{
    return (dungeon !== '')
  }

  const isAbleToJoinGame = ()=>{
      console.log(character ,characterID, verifyToken)
    return (isAbleToPickCharacter() && character !== '' && characterID !== '' && verifyToken !== '')
  }

  

  let value = { isAbleToPickCharacter, isAbleToJoinGame, dungeon, setDungeon, character, setCharacter, characterID, setCharacterID, verifyToken, setVerifyToken };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
export { GameContext, GameProvider };