/**
 * @module Dungeon
 * @category React Components
 * @description Dungeon Component to display Dungeon
 * @props {@linkcode DungeonProps}
 */

import { DungeonResponseData } from '@supervisor/api';
import { t } from 'i18next';
import React from 'react'
import { Accordion, Row } from 'react-bootstrap';
import { Unlock, CloudCheck, CloudSlash, Play, Pencil, Trash, Stop, Lock } from 'react-bootstrap-icons';
import Busy from 'src/components/Busy';
import ConfirmationDialog from 'src/components/Modals/BasicModals/ConfirmationDialog';
import { supervisor } from 'src/services/supervisor';
export interface DungeonProps {
    dungeon: DungeonResponseData;
    fetchDungeons: () => void;
    messageCallback: (msg: string) => void;
 }

const Dungeon: React.FC<DungeonProps> = ({ dungeon, fetchDungeons, messageCallback }) => {
    const [isBusy, setIsBusy] = React.useState(false);

    return (
        <>
            <Row className={`dungeon-item align-items-center pt-1 pb-2 mb-2`}>
                <div className="col-3">
                    {dungeon.name}
                </div>
                <div className="col-6">
                    {dungeon.description}
                </div>
                <div className="col-1">
                    {dungeon.currentPlayers} / {dungeon.maxPlayers}
                </div>
                <div className="col-1">
                    {dungeon.isPrivate ? <Lock style={{ color: "var(--red)" }} size={25} className="mx-1" /> : <Unlock size={25} className="mx-1" />}
                    <CloudCheck size={25} style={{ color: "green" }} className="mx-1" />
                </div>
                <div className="col-1 text-end">
                    <div>
                        <Stop size={30} id="deleteIcon" className="mx-1" onClick={() => {
                            setIsBusy(true);
                            supervisor.stopDungeon(dungeon.id, {}, (data) => {
                                // setIsBusy(false);
                                setIsBusy(false);
                                fetchDungeons();
                                // TODO: handle error correctly
                            }, (error) => { messageCallback(error.error) })
                        }} />
                    </div>
                </div>
            </Row>
        </>
    )
}

export default Dungeon;