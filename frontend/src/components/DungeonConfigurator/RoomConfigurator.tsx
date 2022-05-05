import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { MudConnectionInfo, MudRoom } from 'src/types/dungeon';
import { Stage, Layer, Rect, Transformer, Circle, Group, Line, Image } from 'react-konva';
import './index.css'
import { useDungeonConfigurator } from 'src/hooks/useDungeonConfigurator';
import MudInput from 'src/components/Custom/Input';
import { useTranslation } from 'react-i18next';
import MudTypeahead from '../Custom/Typeahead';
import { GeoAlt, Question, QuestionCircle } from 'react-bootstrap-icons';
import { Container, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import connectionOpenPng from 'src/assets/connection_open.png';
import connectionClosedPng from 'src/assets/connection_closed.png';
import connectionInactivePng from 'src/assets/connection_inactive.png';
import Konva from 'konva';
import { useRefSize } from 'src/hooks/useRefSize';
import Alert from '../Custom/Alert';

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

const RoomConfigurator: React.FC<RoomConfiguratorProps> = (props) => {

    const widthRef = useRef<any>();
    const roomRefs = useRef<any>({});
    const stageRef = useRef<any>();
    const [width, height] = useRefSize(widthRef);
    const [error, setError] = React.useState<string>("");




    const { rooms, currentRoom, items, npcs, actions, saveRoom: saveRoom, addRoom, deleteRoom, selectRoom, setSelectedRoomActions, setSelectedRoomItemValues, setSelectedRoomItems, setSelectedRoomNpcs, selectedRoomActions, selectedRoomItems, selectedRoomItemValues, selectedRoomNpcs, toggleRoomConnection, setSelectedRoomDescription, setSelectedRoomName, selectedRoomDescription, selectedRoomName } = useDungeonConfigurator();

    useEffect(() => {

    }, []);


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
        if (!currentRoom) {
            // Select the first room
            selectRoom(e.target.attrs["data-coordinates"]);
            return;
        }
        if (String(e.target.attrs["data-coordinates"]) === String([currentRoom.xCoordinate, currentRoom.yCoordinate])) {
            return;
        }
        if (selectedRoomName && selectedRoomDescription) {
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
        } else {
            setError("failvalidation.save_room");
        }
    }

    const addNewRoom = (c: [number, number]) => {
        addRoom(c);
    }

    const emptyRoomClickHandler = (e: any) => {
        if(selectedRoomName && selectedRoomDescription) {
        addNewRoom(e.target.attrs["data-coordinates"]);
        }else{
            setError("failvalidation.room");
        }
    }
    const getPossibleEmptyRooms = (rooms: { [key: string]: MudRoom }) => {
        const occupiedCoords = Object.keys(rooms);
        const dirs = [1, -1, 0];
        let possibleCoords: { [key: string]: [number, number] } = {};

        occupiedCoords.forEach(coord => {
            const [x, y] = coord.split(',').map(Number);
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
    const dt = "room_tooltip";
    const renderTooltip = (props: any) => (
        <Tooltip id="help-tooltip" {...props}>
            <Container>
                <div>
                    <h4>{t(`${dt}.title`)}</h4>
                    <h5>{t(`${dt}.add_room.title`)}</h5>
                    <p>{t(`${dt}.add_room.text`)}</p>
                    <h5>{t(`${dt}.edit_room.title`)}</h5>
                    <p>{t(`${dt}.edit_room.text`)}</p>
                    <h5>{t(`${dt}.toggle_connections.title`)}</h5>
                    <p>{t(`${dt}.toggle_connections.text`)}</p>
                    <Row>
                        <div className="col-md-3">
                            <u>{t("dungeon_keys.connections.open")}</u>:
                        </div>
                        <div className="col-md-9 text-start">
                            <img src={connectionOpenPng} width={100} alt="open" />
                        </div>
                    </Row>
                    <Row>
                        <div className="col-md-3">
                            <u>{t("dungeon_keys.connections.closed")}</u>:
                        </div>
                        <div className="col-md-9 text-start">
                            <img src={connectionClosedPng} width={100} alt="closed" />
                        </div>
                    </Row>
                    <Row>
                        <div className="col-md-3">
                            <u>{t("dungeon_keys.connections.inactive")}</u>:
                        </div>
                        <div className="col-md-9 text-start">
                            <img src={connectionInactivePng} width={100} alt="inactive" />
                        </div>
                    </Row>
                    <br />

                    <h5>{t(`${dt}.navigation.title`)}</h5>

                    <Row>
                        <div className="col-md-3">
                            <u>{t(`${dt}.navigation.zoom_in_out`)}:</u>
                        </div>
                        <div className="col-md-9 text-start">
                            <kbd className="light">{t(`${dt}.navigation.ctrl`)}</kbd> + <kbd className="light">{t(`${dt}.navigation.scroll_wheel`)} ↑↓</kbd>
                        </div>
                    </Row>
                    <Row>
                        <div className="col-md-3">
                            <u>{t(`${dt}.navigation.drag.title`)}:</u>
                        </div>
                        <div className="col-md-9 text-start">
                            {t(`${dt}.navigation.drag.text`)}
                        </div>
                    </Row>
                    <Row>
                        <div className="col-md-3">
                            <u> {t(`${dt}.navigation.refocus`)}</u>:
                        </div>
                        <div className="col-md-9 text-start">
                            <GeoAlt />
                        </div>
                    </Row>
                </div>
            </Container>
            <br />
        </Tooltip>
    );
    const tl = 'dungeon_configurator';
    return (
        <>
            <Row className="mt-5">
                <hr />
                <div className="col mb-3">
                    <span className="headline">{t("dungeon_configurator.rooms.title")}</span>
                </div>
            </Row>
            <Row>
                <div id="konva-buttons-container">
                    <GeoAlt size={37} id="refocus-button" onClick={() => {
                        // stageRef.current.scale({ x: 1, y: 1 });
                        stageRef.current.to({ x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.2, easing: Konva.Easings.EaseInOut });
                        // stageRef.current.position({ x: 0, y: 0 });
                    }} />
                    <OverlayTrigger
                        placement="left"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip}
                    >
                        <QuestionCircle id="help-button" size={37} onClick={() => {
                        }} />
                    </OverlayTrigger>

                </div>
            </Row>
            <div id="konvacontainer" ref={widthRef}>
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
                                        {hasEastRoom && <Line points={[x * roomOffset + roomSize + (roomStrokeWidth / 2), y * roomOffset + (roomSize / 2), (x + 1) * roomOffset, y * roomOffset + (roomSize / 2)]} stroke={xStrokeCol} onClick={(e) => handleConnectionClick(e, [x, y], false)} onTap={(e) => handleConnectionClick(e, [x, y], false)} strokeWidth={connectionStrokeWidth} data-status={xStatus} />}

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
                                let x = room.xCoordinate * roomOffset;
                                let y = room.yCoordinate * roomOffset;
                                let fill;
                                let stroke;
                                const isStart = room.id === "0,0";
                                const isSelected = room.id === currentRoom?.id;
                                if (isStart) {
                                    fill = isSelected ? fillStartSelected : fillStart;
                                    stroke = isSelected ? strokeStartSelected : strokeStart;
                                } else {
                                    fill = isSelected ? fillActiveSelected : fillActive;
                                    stroke = isSelected ? strokeSelected : strokeActive;
                                }
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

            {currentRoom ?
                <>
                    <Row className="mt-2 g-1">
                        <MudInput colmd={12} placeholder={t("dungeon_keys.name")} key={currentRoom.id + "name"} name={"name"} value={selectedRoomName} onChange={event => setSelectedRoomName(event.target.value)} />
                        <MudInput colmd={12} name="description" placeholder={t("dungeon_keys.description")} key={currentRoom.id + "descr"} value={selectedRoomDescription} onChange={event => setSelectedRoomDescription(event.target.value)} />
                        <MudTypeahead
                            colmd={12}
                            title={t(`dungeon_keys.actions`)}
                            id={"room-actions-typeahead"}
                            labelKey={(option: any) => `${option.command}`}
                            options={actions}
                            multiple
                            onChange={(e: any) => {
                                setSelectedRoomActions(e);
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
                    </Row>
                    <Row className="mt-4">
                        <div className="col-md-6">
                            <button onClick={() => deleteRoom()} disabled={currentRoom.id === "0,0"} className="btn w-100 drawn-border btn-red">{t(`dungeon_configurator.rooms.delete_room`)}</button>
                        </div>
                    </Row>
                </>
                : null}
            <Alert message={error} setMessage={setError} type="error" />
        </>

    )
}

export default RoomConfigurator;