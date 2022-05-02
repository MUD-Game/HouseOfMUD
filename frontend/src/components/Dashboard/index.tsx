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
import React, { useEffect, useState } from 'react'
import { Container, Nav, Row } from 'react-bootstrap';
import { useAuth } from 'src/hooks/useAuth';
import { supervisor } from 'src/services/supervisor';
import { DungeonResponseData, GetDungeonsRequest } from '@supervisor/api';
import AllDungeons from './AllDungeons/AllDungeons';
import { useNavigate } from 'react-router-dom';
import MyDungeons from './MyDungeons/MyDungeons';
import { useTranslation } from 'react-i18next';
import Alert from '../Custom/Alert';


export type DashboardProps = {
}

const Dashboard: React.FC<DashboardProps> = (props) => {
    
    const {t} = useTranslation();
    const auth = useAuth();
    const navigate = useNavigate();
    const [allDungeons, setAllDungeons] = useState<DungeonResponseData[]>();
    const [myDungeons, setMyDungeons] = useState<DungeonResponseData[]>();
    const [dungeonView, setDungeonView] = useState<"all" | "my">("all");
    const [searchTerm, setSearchTerm] = useState<string>('');

    const[error, setError] = useState<string>("");

    useEffect(() => {
        fetchDungeons();
    }, [])

    const handleSelect = (eventKey: string | null) => {
        if (eventKey === "all") {
            setDungeonView("all");
        } else {
            setDungeonView("my");
        }
        setSearchTerm('');
    }

    const fetchDungeons = () => {
        supervisor.getDungeons({}, setAllDungeons, error => setError(error.error))
        supervisor.getMyDungeons({}, setMyDungeons, error => setError(error.error));
    }

    const handleSearch = (event: any) => {
        setSearchTerm(event.target.value);
    }

    return (
        <Container className="mb-5">
            <Row>
                <Alert message={error} setMessage={setError} type="error" />
            </Row>
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
            <Row className="mb-4">
                <div className="col-md-6">
                    <input id="search-input" typeof='text' value={searchTerm} onChange={handleSearch} placeholder={t("dashboard.search_dungeon")} />
                </div>
            </Row>

            <Row>
                <div className="col">
                    <Nav variant="tabs" defaultActiveKey="all" onSelect={handleSelect}>
                        <Nav.Item>
                            <Nav.Link eventKey="all">Verfügbare Dungeons</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="my">Eigene Dungeons</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </div>
            </Row>


            {dungeonView === "all" && allDungeons ? <AllDungeons filterKey={'name'} filterValue={searchTerm} allDungeons={allDungeons} /> : null}
            {dungeonView === "my" && myDungeons ? <MyDungeons fetchMyDungeons={fetchDungeons} filterKey={'name'} filterValue={searchTerm} myDungeons={myDungeons} /> : null}
        </Container >
    )
}

export default Dashboard;