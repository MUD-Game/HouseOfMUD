import React from 'react';
import { MudActionElement, MudDungeon, MudItem, MudNpc, MudRoom } from 'src/types/dungeon'
import { MudCharacterClass } from '../types/dungeon';
import { validator } from 'src/utils/validator';
import AddClassModal from 'src/components/Modals/CharacterClass/AddClassModal';
import ConfirmationDialog from 'src/components/Modals/BasicModals/ConfirmationDialog';
import AddItemModal from 'src/components/Modals/CharacterClass/AddItemModal';
import AddActionModal from 'src/components/Modals/CharacterClass/AddActionModal';
import { supervisor } from 'src/services/supervisor';
import { CreateDungeonRequest } from '@supervisor/api';
import { useMudConsole } from 'src/hooks/useMudConsole';
import { useNavigate } from 'react-router-dom';
type Option = string | { [key: string]: any };

export interface DungeonConfiguratorContextMethods {
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setMaxPlayers: (maxPlayers: number) => void;
  setGenders: (genders: Option[]) => void;
  setSpecies: (species: Option[]) => void;

  handleOnBlurInput: (event: React.FocusEvent<HTMLInputElement>) => void;
  addClass: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  editClass: (key: number) => void;
  deleteClass: (key: number) => void;

  addItem: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  editItem: (key: number) => void;
  deleteItem: (key: number) => void;

  addAction: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  editAction: (key: number) => void;
  deleteAction: (key: number) => void;


  save: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export interface DungeonConfiguratorContextType extends MudDungeon, DungeonConfiguratorContextMethods {
  npcs: MudNpc[];
  items: MudItem[];
}

let DungeonConfiguratorContext = React.createContext<DungeonConfiguratorContextType>({} as DungeonConfiguratorContextType);

function DungeonConfiguratorProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [maxPlayers, setMaxPlayers] = React.useState<number>(0);
  const [species, setSpecies] = React.useState<Option>([]);
  const [genders, setGenders] = React.useState<Option>([]);
  const [classes, setClasses] = React.useState<MudCharacterClass[]>([]);
  const [items, setItems] = React.useState<MudItem[]>([]);
  const [actions, setActions] = React.useState<MudActionElement[]>([]);
  const [rooms, setRooms] = React.useState<MudRoom[]>([]);
  const [npcs, setNpcs] = React.useState<MudNpc[]>([]);


  const [editData, setEditData] = React.useState<any>();

  const [showCharacterClassModal, setShowCharacterClassModal] = React.useState<boolean>(false);
  const [characterClassKey, setCharacterClassKey] = React.useState<{ selected: number, nextKey: number }>({ selected: 0, nextKey: 0 });

  const [showAddItemsModal, setShowAddItemsModal] = React.useState<boolean>(false);
  const [itemsKey, setItemsKey] = React.useState<{ selected: number, nextKey: number }>({ selected: 0, nextKey: 0 });

  const [showAddActionsModal, setShowAddActionsModal] = React.useState<boolean>(false);
  const [actionsKey, setActionsKey] = React.useState<{ selected: number, nextKey: number }>({ selected: 0, nextKey: 0 });

  const [showConfirmationDialog, setShowConfirmationDialog] = React.useState<{ show: boolean, message: string, title: string, onConfirm: () => void }>({ show: false, message: "", title: "", onConfirm: () => { } });

