/**
 * @module AddRoomModal
 * @description Modal for adding a new room to the dungeon.
 * @author Raphael Sack
 * @category Modal
 */

import React from 'react';
import { Modal, Button, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Alert from 'src/components/Custom/Alert';
import MudInput from 'src/components/Custom/Input';
import { MudRoom } from 'src/types/dungeon';
import { validator } from 'src/utils/validator';
import '../index.css'
import { useDungeonConfigurator } from '../../../hooks/useDungeonConfigurator';
//REFACTOR: Redunant Modal, make generic pls
export interface AddRoomModalProps{
    show: boolean;
    onHide: () => void;
    onSendRoom: (item: MudRoom) => void;
    coordinates: [number, number];
}

const AddRoomModal: React.FC<AddRoomModalProps> = (props) => {

    const { t } = useTranslation();
    const dt = 'dungeon_configurator';
    const {rooms} = useDungeonConfigurator();
    const [name, setName] = React.useState<string>( "");
    const [description, setDescription] = React.useState<string>("");

    const [error, setError] = React.useState<string>("");

    const modalIsInvalid = () => {
        return validator.isEmpty(name) || validator.isEmpty(description);
    }

    const onSubmit = () => {
        if (validator.alreadyExists(name, "name", rooms)) {
            setError(t(`roomalreadyexists`));
            return;
        }
        if (modalIsInvalid()) {
            setError("failvalidation.room");
        } else {
            setError("");
            const [x,y] = props.coordinates;
            const characterRoom: MudRoom = {
                id: String(props.coordinates),
                name: name,
                description: description,
                npcs: [],
                items: [],
                connections: { east: 'inactive', south: 'inactive' },
                actions: [],
                xCoordinate: x,
                yCoordinate: y
            };
            props.onSendRoom(characterRoom);
            props.onHide();
        }
    }
    
    const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !modalIsInvalid()) {
            e.preventDefault();
            onSubmit();
        }

    }

    return (
        <Modal
            onHide={props.onHide}
            show={props.show}
            size="lg"
            centered
        >
            <Container>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {t(`${dt}.rooms.create_room`)}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='row px-4 g-3' onKeyDown={handleEnterKey}>
                    <Alert message={error} type="error" setMessage={setError} />
                    <MudInput name="xcoord" noconstraint={1} colmd={6} placeholder="x" value={props.coordinates[0]} disabled />
                    <MudInput name="ycoord" noconstraint={1} colmd={6} placeholder="y" value={props.coordinates[1]} disabled />
                    <MudInput name="name" placeholder={t(`dungeon_keys.name`)} colmd={12} value={name} onChange={(event) => setName(validator.cirName(event.target))} />
                    <MudInput name="description" placeholder={t(`dungeon_keys.description`)} colmd={12} value={description} onChange={(event) => setDescription(validator.description(event.target))} />
                </Modal.Body>
                <Modal.Footer className="justify-content-between">
                    <div className="col-3">
                        <Button onClick={() => { setError(""); props.onHide() }} className="btn w-100 drawn-border btn-red">{t(`button.cancel`)}</Button>
                    </div>
                    <div className="col-6">
                        <Button onClick={onSubmit} className="btn w-100 drawn-border btn-green">{t(`button.create`)}</Button>
                    </div>
                </Modal.Footer>
            </Container>
        </Modal>
    );
}


export default AddRoomModal;
