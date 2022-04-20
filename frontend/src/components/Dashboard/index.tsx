import React, { useEffect } from 'react'
import { useAuth } from 'src/hooks/useAuth';
import { supervisor } from 'src/services/supervisor';
import { GetDungeonsRequest, GetDungeonsResponse, GetMyDungeonsResponse } from 'src/types/supervisor';
import  AllDungeons  from './AllDungeons';
type DashboardProps = {
}

const Dashboard: React.FC<DashboardProps> = (props) => {

    let auth = useAuth();
    let [allDungeons, setAllDungeons] = React.useState<GetDungeonsResponse>();
    let [myDungeons, setMyDungeons] = React.useState<GetMyDungeonsResponse>();

    useEffect(() => {
        let request : GetDungeonsRequest = {
            user: auth.user,
            auth: auth.token,
        }
        supervisor.getDungeons(request,setAllDungeons, console.log)
        supervisor.getMyDungeons(request,setMyDungeons, console.log);
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