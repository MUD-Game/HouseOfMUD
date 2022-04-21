/**
 * @module Dashboard
 * @category React Components
 * @description The dashboard is the main page of the application.
 * @children {@linkcode AllDungeons}, {@linkcode MyDungeons}
 * @props {@linkcode DashboardProps}
 * ```jsx
 * <>
 *  <AllDungeons />
 *  <MyDungeons />
 * </>
 * ```
 */
import React, { useEffect } from 'react'
import { Container, Nav } from 'react-bootstrap';
import { useAuth } from 'src/hooks/useAuth';
import { supervisor } from 'src/services/supervisor';
import { GetDungeonsRequest, GetDungeonsResponse, GetMyDungeonsResponse } from 'src/types/supervisor';
import AllDungeons from './AllDungeons';
import "./index.css"


export type DashboardProps = {
}

const Dashboard: React.FC<DashboardProps> = (props) => {

    let auth = useAuth();
    let [allDungeons, setAllDungeons] = React.useState<GetDungeonsResponse>();
    let [myDungeons, setMyDungeons] = React.useState<GetMyDungeonsResponse>();
    let [dungeonView, setDungeonView] = React.useState<"all" | "my">("all");

    useEffect(() => {
        let request: GetDungeonsRequest = {
            user: auth.user,
            authToken: auth.token,
        }
        supervisor.getDungeons(request, setAllDungeons, console.log)
        supervisor.getMyDungeons(request, setMyDungeons, console.log);
    }, [])

    const handleSelect = (eventKey: string | null) => {
        if (eventKey === "all") {
            setDungeonView("all");
        } else {
            setDungeonView("my");
        }
    }

    return (
        <Container className="mb-5">
            <h2>Dashboard</h2>
            <Nav variant="tabs" defaultActiveKey="all" onSelect={handleSelect}>
                <Nav.Item>
                    <Nav.Link eventKey="all">Verfügbare Dungeons</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="my">Eigene Dungeons</Nav.Link>
                </Nav.Item>
            </Nav>

            {dungeonView === "all" && allDungeons ? <AllDungeons allDungeons={allDungeons} /> : null}
            {dungeonView === "my" && myDungeons ? <AllDungeons allDungeons={myDungeons} /> : null}
        </Container>
    )
}

export default Dashboard;