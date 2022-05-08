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
import { DungeonResponseData } from '@supervisor/api';
import { Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
export type AllDungeonProps = {
    filterKey: 'name' | 'description';
    filterValue: string;
    allDungeons: DungeonResponseData[];
}

const AllDungeons: React.FC<AllDungeonProps> = ({ allDungeons, filterValue, filterKey }) => {

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

            {allDungeons.filter(dungeon => dungeon[filterKey].toLowerCase().includes(filterValue.toLowerCase())).map((dungeon, index) => {
                return (
                    <AllDungeonLi key={index} isPrivate={false} {...dungeon} />
                )
            })}
        </div>
    )
}

export default AllDungeons;