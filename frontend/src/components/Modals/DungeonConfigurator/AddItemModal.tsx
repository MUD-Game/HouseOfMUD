/**
 * @module AddItemModal
 * @description Modal for adding a new Item to the dungeon.
 * @author Raphael Sack
 * @category Modal
 */

import React from 'react';
import { Modal, Button, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Alert from 'src/components/Custom/Alert';
import MudInput from 'src/components/Custom/MudInupt';
import { MudItem } from 'src/types/dungeon';
import { validator } from 'src/utils/validator';
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

    const [error, setError] = React.useState<string>("");


    const onSubmit = () => {
        if (validator.isEmpty(name) || validator.isEmpty(description)) {
            setError("failvalidation.item");
        } else {
            setError("");
            const characterItem: MudItem = {
                name,
                description,
            } as MudItem;
            props.onSendItem(characterItem);
            props.onHide();
        }
    }

    const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
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
                        {t(`${dt}.buttons.create_item`)}

                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='row px-4 g-3' onKeyDown={handleEnterKey}>
                    <Alert message={error} type="error" setMessage={setError} />
                    <MudInput placeholder={t(`dungeon_keys.name`)} colmd={12} value={name} onChange={(event) => setName(event.target.value)} />
                    <MudInput placeholder={t(`dungeon_keys.description`)} colmd={12} value={description} onChange={(event) => setDescription(event.target.value)} />
                </Modal.Body>
                <Modal.Footer className="justify-content-between">
                    <div className="col-3">
                        <Button onClick={props.onHide} className="btn w-100 drawn-border btn-red">{t(`button.cancel`)}</Button>
                    </div>
                    <div className="col-6">
                        <Button onClick={onSubmit} className="btn w-100 drawn-border btn-green">{t(`button.${props.editData ? 'edit' : 'create'}`)}</Button>
                    </div>
                </Modal.Footer>
            </Container>
        </Modal>
    );
}


export default AddItemModal;
