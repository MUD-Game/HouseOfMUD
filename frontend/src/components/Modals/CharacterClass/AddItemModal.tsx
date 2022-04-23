import React from 'react';
import { Modal, Button, ModalProps } from 'react-bootstrap';
import MudInput from 'src/components/Custom/MudInupt';
import { MudItem } from 'src/types/dungeon';
import { validator } from 'src/utils/validator';
import { useMudConsole } from '../../../hooks/useMudConsole';
//REFACTOR: Redunant Modal, make generic pls
export interface AddItemModalProps {
    show: boolean;
    onHide: () => void;
    onSendItem: (item: MudItem) => void;
    editData?: MudItem;
}

const AddItemModal: React.FC<AddItemModalProps> = (props) => {

    const [name, setName] = React.useState<string>(props.editData?.name || "");
    const [description, setDescription] = React.useState<string>(props.editData?.description || "");
    const homosole = useMudConsole();



    const onSubmit = () => {
        if (validator.isEmpty(name) || validator.isEmpty(description)) {
            homosole.warn("Es sind nicht alle Felder ausgefüllt!", "AddItemModal");
        } else {
            const characterItem: MudItem = {
                name,
                description,
            } as MudItem;
            props.onSendItem(characterItem);
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
            <Modal.Header closeButton>
                <Modal.Title>
                    Neues Item anlegen
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='row px-4 g-3'>
                <MudInput placeholder='Name' colmd={12} value={name} onChange={(event) => setName(event.target.value)} />
                <MudInput placeholder='Beschreibung' colmd={12} value={description} onChange={(event) => setDescription(event.target.value)} />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide} className="btn-danger">Abbrechen</Button>
                <Button onClick={onSubmit} className="btn-success">Anlegen</Button>
            </Modal.Footer>
        </Modal>
    );
}


export default AddItemModal;
