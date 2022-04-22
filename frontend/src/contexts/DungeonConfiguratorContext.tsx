import React from 'react';
import { MudActionElement, MudDungeon, MudNpc, MudRoom } from 'src/types/dungeon'
import { MudCharacterSpecies, MudCharacterGender, MudCharacterClass } from '../types/dungeon';
import { validator } from 'src/utils/validator';

export interface DungeonConfiguratorContextMethods {
  initializeDungeon: (dungeon?: MudDungeon) => void;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setMaxPlayers: (maxPlayers: number) => void;
  setNpcs: (npcs: MudNpc[]) => void;

  handleOnBlurInput: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export interface DungeonConfiguratorContextType extends MudDungeon, DungeonConfiguratorContextMethods {
  npcs: MudNpc[];
}

let DungeonConfiguratorContext = React.createContext<DungeonConfiguratorContextType>({} as DungeonConfiguratorContextType);

function DungeonConfiguratorProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [maxPlayers, setMaxPlayers] = React.useState<number>(2);
  const [species, setSpecies] = React.useState<MudCharacterSpecies[]>([]);
  const [genders, setGenders] = React.useState<MudCharacterGender[]>([]);
  const [classes, setClasses] = React.useState<MudCharacterClass[]>([]);
  const [rooms, setRooms] = React.useState<MudRoom[]>([]);
  const [actions, setActions] = React.useState<MudActionElement[]>([]);
  const [npcs, setNpcs] = React.useState<MudNpc[]>([]);
  const initializeDungeon = (dungeon?: MudDungeon) => {
    if (dungeon) {
      setName(dungeon.name);
      setDescription(dungeon.description);
      setMaxPlayers(dungeon.maxPlayers);
      setSpecies(dungeon.species);
      setGenders(dungeon.genders);
      setClasses(dungeon.classes);
      setRooms(dungeon.rooms);
      setActions(dungeon.actions);
    } else {
      setName("");
      setDescription("");
      setMaxPlayers(0);
      setSpecies([]);
      setGenders([]);
      setClasses([]);
      setRooms([]);
      setActions([]);
    }
  }



  const handleOnBlurInput = (event: React.FocusEvent<HTMLInputElement>) => {
    // REFACTOR: make it prettier and more readable
    let target = event.target;
    const value = target.value;
    switch (target.name) {
      case "name":
        validator.string(target, setName);
        break;
      case "description":
        validator.string(target, setDescription);
        break;
      case "maxPlayers":
        let maxPlayers = validator.maxPlayers(value);
        event.target.value = maxPlayers.toString();
        setMaxPlayers(maxPlayers);
        break;
      case "species":
        validator.string(target, () => {
          setCharacterDecorator(value, setSpecies);
        })
        break;
      case "genders":
        validator.string(target, () => {
          setCharacterDecorator(value, setGenders);
        })
        break;
      default:
        break;
    }
  }

  const setCharacterDecorator = <T,>(decorator: string, setData: (data: T[]) => void) => {
    let data: T[] = [];
    let commaArray = decorator.split(",");
    commaArray.forEach((element, index) => {
      if (element !== '') {
        data.push({
          id: index,
          name: element.trim(),
          description: element.trim() //IMPORTANT: description is not set here
        } as unknown as T);
      }
    });
    setData(data);
  }


  let methods: DungeonConfiguratorContextMethods = {
    initializeDungeon, setName, setDescription, setMaxPlayers, setNpcs, handleOnBlurInput
  }

  let fields: MudDungeon = {
    name,
    maxPlayers,
    species,
    genders,
    classes,
    rooms,
    actions,
    description
  } as MudDungeon;


  return <DungeonConfiguratorContext.Provider value={{ ...fields, ...methods, npcs }}>{children}</DungeonConfiguratorContext.Provider>;
}
export { DungeonConfiguratorContext, DungeonConfiguratorProvider };