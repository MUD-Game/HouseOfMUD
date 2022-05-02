/**
 * @module DungeonConfiguratorContext
 * @description React Context for the DungeonConfigurator, it holds all information that is needed to create a dungeon. Everyone that reads or sets that Information can use this Context via the Hook {@linkcode useDungeonConfiguratorContext}
 * @author Raphael Sack
 * @category React Context
 */

import React, { useEffect } from 'react';
import { MudActionElement, MudCharacterGender, MudCharacterSpecies, MudDungeon, MudItem, MudNpc, MudRoom } from 'src/types/dungeon'
import { MudCharacterClass } from '../types/dungeon';
import { validator } from 'src/utils/validator';
import AddClassModal from 'src/components/Modals/DungeonConfigurator/AddClassModal';
import ConfirmationDialog from 'src/components/Modals/BasicModals/ConfirmationDialog';
import AddItemModal from 'src/components/Modals/DungeonConfigurator/AddItemModal';
import AddActionModal from 'src/components/Modals/DungeonConfigurator/AddActionModal';
import { supervisor } from 'src/services/supervisor';
import { CreateDungeonRequest } from '@supervisor/api';
import { useLocation, useNavigate } from 'react-router-dom';
import Busy from 'src/components/Busy';
import { CharacterSpecies } from '../../../backend/data/src/interfaces/characterSpecies';
import { CharacterGender } from '../../../backend/data/src/interfaces/characterGender';
import { useTranslation } from 'react-i18next';
import AddRoomModal from 'src/components/Modals/DungeonConfigurator/AddRoomModal';
type Option = string | { [key: string]: any };

const processToSend = (array: any[]) => {
    // renames the keys to match the backend naming convention (label => name, customOption falls away)
    let t = array.map(({
        label: name,
        customOption,
        ...rest
    }) => ({
        name,
        ...rest
    }));
    // Finally removes the id-prefix from the id (new-id-x => x)
    return t.map(({
        id,
        ...rest
    }) => ({
        id: (id as string).split("-")[2],
        ...rest
    }));
}

const processAfterReceive = (array: any[]) => {
    // Deletes the _id and  __v keys
    let t = array.map(({
        _id,
        __v,
        ...rest
    }) => ({
        ...rest
    }));
    return t;
}

function arrayToMap(array: any[]): any {
    let map: { [id: string]: any } = {};
    array.forEach((obj: any) => {
        map[obj.id] = obj;
    });
    return map;
}
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

    addRoom: (c: [number, number]) => void;
    editRoom: (room: MudRoom) => void;
    deleteRoom: () => void;
    selectRoom: (c: [number, number]) => void;
    toggleRoomConnection: (c: [number, number], south: boolean) => void;
    setSelectedRoomItems: (items: Option[]) => void;
    setSelectedRoomItemValues: (values: { [key: string]: any }) => void;
    setSelectedRoomActions: (actions: Option[]) => void;
    setSelectedRoomNpcs: (npcs: Option[]) => void;


    save: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, busyCallback: (busy: boolean) => void) => void;
}

export interface DungeonConfiguratorContextType extends MudDungeon, DungeonConfiguratorContextMethods {
    npcs: MudNpc[];
    items: MudItem[];
    currentRoom: MudRoom;
    selectedRoomItems: Option[];
    selectedRoomItemValues: { [key: string]: any };
    selectedRoomActions: Option[];
    selectedRoomNpcs: Option[];
    setError: (error: string) => void;
    error: string;
}


let DungeonConfiguratorContext = React.createContext<DungeonConfiguratorContextType>({} as DungeonConfiguratorContextType);

