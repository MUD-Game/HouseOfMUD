/**
 * @module AddNpcModal
 * @description Modal for adding a new Npc to the dungeon.
 * @author Raphael Sack
 * @category Modal
 */

import React from 'react';
import { Modal, Button, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Alert from 'src/components/Custom/Alert';
import MudInput from 'src/components/Custom/Input';
import { MudNpc } from 'src/types/dungeon';
import { validator } from 'src/utils/validator';
import '../index.css'
import { useDungeonConfigurator } from '../../../hooks/useDungeonConfigurator';
import Typeahead from '../../Custom/Typeahead';

type Option = string | { [key: string]: any };
export interface AddNpcModalProps {
    show: boolean;
    onHide: () => void;
    onSendNpc: (npc: MudNpc) => void;
    editData?: MudNpc;
}

const AddNpcModal: React.FC<AddNpcModalProps> = (props) => {

    const { t } = useTranslation();
    const { species } = useDungeonConfigurator();
    const dt = 'dungeon_configurator';

    let initialSpecies:Option[] = [];
    if(props.editData) {
        const sId = props.editData.species;
        const speciesName = species.find(s => s.id === sId);
        console.log(speciesName, "Npc Modal");
        initialSpecies = [speciesName as unknown as Option];
    }

    const [name, setName] = React.useState<string>(props.editData?.name || "");
    const [description, setDescription] = React.useState<string>(props.editData?.description || "");
    const [speciesSelection, setSpeciesSelection] = React.useState<Option[]>(initialSpecies);

    const [error, setError] = React.useState<string>("");

    const modalIsInvalid = ()=>{
        return validator.isEmpty(name) || validator.isEmpty(description) || speciesSelection.length === 0;
    }

    const onSubmit = () => {
        if (modalIsInvalid()) {
            setError("failvalidation.npc"); //TODO: add failvalidation.npc error
        } else {
            setError("");
            const characterItem: MudNpc = {
                name,
                description,
                species: (speciesSelection[0] as unknown as MudNpc).id,
            } as MudNpc;
            props.onSendNpc(characterItem);
            props.onHide();
        }
    }

    const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !modalIsInvalid()) {
            e.preventDefault();
            onSubmit();
        }
    }

    console.log(species.map(({ from_server, name, ...other }) => {
        return { ...other, label:name }
    }))


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
                    <MudInput placeholder={t(`dungeon_keys.name`)} colmd={12} value={name} onChange={(event) => setName(event.target.value)} />
                    <MudInput placeholder={t(`dungeon_keys.description`)} colmd={12} value={description} onChange={(event) => setDescription(event.target.value)} />
                    <Typeahead id={"typeahead-npc-species"} options={species.map(({ from_server, name, ...other })=> {
                        return { ...other, label: name }
                    }) as Option[]} colmd={6} title={t(`dungeon_keys.species`)} selected={speciesSelection} onChange={(event) => setSpeciesSelection(event)} placeholder={t(`common.select_species`)} />
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
