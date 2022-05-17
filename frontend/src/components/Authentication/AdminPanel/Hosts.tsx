/**
 * @module Hosts
 * @category React Components
 * @description Hosts Component to display Hosts
 * @props {@linkcode HostsProps}
 */

import { AdminDungeonListResponse, DungeonResponseData } from '@supervisor/api';
import React, { useEffect, useState } from 'react'
import { Accordion, Row } from 'react-bootstrap';
import { Pause, SlashCircle, Stack, Stop } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { supervisor } from 'src/services/supervisor';
import Dungeon from './Dungeon';
export interface HostsProps {
    host: string;
    blocked: boolean;
    dungeons: DungeonResponseData[];
    fetchDungeons: () => void;
    messageCallback: (msg: string) => void;
}

const Hosts: React.FC<HostsProps> = ({ host, dungeons, blocked, fetchDungeons, messageCallback }) => {

    const { t } = useTranslation();

    return (
        <>
            <Accordion.Item eventKey={host}>
                <Accordion.Header><Stack size={25} className="me-2"/>{host + (blocked ? ' (blockiert)' : '')}</Accordion.Header>
                <Accordion.Body>
                    <Row className="justify-content-end">
                        {
                            !blocked && <div className="col-2">
                            <button className="btn drawn-border btn-yellow w-100" onClick={() => {
                                supervisor.stopHost(host, { forceStop: false }, () => { setTimeout(fetchDungeons, 2000); }, (error) => { messageCallback(error.error) })
                            }}>
                                    <Pause size={30} id="deleteIcon text-white" className="mx-1" />
                                    <span className="align-text-top">{t("user_settings.admin.softstop")}</span>
                                </button>
                            </div>
                        }
                        <div className="col-2">
                            <button className="btn drawn-border btn-red w-100" onClick={() => {
                            supervisor.stopHost(host, { forceStop: true }, () => { setTimeout(fetchDungeons, 2000); }, (error) => { messageCallback(error.error) })
                        }}>
                                <Stop size={30} id="deleteIcon text-white" className="mx-1" />
                                <span className="align-text-top">{t("user_settings.admin.forcestop")}</span>
                            </button>
                        </div>
                    </Row>
                    {
                        dungeons.map((dungeon, index) => { 
                            return (<Dungeon key={index} dungeon={dungeon} fetchDungeons={fetchDungeons} messageCallback={messageCallback} />)
                        })
                    }
                </Accordion.Body>
            </Accordion.Item>
        </>
    )
}

export default Hosts;