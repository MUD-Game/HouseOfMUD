import React from 'react';
import { Modal, Button, ModalProps, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import MudInput from 'src/components/Custom/MudInupt';
import { MudItem } from 'src/types/dungeon';
import { validator } from 'src/utils/validator';
import { useMudConsole } from '../../../hooks/useMudConsole';
import '../index.css'
//REFACTOR: Redunant Modal, make generic pls
export interface AddItemModalProps {
    show: boolean;
    onHide: () => void;
    onSendItem: (item: MudItem) => void;
    editData?: MudItem;
}

const AddItemModal: React.FC<AddItemModalProps> = (props) => {

    const { t } = useTranslation();
    const dt = 'dungeon_configurator';

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
            <Container>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {t(`${dt}.buttons.create_item`)}

                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='row px-4 g-3'>
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


export default AddItemModal;
