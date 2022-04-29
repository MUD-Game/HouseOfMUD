import React from 'react'
import { Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useDungeonConfigurator } from 'src/hooks/useDungeonConfigurator';
import { useMudConsole } from 'src/hooks/useMudConsole';
import MudInput from '../Custom/MudInupt';
import MudTypeahead from '../Custom/MudTypeahead';
import DungeonObjectList from './DungeonObjectList';
type Option = string | { [key: string]: any };

export interface DungeonConfiguratorProps { }

interface LocationState {
    action: "new" | "edit";
}

const DungeonConfigurator: React.FC<DungeonConfiguratorProps> = ({ }) => {
    const location = useLocation();
    const {t} = useTranslation();
    const tl = "dungeon_configurator";
    const dungeonConfig = useDungeonConfigurator();
    let action = (location.state as LocationState)?.action || "new";
    
    //TODO: Add a way to edit a dungeon that is already created


    return (

        <Container className="mb-5">
            <h2>{t(`${tl}.title`)}</h2>
            <Row className="my-3 g-3">
                <MudInput maxLength={50} colmd={9} onBlur={dungeonConfig.handleOnBlurInput} type="text" name="name" placeholder={ t(`${tl}.inputs.name.placeholder`)} />
                <MudInput colmd={3} onBlur={dungeonConfig.handleOnBlurInput} type="number" name="maxPlayers" placeholder={t(`${tl}.inputs.maxPlayers.placeholder`)} />
                <MudInput maxLength={50} colmd={12} onBlur={dungeonConfig.handleOnBlurInput} type="text" name="description" placeholder={t(`${tl}.inputs.description.placeholder`)} />
                <MudTypeahead title={t(`${tl}.inputs.genders.title`)} options={[]} allowNew colmd={12} multiple id='gender-typeahead' placeholder={t(`${tl}.inputs.genders.placeholder`)} emptyLabel={t(`${tl}.inputs.genders.emptyLabel`)} onChange={dungeonConfig.setGenders as unknown as (a: Option[]) => void} selected={dungeonConfig.genders} />
                <MudTypeahead title={t(`${tl}.inputs.species.title`)} options={[]} allowNew colmd={12} multiple id='species-typeahead' placeholder={t(`${tl}.inputs.species.placeholder`)} emptyLabel={t(`${tl}.inputs.species.emptyLabel`)} onChange={dungeonConfig.setSpecies as unknown as (a: Option[]) => void} selected={dungeonConfig.species} />
            </Row>

            <DungeonObjectList identifier="id" onEditElement={dungeonConfig.editClass} onDeleteElement={dungeonConfig.deleteClass} data={dungeonConfig.classes} displayKeys={["name", "description"]} onAdd={dungeonConfig.addClass} title={t(`dungeon_keys.class`)} buttonText={t(`${tl}.buttons.create_class`)} />

            <DungeonObjectList identifier="id" onEditElement={dungeonConfig.editItem} onDeleteElement={dungeonConfig.deleteItem} data={dungeonConfig.items} displayKeys={["name", "description"]} onAdd={dungeonConfig.addItem} title={t(`dungeon_keys.items`)} buttonText={t(`${tl}.buttons.create_item`)} />

            <DungeonObjectList identifier="id" onEditElement={dungeonConfig.editAction} onDeleteElement={dungeonConfig.deleteAction} data={dungeonConfig.actions} displayKeys={["command", "description"]} onAdd={dungeonConfig.addAction} title={t(`dungeon_keys.actions`)} buttonText={t(`${tl}.buttons.create_action`)} />

            <Row className="mt-5 justify-content-end">
                <div className="col-md-5">
                    <button className="btn w-100 btn-green drawn-border" onClick={dungeonConfig.save}>{action === "new" ? t(`button.create`) : t(`button.save`)}</button>
                </div>
            </Row>
        </Container>

    )
}

export default DungeonConfigurator;