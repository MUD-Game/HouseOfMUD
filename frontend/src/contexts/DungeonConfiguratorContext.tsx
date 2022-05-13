/**
 * @module DungeonConfiguratorContext
 * @description React Context for the DungeonConfigurator, it holds all information that is needed to create a dungeon. Everyone that reads or sets that Information can use this Context via the Hook {@linkcode useDungeonConfiguratorContext}
 * @author Raphael Sack
 * @category React Context
 */

import React, { useEffect } from 'react';
import { MudActionElement, MudCharacterGender, MudCharacterSpecies, MudDungeon, MudItem, MudNpc, MudRoom } from 'src/types/dungeon'
import { MudCharacterClass, MudEvent } from '../types/dungeon';
import { validator } from 'src/utils/validator';
import AddClassModal from 'src/components/Modals/DungeonConfigurator/AddClassModal';
import ConfirmationDialog from 'src/components/Modals/BasicModals/ConfirmationDialog';
import AddItemModal from 'src/components/Modals/DungeonConfigurator/AddItemModal';
import AddActionModal from 'src/components/Modals/DungeonConfigurator/AddActionModal';
import { supervisor } from 'src/services/supervisor';
import { CreateDungeonRequest } from '@supervisor/api';
import { useLocation, useNavigate } from 'react-router-dom';
import Busy from 'src/components/Busy';
import { useTranslation } from 'react-i18next';
import AddRoomModal from 'src/components/Modals/DungeonConfigurator/AddRoomModal';
import AddNpcModal from 'src/components/Modals/DungeonConfigurator/AddNpcModal';
import AddGenderModal from 'src/components/Modals/DungeonConfigurator/AddGenderModal';
import AddSpeciesModal from 'src/components/Modals/DungeonConfigurator/AddSpeciesModal';
type Option = string | { [key: string]: any };

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

const markAsFromServer = (array: any[]) => {
    return array.map(({
        ...rest
    }) => ({
        ...rest,
        from_server: true
    }));
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
    setPassword: (password: string) => void;
    setMaxPlayers: (maxPlayers: number | "") => void;



    addGender: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    editGender: (key: number) => void;
    deleteGender: (key: number) => void;

    addSpecies: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    editSpecies: (key: number) => void;
    deleteSpecies: (key: number) => void;

    addClass: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    editClass: (key: number) => void;
    deleteClass: (key: number) => void;



    addItem: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    editItem: (key: number) => void;
    deleteItem: (key: number) => void;

    addNpc: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    editNpc: (key: number) => void;
    deleteNpc: (key: number) => void;

    addAction: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    editAction: (key: number) => void;
    deleteAction: (key: number) => void;

    addRoom: (c: [number, number]) => void;
    saveRoom: (room: MudRoom) => void;
    deleteRoom: () => void;
    selectRoom: (c: [number, number]) => void;
    toggleRoomConnection: (c: [number, number], south: boolean) => void;
    setSelectedRoomItems: (items: Option[]) => void;
    setSelectedRoomItemValues: (values: { [key: string]: any }) => void;
    setSelectedRoomActions: (actions: Option[]) => void;
    setSelectedRoomNpcs: (npcs: Option[]) => void;
    setSelectedRoomName: (name: string) => void;
    setSelectedRoomDescription: (description: string) => void;


    save: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, busyCallback: (busy: boolean) => void) => void;
}

export interface DungeonConfiguratorContextType extends MudDungeon, DungeonConfiguratorContextMethods {
    npcs: MudNpc[];
    items: MudItem[];
    currentRoom: MudRoom | null;
    selectedRoomItems: Option[];
    selectedRoomItemValues: { [key: string]: any };
    selectedRoomActions: Option[];
    selectedRoomNpcs: Option[];
    selectedRoomName: string;
    selectedRoomDescription: string;
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
    const [password, setPassword] = React.useState<string>("");
    const [maxPlayers, setMaxPlayers] = React.useState<number | "">("");
    const [species, setSpecies] = React.useState<MudCharacterSpecies[]>([]);
    const [genders, setGenders] = React.useState<MudCharacterGender[]>([]);
    const [classes, setClasses] = React.useState<MudCharacterClass[]>([]);
    const [items, setItems] = React.useState<MudItem[]>([]);
    const [actions, setActions] = React.useState<MudActionElement[]>([]);
    const [npcs, setNpcs] = React.useState<MudNpc[]>([]);

