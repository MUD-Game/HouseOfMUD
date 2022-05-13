import React from 'react';

type GameContextType = {
  dungeon: string, // DungeonID
  setDungeon: (dungeonId: string) => void,
  dungeonName: string, // DungeonID
  setDungeonName: (dungeonId: string) => void,
  character: string, // Character
  setCharacter: (character: string) => void,
  verifyToken: string, // Character
  setVerifyToken: (character: string) => void,
  isAbleToJoinGame: () => boolean;
  isAbleToPickCharacter: () => boolean;
}

let GameContext = React.createContext<GameContextType>({} as GameContextType);

function GameProvider({ children }: { children: React.ReactNode }) {
  let [dungeon, setDungeon] = React.useState<string>('');
  let [dungeonName, setDungeonName] = React.useState<string>('');
  let [character, setCharacter] = React.useState<string>('');
  let [verifyToken, setVerifyToken] = React.useState<string>('');


  const isAbleToPickCharacter = () => {
    return (dungeon !== '')
  }

  const isAbleToJoinGame = () => {
    return (isAbleToPickCharacter() && character !== '' && verifyToken !== '')
  }
  
  const isAbleToBeDungeonMaster = () => {
    return (dungeon !== "" && verifyToken !== "");
  }



  let value = { isAbleToPickCharacter, isAbleToJoinGame, dungeon, setDungeon, character, setCharacter, verifyToken, setVerifyToken, dungeonName, setDungeonName };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
export { GameContext, GameProvider };