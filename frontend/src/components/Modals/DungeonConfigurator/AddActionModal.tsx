/**
 * @module AddActionModal
 * @description Modal for adding a new Action to the dungeon.
 * @author Raphael Sack
 * @category Modal
 */

import React from 'react';
import { Modal, Button, Container } from 'react-bootstrap';
import MudInput from 'src/components/Custom/Input';
import { MudActionElement } from 'src/types/dungeon';
import { validator } from 'src/utils/validator';
import { useDungeonConfigurator } from '../../../hooks/useDungeonConfigurator';
import { MudEvent } from '../../../types/dungeon';
import MudTypeahead from '../../Custom/Typeahead';
import '../index.css'
import { useTranslation } from 'react-i18next';
import Alert from 'src/components/Custom/Alert';
type Option = string | { [key: string]: any };

//REFACTOR: Redunant Modal, make generic pls
export interface AddActionModalProps {
    show: boolean;
    onHide: () => void;
    onSendAction: (action: MudActionElement) => void;
    editData?: MudActionElement;
}

const AddActionModal: React.FC<AddActionModalProps> = (props) => {

    const dconf = useDungeonConfigurator();
    const { t } = useTranslation();
    const dt = 'dungeon_configurator';
    let initialItemsNeeded: Option[] = [];
    let initialRemoveItems: Option[] = [];
    let initialAddItems: Option[] = [];
    let initialEvents: Option[] = [];
    let initialEventValues: { [key: string]: number } = {};

    const constructToModalData = () => {
        // initialItemsNeeded = props.editData.itemsneeded.map((item: number) => {id: item});
        props.editData?.itemsneeded?.forEach((item: number) => {
            initialItemsNeeded.push({ id: item, name: dconf.items[item].name, description: dconf.items[item].description });
        });
        props.editData?.events?.forEach((mudEvent: MudEvent) => {
            initialEvents.push(mudEvent.eventType);
            if (mudEvent.eventType === "removeitem") {
                initialRemoveItems.push({ id: mudEvent.value, name: dconf.items[mudEvent.value].name, description: dconf.items[mudEvent.value].description });
            } else if (mudEvent.eventType === "additem") {
                initialAddItems.push({ id: mudEvent.value, name: dconf.items[mudEvent.value].name, description: dconf.items[mudEvent.value].description });
            } else {
                initialEventValues[mudEvent.eventType] = mudEvent.value;
            }
        });




    }
    constructToModalData();

    const [itemsNeeded, setItemsNeeded] = React.useState<Option[]>(initialItemsNeeded);
    const [removeItems, setRemoveItems] = React.useState<Option[]>(initialRemoveItems);
    const [addItems, setAddItems] = React.useState<Option[]>(initialAddItems);
    const [selectedEvents, setSelectedEvents] = React.useState<Option[]>(initialEvents);
    const [eventValues, setEventValues] = React.useState<{ [key: string]: any }>(initialEventValues);
    const [command, setCommand] = React.useState<string>(props.editData?.command || "");
    const [output, setOutput] = React.useState<string>(props.editData?.output || "");
    const [description, setDescription] = React.useState<string>(props.editData?.description || "");
    const [isGlobal, setIsGlobal] = React.useState<boolean>(props.editData?.isGlobal || false);
    const [error, setError] = React.useState<string>("");

    const modalIsInvalid = () => {
        let status = validator.isEmpty(description) || validator.isEmpty(command) || validator.isEmpty(output);
        selectedEvents.forEach((event: any) => {
            if (event === "additem") {
                if (addItems.length === 0) {
                    status = true;
                }
            } else if (event === "removeitem") {
                if (removeItems.length === 0) {
                    status = true;
                }
            } else {
                if (eventValues[event] === undefined) status = true;
            }
        });
        return status;
    }

    const deconstructToContextData = () => {
        let allEvents: MudEvent[] = [];
        // REFACTOR: Typing!!!
        selectedEvents.forEach((event) => {
            let value: number;
            if (event === "additem" && addItems.length > 0) {
                value = parseInt((addItems[0] as any).id);
            } else if (event === "removeitem" && removeItems.length > 0) {
                value = parseInt((removeItems[0] as any).id);
            } else {
                value = parseInt(eventValues[event as MudEvent["eventType"]]);
            }
            if (!isNaN(value)) {
                let currEvent: MudEvent = {
                    eventType: event as MudEvent["eventType"],
                    value
                }
                allEvents.push(currEvent);
            }
        });
        let itemsneedednumbers: number[] = [];
        itemsNeeded.forEach((item) => {
            itemsneedednumbers.push(parseInt((item as any).id));
        });
        const characterAction: MudActionElement = {
            command,
            output,
            description,
            itemsneeded: itemsneedednumbers as number[],
            events: allEvents,
            isGlobal: isGlobal
        } as MudActionElement;
        return characterAction;
    }

    const eventTypes = [
        "additem",
        "removeitem",
        "addhp",
        "removehp",
        "adddmg",
        "removedmg",
        "addmana",
        "removemana"
    ]

    const onSubmit = () => {
        if (validator.alreadyExists(command, "command", dconf.actions)){
            setError(t(`actionalreadyexists`));
            return;
        }
        if (modalIsInvalid()) {
            setError("failvalidation.action");
        } else {
            let action = deconstructToContextData();
            if (!action) setError("failvalidation.action");
            setError("");
            props.onSendAction(action);
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
                        {t(`${dt}.buttons.create_action`)}
                    </Modal.Title>
                </Modal.Header>
                <Alert type="error" message={error} setMessage={setError} />
                <Modal.Body className='row px-4 g-3' onKeyDown={handleEnterKey}>
                    <MudInput autoFocus placeholder={t(`dungeon_keys.command`)} colmd={12} value={command} onChange={(event) => setCommand(event.target.value)} />
                    <MudInput placeholder={t(`dungeon_keys.description`)} colmd={12} value={description} onChange={(event) => setDescription(event.target.value)} />
                    <MudInput placeholder={t(`dungeon_keys.output`)} colmd={12} value={output} onChange={(event) => setOutput(event.target.value)} />
                    <MudTypeahead
                        colmd={12}
                        title={t(`dungeon_keys.itemsNeeded`)}
                        id={"typeahead-items-needed"}
                        labelKey={(option: any) => `${option.name} (${option.description})`}
                        options={dconf.items}
                        multiple
                        onChange={setItemsNeeded}
                        placeholder={t(`common.select_items`)}
                        selected={itemsNeeded}
                    />
                    <MudTypeahead
                        colmd={9}
                        title={t(`dungeon_keys.events`)}
                        id="typeahead-events"
                        labelKey="events"
                        multiple
                        options={eventTypes}
                        onChange={setSelectedEvents}
                        placeholder={t(`common.select_events`)}
                        selected={selectedEvents}
                    />
                    <div className="col-md-3 align-self-end text-end">
                        <div className="form-check form-switch p-0">
                        <label className="form-check-label" htmlFor="isglobal"><b>{t(`common.isglobal`)}</b></label> <br />
                        <input className="form-check-input float-end isglobal-input" onChange={evt => setIsGlobal(evt.target.checked)} type="checkbox" role="switch" id="isglobal" checked={isGlobal} />
                        </div>
                    </div>
                    {selectedEvents.length > 0 && selectedEvents.map((mudEvent, index) => {
                        if (mudEvent as string === 'additem' || mudEvent as string === 'removeitem') {
                            return (
                                <MudTypeahead
                                    colmd={12}
                                    key={mudEvent as string}
                                    title={mudEvent as string}
                                    id={"typeahead" + mudEvent as string}
                                    labelKey={(option: any) => `${option.name} (${option.description})`}
                                    options={dconf.items}
                                    onChange={(mudEvent as string === 'additem') ? setAddItems : (a) => { setRemoveItems(a); setItemsNeeded(a) }}
                                    placeholder={t(`common.select_items`)}
                                    selected={(mudEvent as string === 'additem') ? addItems : removeItems}
                                />
                            )
                        }
                        return (
                            <MudInput type="number" required key={mudEvent as string} placeholder={mudEvent as string} colmd={12} value={eventValues[mudEvent as string] || ""} onChange={(event) => setEventValues({ ...eventValues, [mudEvent as string]: event.target.value })} />
                        )
                    })}

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


export default AddActionModal;
