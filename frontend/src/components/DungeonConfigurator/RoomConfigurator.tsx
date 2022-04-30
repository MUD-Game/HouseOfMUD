import React, { useEffect, useRef } from 'react';
import { MudConnectionInfo, MudRoom } from 'src/types/dungeon';
import { Stage, Layer, Rect, Transformer, Circle, Group, Line, Image } from 'react-konva';
import Konva from 'konva';
import './index.css'
import { useDungeonConfigurator } from 'src/hooks/useDungeonConfigurator';
import MudInput from 'src/components/Custom/MudInupt';
import { useTranslation } from 'react-i18next';
import MudTypeahead from '../Custom/MudTypeahead';
import { ArrowBarLeft, ArrowsFullscreen, Back, BorderCenter, Bullseye, GeoAlt, GeoAltFill, Play } from 'react-bootstrap-icons';

const roomSize = 60;
const roomMargin = 40
const roomOffset = roomSize + roomMargin;
const connectionStrokeWidth = 8;

const sizeX = 20;
const sizeY = 20;
let bodyStyles = window.getComputedStyle(document.body);

const roomStrokeWidth = 4;

const background = bodyStyles.getPropertyValue('--room-background');

const fillActive = bodyStyles.getPropertyValue('--room-active-fill');
const strokeActive = bodyStyles.getPropertyValue('--room-active-stroke');
const strokeActiveSelected = bodyStyles.getPropertyValue('--room-selected-stroke');
const fillActiveSelected = bodyStyles.getPropertyValue('--room-selected-fill');

const fillStartSelected = bodyStyles.getPropertyValue('--room-start-selected-fill');
const fillStart = bodyStyles.getPropertyValue('--room-start-fill');  // Start-Room color
const strokeStart = bodyStyles.getPropertyValue('--room-start-stroke');
const strokeStartSelected = bodyStyles.getPropertyValue('--room-start-selected-stroke');
const strokeSelected = bodyStyles.getPropertyValue('--room-selected-stroke');

const fillInactive = bodyStyles.getPropertyValue('--room-fill');
const strokeInactive = bodyStyles.getPropertyValue('--room-stroke');


