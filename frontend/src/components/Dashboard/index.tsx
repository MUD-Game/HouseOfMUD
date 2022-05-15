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
import { Container, Nav, Row, Col } from 'react-bootstrap';
import { supervisor } from 'src/services/supervisor';
import { DungeonResponseData } from '@supervisor/api';
import AllDungeons from './AllDungeons/AllDungeons';
import { useNavigate, useLocation } from 'react-router-dom';
import MyDungeons from './MyDungeons/MyDungeons';
import { useTranslation } from 'react-i18next';
import Alert from '../Custom/Alert';
import { Arrow90degLeft, ArrowCounterclockwise, Circle } from 'react-bootstrap-icons';
import Busy from '../Busy';


export type DashboardProps = {
}

export interface DashboardLocationState {
    message: string;
    title: string;
    delay: number;
    time: Date;
}

type boardtype = 'all' | 'my';

const Dashboard: React.FC<DashboardProps> = (props) => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    // Get the search params
    const searchParams = new URLSearchParams(location.search);
    let board = searchParams.get('board') as boardtype;
    if (board !== "all" && board !== "my") board = "all";
    const [allDungeons, setAllDungeons] = useState<DungeonResponseData[]>();
    const [myDungeons, setMyDungeons] = useState<DungeonResponseData[]>();
    const [dungeonView, setDungeonView] = useState<boardtype>(board);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [alert, setAlert] = useState({ title: "", text: "" });
    const [error, setError] = useState<string>("");


    useEffect(() => {
        if (location.state) {
            const dState = location.state as DashboardLocationState;
            // If a timestamp was given, check if its too old
            const isInTime = dState.time ? dState.time && dState.time.getTime() + 2000 > Date.now() : true;
            if (isInTime && dState.message && dState.title) {
                setAlert({ title: dState.title, text: dState.message });
            }
            const delay = dState.delay;
            if (isInTime && delay) {
                setTimeout(() => fetchDungeons(), delay);
            } else {
                fetchDungeons();
            }
        } else {
            fetchDungeons();
        }
    }, [])

    const handleSelect = (eventKey: string | null) => {
        if (eventKey === "all") {
            setDungeonView("all");
        } else {
            setDungeonView("my");
        }
        setSearchTerm('');
    }


    const fetchDungeons = (callback?: VoidFunction) => {
        supervisor.getDungeons({}, (data) => { setAllDungeons(data); callback && callback() }, error => setError(error.error))
        supervisor.getMyDungeons({}, (data) => { setMyDungeons(data); }, error => setError(error.error));
    }

    const handleSearch = (event: any) => {
        setSearchTerm(event.target.value);
    }

    return (
        <Container className="mb-5">
            <Row>
                <Alert message={error} setMessage={setError} type="error" />
                <Alert message={alert.text} setMessage={() => setAlert({ title: "", text: "" })} title={alert.title} type={'error'} />
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
            <Row className="align-items-center pt-1 pb-2 mb-4 g-2">
                <div className="col-md-6">
                    <input id="search-input" className="input-standard drawn-border" typeof='text' value={searchTerm} onChange={handleSearch} placeholder={t("dashboard.search_dungeon")} />
                </div>
                <div className="col-md-2 col-lg-1 ms-md-2">
                    <button onClick={(evt) => {
                        const target: React.MouseEvent<HTMLButtonElement, MouseEvent>["currentTarget"] = evt.currentTarget;
                        target.classList.add("spin");
                        target.disabled = true;
                        fetchDungeons(() => {
                            setTimeout(()=>{target.classList.remove("spin")}, 750);
                            target.disabled = false;
                        })
                    }} className="btn drawn-border btn-blue w-100" id="refreshButton" ><ArrowCounterclockwise size={30} /></button>
                </div>
            </Row>

            <Row>
                <div className="col">
                    <Nav variant="tabs" defaultActiveKey={board} onSelect={handleSelect}>
                        <Nav.Item>
                            <Nav.Link eventKey="all">{t("dashboard.all_dungeons")}</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="my">{t("dashboard.my_dungeons")}</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </div>
            </Row>

            {dungeonView === "all" && !allDungeons && <Busy />}
            {dungeonView === "my" && !myDungeons && <Busy />}

            {dungeonView === "all" && allDungeons ? <AllDungeons fetchDungeons={fetchDungeons} messageCallback={setError} filterKey={'name'} filterValue={searchTerm} allDungeons={allDungeons} /> : null}
            {dungeonView === "my" && myDungeons ? <MyDungeons messageCallback={setError} fetchMyDungeons={fetchDungeons} filterKey={'name'} filterValue={searchTerm} myDungeons={myDungeons} /> : null}
        </Container >
    )
}

export default Dashboard;