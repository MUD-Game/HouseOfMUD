import React, { useEffect } from 'react'
import { useAuth } from 'src/hooks/useAuth';
import { GetDungeonsResponse, GetMyDungeonsResponse, supervisor } from 'src/services/supervisor';
import  AllDungeons  from './AllDungeons';
type DashboardProps = {
}

const Dashboard: React.FC<DashboardProps> = (props) => {

    let auth = useAuth();
    let [allDungeons, setAllDungeons] = React.useState<GetDungeonsResponse>();
    let [myDungeons, setMyDungeons] = React.useState<GetMyDungeonsResponse>();
    useEffect(() => {
        supervisor.getAllDungeons(setAllDungeons, console.log)
        supervisor.getAllDungeons(setMyDungeons, console.log);
    }, [])

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Hello {auth.user}</p>
            {allDungeons ? <AllDungeons allDungeons={allDungeons} /> : <p>Loading...</p>}
        </div>
    )
}

export default Dashboard;