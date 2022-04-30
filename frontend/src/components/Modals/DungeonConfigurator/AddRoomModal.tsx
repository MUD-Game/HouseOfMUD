import React from 'react';
import { Modal, Button, ModalProps, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import MudInput from 'src/components/Custom/MudInupt';
import { MudRoom } from 'src/types/dungeon';
import { validator } from 'src/utils/validator';
import { useMudConsole } from '../../../hooks/useMudConsole';
import '../index.css'
//REFACTOR: Redunant Modal, make generic pls
export interface AddRoomModalProps {
    show: boolean;
    onHide: () => void;
    onSendRoom: (item: MudRoom) => void;
    coordinates: [number, number];
}

const AddRoomModal: React.FC<AddRoomModalProps> = (props) => {

    const { t } = useTranslation();
    const dt = 'dungeon_configurator';

    const [name, setName] = React.useState<string>( "");
    const [description, setDescription] = React.useState<string>( "");
    const homosole = useMudConsole();



    const onSubmit = () => {
        if (validator.isEmpty(name) || validator.isEmpty(description)) {
            homosole.warn("Es sind nicht alle Felder ausgefüllt!", "AddRoomModal");
        } else {
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
                <Modal.Body className='row px-4 g-3'>
                    <MudInput colmd={6} placeholder="x" value={props.coordinates[0]} disabled />
                    <MudInput colmd={6} placeholder="y" value={props.coordinates[1]} disabled />
                    <MudInput placeholder={t(`dungeon_keys.name`)} colmd={12} value={name} onChange={(event) => setName(event.target.value)} />
                    <MudInput placeholder={t(`dungeon_keys.description`)} colmd={12} value={description} onChange={(event) => setDescription(event.target.value)} />
                </Modal.Body>
                <Modal.Footer className="justify-content-between">
                    <div className="col-3">
                        <Button onClick={props.onHide} className="btn w-100 drawn-border btn-red">{t(`button.cancel`)}</Button>
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
