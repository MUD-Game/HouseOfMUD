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

import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom'
import AllDungeonLi from './AllDungeonsLi';

import { DungeonResponseData } from '@supervisor/api';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {supervisor} from 'src/services/supervisor'
import {useGame} from 'src/hooks/useGame'
import { SendsMessagesProps } from '../../../types/misc';
import DungeonPasswordModal, {
    DungeonPasswordModalProps,
} from '../../Modals/DungeonConfigurator/DungeonPasswordModal';
import CryingLlama from 'src/components/Busy/CryingLlama';
export type AllDungeonProps = {
    filterKey: 'name' | 'description';
    filterValue: string;
    allDungeons: DungeonResponseData[];
};

const AllDungeons: React.FC<AllDungeonProps & SendsMessagesProps> = ({
    allDungeons,
    filterValue,
    filterKey,
    messageCallback
}) => {
    const { t } = useTranslation();
    const game = useGame();
    const navigate = useNavigate();
    const [modalState, setModalState] = useState<DungeonPasswordModalProps>({
        show: false,
        onConfirm: (password: string) => {},
        onHide: () => {},
    });

    const onPasswordRequest = (dungeonId: string, dungeonName: string) => {
        setModalState({ show: true, onConfirm: password => {
            supervisor.checkPassword(
                dungeonId,
                password,
                () => {
                    setModalState({ show: false, onHide: () => { }, onConfirm: () => { } });
                    game.setDungeon(dungeonId);
                    game.setDungeonName(dungeonName);
                    navigate('/select-character');
                },
                error => {
                    console.log(error.error);
                    messageCallback(error.error);
                }
            );
        }, onHide: () => {
            setModalState({ show: false, onHide: () => {}, onConfirm: () =>{}});
            messageCallback("");
        } });
    };

    return (
        <div className="dashboard pt-3">
            {allDungeons.length !== 0 ? <><Row className="py-2">
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
                    <AllDungeonLi
                                onPasswordRequest={onPasswordRequest}
                                key={index}
                                {...dungeon}
                            />
                )
            })}</>
             : 
             <CryingLlama />
             }
        </div>
    )
}

            <DungeonPasswordModal {...modalState} />
        </>
    );
};

export default AllDungeons;