  const homosole = useMudConsole();
  const navigate = useNavigate();

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
      show: true, message, title, onConfirm
    });
  }



  // REFACTOR: Redunant code/methods

  const addClass = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setEditData(null);
    setCharacterClassKey({ ...characterClassKey, selected: characterClassKey.nextKey });
    setShowCharacterClassModal(true);
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

  const addItem = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setEditData(null);
    setItemsKey({ ...itemsKey, selected: itemsKey.nextKey })
    setShowAddItemsModal(true);
  }
  const editItem = (key: number) => {
    setEditData(items[key]);
    setItemsKey({ selected: key, nextKey: itemsKey.nextKey });
    setShowAddItemsModal(true);
  }
  const deleteItem = (key: number) => {
    showConfirmation("Delete Item", "Are you sure you want to delete this Item?", () => {
      let index = items.findIndex(c => c.id === key + "");
      let newItems = items;
      newItems.splice(index, 1);
      setItems(newItems);
    });
  }

  const addAction = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setEditData(null);
    setActionsKey({ ...actionsKey, selected: actionsKey.nextKey })
    setShowAddActionsModal(true);

    // setClasses([...classes, mockupClass]);
  }
  const editAction = (key: number) => {
    setEditData(actions[key]);
    setActionsKey({ selected: key, nextKey: actionsKey.nextKey });
    setShowAddActionsModal(true);
  }
  const deleteAction = (key: number) => {
    showConfirmation("Delete Action", "Are you sure you want to delete this Action?", () => {
      let index = actions.findIndex(c => c.id === key + "");
      let newActions = actions;
      newActions.splice(index, 1);
      setActions(newActions);
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

  const validateData = () => {
    let errorString = "";
    let valid = true;
    if (name === "") {
      valid = false;
      errorString += " Name,";
    }
    if (description === "") {
      valid = false;
      errorString += " Beschreibung,";

    }
    if (maxPlayers === 0) {
      valid = false;
      errorString += " Maximale Spieleranzahl,";
    }
    if (species.length === 0) {
      valid = false;
      errorString += " Spezies,";
    }
    if (genders.length === 0) {
      valid = false;
      errorString += " Geschlechter,"
    }
    if (classes.length === 0) {
      valid = false;
      errorString += " Klassen,"
    }



    homosole.warn(`Bitte Fülle alle Felder aus:\n${errorString.substring(0, errorString.length - 1)
      }`, "Dungeon-Editor");
    return valid;
  }

  const save = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (validateData()) {
      let createBody: CreateDungeonRequest = {} as CreateDungeonRequest;
      supervisor.createDungeon(createBody, (data) => {
        homosole.log("Dungeon Successfully created");
        navigate("/");
      }, (error) => {
        homosole.log(error.error, "Dungeon-Configurator");
      });
    } else {
      // homosole.warn("Bitte füll alle Felder aus!", "Dungeon-Configurator");
    }
  }


  let methods: DungeonConfiguratorContextMethods = {
    setName, setDescription, setMaxPlayers, handleOnBlurInput, addClass, editClass, deleteClass, addItem, editItem, deleteItem, addAction, editAction, deleteAction, setGenders, setSpecies, save
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


  return <DungeonConfiguratorContext.Provider value={{ ...fields, ...methods, npcs, items }}>
    <AddClassModal editData={editData as MudCharacterClass} key={"Class-" + characterClassKey.selected} onSendCharacterClass={(cc) => {
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

    <AddItemModal editData={editData as MudItem} key={"Item:" + itemsKey.selected} onSendItem={(cc) => {
      if (itemsKey.selected === itemsKey.nextKey) { // if the current key is the same as the next key, it means that the user is creating a new class
        cc.id = itemsKey.nextKey + "";
        setItems([...items, cc]);
        setShowAddItemsModal(false);
        setItemsKey({ nextKey: itemsKey.nextKey + 1, selected: itemsKey.selected + 1 });
      } else {
        // User is editing
        cc.id = itemsKey.selected + "";
        // Set the key to a new id
        setItemsKey({ ...itemsKey, selected: itemsKey.nextKey });
        let temp = items;
        let index = temp.findIndex((c) => c.id === cc.id);
        temp[index] = cc;
        setItems(temp);
      }
    }} show={showAddItemsModal} onHide={() => {
      setShowAddItemsModal(false);
    }} />

    <AddActionModal editData={editData as MudActionElement} key={"Action:" + actionsKey.selected} onSendAction={(cc) => {
      if (actionsKey.selected === actionsKey.nextKey) { // if the current key is the same as the next key, it means that the user is creating a new class
        cc.id = actionsKey.nextKey + "";
        setActions([...actions, cc]);
        setShowAddActionsModal(false);
        setActionsKey({ nextKey: actionsKey.nextKey + 1, selected: actionsKey.selected + 1 });
      } else {
        // User is editing
        cc.id = actionsKey.selected + "";
        // Set the key to a new id
        setActionsKey({ ...actionsKey, selected: actionsKey.nextKey });
        let temp = actions;
        let index = temp.findIndex((c) => c.id === cc.id);
        temp[index] = cc;
        setActions(temp);
      }
    }} show={showAddActionsModal} onHide={() => {
      setShowAddActionsModal(false);
    }} />

    <ConfirmationDialog onHide={() => { setShowConfirmationDialog({ show: false, message: "", title: "", onConfirm: () => { } }) }} {...showConfirmationDialog} />
    {children}
  </DungeonConfiguratorContext.Provider>;
}
export { DungeonConfiguratorContext, DungeonConfiguratorProvider };