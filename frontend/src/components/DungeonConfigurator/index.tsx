import React from 'react'
import { Container, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import MudInput from '../Custom/MudInupt';
import './index.css'

export interface DungeonConfiguratorProps { }

interface LocationState {
    action: "new" | "edit";
}

const DungeonConfigurator: React.FC<DungeonConfiguratorProps> = ({ }) => {
    const location = useLocation();
    let action = (location.state as LocationState)?.action || "new";

    return (

        <Container>
            <Row className="my-3 g-3">
                <h1>DungeonConfigurator</h1>
                <MudInput colmd={9} type="text" name="name" placeholder="Name" />
                <MudInput colmd={3} type="number" name="maxplayercount" placeholder="Maximale Spieleranzahl" />
                <MudInput colmd={12} type="text" name="description" placeholder="Beschreibung" />
            </Row>
        </Container>

    )
}

export default DungeonConfigurator;