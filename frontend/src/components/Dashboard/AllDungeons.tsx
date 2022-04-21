/**
 * @module AllDungeons
 * @category React Components
 * @description Lists all visible dungeons to a user.
 * @children {@linkcode AllDungeonLi}
 * @props {@linkcode AllDungeonProps}
 * ```jsx
 * <>
 *  <AllDungeonLi />[]
 * </>
 * ```
 */

import React from 'react';
import AllDungeonLi from './AllDungeonsLi';
import { GetDungeonsResponse } from 'src/types/supervisor';
export type AllDungeonProps = {
    allDungeons: GetDungeonsResponse;
}

const AllDungeons: React.FC<AllDungeonProps> = ({ allDungeons }) => {

    return (
        <div>
            {allDungeons.map((dungeon, index) => {
                return (
                    <AllDungeonLi key={index} isPrivate={false} {...dungeon} />
                )
            })}
        </div>
    )
}

export default AllDungeons;