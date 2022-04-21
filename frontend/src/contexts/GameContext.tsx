import React from 'react';

type GameContextType = {
  dungeon: string, // DungeonID
  setDungeon: (dungeonId: string) => void,
  character: string, // CharacterID
  setCharacter: (characterId: string) => void,
  characterID: string, // CharacterID
  setCharacterID: (characterId: string) => void,
}

let GameContext = React.createContext<GameContextType>({} as GameContextType);

function GameProvider({ children }: { children: React.ReactNode }) {
  let [dungeon, setDungeon] = React.useState<string>('');
  let [character, setCharacter] = React.useState<string>('');
  let [characterID, setCharacterID] = React.useState<string>('');


  let value = { dungeon, setDungeon, character, setCharacter, characterID, setCharacterID };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
export { GameContext, GameProvider };