    const [rooms, setRooms] = React.useState<{ [key: string]: MudRoom }>({
        "0,0": {
            id: "0,0",
            name: t("common.start_room.name"),
            description: t("common.start_room.description"),
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

    const [showAddGenderModal, setShowAddGenderModal] = React.useState<boolean>(false);
    const [gendersKey, setGendersKey] = React.useState<{ selected: number, nextKey: number }>({ selected: 0, nextKey: 0 });
    const [showAddSpeciesModal, setShowAddSpeciesModal] = React.useState<boolean>(false);
    const [speciesKey, setSpeciesKey] = React.useState<{ selected: number, nextKey: number }>({ selected: 0, nextKey: 0 });

    // States for configure Actions
    const [showAddActionsModal, setShowAddActionsModal] = React.useState<boolean>(false);
    const [actionsKey, setActionsKey] = React.useState<{ selected: number, nextKey: number }>({ selected: 0, nextKey: 0 });

    // States for NPC
    const [showAddNpcModal, setShowAddNpcModal] = React.useState<boolean>(false);
    const [npcsKey, setNpcsKey] = React.useState<{ selected: number, nextKey: number }>({ selected: 0, nextKey: 0 });

    // Used to configure Rooms
    const [showAddRoomModal, setShowAddRoomModal] = React.useState<boolean>(false);
    const [roomsKey, setRoomsKey] = React.useState<string>("");
    const [roomCoordiantes, setRoomCoordiantes] = React.useState<[number, number] | null>(null);
    const [currentRoom, setCurrentRoom] = React.useState<MudRoom | null>(null);
    const [selectedRoomName, setSelectedRoomName] = React.useState<string>(t("common.start_room.name"));
    const [selectedRoomDescription, setSelectedRoomDescription] = React.useState<string>(t("common.start_room.description"));
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
                if(dungeon.globalActions){
                    dungeon.globalActions.forEach((globalActionId:string)=>{
                        dungeon.actions.forEach((action:MudActionElement)=>{
                            if(action.id===globalActionId){
                                action.isGlobal=true;
                            }
                        });
                    })
                }
                setName(dungeon.name);
                setDescription(dungeon.description);
                setPassword(dungeon.password);
                setMaxPlayers(dungeon.maxPlayers);
                setClasses(markAsFromServer(processAfterReceive(dungeon.characterClasses)));
                setCharacterClassKey({ selected: dungeon.characterClasses.length, nextKey: dungeon.characterClasses.length+1 });
                setItems(processAfterReceive(dungeon.items));
                setItemsKey({ selected: dungeon.characterClasses.length, nextKey: dungeon.items.length+1 });
                setActions(processAfterReceive(dungeon.actions));
                setActionsKey({ selected: dungeon.characterClasses.length, nextKey: dungeon.actions.length+1 });

                setRooms(arrayToMap(dungeon.rooms));

                setNpcs(dungeon.npcs);
                setNpcsKey({ selected: dungeon.characterClasses.length, nextKey: dungeon.npcs.length+1 });
                setSpecies(markAsFromServer(processAfterReceive(dungeon.characterSpecies)));
                setSpeciesKey({ selected: dungeon.characterClasses.length, nextKey: dungeon.characterSpecies.length+1 });
                setGenders(markAsFromServer(processAfterReceive(dungeon.characterGenders)));
                setGendersKey({ selected: dungeon.characterClasses.length, nextKey: dungeon.characterGenders.length+1 });
                setIsLoading(false);
            }, error => setError(error.error));
        }
        return () => {

        }
    }, [dungeonId])




    const showConfirmation = (localeString: string, onConfirm: () => void) => {
        setShowConfirmationDialog({
            show: true, message: t(`dungeon_configurator.confirmations.${localeString}.text`), title: t(`dungeon_configurator.confirmations.${localeString}.title`), onConfirm
        });
    }

    const addGender = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setEditData(null);
        setGendersKey({ ...gendersKey, selected: gendersKey.nextKey });
        setShowAddGenderModal(true);
    }

    const editGender = (key: number) => {
        const editIndex = genders.findIndex(c => c.id === key + "");
        setEditData(genders[editIndex]);
        setGendersKey({ selected: key, nextKey: gendersKey.nextKey });
        setShowAddGenderModal(true);
    }

    const deleteGender = (key: number) => {
        showConfirmation("delete_gender", () => {
            let index = genders.findIndex(c => c.id === key + "");
            let newGenders = genders;
            newGenders.splice(index, 1);
            setGenders(newGenders);
        });
    }

    const addSpecies = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setEditData(null);
        setSpeciesKey({ ...speciesKey, selected: speciesKey.nextKey });
        setShowAddSpeciesModal(true);
    }

    const editSpecies = (key: number) => {
        const editIndex = species.findIndex(c => c.id === key + "");
        setEditData(species[editIndex]);
        setSpeciesKey({ selected: key, nextKey: speciesKey.nextKey });
        setShowAddSpeciesModal(true);
    }

    const deleteSpecies = (speciesKey: number) => {
        // check if the items are used in any action
        let usedInNpc = false;
        npcs.forEach((a: MudNpc) => {
            if (a.species === speciesKey + "") {
                usedInNpc = true;
            }
        });
        if (usedInNpc) {
            setError("reference_in_npc");
        }else{
        showConfirmation("delete_species", () => {
            let index = species.findIndex(c => c.id === speciesKey + "");
            let newSpecies = species;
            newSpecies.splice(index, 1);
            setSpecies(newSpecies);
        });
        }

    }

    const addClass = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setEditData(null);
        setCharacterClassKey({ ...characterClassKey, selected: characterClassKey.nextKey });
        setShowCharacterClassModal(true);
    }
    const editClass = (key: number) => {
        const editIndex = classes.findIndex(c => c.id === key+"");
        setEditData(classes[editIndex]);
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
        setRoomCoordiantes(c); // Set room-coordinates to be used in the modal 
        setShowAddRoomModal(true);
    }

    const saveRoom = (oldRoom: MudRoom) => {
        let temp = rooms;
        oldRoom.name = selectedRoomName;
        oldRoom.description = selectedRoomDescription;
        oldRoom.items = [];
        oldRoom.npcs = [];
        oldRoom.actions = [];
        selectedRoomItems.forEach((i: any) => {
            oldRoom.items.push({ item: i.id, count: selectedRoomItemValues[i.id] });
        });
        selectedRoomActions.forEach((i: any) => {
            oldRoom.actions.push(i.id);
        });
        selectedRoomNpcs.forEach((i: any) => {
            oldRoom.npcs.push(i.id);
        });
        temp[roomsKey] = oldRoom;
        setRooms(temp);
    }

    const deleteRoom = () => {
        if (!roomCoordiantes || !currentRoom || roomsKey === "") {
            setError("noroomselected");
            return;
        }
        if (roomsKey === "0,0") {
            setError("deletestartroom")
        } else {
            showConfirmation("delete_room", () => {
                roomConnectionNeighbour(roomCoordiantes, "inactive");
                let newRooms = rooms;
                delete newRooms[roomsKey];
                setRooms(newRooms);
                // After room deletion we need to update the roomsKey and the currentRoom
                setRoomCoordiantes([0, 0]);
                setCurrentRoom(rooms["0,0"]);
                setRoomsKey("0,0");
            });
        }
    }

    const selectRoom = (c: [number, number]) => {
        // Save the old room
        if (String(roomCoordiantes) !== String(c) && (currentRoom && roomsKey !== "" && roomCoordiantes)) {
            let temp = rooms;
            let oldRoom = temp[roomsKey];
            oldRoom.name = selectedRoomName;
            oldRoom.description = selectedRoomDescription;
            oldRoom.items = [];
            oldRoom.npcs = [];
            oldRoom.actions = [];
            selectedRoomItems.forEach((i: any) => {
                oldRoom.items.push({ item: i.id, count: selectedRoomItemValues[i.id] });
            });
            selectedRoomActions.forEach((i: any) => {
                oldRoom.actions.push(i.id);
            });
            selectedRoomNpcs.forEach((i: any) => {
                oldRoom.npcs.push(i.id);
            });
            temp[roomsKey] = oldRoom;
            setRooms(temp);
        }
        // Set the new room
        const key = String(c);
        setRoomCoordiantes(c);
        setRoomsKey(key);
        setRoomsKey(key);
        if (rooms[key]) {
            setCurrentRoom(rooms[key]);
            setSelectedRoomDescription(rooms[key].description);
            setSelectedRoomName(rooms[key].name);
            const items_array = rooms[key].items;
            const actions_array = rooms[key].actions;
            const npcs_array = rooms[key].npcs;
            // {item: i.id, count: selectedRoomItemValues[i.id]}
            // select items
            setSelectedRoomItems(items_array.map((i: {
                item: string;
                count: number;
            }) => {
                return {
                    name: items[parseInt(i.item)].name,
                    description: items[parseInt(i.item)].description,
                    id: items[parseInt(i.item)].id
                }
            }));

            // Count how many of each item is in the room
            let temp: { [key: string]: number } = {};
            items_array.forEach((i: {
                item: string;
                count: number;
            }) => {
                temp[i.item] = i.count;
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
        const editIndex = items.findIndex(i => i.id === key + "");
        setEditData(items[editIndex]);
        setItemsKey({ selected: key, nextKey: itemsKey.nextKey });
        setShowAddItemsModal(true);
    }

    const deleteItem = (itemkey: number) => {
        // check if the items are used in any action
        let usedInActions = false;
        actions.forEach((a: MudActionElement) => {
            if (a.itemsneeded.includes(itemkey)) {
                usedInActions = true;
            }
            a.events.forEach((e: MudEvent) => {
                if ((e.eventType === "additem" || e.eventType === "removeitem") && e.value === itemkey) {
                    usedInActions = true;
                }
            });
        });
        if (usedInActions) {
            setError("reference_in_action");
        } else {

            showConfirmation('delete_item', () => {
                let index = items.findIndex(c => c.id === itemkey + "");
                let newItems = items;
                setItems(newItems.filter((_, i) => i !== index));
                // Delete from selectedItems
                let newSelectedItems = selectedRoomItems;
                newSelectedItems = newSelectedItems.filter((i: any) => i.id !== itemkey);
                setSelectedRoomItems(newSelectedItems);
                let temprooms = rooms;
                Object.keys(temprooms).forEach((roomKey: string) => {
                    let room = temprooms[roomKey];
                    room.items = room.items.filter((i: any) => i.item !== itemkey + "");
                    temprooms[roomKey] = room;
                });
                setRooms(temprooms);
                if (roomCoordiantes) {
                    selectRoom(roomCoordiantes);
                }


            });
        }
    }

    const addNpc = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setEditData(null);
        setNpcsKey({ ...npcsKey, selected: npcsKey.nextKey })
        setShowAddNpcModal(true);
    }
    const editNpc = (key: number) => {
        const editIndex = npcs.findIndex(i => i.id === key + "");
        setEditData(npcs[editIndex]);
        setNpcsKey({ selected: key, nextKey: npcsKey.nextKey });
        setShowAddNpcModal(true);
    }

    const deleteNpc = (npckey: number) => {
        showConfirmation('delete_npc', () => {
            let temprooms = rooms;
            Object.keys(temprooms).forEach((roomKey: string) => {
                let room = temprooms[roomKey];
                room.npcs = room.npcs.filter((i: any) => i !== npckey + "");
                temprooms[roomKey] = room;
            });
            setRooms(temprooms);
            if (roomCoordiantes) {
                selectRoom(roomCoordiantes);
            }
            setNpcs(npcs.filter((n) => n.id !== npckey + ""));
        });
    }

    const addAction = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setEditData(null);
        setActionsKey({ ...actionsKey, selected: actionsKey.nextKey })
        setShowAddActionsModal(true);

        // setClasses([...classes, mockupClass]);
    }
    const editAction = (key: number) => {
        const editIndex = actions.findIndex(i => i.id === key + "");
        setEditData(actions[editIndex]);
        setActionsKey({ selected: key, nextKey: actionsKey.nextKey });
        setShowAddActionsModal(true);
    }
    const deleteAction = (actionKey: number) => {
        showConfirmation('delete_action', () => {
            let temprooms = rooms;
            Object.keys(temprooms).forEach((roomKey: string) => {
                let room = temprooms[roomKey];
                room.actions = room.actions.filter((i: any) => i !== actionKey + "");
                temprooms[roomKey] = room;
            });
            setRooms(temprooms);
            if (roomCoordiantes) {
                selectRoom(roomCoordiantes);
            }
            setActions(actions.filter((a) => a.id !== actionKey + ""));
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
        else if (maxPlayers === "") {
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
            let temp = rooms;
            // Dungeon-Rooms are saved when you switch the room selection, so the last selection needs to be saved before saving the dungeon
            if ((currentRoom && roomsKey !== "" && roomCoordiantes)) { // Only "save" it when there was a room selected
                let oldRoom = temp[roomsKey];
                oldRoom.name = selectedRoomName;
                oldRoom.description = selectedRoomDescription;
                oldRoom.items = [];
                oldRoom.npcs = [];
                oldRoom.actions = [];
                selectedRoomItems.forEach((i: any) => {
                    oldRoom.items.push({ item: i.id, count: selectedRoomItemValues[i.id] });
                });
                selectedRoomActions.forEach((i: any) => {
                    oldRoom.actions.push(i.id);
                });
                selectedRoomNpcs.forEach((i: any) => {
                    oldRoom.npcs.push(i.id);
                });
                temp[roomsKey] = oldRoom;
            }

            // Create global actions:
            let globalActions: string[] = [];
            actions.forEach((a: MudActionElement) => {
                if(a.isGlobal){
                    globalActions.push(a.id);
                }
            });
            let createBody: CreateDungeonRequest['dungeonData'] = {
                id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                name,
                description,
                password,
                creatorId: "",
                masterId: "",
                currentPlayers: 0,
                maxPlayers,
                characters: [],
                characterSpecies: species.map(({ from_server, ...rest }) => rest),
                characterGenders: genders.map(({ from_server, ...rest }) => rest),
                actions: actions.map(({isGlobal,...rest}) => {
                    return {...rest}
                }),
                globalActions,
                characterClasses: classes.map(({ from_server, ...rest }) => rest),
                items,
                rooms: Object.keys(temp).map((coordId) => {
                    return rooms[coordId] // Map => Array
                }),
                npcs,
                blacklist: []
            };
            if (dungeonId) {
                supervisor.editDungeon(dungeonId, { dungeonData: createBody }, (data) => {
                    busyCallback(false);
                    navigate("/?board=my");
                }, (error) => {
                    setError(error.error);
                });
            } else {
                supervisor.createDungeon({ dungeonData: createBody }, (data) => {
                    busyCallback(false);
                    navigate("/?board=my");
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
        setName, setDescription, setPassword, setMaxPlayers, addClass, editClass, deleteClass, addItem, editItem, deleteItem, addAction, editAction, deleteAction, save, addRoom, saveRoom: saveRoom, deleteRoom, selectRoom, setSelectedRoomActions, setSelectedRoomItems, setSelectedRoomItemValues, setSelectedRoomNpcs, toggleRoomConnection, addNpc, editNpc, deleteNpc, setSelectedRoomDescription, setSelectedRoomName, addGender, deleteGender, editGender, addSpecies, deleteSpecies, editSpecies
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
        password,
    } as MudDungeon;


    // REFACTOR: Somehow make the Modals more Readable...
    return <DungeonConfiguratorContext.Provider value={{ ...fields, ...methods, error, setError, npcs, items, currentRoom, selectedRoomActions, selectedRoomItemValues, selectedRoomItems, selectedRoomNpcs, selectedRoomDescription, selectedRoomName }}>
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
                let temp = items;
                let index = temp.findIndex((c) => c.id === cc.id);
                temp[index] = cc;
                setItems(temp);
            }
        }} show={showAddItemsModal} onHide={() => {
            setShowAddItemsModal(false);
        }} />

        <AddGenderModal editData={editData as MudCharacterGender} key={"Gender:" + gendersKey.selected} onSendGender={(cc: MudCharacterGender) => {
            if (gendersKey.selected === gendersKey.nextKey) {
                cc.id = gendersKey.nextKey + "";
                setGenders([...genders, cc]);
                setShowAddGenderModal(false);
                setGendersKey({ nextKey: gendersKey.nextKey + 1, selected: gendersKey.selected + 1 });
            } else {
                cc.id = gendersKey.selected + "";
                // Set the key to a new id
                let temp = genders;
                let index = temp.findIndex((c) => c.id === cc.id);
                temp[index] = cc;
                setGenders(temp);
            }
        }} onHide={() => { setShowAddGenderModal(false) }} show={showAddGenderModal} />

        <AddSpeciesModal editData={editData as MudCharacterSpecies} key={"Species:" + speciesKey.selected} onSendSpecies={(cc: MudCharacterSpecies) => {
            if (speciesKey.selected === speciesKey.nextKey) {

                cc.id = speciesKey.nextKey + "";
                setSpecies([...species, cc]);
                setShowAddSpeciesModal(false);
                setSpeciesKey({ nextKey: speciesKey.nextKey + 1, selected: speciesKey.selected + 1 });
            } else {
                cc.id = speciesKey.selected + "";
                // Set the key to a new id
                let temp = species;
                let index = temp.findIndex((c) => c.id === cc.id);
                temp[index] = cc;
                setSpecies(temp);
            }
        }} onHide={() => { setShowAddSpeciesModal(false) }} show={showAddSpeciesModal} />

        <AddNpcModal editData={editData as MudNpc} key={"Npc:" + npcsKey.selected} onSendNpc={(cc: MudNpc) => {
            if (npcsKey.selected === npcsKey.nextKey) { // if the current key is the same as the next key, it means that the user is creating a new class
                cc.id = npcsKey.nextKey + "";
                setNpcs([...npcs, cc]);
                setShowAddNpcModal(false);
                setNpcsKey({ nextKey: npcsKey.nextKey + 1, selected: npcsKey.selected + 1 });
                setEditData(null);
            } else {
                // User is editing
                cc.id = npcsKey.selected + "";
                // Set the key to a new id
                let temp = npcs;
                let index = temp.findIndex((c) => c.id === cc.id);
                temp[index] = cc;
                setNpcs(temp);
            }
        }} show={showAddNpcModal} onHide={() => {
            setShowAddNpcModal(false);
        }} />

        <AddRoomModal coordinates={roomCoordiantes || [0, 0]} key={"Room:" + Object.keys(rooms).length} onSendRoom={(cc: MudRoom) => {
            const newKey: [number, number] = [cc.xCoordinate, cc.yCoordinate];
            // Save the old room
            let temp = rooms;
            if ((currentRoom && roomsKey !== "" && roomCoordiantes)) {
                let oldRoom = temp[roomsKey];
                oldRoom.name = selectedRoomName;
                oldRoom.description = selectedRoomDescription;
                oldRoom.items = [];
                oldRoom.npcs = [];
                oldRoom.actions = [];
                selectedRoomItems.forEach((i: any) => {
                    oldRoom.items.push({ item: i.id, count: selectedRoomItemValues[i.id] });
                });
                selectedRoomActions.forEach((i: any) => {
                    oldRoom.actions.push(i.id);
                });
                selectedRoomNpcs.forEach((i: any) => {
                    oldRoom.npcs.push(i.id);
                });
                temp[roomsKey] = oldRoom;
            }
            temp[String(newKey)] = cc;
            setRooms(temp);
            setRoomsKey(String(newKey));
            setInitialRoomConnections(newKey);
            setEditData(null);
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
                setEditData(null);
            } else {
                // User is editing
                cc.id = actionsKey.selected + "";
                // Set the key to a new id
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