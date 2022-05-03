/**
 * @module DungeonConfigurator
 * @category React Components
 * @description DungeonConfigurator Component to display the DungeonConfigurator
 * @author Raphael Sack
 */

import React from 'react'
import { Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useDungeonConfigurator } from 'src/hooks/useDungeonConfigurator';
import Busy from '../Busy';
import Alert from '../Custom/Alert';
import MudInput from '../Custom/Input';
import MudTypeahead from '../Custom/Typeahead';
import DungeonObjectList from './DungeonObjectList';
import RoomConfigurator from './RoomConfigurator';
type Option = string | { [key: string]: any };

export interface DungeonConfiguratorProps { }

interface LocationState {
    dungeonId?: string;
}

const DungeonConfigurator: React.FC<DungeonConfiguratorProps> = ({ }) => {
    const {t} = useTranslation();
    const tl = "dungeon_configurator";
    const dungeonConfig = useDungeonConfigurator();
    const location = useLocation();
    const [isBusy, setIsBusy] = React.useState(false);
    let dungeonId = (location.state as LocationState)?.dungeonId || undefined;

    return (

        <Container className="mb-5">
            <h2>{t(`${tl}.title`)}</h2>

            {isBusy ? <Busy/> : 
            <>
                <Row className="my-3 g-3">
                <MudInput maxLength={50} colmd={9} defaultValue={dungeonConfig.name} onBlur={dungeonConfig.handleOnBlurInput} type="text" name="name" placeholder={ t(`${tl}.inputs.name.placeholder`)} />
                <MudInput colmd={3} defaultValue={dungeonConfig.maxPlayers} onBlur={dungeonConfig.handleOnBlurInput} type="number" name="maxPlayers" placeholder={t(`${tl}.inputs.maxPlayers.placeholder`)} />
                <MudInput maxLength={50} colmd={12} defaultValue={dungeonConfig.description} onBlur={dungeonConfig.handleOnBlurInput} type="text" name="description" placeholder={t(`${tl}.inputs.description.placeholder`)} />
                <MudTypeahead disabled={dungeonId ? true : false} title={t(`${tl}.inputs.genders.title`)} options={[]} allowNew colmd={12} multiple id='index-gender-typeahead' placeholder={t(`${tl}.inputs.genders.placeholder`)} emptyLabel={t(`${tl}.inputs.genders.emptyLabel`)} onChange={dungeonConfig.setGenders as unknown as (a: Option[]) => void} selected={dungeonConfig.genders} />
                <MudTypeahead disabled={dungeonId ? true : false} title={t(`${tl}.inputs.species.title`)} options={[]} allowNew colmd={12} multiple id='index-species-typeahead' placeholder={t(`${tl}.inputs.species.placeholder`)} emptyLabel={t(`${tl}.inputs.species.emptyLabel`)} onChange={dungeonConfig.setSpecies as unknown as (a: Option[]) => void} selected={dungeonConfig.species} />
                </Row>

            <DungeonObjectList disabled={dungeonId ? true : false} identifier="id" onEditElement={dungeonConfig.editClass} onDeleteElement={dungeonConfig.deleteClass} data={dungeonConfig.classes} displayKeys={["name", "description"]} onAdd={dungeonConfig.addClass} title={t(`dungeon_keys.class`)} buttonText={t(`${tl}.buttons.create_class`)} />

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
                <div className="col-md-5">
                    <button className="btn w-100 btn-green drawn-border" onClick={(e)=>dungeonConfig.save(e,setIsBusy)}>{dungeonId ? t(`button.create`) : t(`button.save`)}</button>
                </div>
            </Row>
            </>
            }
        </Container>

    )
}

export default DungeonConfigurator;