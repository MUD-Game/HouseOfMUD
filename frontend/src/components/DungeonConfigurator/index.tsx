import React from 'react'
import { Container } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

export interface DungeonConfiguratorProps { }

interface LocationState {
    action: "new" | "edit";
}

const DungeonConfigurator: React.FC<DungeonConfiguratorProps> = ({ }) => {
    const location = useLocation();
    let action = (location.state as LocationState)?.action || "new";

    return (

        <Container>
            <h1>DungeonConfigurator</h1>
        </Container>

    )
}

export default DungeonConfigurator;