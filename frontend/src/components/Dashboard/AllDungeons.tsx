import React from 'react';
import AllDungeonLi from './AllDungeonsLi';
import { GetDungeonsResponse } from 'src/types/supervisor';
type AllDungeonProps = {
    allDungeons: GetDungeonsResponse;
}

const AllDungeons: React.FC<AllDungeonProps> = ({ allDungeons }) => {

    return (
        <div>
            {allDungeons.map((dungeon, index)=>{
                return (
                    <AllDungeonLi key={index} isPrivate={false} {...dungeon}/>
                )
            })}
        </div>
    )
}

export default AllDungeons;