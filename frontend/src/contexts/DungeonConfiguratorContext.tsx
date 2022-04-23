import React from 'react';
import { MudActionElement, MudDungeon, MudNpc, MudRoom } from 'src/types/dungeon'
import { MudCharacterSpecies, MudCharacterGender, MudCharacterClass } from '../types/dungeon';
import { validator } from 'src/utils/validator';
import AddClassModal from 'src/components/Modals/CharacterClass/AddClassModal';
import ConfirmationDialog from 'src/components/Modals/BasicModals/ConfirmationDialog';

export interface DungeonConfiguratorContextMethods {
  initializeDungeon: (dungeon?: MudDungeon) => void;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setMaxPlayers: (maxPlayers: number) => void;

  handleOnBlurInput: (event: React.FocusEvent<HTMLInputElement>) => void;
  addClass: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  editClass: (key: number) => void;
  deleteClass: (key: number) => void;
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

  const [editData, setEditData] = React.useState<any>();
  const [showCharacterClassModal, setShowCharacterClassModal] = React.useState<boolean>(false);
  const [characterClassKey, setCharacterClassKey] = React.useState<{ selected: number, nextKey: number }>({ selected: 0, nextKey: 0 });
  const [showConfirmationDialog, setShowConfirmationDialog] = React.useState<{ show: boolean, message: string, title: string, onConfirm: () => void }>({ show: false, message: "", title: "", onConfirm: () => { } });
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

  const showConfirmation = (title: string, message: string, onConfirm: () => void) => {
    setShowConfirmationDialog({
      show: true, message, title, onConfirm: () => {
        onConfirm();
        setShowConfirmationDialog({ show: false, message: "", title: "", onConfirm: () => { } });
      }
    });
  }

  const mockupClass: MudCharacterClass = {
    name: "Mock-Name",
    description: "Mock-Description"
  } as MudCharacterClass;

  const addClass = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setShowCharacterClassModal(true);
    // setClasses([...classes, mockupClass]);
  }
  const editClass = (key: number) => {
    setEditData(classes[key]);
    setCharacterClassKey({ selected: key, nextKey: characterClassKey.nextKey });
    setShowCharacterClassModal(true);
  }
  const deleteClass = (key: number) => {
    showConfirmation("Delete Class", "Are you sure you want to delete this class?", () => {
      let index = classes.findIndex(c => c.id === key + "");
      let newClasses = classes;
      newClasses.splice(index, 1);
      setClasses(newClasses);
    });
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
    initializeDungeon, setName, setDescription, setMaxPlayers, handleOnBlurInput, addClass, editClass, deleteClass
  }

  let fields: MudDungeon = {
    name,
    maxPlayers,
    species,
    genders,
    classes,
    rooms,
    actions,
    description,
  } as MudDungeon;


  return <DungeonConfiguratorContext.Provider value={{ ...fields, ...methods, npcs }}>
    <AddClassModal editData={editData as MudCharacterClass} key={characterClassKey.selected} onSendCharacterClass={(cc) => {
      if (characterClassKey.selected === characterClassKey.nextKey) { // if the current key is the same as the next key, it means that the user is creating a new class
        cc.id = characterClassKey.nextKey + "";
        setClasses([...classes, cc]);
        setShowCharacterClassModal(false);
        setCharacterClassKey({ nextKey: characterClassKey.nextKey + 1, selected: characterClassKey.selected + 1 });
      } else {
        // User is editing
        cc.id = characterClassKey.selected + "";
        // Set the key to a new id
        setCharacterClassKey({ ...characterClassKey, selected: characterClassKey.nextKey });
        let temp = classes;
        let index = temp.findIndex((c) => c.id === cc.id);
        temp[index] = cc;
        setClasses(temp);
      }
    }} show={showCharacterClassModal} onHide={() => {
      setShowCharacterClassModal(false);
    }} />

    <ConfirmationDialog onHide={() => { }} {...showConfirmationDialog} />
    {children}
  </DungeonConfiguratorContext.Provider>;
}
export { DungeonConfiguratorContext, DungeonConfiguratorProvider };