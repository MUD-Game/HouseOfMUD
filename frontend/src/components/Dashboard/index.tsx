import React from 'react'

type DashboardProps = {
    user: string
}

const Dashboard: React.FC<DashboardProps> = (props) => { 
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Hello {props.user}</p>
        </div>
    )
} 

export default Dashboard;