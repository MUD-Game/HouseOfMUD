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
import { Button, Container, Form, FormControl, Nav, Row } from 'react-bootstrap';
import { useAuth } from 'src/hooks/useAuth';
import { useMudConsole } from 'src/hooks/useMudConsole';
import { supervisor } from 'src/services/supervisor';
import { DungeonResponseData, GetDungeonsRequest, GetDungeonsResponse, GetMyDungeonsResponse } from '@supervisor/api';
import AllDungeons from './AllDungeons/AllDungeons';
import "./index.css"
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import MyDungeons from './MyDungeons/MyDungeons';
import { useTranslation } from 'react-i18next';


export type DashboardProps = {
}

const Dashboard: React.FC<DashboardProps> = (props) => {
    
    const {t} = useTranslation();
    const auth = useAuth();
    const homsole = useMudConsole();
    const navigate = useNavigate();
    let [allDungeons, setAllDungeons] = React.useState<DungeonResponseData[]>();
    let [myDungeons, setMyDungeons] = React.useState<DungeonResponseData[]>();
    let [dungeonView, setDungeonView] = React.useState<"all" | "my">("all");
    let [searchTerm, setSearchTerm] = React.useState<string>('');

    useEffect(() => {
        let request: GetDungeonsRequest = {
            user: auth.user,
        }
        supervisor.getDungeons(request, setAllDungeons, homsole.supervisorerror)
        supervisor.getMyDungeons(request, setMyDungeons, homsole.supervisorerror);
    }, [])

    const handleSelect = (eventKey: string | null) => {
        if (eventKey === "all") {
            setDungeonView("all");
        } else {
            setDungeonView("my");
        }
    }
    const handleSearch = (event: any) => {
        setSearchTerm(event.target.value);
    }

    return (
        <Container className="mb-5">
            <Row className="align-items-center mb-3">
                <div className="col-8">
                    <h2 className='my-3'>{t("dashboard.title")}</h2>
                </div>
                <div className="col-4">
                    <button className="btn drawn-border btn-standard" onClick={() => {
                        navigate("/dungeon-configurator", { state: { action: "new" } });
                    }}>{t("dashboard.create_new_dungeon")}</button>
                </div>
            </Row>

            <Nav variant="tabs" defaultActiveKey="all" onSelect={handleSelect}>
                <Nav.Item>
                    <Nav.Link eventKey="all">{t("dashboard.all_dungeons")}</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="my">{t("dashboard.my_dungeons")}</Nav.Link>
                </Nav.Item>
            </Nav>
            <input id="search-input" typeof='text' value={searchTerm} onChange={handleSearch} placeholder={t("dashboard.search_dungeon")} />

            {dungeonView === "all" && allDungeons ? <AllDungeons filterKey={'name'} filterValue={searchTerm} allDungeons={allDungeons} /> : null}
            {dungeonView === "my" && myDungeons ? <MyDungeons filterKey={'name'} filterValue={searchTerm} myDungeons={myDungeons} /> : null}
        </Container >
    )
}

export default Dashboard;