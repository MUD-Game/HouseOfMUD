/**
 * @module AddNpcModal
 * @description Modal for adding a new Npc to the dungeon.
 * @author Raphael Sack
 * @category Modal
 */

import React, { useEffect } from 'react';
import { Modal, Button, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Alert from 'src/components/Custom/Alert';
import MudInput from 'src/components/Custom/Input';
import { MudNpc } from 'src/types/dungeon';
import { validator } from 'src/utils/validator';
import '../index.css'
import { useDungeonConfigurator } from '../../../hooks/useDungeonConfigurator';
import MudSelect from '../../Custom/Select';

export interface AddNpcModalProps {
    show: boolean;
    onHide: () => void;
    onSendNpc: (npc: MudNpc) => void;
    editData?: MudNpc;
}

const AddNpcModal: React.FC<AddNpcModalProps> = (props) => {

    useEffect(()=>{
        if(props.editData?.name && props.editData?.description && props.editData?.species){
            setName(props.editData.name);
            setDescription(props.editData.description);
            setSpeciesSelection(props.editData.species);
        }
    })

    const { t } = useTranslation();
    const { species, npcs } = useDungeonConfigurator();
    const dt = 'dungeon_configurator';

    const [name, setName] = React.useState<string>( "");
    const [description, setDescription] = React.useState<string>( "");
    const [speciesSelection, setSpeciesSelection] = React.useState<string>("");

    const [error, setError] = React.useState<string>("");

    const modalIsInvalid = ()=>{
        return validator.isEmpty(name) || validator.isEmpty(description) || speciesSelection.length === 0;
    }

    const onSubmit = () => {
        if (!props.editData && validator.alreadyExists(name, "name", npcs)) {
            setError(t(`npcalreadyexists`));
            return;
        }
        if (modalIsInvalid()) {
            setError("failvalidation.npc"); //TODO: add failvalidation.npc error
        } else {
            setError("");
            const npcItem: MudNpc = {
                name,
                description,
                species: speciesSelection,
            } as MudNpc;
            // set the input fields to empty
            props.onSendNpc(npcItem);
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
                        {t(`${dt}.buttons.create_npc`)}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='row px-4 g-3' onKeyDown={handleEnterKey}>
                    <Alert message={error} type="error" setMessage={setError} />
                    <MudInput autoFocus name="name" placeholder={t(`dungeon_keys.name`)} colmd={12} value={name} onChange={(event) => setName(validator.name(event.target))} />
                    <MudInput name="description" placeholder={t(`dungeon_keys.description`)} colmd={12} value={description} onChange={(event) => setDescription(validator.description(event.target))} />
                    <MudSelect value={speciesSelection} colmd={6} title={t(`dungeon_keys.species`)} onChange={(event) => setSpeciesSelection(event.target.value)} placeholder={t(`common.select_species`)} label={t(`dungeon_keys.species`)}>
                        <option value="-1" hidden>{t(`common.select_species`)}</option>
                        {species.map(({name, id})=>{
                            return <option key={`npc-species-option-${id}`} value={id}>{name}</option>
                        })}
                    </MudSelect>
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


export default AddNpcModal;
