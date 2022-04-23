import React from 'react';
import { Modal, Button, ModalProps, Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import MudInput from 'src/components/Custom/MudInupt';
import { MudActionElement } from 'src/types/dungeon';
import { validator } from 'src/utils/validator';
import { useMudConsole } from '../../../hooks/useMudConsole';
import { useDungeonConfigurator } from '../../../hooks/useDungeonConfigurator';
import { MudItem } from '../../../types/dungeon';
//REFACTOR: Redunant Modal, make generic pls
export interface AddActionModalProps {
    show: boolean;
    onHide: () => void;
    onSendAction: (action: MudActionElement) => void;
    editData?: MudActionElement;
}

const AddActionModal: React.FC<AddActionModalProps> = (props) => {
    const [multiSelections, setMultiSelections] = React.useState<any>([]);
    const [description, setDescription] = React.useState<string>(props.editData?.description || "");
    const homosole = useMudConsole();

    const dconf = useDungeonConfigurator();

    const onSubmit = () => {
        if (validator.isEmpty(description)) {
            homosole.warn("Es sind nicht alle Felder ausgefüllt!", "AddActionModal");
        } else {
            const characterAction: MudActionElement = {
                command: "mock command",
                output: "mock output",
                description,
            } as MudActionElement;
            props.onSendAction(characterAction);
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
                    Neues Action anlegen
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='row px-4 g-3'>
                <MudInput placeholder='Beschreibung' colmd={12} value={description} onChange={(event) => setDescription(event.target.value)} />
                <Form.Group style={{ marginTop: '20px' }}>
                    <Form.Label>Items:</Form.Label>
                    <Typeahead
                        id="typeahead-multiple-items"
                        labelKey="name"
                        multiple
                        options={dconf.items}
                        onChange={(s: any) => { setMultiSelections(s); console.log(s) }}
                        placeholder="Items auswählen"
                        selected={multiSelections}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide} className="btn-danger">Abbrechen</Button>
                <Button onClick={onSubmit} className="btn-success">Anlegen</Button>
            </Modal.Footer>
        </Modal>
    );
}


export default AddActionModal;
