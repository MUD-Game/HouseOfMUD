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
import { DungeonResponseData } from '@supervisor/api';
import { Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { SendsMessagesProps } from '../../../types/misc';
export type AllDungeonProps = {
    filterKey: 'name' | 'description';
    filterValue: string;
    myDungeons: DungeonResponseData[];
    fetchMyDungeons: ()=>void;
}

const MyDungeons: React.FC<AllDungeonProps & SendsMessagesProps> = ({ myDungeons, filterValue, filterKey, fetchMyDungeons, messageCallback }) => {

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
                    <MyDungeonsLi key={index} fetchMyDungeons={fetchMyDungeons} messageCallback={messageCallback} {...dungeon} />
                )
            })}
            
        </div>
    )
}

export default MyDungeons;