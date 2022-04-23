import React from 'react'
import { Container, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useDungeonConfigurator } from 'src/hooks/useDungeonConfigurator';
import { useMudConsole } from 'src/hooks/useMudConsole';
import MudInput from '../Custom/MudInupt';
import DungeonObjectList from './DungeonObjectList';
import './index.css'

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
                <MudInput colmd={12} onBlur={dungeonConfig.handleOnBlurInput} type="text" name="genders" placeholder='Geschlechter (gentrennt durch ein Komma)' />
                <MudInput colmd={12} onBlur={dungeonConfig.handleOnBlurInput} type="text" name="species" placeholder='Spezies (gentrennt durch ein Komma)' />
            </Row>
            <DungeonObjectList identifier="id" onEditElement={dungeonConfig.editClass} onDeleteElement={dungeonConfig.deleteClass} data={dungeonConfig.classes} displayKeys={{ name: "Name", description: "Beschreibung" }} onAdd={dungeonConfig.addClass} title="Klassen" buttonText="neue Klasse anlegen" />

            <DungeonObjectList identifier="id" onEditElement={dungeonConfig.editItem} onDeleteElement={dungeonConfig.deleteItem} data={dungeonConfig.items} displayKeys={{ name: "Name", description: "Beschreibung" }} onAdd={dungeonConfig.addItem} title="Items" buttonText="neues Item anlegen" />

        </Container>

    )
}

export default DungeonConfigurator;