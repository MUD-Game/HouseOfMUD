/**
 * @module AddSpeciesModal
 * @description Modal for adding a new Species to the dungeon.
 * @author Raphael Sack
 * @category Modal
 */

import React from 'react';
import { Modal, Button, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Alert from 'src/components/Custom/Alert';
import MudInput from 'src/components/Custom/Input';
import { MudCharacterSpecies } from 'src/types/dungeon';
import { validator } from 'src/utils/validator';
import '../index.css'
//REFACTOR: Redunant Modal, make generic pls
export interface AddSpeciesModalProps {
    show: boolean;
    onHide: () => void;
    onSendSpecies: (species: MudCharacterSpecies) => void;
    editData?: MudCharacterSpecies;
}

const AddSpeciesModal: React.FC<AddSpeciesModalProps> = (props) => {

    const { t } = useTranslation();
    const dt = 'dungeon_configurator';

    const [name, setName] = React.useState<string>(props.editData?.name || "");

    const [error, setError] = React.useState<string>("");

    const modalIsInvalid = () => {
        return validator.isEmpty(name);
    }

    const onSubmit = () => {
        if (modalIsInvalid()) {
            setError("failvalidation.species");
        } else {
            setError("");
            const characterSpecies: MudCharacterSpecies = {
                name
            } as MudCharacterSpecies;
            props.onSendSpecies(characterSpecies);
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
                        {t(`${dt}.buttons.create_species`)}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='row px-4 g-3' onKeyDown={handleEnterKey}>
                    <Alert message={error} type="error" setMessage={setError} />
                    <MudInput placeholder={t(`dungeon_keys.name`)} colmd={12} value={name} onChange={(event) => setName(event.target.value)} />
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


export default AddSpeciesModal;
