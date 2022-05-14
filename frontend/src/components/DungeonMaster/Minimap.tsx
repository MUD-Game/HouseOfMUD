/**
 * @module Minimap
 * @category React Components
 * @description Minimap Component to display the currently visible Minimap
 * @props {@linkcode MinimapProps}
 */
import React, { useRef, useLayoutEffect } from 'react'
import { Group, Layer, Line, Rect, Stage, Text } from 'react-konva';
import { MudRoom } from 'src/types/dungeon';
import { useRabbitMQ } from '../../hooks/useRabbitMQ';
import './index.css'
import { ArrowsAngleContract, ArrowsFullscreen, QuestionCircle } from 'react-bootstrap-icons';
import compassPng from 'src/assets/compass.png';
import Konva from 'konva';
import { Container, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const roomSize = 60;
const roomMargin = 40
const roomOffset = roomSize + roomMargin;
const connectionStrokeWidth = 10;
const initialScaleSmall = 0.8;
const initialScaleLarge = 4;
const minScale = 0.1;
const maxScale = 10;

let bodyStyles = window.getComputedStyle(document.body);

const roomStrokeWidth = 4;


const fillActive = bodyStyles.getPropertyValue('--room-active-fill');
const strokeActive = bodyStyles.getPropertyValue('--room-active-stroke');

const connectionOpen = bodyStyles.getPropertyValue('--connection-open');
const connectionInactive = bodyStyles.getPropertyValue('--connection-inactive');
const connectionClosed = bodyStyles.getPropertyValue('--connection-closed');


export interface MiniMapData {
    rooms: {
        [key: string]: {
            xCoordinate: MudRoom['xCoordinate'],
            yCoordinate: MudRoom['yCoordinate'],
            connections: MudRoom['connections'],
            explored: boolean,
            name:string
        }
    };
    startRoom: string;
}


export interface MinimapProps extends MiniMapData { }

const Minimap: React.FC<MinimapProps> = (props) => {

    const { sendToggleConnection } = useRabbitMQ()

    const sizeRef = useRef<any>();
    const stageRef = useRef<any>();
    const [rooms] = React.useState<MiniMapData["rooms"]>(props.rooms);
    // const [width, height] = useRefSize(sizeRef);
    const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false);
    const [size, setSize] = React.useState<{ width: number, height: number }>({ width: 0, height: 0 });
    const {t} = useTranslation();
    const dt = "minimap";

    const renderTooltip = (props: any) => (
        <Tooltip id="help-tooltip" {...props}>
            <Container>
                <div>
                    <h5>{t(`${dt}.navigation.title`)}</h5>

                    <Row className="py-1">
                        <div className="col-md-3">
                            <u>{t(`${dt}.navigation.zoom_in_out`)}:</u>
                        </div>
                        <div className="col-md-9 text-start">
                            <kbd className="light">{t(`${dt}.navigation.scroll_wheel`)} ↑↓</kbd>
                        </div>
                    </Row>
                    <Row className="py-1">
                        <div className="col-md-3">
                            <u>{t(`${dt}.navigation.drag.title`)}:</u>
                        </div>
                        <div className="col-md-9 text-start">
                            {t(`${dt}.navigation.drag.text`)}
                        </div>
                    </Row>
                    <Row className="py-1">
                        <div className="col-md-3">
                            <u> {t(`${dt}.navigation.refocus`)}</u>:
                        </div>
                        <div className="col-md-9 text-start">
                            <img src={compassPng} alt="compass" style={{ background: "var(--bgcolor)", padding: ".2em" }} width="40" height="40" />
                        </div>
                    </Row>
                    <Row className="py-1">
                        <div className="col-md-3">
                            <u> {t(`${dt}.navigation.fullscreen`)}</u>:
                        </div>
                        <div className="col-md-9 text-start">
                            <ArrowsFullscreen style={{ background: "var(--bgcolor)", padding: ".2em" }} color="var(--accent)" width="40" height="40" />
                        </div>
                    </Row>
                    <Row className="py-1">
                        <div className="col-md-3">
                            <u> {t(`${dt}.navigation.toggle_connection.title`)}</u>:
                        </div>
                        <div className="col-md-9 text-start">
                            {t(`${dt}.navigation.toggle_connection.text`)}
                        </div>
                    </Row>
                </div>
            </Container>
            <br />
        </Tooltip>
    );

    // Get the new Size of sizeRef on resize
    useLayoutEffect(() => {
        let windowListener = () => setSize({ width: sizeRef?.current?.clientWidth, height: sizeRef?.current?.clientHeight });
        window.addEventListener('resize', windowListener);
        windowListener();
        return () => {
            window.removeEventListener('resize', windowListener);
        }
    }, []);

    useLayoutEffect(() => {
        focusOnRoom("0,0", isFullscreen);
    }, [isFullscreen]);

    // useEffect(() => {
    //     console.log("d")
    //     const s = sizeRef.current.getBoundingClientRect();
    //     setSize({ width: s.width, height: s.height });
    // }, [sizeRef]);

    const toggleConnection = (event: any) => {
        // Change the attrs of the connection
        const status = event.target.attrs["data-status"] as string;
        const roomId = event.target.attrs["data-room"] as string;
        const direction = event.target.attrs["data-direction"] as 'east' | 'south';

        sendToggleConnection(roomId, direction, status === 'open' ? 'closed' : 'open', () => {
            switch (status) {
                case "open":
                    event.target.setAttrs({
                        stroke: connectionClosed,
                        "data-status": "closed"
                    })
                    rooms[roomId].connections[direction] = "closed";
                    break;
                    case "closed":
                        event.target.setAttrs({
                            stroke: connectionOpen,
                            "data-status": "open"
                        })
                        rooms[roomId].connections[direction] = "open";
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


    const focusOnRoom = (roomId: string, isFullscreen: boolean) => {
        if (stageRef.current) {
            const xc = parseInt((roomId).split(",")[0]);
            const yc = parseInt((roomId).split(",")[1]);
            const usedScale = isFullscreen ? initialScaleLarge : initialScaleSmall;
            const x = -xc * roomOffset * usedScale;
            const y = -yc * roomOffset * usedScale;
            stageRef.current.to({ x: x, y: y, duration: 0.4, scaleX: usedScale, scaleY: usedScale, easing: Konva.Easings.EaseInOut });
        }
    }

    return (
        <div ref={sizeRef}>
            <div id={`konva-buttons-container${isFullscreen ? "-fullscreen" : ""}`}>
                <img src={compassPng} draggable={false} alt="compass" id={`compass${isFullscreen ? "-fullscreen" : ""}`} onClick={() => {
                    focusOnRoom("0,0", isFullscreen);
                }} />
                {isFullscreen ? <ArrowsAngleContract id={`fullscreenbutton-fullscreen`} onClick={() => {
                    setIsFullscreen(!isFullscreen);
                }} /> : <ArrowsFullscreen id={`fullscreenbutton`} onClick={() => {
                    setIsFullscreen(!isFullscreen);
                }} />}
            </div>
            <div id={`minimap${isFullscreen ? "-fullscreen" : ""}`} className="mb-2">
                {!isFullscreen ? <Stage ref={stageRef} onWheel={onWheelHandle} width={size.width} height={size.width} draggable offsetY={(-size.width / 2) / initialScaleSmall + (roomSize / 2)} offsetX={(-size.width / 2) / initialScaleSmall + (roomSize / 2)}>
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


                                const xPoints = [x * roomOffset + roomSize + roomStrokeWidth / 2, y * roomOffset + (roomSize / 2), (x + 1) * roomOffset - roomStrokeWidth / 2, y * roomOffset + (roomSize / 2)];

                                const yPoints = [x * roomOffset + (roomSize / 2), y * roomOffset + roomSize + roomStrokeWidth / 2, x * roomOffset + (roomSize / 2), (y + 1) * roomOffset - roomStrokeWidth / 2];

                                let connections: React.ReactNode[] = [];


                                (xStatus !== 'inactive') && connections.push(<Line key={`${roomkey}-connection-east`} points={xPoints} stroke={xStrokeCol} data-room={roomkey} strokeWidth={connectionStrokeWidth} data-status={xStatus} onClick={toggleConnection} data-direction={'east'} />);


                                (yStatus !== 'inactive') && connections.push(<Line key={`${roomkey}-connection-south`} points={yPoints} stroke={yStrokeCol} data-room={roomkey} strokeWidth={connectionStrokeWidth} data-status={yStatus} onClick={toggleConnection} data-direction={'south'} />);

                              

                                return (
                                    <Group key={roomkey}>
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
                                        {connections}

                                    </Group>
                                )
                            })}
                            {/* {<Circle ref={currentPositionCircleRef} data-id="0,0" x={0 * roomOffset + (roomSize / 2)} y={0 * roomOffset + (roomSize / 2)} radius={roomSize / 4} fill={fillCurrentRoom} stroke={fillCurrentRoom} />} */}
                        </Group>
                    </Layer>
                </Stage>
                    : <Stage onWheel={onWheelHandle} width={window.innerWidth} scaleX={initialScaleLarge} scaleY={initialScaleLarge} height={window.innerHeight} draggable offsetY={(-window.innerHeight / 2) / (initialScaleLarge) + (roomSize / 2)} offsetX={-window.innerWidth / 2 / (initialScaleLarge) + (roomSize / 2)}>
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


                                const xPoints = [x * roomOffset + roomSize + roomStrokeWidth / 2, y * roomOffset + (roomSize / 2), (x + 1) * roomOffset - roomStrokeWidth / 2, y * roomOffset + (roomSize / 2)];

                                const yPoints = [x * roomOffset + (roomSize / 2), y * roomOffset + roomSize + roomStrokeWidth / 2, x * roomOffset + (roomSize / 2), (y + 1) * roomOffset - roomStrokeWidth / 2];

                                let connections: React.ReactNode[] = [];


                                (xStatus !== 'inactive') && connections.push(<Line key={`${roomkey}-connection-east`} points={xPoints} stroke={xStrokeCol} data-room={roomkey} strokeWidth={connectionStrokeWidth} data-status={xStatus} onClick={toggleConnection} data-direction={'east'} />);


                                (yStatus !== 'inactive') && connections.push(<Line key={`${roomkey}-connection-south`} points={yPoints} stroke={yStrokeCol} data-room={roomkey} strokeWidth={connectionStrokeWidth} data-status={yStatus} onClick={toggleConnection} data-direction={'south'} />);

                                const roomNameText = {
                                    x: x * roomOffset,
                                    y: y * roomOffset,
                                    align: "center",
                                    width: roomSize,
                                    height: roomSize,
                                    fontSize: 10,
                                    fontFamily: 'Segoe UI',
                                    padding: roomStrokeWidth,
                                    text: room.name,
                                    wrap: "word",
                                    verticalAlign: "middle"
                                }

                                const coordText = {
                                    x: x * roomOffset,
                                    y: y * roomOffset,
                                    align: "left",
                                    width: roomSize,
                                    height: roomSize,
                                    fontSize: 8,
                                    fontFamily: 'Segoe UI',
                                    padding: roomStrokeWidth,
                                    text: roomkey,
                                    wrap: "word",
                                    verticalAlign: "top"
                                }
                                // let text = new Konva.Text(roomNameText)
                                // console.log(text.getSize());

                                return (
                                    <Group key={roomkey}>
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
                                           {...roomNameText}
                                        />
                                        <Text 
                                            {... coordText}
                                        />
                                        {connections}

                                    </Group>
                                )
                            })}
                            {/* {<Circle ref={currentPositionCircleRef} data-id="0,0" x={0 * roomOffset + (roomSize / 2)} y={0 * roomOffset + (roomSize / 2)} radius={roomSize / 4} fill={fillCurrentRoom} stroke={fillCurrentRoom} />} */}
                        </Group>
                    </Layer>
                </Stage>}
            </div>
            <div style={{ width: size.width }}>
                {isFullscreen ? null : <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                >
                     <QuestionCircle id="help-button-minimap" size={37} onClick={() => {
                    }} />
                </OverlayTrigger>}
            
            </div>
        </div>
    )
}

export default Minimap;    