function DungeonConfiguratorProvider({ children }: { children: React.ReactNode }) {

    // Hooks
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    // States
    const [name, setName] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");
    const [maxPlayers, setMaxPlayers] = React.useState<number>(0);
    const [species, setSpecies] = React.useState<Option[]>([]);
    const [genders, setGenders] = React.useState<Option[]>([]);
    const [classes, setClasses] = React.useState<MudCharacterClass[]>([]);
    const [items, setItems] = React.useState<MudItem[]>([]);
    const [actions, setActions] = React.useState<MudActionElement[]>([]);
    const [npcs, setNpcs] = React.useState<MudNpc[]>([]);

    const [rooms, setRooms] = React.useState<{ [key: string]: MudRoom }>({
        "0,0": {
            id: "0,0",
            name: "Start-Raum",
            description: "Der Start-Raum ist der erste Raum, der beim ersten Aufruf des Dungeons angezeigt wird. Hier kannst du dich mit den anderen Spielern verbinden und deine eigenen Charaktere erstellen.",
            npcs: [],
            items: [],
            connections: { east: 'inactive', south: 'inactive' },
            actions: [],
            xCoordinate: 0,
            yCoordinate: 0
        }
    });

    
    // States for configure Classes
    const [showCharacterClassModal, setShowCharacterClassModal] = React.useState<boolean>(false);
    const [characterClassKey, setCharacterClassKey] = React.useState<{ selected: number, nextKey: number }>({ selected: 0, nextKey: 0 });
    
    // States for configure Items
    const [showAddItemsModal, setShowAddItemsModal] = React.useState<boolean>(false);
    const [itemsKey, setItemsKey] = React.useState<{ selected: number, nextKey: number }>({ selected: 0, nextKey: 0 });
    
    // States for configure Actions
    const [showAddActionsModal, setShowAddActionsModal] = React.useState<boolean>(false);
    const [actionsKey, setActionsKey] = React.useState<{ selected: number, nextKey: number }>({ selected: 0, nextKey: 0 });
    
    // States for NPC
    const [showAddNpcModal, setShowAddNpcModal] = React.useState<boolean>(false);
    const [npcsKey, setNpcsKey] = React.useState<{ selected: number, nextKey: number }>({ selected: 0, nextKey: 0 });
    
    // Used to configure Rooms
    const [showAddRoomModal, setShowAddRoomModal] = React.useState<boolean>(false);
    const [roomsKey, setRoomsKey] = React.useState<string>("0,0");
    const [roomCoordiantes, setRoomCoordiantes] = React.useState<[number, number]>([0, 0]);
    const [currentRoom, setCurrentRoom] = React.useState<MudRoom>(rooms["0,0"]);
    const [selectedRoomItems, setSelectedRoomItems] = React.useState<Option[]>([]);
    const [selectedRoomItemValues, setSelectedRoomItemValues] = React.useState<{ [key: string]: any }>({});
    const [selectedRoomActions, setSelectedRoomActions] = React.useState<Option[]>([]);
    const [selectedRoomNpcs, setSelectedRoomNpcs] = React.useState<Option[]>([]);
    
    const [showConfirmationDialog, setShowConfirmationDialog] = React.useState<{ show: boolean, message: string, title: string, onConfirm: () => void }>({ show: false, message: "", title: "", onConfirm: () => { } });
    
    // If the Configurator is called with a dungeonId in the location-State it means that the dungeon is here for editing.
    const dungeonId = (location.state as any)?.dungeonId || undefined;

    // Other States 
    const [isLoading, setIsLoading] = React.useState<boolean>(dungeonId ? true : false);
    const [error, setError] = React.useState<string>("");
    const [editData, setEditData] = React.useState<any>();


    useEffect(() => {
        // If the dungeonID exists we load the dungeon in the background and fill the states with the data.
        if (dungeonId) {
            supervisor.getDungeon(dungeonId, {}, (dungeon: any) => {
                setName(dungeon.name);
                setDescription(dungeon.description);
                setMaxPlayers(dungeon.maxPlayers);
                setClasses(dungeon.characterClasses);
                setCharacterClassKey({ selected: dungeon.characterClasses.length, nextKey: dungeon.characterClasses.length });
                setItems(processAfterReceive(dungeon.items));
                setItemsKey({ selected: dungeon.characterClasses.length, nextKey: dungeon.items.length });
                setActions(processAfterReceive(dungeon.actions));
                setActionsKey({ selected: dungeon.characterClasses.length, nextKey: dungeon.actions.length });
                
                setRooms(arrayToMap(dungeon.rooms));
                setRoomsKey("0,0");
                setRoomCoordiantes([0, 0]);

                setCurrentRoom(rooms["0,0"]);

                setNpcs(dungeon.npcs);
                setNpcsKey({ selected: dungeon.characterClasses.length, nextKey: dungeon.npcs.length });
                dungeon.characterSpecies.forEach((s: CharacterSpecies) => {
                    setSpecies([...species, { label: s.name, id: `new-id-${s.id}` }]);
                });
                dungeon.characterGenders.forEach((s: CharacterGender) => {
                    setGenders([...genders, { label: s.name, id: `new-id-${s.id}` }]);
                });
                setIsLoading(false);
            }, error => setError(error.error));
        }
        return () => {

        }
    }, [])




    const handleOnBlurInput = (event: React.FocusEvent<HTMLInputElement>) => {
        // What happens when the user leaves the input field --> Validates the inputs and either saves the data in state or handles the invalid data (happens in validator)
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

    const showConfirmation = (localeString: string, onConfirm: () => void) => {
        setShowConfirmationDialog({
            show: true, message: t(`dungeon_configurator.confirmations.${localeString}.text`), title: t(`dungeon_configurator.confirmations.${localeString}.title`), onConfirm
        });
    }

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
        showConfirmation("delete_class", () => {
            let index = classes.findIndex(c => c.id === key + "");
            let newClasses = classes;
            newClasses.splice(index, 1);
            setClasses(newClasses);
        });
    }

    // REFACTOR: Check again if RoomsKey, RoomCoordiantes and CurrentRoom are needed or just one.. or at least two of them
    const addRoom = (c: [number, number]) => {
        setEditData(null); // EditData that is used for every Modal
        setRoomsKey(String(c));
        setRoomCoordiantes(c); // Set room-coordinates to be used in the modal 
        setShowAddRoomModal(true);
    }

    const editRoom = (room: MudRoom) => {
        let temp = rooms;
        room.items = [];
        room.npcs = [];
        room.actions = [];
        selectedRoomItems.forEach((i: any) => {
            for (let j = 0; j < selectedRoomItemValues[i.id]; j++) {
                room.items.push(i.id);
            }
        });
        selectedRoomActions.forEach((i: any) => {
            room.actions.push(i.id);
        });
        selectedRoomNpcs.forEach((i: any) => {
            room.npcs.push(i.id);
        });
        temp[roomsKey] = room;
        setRooms(temp);
        setCurrentRoom(room);
    }

    const deleteRoom = () => {
        if (roomsKey === "0,0") {
            setError("deletestartroom")
        } else {
            showConfirmation("delete_room", () => {
                roomConnectionNeighbour(roomCoordiantes, "inactive");
                let newRooms = rooms;
                delete newRooms[roomsKey];
                setRooms(newRooms);
            });
        }
    }

    const selectRoom = (c: [number, number]) => {
        const key = String(c);
        setRoomCoordiantes(c);
        setRoomsKey(key);
        if (rooms[key]) {
            setCurrentRoom(rooms[key]);
            const items_array = rooms[key].items;
            const actions_array = rooms[key].actions;
            const npcs_array = rooms[key].npcs;
            // select items
            setSelectedRoomItems([...new Set(items_array)].map(i => {
                return {
                    name: items[parseInt(i)].name,
                    description: items[parseInt(i)].description,
                    id: items[parseInt(i)].id
                }
            }));
            // Count how many of each item is in the room
            let temp: { [key: string]: number } = {};
            items_array.forEach((i: string) => {
                if (temp[i]) {
                    temp[i]++;
                } else {
                    temp[i] = 1;
                }
            });
            setSelectedRoomItemValues(temp);
            // select actions
            setSelectedRoomActions(actions_array.map(a => {
                const index = parseInt(a);
                return {
                    description: actions[index].description,
                    id: actions[index].id,
                    command: actions[index].command,
                    output: actions[index].output,
                    events: actions[index].events,
                    itemsneeded: actions[index].itemsneeded
                }
            }));

            // select npcs
            setSelectedRoomNpcs(npcs_array.map(n => {
                const index = parseInt(n);
                return {
                    name: npcs[index].name,
                    description: npcs[index].description,
                    species: npcs[index].species,
                    id: npcs[index].id
                }
            }
            ));
        }
        // setSelectedRoomItems(rooms[key] ? rooms[key].items : []);
        // setSelectedRoomActions(rooms[key] ? rooms[key].actions : []);
        // setSelectedRoomNpcs(rooms[key] ? rooms[key].npcs : []);

    }

    const toggleRoomConnection: (c: [number, number], south: boolean) => void = (c: [number, number], south: boolean) => {
        let temp = rooms;
        let key = String(c);
        let room = temp[key];
        if (room) {
            switch (room.connections[south ? "south" : "east"]) {
                case "open":
                    room.connections[south ? "south" : "east"] = "closed";
                    break;
                case "closed":
                    room.connections[south ? "south" : "east"] = "inactive";
                    break;
                case "inactive":
                    room.connections[south ? "south" : "east"] = "open";
            }
            temp[key] = room;
            setRooms(temp);
        }
    }

    const roomConnectionNeighbour = (c: [number, number], connectionType: MudRoom['connections']['east']) => {
        const [x, y] = c;
        let room = rooms[String(c)];
        let tempRooms = rooms;
        if (room) {
            if (tempRooms[String([x + 1, y])]) {
                room.connections.east = connectionType;
            }
            if (tempRooms[String([x, y + 1])]) {
                room.connections.south = connectionType;
            }
            if (tempRooms[String([x - 1, y])]) {
                tempRooms[String([x - 1, y])].connections.east = connectionType;
            }
            if (tempRooms[String([x, y - 1])]) {
                tempRooms[String([x, y - 1])].connections.south = connectionType;
            }
        }
        setRooms(tempRooms);
    }

    const setInitialRoomConnections = (c: [number, number]) => {
        roomConnectionNeighbour(c, "open");
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
        showConfirmation('delete_item', () => {
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
        showConfirmation('delete_action', () => {
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
        // REFACTOR: Put in validator
        let valid = true;
        if (name === "") {
            valid = false;
        }
        else if (description === "") {
            valid = false;
        }
        else if (maxPlayers === 0) {
            valid = false;
        }
        else if (species.length === 0) {
            valid = false;
        }
        else if (genders.length === 0) {
            valid = false;
        }
        else if (classes.length === 0) {
            valid = false;
        }

        return valid;
    }

    /**
     * 
     * @param event onClick event
     * @param busyCallback callback that can set a busy state
     */
    const save = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, busyCallback: (busy: boolean) => void) => {
        if (validateData()) {
            setError('');
            busyCallback(true);
            let createBody: CreateDungeonRequest['dungeonData'] = {
                id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                name,
                description,
                creatorId: "",
                masterId: "",
                currentPlayers: 0,
                maxPlayers,
                species: processToSend(species),
                genders: processToSend(genders),
                characters: [],
                characterSpecies: processToSend(species) as MudCharacterSpecies[],
                characterGenders: processToSend(genders) as MudCharacterGender[],
                actions,
                characterClasses: classes,
                items,
                rooms: Object.keys(rooms).map((coordId) => {
                    return rooms[coordId] // Map => Array
                }),
                npcs,
                blacklist: []
            };
            if (dungeonId) {
                supervisor.editDungeon(dungeonId, { dungeonData: createBody }, (data) => {
                    busyCallback(false);
                    navigate("/");
                }, (error) => {
                    setError(error.error);
                });
            } else {
                supervisor.createDungeon({ dungeonData: createBody }, (data) => {
                    busyCallback(false);
                    navigate("/");
                }, (error) => {
                    busyCallback(false);
                    setError(error.error);
                });
            }
        } else {
            setError('failvalidation.dungeon');
        }
    }

    // You need to give the Provider a "value" prop that is an object, to make it more readable i put the methods and fields in seperated objects
    let methods: DungeonConfiguratorContextMethods = {
        setName, setDescription, setMaxPlayers, handleOnBlurInput, addClass, editClass, deleteClass, addItem, editItem, deleteItem, addAction, editAction, deleteAction, setGenders, setSpecies, save, addRoom, editRoom, deleteRoom, selectRoom, setSelectedRoomActions, setSelectedRoomItems, setSelectedRoomItemValues, setSelectedRoomNpcs, toggleRoomConnection
    }

    let fields: MudDungeon = {
        name,
        maxPlayers,
        species,
        genders,
        classes,
        actions,
        rooms,
        description,
    } as MudDungeon;


    // REFACTOR: Somehow make the Modals more Readable...
    return <DungeonConfiguratorContext.Provider value={{ ...fields, ...methods, error, setError ,npcs, items, currentRoom, selectedRoomActions, selectedRoomItemValues, selectedRoomItems, selectedRoomNpcs }}>
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

        <AddRoomModal coordinates={roomCoordiantes} key={"Room:" + roomsKey} onSendRoom={(cc: MudRoom) => {
            const newKey: [number, number] = [cc.xCoordinate, cc.yCoordinate];
            let temp_rooms = rooms;
            temp_rooms[String(newKey)] = cc;
            setRooms(temp_rooms);
            setShowAddRoomModal(false);
            setInitialRoomConnections(newKey);
            selectRoom(newKey);
        }} show={showAddRoomModal} onHide={() => {
            setShowAddRoomModal(false);
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
        {isLoading ? <Busy /> : children}
    </DungeonConfiguratorContext.Provider>;
}
export { DungeonConfiguratorContext, DungeonConfiguratorProvider };