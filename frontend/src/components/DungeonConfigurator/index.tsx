/**
 * @module DungeonConfigurator
 * @category React Components
 * @description DungeonConfigurator Component to display the DungeonConfigurator
 * @author Raphael Sack
 */

import React, { useEffect } from 'react'
import { Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useBeforeunload } from 'react-beforeunload';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDungeonConfigurator } from 'src/hooks/useDungeonConfigurator';
import Busy from '../Busy';
import Alert from '../Custom/Alert';
import MudInput from '../Custom/Input';
import DungeonObjectList from './DungeonObjectList';
import RoomConfigurator from './RoomConfigurator';
import { validator } from 'src/utils/validator';
import { ChevronLeft } from 'react-bootstrap-icons';
import ConfirmationDialog from 'src/components/Modals/BasicModals/ConfirmationDialog';
export interface DungeonConfiguratorProps { }

interface LocationState {
    dungeonId?: string;
}

const DungeonConfigurator: React.FC<DungeonConfiguratorProps> = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const tl = "dungeon_configurator";
    const dungeonConfig = useDungeonConfigurator();
    const location = useLocation();
    const [showConfirmationDialog, setShowConfirmationDialog] = React.useState({ show: false, message: "", title: "", onConfirm: () => { } });
    const [isBusy, setIsBusy] = React.useState(false);
    let dungeonId = (location.state as LocationState)?.dungeonId || undefined;

    const [isPrivate, setIsPrivate] = React.useState(false);
    useBeforeunload((event) => {
        
        return "";
        
    });

    useEffect(()=>{
        if(dungeonConfig.password){
            setIsPrivate(true);
        }
    },[dungeonConfig.password])


    const showConfirmation = (localeString: string, onConfirm: () => void) => {
        setShowConfirmationDialog({
            show: true, message: t(`dungeon_configurator.confirmations.${localeString}.text`), title: t(`dungeon_configurator.confirmations.${localeString}.title`), onConfirm
        });
    }

    const onCancel = () =>{
        showConfirmation("canceldungeon", ()=>{
            navigate("/?board=my");
        })
    }
    return (

        <Container className="mb-5">
            <div className="mb-3" id="backbutton" onClick={onCancel} ><ChevronLeft size={30}/><span>{t("common.back")}</span></div>

            <h2>{t(`${tl}.title`)}</h2>
            <ConfirmationDialog onHide={() => { setShowConfirmationDialog({ show: false, message: "", title: "", onConfirm: () => { } }) }} {...showConfirmationDialog} />
            {isBusy ? <Busy /> :
                <>
                    <Row className="my-3 g-3 align-items-end">
                        <MudInput colmd={8} value={dungeonConfig.name} onChange={evt => {
                            dungeonConfig.setName(validator.name(evt.target));
                        }} type="text" name="name" placeholder={t(`${tl}.inputs.name.placeholder`)} />

                        <MudInput colmd={4} value={dungeonConfig.maxPlayers} onChange={evt => {
                            dungeonConfig.setMaxPlayers(validator.maxPlayers(evt.target.value));
                        }} type="number" name="maxPlayers" placeholder={t(`${tl}.inputs.maxPlayers.placeholder`)} />

                        <MudInput colmd={12} value={dungeonConfig.description} onChange={evt => {
                            dungeonConfig.setDescription(validator.description(evt.target));
                        }} type="text" name="description" placeholder={t(`${tl}.inputs.description.placeholder`)} />


                        <div className="col-md-3 align-self-end text-start" >
                            <div className="form-check form-switch p-0" style={{ margin: 0 }}>
                                <label className="form-check-label" style={{ margin: 0 }} htmlFor="isglobal"><b>{t(`common.isprivate`)}?</b></label><br/>
                                <input style={{ margin: "5px 0 0 0" }} className="form-check-input isglobal-input" onChange={evt => {
                                    setIsPrivate(evt.target.checked)
                                    if(!evt.target.checked){
                                        dungeonConfig.setPassword("");
                                    }
                                    }} type="checkbox" role="switch" id="isprivate" checked={isPrivate} />
                            </div>
                        </div>

                        {isPrivate ? <MudInput colmd={12} autoComplete="off" value={dungeonConfig.password} onChange={evt => {
                            dungeonConfig.setPassword(validator.dungeonPassword(evt.target));
                        }} type="text" name="dungeon_password" placeholder={t(`${tl}.inputs.password.placeholder`)} /> : null}
                    </Row>


                    <DungeonObjectList identifier="id" onEditElement={dungeonConfig.editGender} onDeleteElement={dungeonConfig.deleteGender} data={dungeonConfig.genders} displayKeys={["name"]} onAdd={dungeonConfig.addGender} title={t(`dungeon_keys.gender`)} buttonText={t(`${tl}.buttons.create_gender`)} />

                    <DungeonObjectList identifier="id" onEditElement={dungeonConfig.editSpecies} onDeleteElement={dungeonConfig.deleteSpecies} data={dungeonConfig.species} displayKeys={["name"]} onAdd={dungeonConfig.addSpecies} title={t(`dungeon_keys.species`)} buttonText={t(`${tl}.buttons.create_species`)} />

                    <DungeonObjectList identifier="id" onEditElement={dungeonConfig.editClass} onDeleteElement={dungeonConfig.deleteClass} data={dungeonConfig.classes} displayKeys={["name", "description"]} onAdd={dungeonConfig.addClass} title={t(`dungeon_keys.class`)} buttonText={t(`${tl}.buttons.create_class`)} />

                    <DungeonObjectList identifier="id" onEditElement={dungeonConfig.editItem} onDeleteElement={dungeonConfig.deleteItem} data={dungeonConfig.items} displayKeys={["name", "description"]} onAdd={dungeonConfig.addItem} title={t(`dungeon_keys.items`)} buttonText={t(`${tl}.buttons.create_item`)} />

                    <DungeonObjectList identifier="id" onEditElement={dungeonConfig.editNpc} onDeleteElement={dungeonConfig.deleteNpc} data={dungeonConfig.npcs} displayKeys={["name", "description"]} onAdd={dungeonConfig.addNpc} title={t(`dungeon_keys.npc`)} buttonText={t(`${tl}.buttons.create_npc`)} />

                    <DungeonObjectList identifier="id" onEditElement={dungeonConfig.editAction} onDeleteElement={dungeonConfig.deleteAction} data={dungeonConfig.actions} displayKeys={["command", "description"]} onAdd={dungeonConfig.addAction} title={t(`dungeon_keys.actions`)} buttonText={t(`${tl}.buttons.create_action`)} />

                    

                    <Row className="mb-5">
                        <RoomConfigurator />
                    </Row>
                    <hr />
                    <Row>
                        <Alert type="error" message={dungeonConfig.error} setMessage={dungeonConfig.setError} />
                    </Row>
                    <Row className="mt-3 justify-content-end">
                        <div className="col-md-6">
                            <button className="btn w-100 btn-red drawn-border" onClick={onCancel}>{t(`button.cancel`)}</button>
                        </div>
                        <div className="col-md-6">
                            <button className="btn w-100 btn-green drawn-border" onClick={(e) => dungeonConfig.save(e, setIsBusy)}>{dungeonId ? t(`button.save`) : t(`button.create`) }</button>
                        </div>
                    </Row>
                </>
            }
        </Container>

    )
}

export default DungeonConfigurator;