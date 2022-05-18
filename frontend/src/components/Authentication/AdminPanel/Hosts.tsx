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
     players: number;
     dungeons: DungeonResponseData[];
     fetchDungeons: () => void;
     messageCallback: (msg: string) => void;
 }
 
 const Hosts: React.FC<HostsProps> = ({ host, dungeons, players, blocked, fetchDungeons, messageCallback }) => {
 
     const { t } = useTranslation();
 
     return (
         <>
             <Accordion.Item eventKey={host}>
                 <Accordion.Header><Stack size={25} className="me-2"/>{host + `: ${players} Spieler` + (blocked ? ' (blockiert)' : '')}</Accordion.Header>
                 <Accordion.Body>
                     <Row className="justify-content-between">
                         <div className="col-6">
                             <h4>{ t("user_settings.admin.hostoptions.title") }</h4>
                         </div>
                         {
                             !blocked && <div className="col-3">
                             <button className="btn drawn-border btn-yellow w-100" onClick={() => {
                                 supervisor.stopHost(host, { forceStop: false }, () => { fetchDungeons() }, (error) => { messageCallback(error.error) })
                             }}>
                                     <Pause size={30} id="deleteIcon text-white" className="mx-1" />
                                     <span className="align-text-top">{t("user_settings.admin.hostoptions.softstop")}</span>
                                 </button>
                             </div>
                         }
                         <div className="col-3">
                             <button className="btn drawn-border btn-red w-100" onClick={() => {
                             supervisor.stopHost(host, { forceStop: true }, () => { fetchDungeons() }, (error) => { messageCallback(error.error) })
                         }}>
                                 <Stop size={30} id="deleteIcon text-white" className="mx-1" />
                                 <span className="align-text-top">{t("user_settings.admin.hostoptions.forcestop")}</span>
                             </button>
                         </div>
                     </Row>
                     <hr />
                     <Row>
                         <div className="col">
                             <h4>{ t("user_settings.admin.dungeonoptions.title") }</h4>
                         </div>
                     </Row>
                     { dungeons.length !== 0 ?
                     <Row>
                         <div className="col-3">
                             <b><u>{t("dungeon_keys.name")}</u></b>
                         </div>
                         <div className="col-6">
                             <b><u>{t("dungeon_keys.description")}</u></b>
                         </div>
                         <div className="col-1">
                             <b><u>{t("dungeon_keys.players")}</u></b>
                         </div>
                         <div className="col-1">
                             <b><u>{t("dungeon_keys.status")}</u></b>
                         </div>
                         <div className="col-1"></div>
                     </Row>
                     : t("user_settings.admin.dungeonoptions.no_dungeons")
                     }                    
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