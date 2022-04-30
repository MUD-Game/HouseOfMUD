import React, { useEffect, useRef } from 'react';
import { MudConnectionInfo, MudRoom } from 'src/types/dungeon';
import { Stage, Layer, Rect, Transformer, Circle, Group } from 'react-konva';
import './index.css'
import { useDungeonConfigurator } from 'src/hooks/useDungeonConfigurator';
import MudInput from 'src/components/Custom/MudInupt';
import { useTranslation } from 'react-i18next';
import MudTypeahead from '../Custom/MudTypeahead';
export interface RoomConfiguratorProps {
}
type Option = string | { [key: string]: any };
const RoomConfigurator: React.FC<RoomConfiguratorProps> = (props) => {

    const [width, setWidth] = React.useState(0);
    const [mapSize, setMapSize] = React.useState({ width: 10, height: 5 });
    const ref = useRef<any>();
    useEffect(()=>{
        setWidth(ref.current.clientWidth);
    },[]);
    const {rooms, currentRoom ,items, npcs, editRoom, addRoom, deleteRoom, selectRoom, setSelectedRoomActions, setSelectedRoomItemValues, setSelectedRoomItems, setSelectedRoomNpcs, selectedRoomActions, selectedRoomItems, selectedRoomItemValues, selectedRoomNpcs} = useDungeonConfigurator();
    const roomSize = 60;
    const roomOffset = 50;

    const sizeX = 20;
    const sizeY = 20;
    let bodyStyles = window.getComputedStyle(document.body);
    let fooBar = bodyStyles.getPropertyValue('--accent');
    const fillActive = fooBar;
    const fillStart = '#FF4a20';
    const strokeActive = '#6b2a00';
    const strokeStart = '#8b2a00';

    const fillInactive = '#ddd';
    const strokeInactive = '#ccc';
    
    const onWheelHandle = (e:any)=>{
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

    const roomClickHandler = (e:any)=>{
        selectRoom(e.target.attrs["data-coordinates"]);
        setIsEdited(false);
    }

    const addNewRoom = (c: [number, number]) => {
        addRoom(c);
    }

    const emptyRoomClickHandler = (e:any)=>{
        switch(e.evt.detail){
            case 2:
                addNewRoom(e.target.attrs["data-coordinates"]);
                break;
        }
    }

    const submitEditDungeon = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();   
        const formData = new FormData(evt.currentTarget);
        // get name and description
        const name = formData.get("name");
        const description = formData.get("description");
        const newData:MudRoom = {
            id: currentRoom.id,
            name: name,
            description: description,
            npcs: [],
            items: [],
            connections: { east: 'inactive', south: 'inactive' },
            actions: [],
            xCoordinate: currentRoom.xCoordinate,
            yCoordinate: currentRoom.yCoordinate
        } as MudRoom;
        editRoom(newData);
        setIsEdited(false);
    }


    const {t} = useTranslation();
    const tl = 'dungeon_configurator';
    const [isEdited, setIsEdited] = React.useState(false);
    return (
        <div ref={ref}>
            <form className="row" onSubmit={submitEditDungeon} onChange={() => {
                if(!isEdited){
                    setIsEdited(true);
                }
            }}>
                <MudInput colmd={6} placeholder={t("dungeon_keys.name")} key={currentRoom.id + "name"} name={"name"} defaultValue={currentRoom.name}/>
                <MudInput colmd={6} name="description" placeholder={t("dungeon_keys.description")} key={currentRoom.id + "descr"} defaultValue={currentRoom.description}/>
                <MudTypeahead
                    colmd={12}
                    title={t(`dungeon_keys.items`)}
                    id={"typeahead-items"}
                    labelKey={(option: any) => `${option.name} (${option.description})`}
                    options={items}
                    multiple
                    onChange={(e:any)=>{
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
                        const createdItem = e.filter((x:any) => !selectedRoomItems.includes(x))[0];
                        const createdItemId = createdItem?.id;
                        const deletedItemId = (selectedRoomItems.filter((x:any) => !e.includes(x))[0] as any)?.id;
                        setSelectedRoomItemValues({ ...selectedRoomItemValues, [createdItemId || deletedItemId]: 1});
                    }}
                    placeholder={t(`common.select_items`)}
                    selected={selectedRoomItems}
                />
                {selectedRoomItems.map((item:any)=>{
                    return <MudInput colmd={2} type="number" placeholder={item.name+"-"+t("common.amount")} key={currentRoom.id + item.name} name={item.name} value={selectedRoomItemValues[item.id]} onChange={(event)=> setSelectedRoomItemValues({...selectedRoomItemValues, [item.id]: event.target.value})}/>
                })}
                <button className="btn btn-primary" disabled={!isEdited} type="submit">{t(`button.save`)}</button>
            </form>
            <Stage onWheel={onWheelHandle} width={width} height={width / 1.618} draggable>
                <Layer>
                    <Group name="emptyRooms">
                        {Array(mapSize.width*mapSize.height).fill(0).map((_, index) => {
                            const x = index % mapSize.width * (roomSize + roomOffset);
                            const y = Math.floor(index / mapSize.width) * (roomSize + roomOffset);
                            return (
                                <Rect key={index+"-empty"}
                                    onClick={emptyRoomClickHandler}
                                    data-coordinates={[index % mapSize.width, Math.floor(index / mapSize.width) ]}
                                    x={x}
                                    y={y}
                                    width={roomSize}
                                    height={roomSize}
                                    fill={fillInactive}
                                    stroke={strokeInactive}
                                    />
                            )
                        })}
                    </Group>
                    <Group name="rooms">
                        {Object.keys(rooms).map((roomkey, index) => {
                            const room = rooms[roomkey];
                            let x = room.xCoordinate * (roomSize + roomOffset);
                            let y = room.yCoordinate * (roomSize + roomOffset);
                            let fill = room.id === "0,0" ? fillStart : fillActive;
                            let stroke = room.id === "0,0" ? strokeStart : strokeActive;
                            let name = room.name;
                            return (
                                    <Rect onClick={roomClickHandler} key={room.id}
                                        x={x}
                                        y={y}
                                        data-coordinates={[room.xCoordinate, room.yCoordinate ]}
                                        width={roomSize}
                                        height={roomSize}
                                        fill={fill}
                                        name={name}
                                        stroke={stroke}
                                        />
                            )
                        })}
                    </Group>
                </Layer>
            </Stage>
        </div>
    )


}


export default RoomConfigurator;