/**
 * @module Minimap
 * @category React Components
 * @description Minimap Component to display the currently visible Minimap
 * @props {@linkcode MinimapProps}
 */
import React, { useRef } from 'react'
import { Circle, Group, Layer, Line, Rect, Stage, Text } from 'react-konva';
import { MudRoom } from 'src/types/dungeon';
import { useRabbitMQ } from '../../hooks/useRabbitMQ';
import { useEffect } from 'react';
import './index.css'
import $ from 'jquery'
import { ArrowsFullscreen, Compass, Fullscreen, GeoAlt } from 'react-bootstrap-icons';
import compassPng from 'src/assets/compass.png';
import Konva from 'konva';
import { useRefSize } from '../../hooks/useRefSize';

const roomSize = 60;
const roomMargin = 40
const roomOffset = roomSize + roomMargin;
const connectionStrokeWidth = 10;
const connectionBlobRadius = connectionStrokeWidth;
const initialScale = 0.8;
const minScale = 0.1;
const maxScale = 10;

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


export interface MinimapProps extends MiniMapData { }

const Minimap: React.FC<MinimapProps> = (props) => {

    const { sendToggleConnection } = useRabbitMQ()

    const sizeRef = useRef<any>();
    const stageRef = useRef<any>();
    const currentPositionCircleRef = useRef<any>();
    const [currentRoomId, setCurrentRoomId] = React.useState<string>(props.startRoom);
    const [rooms, setRooms] = React.useState<MiniMapData["rooms"]>(props.rooms);
    const [width, height] = useRefSize(sizeRef);


    useEffect(() => {
        focusOnRoom("0,0", true);
    }, []);

    const toggleConnection = (event: any) => {
        // Change the attrs of the connection
        const status = event.target.attrs["data-status"];
        const roomId = event.target.attrs["data-room"];
        const direction = event.target.attrs["data-direction"];

        sendToggleConnection(roomId, direction, status === 'open' ? 'closed' : 'open', ()=>{
            switch (status) {
                case "open":
                    event.target.setAttrs({
                        stroke: connectionClosed,
                        "data-status": "closed"
                    })
                    break;
                case "closed":
                    event.target.setAttrs({
                        stroke: connectionOpen,
                        "data-status": "open"
                    })
                    break;
            }
        }, console.error);

    }

    const onWheelHandle = (e: any) => {
        e.evt.preventDefault();

        let stage = e.currentTarget;
        var oldScale = stage.attrs.scaleX;
        var pointer = stage.getPointerPosition();
        var scaleBy = 1.1;
        var mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };
        // how to scale? Zoom in? Or zoom out?
        let direction = e.evt.deltaY > 0 ? -1 : 1;

        let scale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
        scale = Math.min(Math.max(scale, minScale), maxScale);
        stage.scale({ x: scale, y: scale });

        var newPos = {
            x: pointer.x - mousePointTo.x * scale,
            y: pointer.y - mousePointTo.y * scale,
        };
        stage.position(newPos);
    }


    const focusOnRoom = (roomId: string, isAnc: boolean) => {
        if (isAnc && stageRef.current) {
            const xc = parseInt((roomId || currentRoomId).split(",")[0]);
            const yc = parseInt((roomId || currentRoomId).split(",")[1]);
            const x = -xc * roomOffset * initialScale;
            const y = -yc * roomOffset * initialScale;
            stageRef.current.to({ x: x, y: y, duration: 0.4, scaleX: initialScale, scaleY: initialScale, easing: Konva.Easings.EaseInOut });
        }
    }

    return (
        <>
            <div id="konva-buttons-container">
                <img src={compassPng} alt="compass" id="compass" onClick={() => {
                    focusOnRoom(currentRoomId, true);
                 }} />
                <ArrowsFullscreen size={40} onClick={() => {
                    $("body").toggleClass("noclickevents");
                    $('#minimap').toggleClass('fullscreen');
                    // Check if the stage is already fullscreen
                    if ($('#minimap').hasClass('fullscreen')) {
                        stageRef.current.setAttrs({
                            width: window.innerWidth,
                            height: window.innerHeight,
                        })
                    }else{
                        stageRef.current.to({
                            width: width,
                            height: width,
                            duration: 0.01,
                        })
                    }
                }} />
            </div>
            <div id="minimap" className="mb-2" ref={sizeRef}>
                <Stage ref={stageRef} onWheel={onWheelHandle} width={width} height={width} draggable offsetY={(-width / 2) / initialScale + (roomSize / 2)} offsetX={(-width / 2) / initialScale + (roomSize / 2)}>
                    <Layer>
                        <Group name="rooms">
                            {Object.keys(rooms).map((roomkey, index) => {
                                const room = rooms[roomkey];
                                let fillColor = fillActive;
                                let strokeColor = strokeActive;
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
                                const xStatus = rooms[roomkey].connections.east;
                                const yStatus = rooms[roomkey].connections.south;


                                const xPoints = [x * roomOffset + roomSize + 2, y * roomOffset + (roomSize / 2), (x + 1) * roomOffset, y * roomOffset + (roomSize / 2)];

                                const yPoints = [x * roomOffset + (roomSize / 2), y * roomOffset + roomSize + 2, x * roomOffset + (roomSize / 2), (y + 1) * roomOffset];

                                let connections: React.ReactNode[] = [];


                                (xStatus !== 'inactive') && connections.push(<Line key={`${roomkey}-connection-east`} points={xPoints} stroke={xStrokeCol} data-room={roomkey} strokeWidth={connectionStrokeWidth} data-status={xStatus} onClick={toggleConnection} data-direction={'east'} />);


                                (yStatus !== 'inactive') && connections.push(<Line key={`${roomkey}-connection-south`} points={yPoints} stroke={yStrokeCol} data-room={roomkey} strokeWidth={connectionStrokeWidth} data-status={yStatus} onClick={toggleConnection} data-direction={'south'} />);



                                return (
                                    <Group key={roomkey}>
                                        {connections}
                                        <Rect
                                            x={x * roomOffset}
                                            y={y * roomOffset}
                                            data-coordinates={[room.xCoordinate, room.yCoordinate]}
                                            width={roomSize}
                                            height={roomSize}
                                            fill={fillColor}
                                            strokeWidth={roomStrokeWidth}
                                            stroke={strokeColor}
                                        />
                                        <Text
                                            x={x * roomOffset }
                                            y={y * roomOffset }
                                            width={roomSize}
                                            height={roomSize}
                                            align="center"
                                            padding={roomStrokeWidth}
                                            text={"lorem ipsulorem ipsum dolor sit ametlorem ipsum dolor sit ametm dolor sit ametlorem ipsum dolor sit ametlorem ipsum dolor sit amet"}
                                            verticalAlign="middle"
                                        />

                                    </Group>
                                )
                            })}
                            {/* {<Circle ref={currentPositionCircleRef} data-id="0,0" x={0 * roomOffset + (roomSize / 2)} y={0 * roomOffset + (roomSize / 2)} radius={roomSize / 4} fill={fillCurrentRoom} stroke={fillCurrentRoom} />} */}
                        </Group>
                    </Layer>
                </Stage>
            </div>

        </>
    )
}

export default Minimap;    