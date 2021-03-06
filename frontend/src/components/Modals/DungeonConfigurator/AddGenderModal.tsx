/**
 * @module AddGenderModal
 * @description Modal for adding a new Gender to the dungeon.
 * @author Raphael Sack
 * @category Modal
 */

import React, { useEffect } from 'react';
import { Modal, Button, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Alert from 'src/components/Custom/Alert';
import MudInput from 'src/components/Custom/Input';
import { MudCharacterGender } from 'src/types/dungeon';
import { validator } from 'src/utils/validator';
import '../index.css'
import { useDungeonConfigurator } from '../../../hooks/useDungeonConfigurator';
//REFACTOR: Redunant Modal, make generic pls
export interface AddGenderModalProps {
    show: boolean;
    onHide: () => void;
    onSendGender: (gender: MudCharacterGender) => void;
    editData?: MudCharacterGender;
}

const AddGenderModal: React.FC<AddGenderModalProps> = (props) => {

    useEffect(()=>{
        if(props.editData?.name){
            setName(props.editData.name);
        }
    })

    const { t } = useTranslation();
    const dt = 'dungeon_configurator';
    const dconf = useDungeonConfigurator();
    const [name, setName] = React.useState<string>(props.editData?.name || "");

    const [error, setError] = React.useState<string>("");

    const modalIsInvalid = () => {
        return validator.isEmpty(name);
    }

    const onSubmit = () => {
        if (!props.editData && validator.alreadyExists(name, "name", dconf.genders)) {
            setError(t(`genderalreadyexists`));
            return;
        }
        if (modalIsInvalid()) {
            setError("failvalidation.gender");
        } else {
            setError("");
            const characterGender: MudCharacterGender = {
                name
            } as MudCharacterGender;
            props.onSendGender(characterGender);
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
                        {t(`${dt}.buttons.${props.editData ? 'edit' : 'create'}_gender`)}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='row px-4 g-3' onKeyDown={handleEnterKey}>
                    <Alert message={error} type="error" setMessage={setError} />
                    <MudInput autoFocus name="name" placeholder={t(`dungeon_keys.name`)} colmd={12} value={name} onChange={(event) => setName(validator.name(event.target))} />
                </Modal.Body>
                <Modal.Footer className="justify-content-between">
                    <div className="col-3">
                        <Button onClick={()=>{setError("");props.onHide()}} className="btn w-100 drawn-border btn-red">{t(`button.cancel`)}</Button>
                    </div>
                    <div className="col-6">
                        <Button onClick={onSubmit} className="btn w-100 drawn-border btn-green">{t(`button.${props.editData ? 'edit' : 'create'}`)}</Button>
                    </div>
                </Modal.Footer>
            </Container>
        </Modal>
    );
}


export default AddGenderModal;