const connectionOpen = bodyStyles.getPropertyValue('--connection-open');
const connectionInactive = bodyStyles.getPropertyValue('--connection-inactive');
const connectionClosed = bodyStyles.getPropertyValue('--connection-closed');
export interface RoomConfiguratorProps {
}
type Option = string | { [key: string]: any };
const RoomConfigurator: React.FC<RoomConfiguratorProps> = (props) => {

    const [width, setWidth] = React.useState(0);
    const [mapSize, setMapSize] = React.useState({ width: 10, height: 5 });
    const widthRef = useRef<any>();
    const roomRefs = useRef<any>({});
    const stageRef = useRef<any>();
    useEffect(() => {
        setWidth(widthRef.current.clientWidth);
    }, []);
    const { rooms, currentRoom, items, npcs, actions, editRoom, addRoom, deleteRoom, selectRoom, setSelectedRoomActions, setSelectedRoomItemValues, setSelectedRoomItems, setSelectedRoomNpcs, selectedRoomActions, selectedRoomItems, selectedRoomItemValues, selectedRoomNpcs, toggleRoomConnection } = useDungeonConfigurator();


    const [selectedRoomObject, setSelectedRoomObject] = React.useState<any>(null);
    const onWheelHandle = (e: any) => {
        if (!e.evt.ctrlKey) {
            return;
        }
        e.evt.preventDefault();
        let stage = e.currentTarget;
        var oldScale = stage.attrs.scaleX || 1;
        var pointer = stage.getPointerPosition();
        var scaleBy = 1.2;
        var mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        // how to scale? Zoom in? Or zoom out?
        let direction = e.evt.deltaY > 0 ? -1 : 1;

        var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        stage.scale({ x: newScale, y: newScale });

        var newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        stage.position(newPos);
    }

    const roomClickHandler = (e: any) => {
        selectRoom(e.target.attrs["data-coordinates"]);
        if (selectedRoomObject) {
            const isStartOld = String(selectedRoomObject.attrs["data-coordinates"]) === String([0, 0]);
            selectedRoomObject.setAttrs({
                fill: isStartOld ? fillStart : fillActive,
                stroke: isStartOld ? strokeStart : strokeActive
            });
        }
        const isStart = String(e.target.attrs["data-coordinates"]) === String([0, 0]);
        e.target.setAttrs({
            fill: isStart ? fillStartSelected : fillActiveSelected,
            stroke: isStart ? strokeStartSelected : strokeActiveSelected
        });
        setSelectedRoomObject(e.target);
        setIsEdited(false);
    }

    const addNewRoom = (c: [number, number]) => {
        addRoom(c);
    }

    const emptyRoomClickHandler = (e: any) => {
     addNewRoom(e.target.attrs["data-coordinates"]); 
    }
    const getPossibleEmptyRooms = (rooms: { [key: string]: MudRoom }) => {
        const occupiedCoords = Object.keys(rooms);
        const dirs = [1, -1, 0];
        let possibleCoords: { [key: string]: [number, number] } = {};

        occupiedCoords.forEach(coord => {
            const [x, y] = coord.split(',').map(Number);
            const room = rooms[coord];
            dirs.forEach(xOff => {
                dirs.forEach(yOff => {
                    if (Math.abs(xOff + yOff) === 1) {

                        const newX = x + xOff;
                        const newY = y + yOff;
                        if (!rooms[newX + ',' + newY]) {
                            possibleCoords[newX + ',' + newY] = [newX, newY];
                        }
                    }
                });
            });
        });
        return Object.keys(possibleCoords).map(coord => possibleCoords[coord]);
    }

    const submitEditDungeon = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        const formData = new FormData(evt.currentTarget);
        // get name and description
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        let newData: MudRoom = currentRoom;
        newData.name = name;
        newData.description = description;
        editRoom(newData);
        setIsEdited(false);
    }

    const handleConnectionClick = (event: any, coords: [number, number], south: boolean) => {
        toggleRoomConnection(coords, south); // handle in backend
        switch (event.target.attrs["data-status"]) {
            case 'open':
                event.target.setAttrs({
                    stroke: connectionClosed,
                    "data-status": 'closed'
                });
                break;
            case 'inactive':
                event.target.setAttrs({
                    stroke: connectionOpen,
                    "data-status": 'open'

                });
                break;
            case 'closed':
                event.target.setAttrs({
                    stroke: connectionInactive,
                    "data-status": 'inactive'
                });
        }
    }

    const { t } = useTranslation();
    const tl = 'dungeon_configurator';
    const [isEdited, setIsEdited] = React.useState(false);
    return (
        <>
        <div id="konvacontainer" ref={widthRef}>
            <div id="refocus-button-container">
            <GeoAlt size={40} id="refocus-button" onClick={() => {
                stageRef.current.scale({ x: 1, y: 1 });
                
                stageRef.current.position({ x: 0, y: 0 });
            }} />
            </div>
            <Stage ref={stageRef} onWheel={onWheelHandle} width={width} height={width / 1.618} draggable offsetY={-(width / 1.618) / 2} offsetX={-width / 2}>
                <Layer>
                    <Group name="connections">
                        {Object.keys(rooms).map(key => {
                            const room = rooms[key];
                            const x = room.xCoordinate;
                            const y = room.yCoordinate;

                            let xStrokeCol = connectionOpen;
                            let yStrokeCol = connectionOpen;
                            switch (room.connections.east) {
                                case 'open':
                                    xStrokeCol = connectionOpen;
                                    break;
                                case 'inactive':
                                    xStrokeCol = connectionInactive;
                                    break;
                                case 'closed':
                                    xStrokeCol = connectionClosed;
                                    break;
                            }
                            switch (room.connections.south) {
                                case 'open':
                                    yStrokeCol = connectionOpen;
                                    break;
                                case 'inactive':
                                    yStrokeCol = connectionInactive;
                                    break;
                                case 'closed':
                                    yStrokeCol = connectionClosed;
                                    break;
                            }
                            const xStatus = rooms[key].connections.east;
                            const yStatus = rooms[key].connections.south;

                            const hasSouthRoom = rooms[x + ',' + (y + 1)] !== undefined;
                            const hasEastRoom = rooms[(x + 1) + ',' + y] !== undefined;

                            return (
                                <Group key={key + "connections"}>
                                    {hasEastRoom && <Line points={[x * roomOffset + roomSize + (roomStrokeWidth / 2), y * roomOffset + (roomSize / 2), (x + 1) * roomOffset, y * roomOffset + (roomSize / 2)]} stroke={xStrokeCol} onClick={(e) => handleConnectionClick(e, [x, y], false)} onTap={(e) => handleConnectionClick(e, [x, y], false)}  strokeWidth={connectionStrokeWidth} data-status={xStatus} />}

                                    {hasSouthRoom && <Line points={[x * roomOffset + (roomSize / 2), y * roomOffset + roomSize + (roomStrokeWidth / 2), x * roomOffset + (roomSize / 2), (y + 1) * roomOffset]} stroke={yStrokeCol} onTap={(e) => handleConnectionClick(e, [x, y], true)} onClick={(e) => handleConnectionClick(e, [x, y], true)} strokeWidth={connectionStrokeWidth} data-status={yStatus} />}
                                </Group>
                            )
                        })}
                    </Group>
                    <Group name="emptyRooms">
                        {getPossibleEmptyRooms(rooms).map((coords: [number, number], index) => {
                            const [xc, yc] = coords;
                            const x = xc * roomOffset;
                            const y = yc * roomOffset;
                            return (
                                <Rect key={index + "-empty"}
                                    onClick={emptyRoomClickHandler}
                                    onTap={emptyRoomClickHandler}
                                    data-coordinates={coords}
                                    x={x}
                                    y={y}
                                    width={roomSize}
                                    height={roomSize}
                                    fill={fillInactive}
                                    stroke={strokeInactive}
                                    strokeWidth={roomStrokeWidth}
                                />
                            )
                        })}
                    </Group>
                    <Group name="rooms" ref={roomRefs}>
                        {Object.keys(rooms).map((roomkey, index) => {
                            const room = rooms[roomkey];
                            let fillColor = room.id === "0,0" ? fillStart : fillActive;
                            let strokeColor = room.id === "0,0" ? strokeStart : strokeActive;
                            if ([room.xCoordinate, room.yCoordinate].toString() === currentRoom.id.toString()) {
                                fillColor = room.id === "0,0" ? fillStartSelected : fillActiveSelected;
                                strokeColor = room.id === "0,0" ? strokeStartSelected : strokeSelected;
                            }
                            let x = room.xCoordinate * roomOffset;
                            let y = room.yCoordinate * roomOffset;
                            let fill = room.id === "0,0" ? fillStart : fillActive;
                            let stroke = room.id === "0,0" ? strokeStart : strokeActive;
                            let name = room.name;
                            return (
                                <Rect onClick={roomClickHandler} onTap={roomClickHandler} key={room.id}
                                    x={x}
                                    y={y}
                                    data-coordinates={[room.xCoordinate, room.yCoordinate]}
                                    width={roomSize}
                                    height={roomSize}
                                    fill={fill}
                                    strokeWidth={roomStrokeWidth}
                                    name={name}
                                    stroke={stroke}
                                />

                            )
                        })}
                    </Group>
                </Layer>
            </Stage>
            </div>

            <form className="row" onSubmit={submitEditDungeon} onChange={() => {
                if (!isEdited) {
                    setIsEdited(true);
                }
            }}>
                <MudInput colmd={6} placeholder={t("dungeon_keys.name")} key={currentRoom.id + "name"} name={"name"} defaultValue={currentRoom.name} />
                <MudInput colmd={6} name="description" placeholder={t("dungeon_keys.description")} key={currentRoom.id + "descr"} defaultValue={currentRoom.description} />
                <MudTypeahead
                    colmd={12}
                    title={t(`dungeon_keys.actions`)}
                    id={"room-actions-typeahead"}
                    labelKey={(option: any) => `${option.command}`}
                    options={actions}
                    multiple
                    onChange={(e: any) => {
                        setSelectedRoomActions(e);
                        if (!isEdited) {
                            setIsEdited(true);
                        }
                    }}
                    placeholder={t(`common.select_actions`)}
                    selected={selectedRoomActions}
                />
                <MudTypeahead
                    colmd={12}
                    title={t(`dungeon_keys.npcs`)}
                    id={"room-npc-typeahead"}
                    labelKey={(option: any) => `${option.name}`}
                    options={npcs}
                    multiple
                    onChange={(e: any) => {
                        setSelectedRoomNpcs(e);
                        if (!isEdited) {
                            setIsEdited(true);
                        }
                    }}
                    placeholder={t(`common.select_npcs`)}
                    selected={selectedRoomNpcs}
                />
                <MudTypeahead
                    colmd={12}
                    title={t(`dungeon_keys.items`)}
                    id={"room-items-typeahead"}
                    labelKey={(option: any) => `${option.name} (${option.description})`}
                    options={items}
                    multiple
                    onChange={(e: any) => {
                        setSelectedRoomItems(e);
                        if (!isEdited) {
                            setIsEdited(true);
                        }
                        let temp = selectedRoomItemValues;
                        // e.forEach((element:any) => {
                        //     if (selectedRoomItemValues[element.id] === undefined) {
                        //         temp = { ...temp, [element.id]: 1};
                        //     }
                        // });
                        const createdItem = e.filter((x: any) => !selectedRoomItems.includes(x))[0];
                        const createdItemId = createdItem?.id;
                        const deletedItemId = (selectedRoomItems.filter((x: any) => !e.includes(x))[0] as any)?.id;
                        setSelectedRoomItemValues({ ...selectedRoomItemValues, [createdItemId || deletedItemId]: 1 });
                    }}
                    placeholder={t(`common.select_items`)}
                    selected={selectedRoomItems}
                />
                {selectedRoomItems.map((item: any) => {
                    return <MudInput colmd={2} type="number" placeholder={item.name + "-" + t("common.amount")} key={currentRoom.id + item.name} name={item.name} value={selectedRoomItemValues[item.id]} onChange={(event) => setSelectedRoomItemValues({ ...selectedRoomItemValues, [item.id]: event.target.value })} />
                })}

                <button className="btn btn-primary" disabled={!isEdited} type="submit">{t(`dungeon_configurator.rooms.save_room`)}</button>
                <button onClick={() => deleteRoom()} disabled={currentRoom.id === "0,0"} className="btn btn-danger">{t(`dungeon_configurator.rooms.delete_room`)}</button>
            </form>
        </>

    )



}



export default RoomConfigurator;