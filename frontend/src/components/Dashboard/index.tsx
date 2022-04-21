import React, { useEffect } from 'react'
import { Container } from 'react-bootstrap';
import { useAuth } from 'src/hooks/useAuth';
import { supervisor } from 'src/services/supervisor';
import { GetDungeonsRequest, GetDungeonsResponse, GetMyDungeonsResponse } from 'src/types/supervisor';
import AllDungeons from './AllDungeons';
import "./index.css"
type DashboardProps = {
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

    const toggleView = () => {
        if (dungeonView === "all") {
            setDungeonView("my");
        } else {
            setDungeonView("all");
        }
    }

    return (
        <Container>
            <h1>Dashboard</h1>
            <p>Hello {auth.user}</p>
            <button onClick={toggleView}>{dungeonView == "all" ? "myDungeons" : "allDungeons"}</button>
            {dungeonView === "all" && allDungeons ? <AllDungeons allDungeons={allDungeons} /> : null}
            {dungeonView === "my" && myDungeons ? <AllDungeons allDungeons={myDungeons} /> : null}
        </Container>
    )
}

export default Dashboard;