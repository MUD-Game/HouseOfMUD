import React from 'react'
import { Container, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useDungeonConfigurator } from 'src/hooks/useDungeonConfigurator';
import { useMudConsole } from 'src/hooks/useMudConsole';
import MudInput from '../Custom/MudInupt';
import MudTypeahead from '../Custom/MudTypeahead';
import DungeonObjectList from './DungeonObjectList';
import './index.css'
type Option = string | { [key: string]: any };

export interface DungeonConfiguratorProps { }

interface LocationState {
    action: "new" | "edit";
}

const DungeonConfigurator: React.FC<DungeonConfiguratorProps> = ({ }) => {
    const location = useLocation();
    const homosole = useMudConsole();
    const dungeonConfig = useDungeonConfigurator();
    let action = (location.state as LocationState)?.action || "new";
    //TODO: Add a way to edit a dungeon that is already created


    return (

        <Container>
            <Row className="my-3 g-3">
                <h1>DungeonConfigurator</h1>
                <MudInput maxLength={50} colmd={9} onBlur={dungeonConfig.handleOnBlurInput} type="text" name="name" placeholder="Name" />
                <MudInput colmd={3} onBlur={dungeonConfig.handleOnBlurInput} type="number" name="maxPlayers" placeholder="Maximale Spieleranzahl" />
                <MudInput maxLength={50} colmd={12} onBlur={dungeonConfig.handleOnBlurInput} type="text" name="description" placeholder="Beschreibung" />
                <MudTypeahead title="Geschlechter" options={[]} allowNew colmd={12} multiple id='gender-typeahead' emptyLabel="Neues Geschlecht eingeben..." onChange={dungeonConfig.setGenders as unknown as (a: Option[]) => void} selected={dungeonConfig.genders} />
                <MudTypeahead title="Spezies" options={[]} allowNew colmd={12} multiple id='species-typeahead' emptyLabel="Neue Spezies eingeben..." onChange={dungeonConfig.setSpecies as unknown as (a: Option[]) => void} selected={dungeonConfig.species} />
            </Row>
            <DungeonObjectList identifier="id" onEditElement={dungeonConfig.editClass} onDeleteElement={dungeonConfig.deleteClass} data={dungeonConfig.classes} displayKeys={{ name: "Name", description: "Beschreibung" }} onAdd={dungeonConfig.addClass} title="Klassen" buttonText="neue Klasse anlegen" />

            <DungeonObjectList identifier="id" onEditElement={dungeonConfig.editItem} onDeleteElement={dungeonConfig.deleteItem} data={dungeonConfig.items} displayKeys={{ name: "Name", description: "Beschreibung" }} onAdd={dungeonConfig.addItem} title="Items" buttonText="neues Item anlegen" />

            <DungeonObjectList identifier="id" onEditElement={dungeonConfig.editAction} onDeleteElement={dungeonConfig.deleteAction} data={dungeonConfig.actions} displayKeys={{ command: "Eingabe", description: "Beschreibung" }} onAdd={dungeonConfig.addAction} title="Aktionen" buttonText="neue Aktion anlegen" />

            <button onClick={dungeonConfig.save}>Speichern</button>
        </Container>

    )
}

export default DungeonConfigurator;