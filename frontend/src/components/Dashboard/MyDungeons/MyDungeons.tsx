/**
 * @module MyDungeons
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
import MyDungeonsLi from './MyDungeonsLi';
import { DungeonResponseData, GetDungeonsResponse } from '@supervisor/api';
import { Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
export type AllDungeonProps = {
    filterKey: 'name' | 'description';
    filterValue: string;
    myDungeons: DungeonResponseData[];
    fetchMyDungeons: ()=>void;
}

const MyDungeons: React.FC<AllDungeonProps> = ({ myDungeons, filterValue, filterKey, fetchMyDungeons }) => {

    const {t} = useTranslation();

    return (
        <div className="dashboard pt-3">
            <Row className="py-2">
                <div className="col-3">
                    <b><u>{t("dungeon_keys.name")}</u></b>
                </div>
                <div className="col-5">
                    <b><u>{t("dungeon_keys.description")}</u></b>
                </div>
                <div className="col-1">
                    <b><u>{t("dungeon_keys.players")}</u></b>
                </div>
                <div className="col-1 text-center">
                    <b><u>{t("dungeon_keys.status")}</u></b>
                </div>
                <div className="col-2"></div>
            </Row>

            {myDungeons.filter(dungeon => dungeon[filterKey].toLowerCase().includes(filterValue.toLowerCase())).map((dungeon, index) => {
                return (
                    <MyDungeonsLi key={index} isPrivate={false} fetchMyDungeons={fetchMyDungeons} {...dungeon} />
                )
            })}

            {/* {allDungeons.map((dungeon, index) => {
                if (dungeon.name === filter)
                return (
                    <AllDungeonLi key={index} isPrivate={false} {...dungeon} />
                )
            })} */}
        </div>
    )
}

export default MyDungeons;