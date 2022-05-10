/**
 * @module AddClassModal
 * @description Modal for adding a new Character-Class to the dungeon.
 * @author Raphael Sack
 * @category Modal
 */

import React from 'react';
import { Modal, Button, Container } from 'react-bootstrap';
import MudInput from 'src/components/Custom/Input';
import { validator } from 'src/utils/validator';
import { MudCharacterClass, MudCharacterStats } from '../../../types/dungeon';
import '../index.css'
import { useTranslation } from 'react-i18next';
import Alert from 'src/components/Custom/Alert';
import { useDungeonConfigurator } from '../../../hooks/useDungeonConfigurator';

export interface AddClassModalProps {
    show: boolean;
    onHide: () => void;
    onSendCharacterClass: (characterClass: MudCharacterClass) => void;
    editData?: MudCharacterClass;
}

const AddClassModal: React.FC<AddClassModalProps> = (props) => {

    const {t} = useTranslation();
    const dt = 'dungeon_configurator';
    const dconf = useDungeonConfigurator();
    const [name, setName] = React.useState<string>(props.editData?.name || "");
    const [description, setDescription] = React.useState<string>(props.editData?.description || "");
    const [hitPoints, setHitPoints] = React.useState<number | "">(props.editData?.startStats?.hp || "");
    const [mana, setMana] = React.useState<number | "">(props.editData?.startStats?.mana || "");
    const [dmg, setDmg] = React.useState<number | "">(props.editData?.startStats?.dmg || "");

    const [error, setError] = React.useState<string>("");

    const modalIsInvalid = () => {
        return dmg !== "" || mana !== "" || hitPoints !== "" || validator.isEmpty(name) || validator.isEmpty(description);
    }
    
    const onSubmit = () => {
        if (!props.editData && validator.alreadyExists(name, "name", dconf.classes)) {
            setError(t(`classalreadyexists`));
            return;
        }
        if (modalIsInvalid()) {
            setError("failvalidation.class");
        } else {
            const stats: MudCharacterStats = {
                hp: hitPoints as number,
                mana: mana as number,
                dmg: dmg as number
            }
            const characterClass: MudCharacterClass = {
                name,
                description,
                maxStats: stats,
                startStats: stats
            } as MudCharacterClass;
            props.onSendCharacterClass(characterClass);
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
                        {t(`${dt}.buttons.create_class`)}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='row px-4 g-3' onKeyDown={handleEnterKey}>
                    <Alert type="error" message={error} setMessage={setError} />
                    <MudInput placeholder='Name' colmd={12} value={name} onChange={(event) => setName(validator.name(event.target))} />
                    <MudInput placeholder={t(`dungeon_keys.description`)} colmd={12} value={description} onChange={(event) => setDescription(validator.description(event.target))} />
                    <MudInput disabled={props.editData?.from_server || false ? true : false} placeholder={t(`dungeon_keys.maxhp`)} colmd={4} value={hitPoints} type="number" onChange={(event) => setHitPoints(validator.statValues(event.target.value))} />
                    <MudInput disabled={props.editData?.from_server || false ? true : false} placeholder={t(`dungeon_keys.maxmana`)} colmd={4} value={mana} type="number" onChange={(event) => setMana(validator.statValues(event.target.value))} />
                    <MudInput disabled={props.editData?.from_server || false ? true : false} placeholder={t(`dungeon_keys.maxdmg`)} colmd={4} value={dmg} type="number" onChange={(event) => setDmg(validator.statValues(event.target.value))} />
                </Modal.Body>
                <Modal.Footer className="justify-content-between">
                    <div className="col-3">
                        <Button onClick={() => { setError(""); props.onHide() }} className="btn w-100 drawn-border btn-red">{t(`button.cancel`)}</Button>
                    </div>
                    <div className="col-6">
                        <Button onClick={onSubmit} className="btn w-100 drawn-border btn-green">{t(`button.${props.editData ? 'edit' : 'create'}`)}</Button>
                    </div>
                </Modal.Footer>
            </Container>
        </Modal>
    );
}


export default AddClassModal;
