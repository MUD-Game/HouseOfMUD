import React from 'react';
import { Modal, Button, ModalProps, Container } from 'react-bootstrap';
import MudInput from 'src/components/Custom/MudInupt';
import { validator } from 'src/utils/validator';
import { MudCharacterClass, MudCharacterStats } from '../../../types/dungeon';
import { useMudConsole } from '../../../hooks/useMudConsole';
import '../index.css'
import { useTranslation } from 'react-i18next';

export interface AddClassModalProps {
    show: boolean;
    onHide: () => void;
    onSendCharacterClass: (characterClass: MudCharacterClass) => void;
    editData?: MudCharacterClass;
}

const AddClassModal: React.FC<AddClassModalProps> = (props) => {

    const {t} = useTranslation();
    const dt = 'dungeon_configurator';

    const [name, setName] = React.useState<string>(props.editData?.name || "");
    const [description, setDescription] = React.useState<string>(props.editData?.description || "");
    const [hitPoints, setHitPoints] = React.useState<number>(props.editData?.startStats?.hp || 0);
    const [mana, setMana] = React.useState<number>(props.editData?.startStats?.mana || 0);
    const [dmg, setDmg] = React.useState<number>(props.editData?.startStats?.dmg || 0);
    const homosole = useMudConsole();



    const onSubmit = () => {
        if (validator.isEmpty(name) || validator.isEmpty(description) || validator.isZero(hitPoints) || validator.isZero(mana) || validator.isZero(dmg)) {
            homosole.warn("Es sind nicht alle Felder ausgefüllt!", "AddClassModal");
        } else {
            const stats: MudCharacterStats = {
                hp: hitPoints,
                mana: mana,
                dmg: dmg
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
                <Modal.Body className='row px-4 g-3'>
                    <MudInput placeholder='Name' colmd={12} value={name} onChange={(event) => setName(event.target.value)} />
                    <MudInput placeholder={t(`dungeon_keys.description`)} colmd={12} value={description} onChange={(event) => setDescription(event.target.value)} />
                    <MudInput placeholder={t(`dungeon_keys.maxhp`)} colmd={4} value={hitPoints} type="number" onChange={(event) => setHitPoints(parseInt(event.target.value))} />
                    <MudInput placeholder={t(`dungeon_keys.maxmana`)} colmd={4} value={mana} type="number" onChange={(event) => setMana(parseInt(event.target.value))} />
                    <MudInput placeholder={t(`dungeon_keys.maxdmg`)} colmd={4} value={dmg} type="number" onChange={(event) => setDmg(parseInt(event.target.value))} />
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


export default AddClassModal;
