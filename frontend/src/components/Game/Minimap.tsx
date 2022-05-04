/**
 * @module Minimap
 * @category React Components
 * @description Minimap Component to display the currently visible Minimap
 * @props {@linkcode MinimapProps}
 */
import React, { useRef } from 'react'
import { Circle, Group, Layer, Line, Rect, Stage } from 'react-konva';
import { MudRoom } from 'src/types/dungeon';
import { useRabbitMQ } from '../../hooks/useRabbitMQ';
import { useEffect } from 'react';
import './index.css'
import { Compass, GeoAlt } from 'react-bootstrap-icons';
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
const maxScale = 1.5;

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


export interface MinimapProps extends MiniMapData {}

const Minimap: React.FC<MinimapProps> = (props) => {

    const { setRoomSubscriber } = useRabbitMQ()

    const sizeRef = useRef<any>();
    const stageRef = useRef<any>();
    const currentPositionCircleRef = useRef<any>();
    const [currentRoomId, setCurrentRoomId] = React.useState<string>(props.startRoom);
    const [rooms, setRooms] = React.useState<MiniMapData["rooms"]>(props.rooms);
    const [width, height] = useRefSize(sizeRef);

    useEffect(() => {
        setRoomSubscriber((id:string)=>{
            setCurrentRoomId(id);
            let tempRooms = rooms;
            tempRooms[id].explored = true;
            setRooms(tempRooms);
            // Check if we move on the x or y axis
            const oldId = currentPositionCircleRef.current.attrs["data-id"];
            currentPositionCircleRef.current.attrs["data-id"] = id;
            const [oldX, oldY] = oldId.split(',').map((x:any)=>parseInt(x));
            const [newX, newY] = id.split(',').map(x=>parseInt(x));
            // initially for ltr
            let xHalf = (newX * roomOffset - roomMargin / 2);
            const xFull = (newX * roomOffset + roomSize / 2);
            let yHalf = (newY * roomOffset - roomMargin / 2);
            const yFull = (newY * roomOffset + roomSize / 2);
            if(newX>oldX){ // Left to right
                xHalf = (newX * roomOffset - roomMargin / 2)
                yHalf = yFull;
            }else if(newX<oldX){ // Right to left
                xHalf = (newX * roomOffset + roomMargin / 2)
                yHalf = yFull;
            }else if(newY>oldY){ // Top to bottom
                xHalf = xFull;
                yHalf = (newY * roomOffset - roomMargin / 2)
            }else if(newY<oldY){ // Bottom to top
                xHalf = xFull;
                yHalf = (newY * roomOffset + roomSize / 2)
            }else{
                return;
            }
            stageRef.current.to({ x: -rooms[id].xCoordinate * roomOffset * initialScale, y: -rooms[id].yCoordinate * roomOffset * initialScale, duration: 1, scaleX: initialScale, scaleY: initialScale, easing: Konva.Easings.EaseInOut });
            currentPositionCircleRef.current.to({
                duration: 0.5,
                radius: roomSize / 16,
                x: xHalf,
                y: yHalf,
                easing: Konva.Easings.EaseIn,
                onFinish: () => {
                    currentPositionCircleRef.current.to({
                        duration: 0.5,
                        radius: roomSize / 4,
                        x: xFull,
                        y: yFull,
                        easing: Konva.Easings.EaseOut
                    })
                }
          
            })
        });
        focusOnRoom("0,0", true);
    }, []);


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


    const focusOnRoom = (roomId:string, isAnc:boolean) => {
        console.log("focus")
        if(isAnc && stageRef.current){
            const xc = parseInt((roomId || currentRoomId).split(",")[0]);
            const yc = parseInt((roomId || currentRoomId).split(",")[1]);
            const x = -xc * roomOffset * initialScale;
            const y = -yc * roomOffset * initialScale;
            stageRef.current.to({ x: x, y: y, duration: 0.4,scaleX: initialScale, scaleY: initialScale, easing: Konva.Easings.EaseInOut});
        }
    }

    return (
        <>
            <div id="konva-buttons-container">
                <img src={compassPng} alt="compass" id="compass" onClick={() => {
                     focusOnRoom(currentRoomId, true);
                }} />
            </div>
            <div id="minimap"  ref={sizeRef}>
                <Stage ref={stageRef} onWheel={onWheelHandle} width={width} height={width} draggable offsetY={(-width / 2) / initialScale + (roomSize / 2)} offsetX={(-width / 2) / initialScale + (roomSize / 2)}>
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
                                        eastExplored = false;
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
                                        southExplored = false;
                                        yStrokeCol = connectionInactive;
                                        break;
                                    case 'closed':
                                        yStrokeCol = connectionClosed;
                                        break;
                                }
                                const xStatus = rooms[key].connections.east;
                                const yStatus = rooms[key].connections.south;

                                const isEastInactive = !eastExplored && xStatus === 'inactive';
                                const isSouthInactive = !southExplored && yStatus === 'inactive';


                                const onEastVisible = (room.explored && !isEastInactive);
                                const onWestVisible = (!room.explored && eastExplored);
                                const onNorthVisible = !room.explored && southExplored;
                                const onSouthVisible = room.explored && !isSouthInactive

                                let returnNode:React.ReactNode[] = [];

                                if(room.explored){
                                   return null; 
                                }
                                else{
                                    if(onEastVisible){
                                        returnNode.push(<Circle key={`${key}-connection-unexplored-east`} x={x * roomOffset + roomSize + 2} y={y * roomOffset + (roomSize / 2)} stroke={xStrokeCol} radius={connectionBlobRadius} fill={xStrokeCol} data-status={xStatus} />);
                                    }
                                    if(onWestVisible){
                                        returnNode.push(<Circle key={`${key}-connection-unexplored-west`} x={(x + 1) * roomOffset} y={y * roomOffset + (roomSize / 2)} stroke={xStrokeCol} radius={connectionBlobRadius} fill={xStrokeCol} data-status={xStatus} />);
                                    }
                                    if(onNorthVisible){
                                        returnNode.push(<Circle key={`${key}-connection-unexplored-north`} x={x * roomOffset + (roomSize / 2)} y={(y + 1) * roomOffset} stroke={yStrokeCol} radius={connectionBlobRadius} fill={yStrokeCol} data-status={xStatus} />);
                                    }
                                    if(onSouthVisible){
                                        returnNode.push(<Circle key={`${key}-connection-unexplored-south`} x={x * roomOffset + (roomSize / 2)} y={y * roomOffset + roomSize + 2} stroke={yStrokeCol} radius={connectionBlobRadius} fill={yStrokeCol} data-status={xStatus} />);
                                    }
                                }
                                
                                return (
                                    <Group key={key + "connections-from-empty"}>
                                        {returnNode}                                      
                                    </Group>
                                )
                            })}
                        </Group>
                        <Group name="rooms">
                            {Object.keys(rooms).map((roomkey, index) => {
                                const room = rooms[roomkey];
                                let fillColor = fillActive;
                                let strokeColor = strokeActive;
                                if (!room.explored) {
                                    return null
                                }
                               
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
                                        eastExplored = false;
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
                                        southExplored = false;
                                        yStrokeCol = connectionInactive;
                                        break;
                                    case 'closed':
                                        yStrokeCol = connectionClosed;
                                        break;
                                }
                                const xStatus = rooms[roomkey].connections.east;
                                const yStatus = rooms[roomkey].connections.south;

                                const isEastInactive = !eastExplored && xStatus === 'inactive';
                                const isSouthInactive = !southExplored && yStatus === 'inactive';

                                const xPoints = [x * roomOffset + roomSize + 2, y * roomOffset + (roomSize / 2), (x + 1) * roomOffset, y * roomOffset + (roomSize / 2)];

                                const yPoints = [x * roomOffset + (roomSize / 2), y * roomOffset + roomSize + 2, x * roomOffset + (roomSize / 2), (y + 1) * roomOffset];
                                let connections:React.ReactNode[] = []

                                if (!isEastInactive){

                                    if(!eastExplored ){
                                        // Put a blob instead of line
                                        connections.push(<Circle key={`${roomkey}-connection-explored-east`} x={x * roomOffset + roomSize + 2} y={y * roomOffset + (roomSize / 2)} stroke={xStrokeCol} radius={connectionBlobRadius} fill={xStrokeCol} data-status={xStatus} />);
                                    }else{
                                        // Put a line
                                        connections.push(<Line key={`${roomkey}-connection-explored-east`} points={xPoints} stroke={xStrokeCol} strokeWidth={connectionStrokeWidth}  data-status={xStatus} />);
                                    }
                                }
                                if (!isSouthInactive){

                                if(!southExplored){
                                    // Put a blob instead of line
                                    connections.push(<Circle key={`${roomkey}-connection-explored-south`} x={x * roomOffset + (roomSize / 2)} y={y * roomOffset + roomSize + 2} stroke={yStrokeCol} radius={connectionBlobRadius} fill={yStrokeCol} data-status={yStatus} />);
                                }else{
                                    // Put a line
                                    connections.push(<Line key={`${roomkey}-connection-explored-south`} points={yPoints} stroke={yStrokeCol} strokeWidth={connectionStrokeWidth} data-status={yStatus} />);
                                    }
                                }

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
                                        
                                    </Group>
                                )
                            })}
                            {<Circle ref={currentPositionCircleRef} data-id="0,0" x={0 * roomOffset + (roomSize / 2)} y={0 * roomOffset + (roomSize / 2)} radius={roomSize / 4} fill={fillCurrentRoom} stroke={fillCurrentRoom} />}
                        </Group>
                    </Layer>
                </Stage>
            </div>
            
        </>
    )
}

export default Minimap;    