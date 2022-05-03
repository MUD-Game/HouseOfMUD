/**
 * @module Minimap
 * @category React Components
 * @description Minimap Component to display the currently visible Minimap
 * @props {@linkcode MinimapProps}
 */
import React, { useRef } from 'react'
import { Group, Layer, Line, Rect, Stage } from 'react-konva';
import { MudRoom } from 'src/types/dungeon';
import { useRabbitMQ } from '../../hooks/useRabbitMQ';
import { useEffect } from 'react';
import './index.css'
import { Compass, GeoAlt } from 'react-bootstrap-icons';
import compassPng from 'src/assets/compass.png';

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
const fillCurrentRoom = bodyStyles.getPropertyValue('--room-current-fill');

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

export interface MiniMapData {
    rooms: {
        [key: string]: {
            xCoordinate: MudRoom['xCoordinate'],
            yCoordinate: MudRoom['yCoordinate'],
            connections: MudRoom['connections'],
            explored: boolean
        }
    };
    startRoom: string;
}


export interface MinimapProps extends MiniMapData {}

const Minimap: React.FC<MinimapProps> = (props) => {

    const { } = useRabbitMQ()

    const sizeRef = useRef<any>();
    const stageRef = useRef<any>();
    const [currentRoomId, setCurrentRoomId] = React.useState<string>(props.startRoom);
    const [rooms, setRooms] = React.useState<MiniMapData["rooms"]>(props.rooms);
    const [size, setSize] = React.useState<{ width: number, height: number }>({ width: 0, height: 0 });

    useEffect(() => {
        setSize({ width: sizeRef.current.clientWidth, height: sizeRef.current.clientHeight });
    }, [sizeRef])

    const focusOnRoom = (roomId?:string) => {
        if(stageRef.current){
            const xc = parseInt((roomId || currentRoomId).split(",")[0]);
            const yc = parseInt((roomId || currentRoomId).split(",")[1]);
            const x = -xc * roomOffset; 
            const y = -yc * roomOffset;
            stageRef.current.scale({ x: 1, y: 1 });
            stageRef.current.position({ x: x, y: y });
        }
    }

    return (
        <>
            <div id="konva-buttons-container">
                <img src={compassPng} alt="compass" id="compass" onClick={() => {
                    focusOnRoom();
                }} />
            </div>
            <div id="minimap" ref={sizeRef}>
                <Stage ref={stageRef} onWheel={onWheelHandle} width={size.width} height={size.height} draggable offsetY={-size.height / 2 + roomSize / 2} offsetX={-size.width / 2 + roomSize / 2}>
                    <Layer>
                        <Group name="connections">
                            {Object.keys(rooms).map(key => {
                                const room = rooms[key];
                                // used if this room isnt explored to draw the connections to the other rooms
                                let eastExplored = true;
                                let southExplored = true;
                                const eastRoom = rooms[`${room.xCoordinate + 1},${room.yCoordinate}`];
                                const southRoom = rooms[`${room.xCoordinate},${room.yCoordinate + 1}`];
                                eastExplored = eastRoom && eastRoom.explored;
                                southExplored = southRoom && southRoom.explored;
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


                                const xPoints = [x * roomOffset + roomSize + 2, y * roomOffset + (roomSize / 2), (x + 1) * roomOffset, y * roomOffset + (roomSize / 2)];

                                const yPoints = [x * roomOffset + (roomSize / 2), y * roomOffset + roomSize + 2, x * roomOffset + (roomSize / 2), (y + 1) * roomOffset];
                                if(!room.explored && !eastExplored && !southExplored){
                                    return null;
                                }
                                return (
                                    <Group key={key + "connections"}>
                                        {(eastRoom || eastExplored) && <Line points={xPoints} stroke={xStrokeCol} strokeWidth={connectionStrokeWidth} data-status={xStatus} />}

                                        {(southRoom || southExplored) && <Line points={yPoints} stroke={yStrokeCol} strokeWidth={connectionStrokeWidth} data-status={yStatus} />}
                                    </Group>
                                )
                            })}
                        </Group>
                        <Group name="rooms">
                            {Object.keys(rooms).map((roomkey, index) => {
                                const room = rooms[roomkey];
                                if (!room.explored) return null;
                                let fillColor = fillActive;
                                let strokeColor = strokeActive;
                                if (roomkey === currentRoomId) {
                                    fillColor = fillCurrentRoom;
                                }
                                let x = room.xCoordinate * roomOffset;
                                let y = room.yCoordinate * roomOffset;
                                return (
                                    <Rect key={roomkey}
                                        x={x}
                                        y={y}
                                        data-coordinates={[room.xCoordinate, room.yCoordinate]}
                                        width={roomSize}
                                        height={roomSize}
                                        fill={fillColor}
                                        strokeWidth={roomStrokeWidth}
                                        stroke={strokeColor}
                                    />
                                )
                            })}
                        </Group>
                    </Layer>
                </Stage>
            </div>
            
        </>
    )
}

export default Minimap;    