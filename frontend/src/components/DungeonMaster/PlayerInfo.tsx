/**
 * @module PlayerInfo
 * @category React Components
 * @description Player information from a specific player
 * @props {@linkcode PlayerInfoProps}
*/

import { useTranslation } from 'react-i18next';
import React, { useEffect } from 'react'
import { useRabbitMQ } from 'src/hooks/useRabbitMQ';
import ResourceBar from '../Game/HUD/ResourceBar';

export interface PlayerInfoData {    
    playerName: string,
    inventory: [{
        item: string,
        count: number
    }],
    room: string,
    currentStats: {
        hp: number,
        dmg: number,
        mana: number
    },
    maxStats: {
        hp: number,
        dmg: number,
        mana: number
    }
}

export interface PlayerInfoProps { 
}

const PlayerInfo: React.FC<PlayerInfoProps> = () => {
    const { t } = useTranslation();    
    const { setPlayerInformationSubscriber } = useRabbitMQ();
    const [playerInformation, setPlayerInformation] = React.useState<PlayerInfoData | undefined>(undefined);

    const playerInformationSubscriber = (playerInformation: PlayerInfoData) => {
        setPlayerInformation(playerInformation);
    }

    useEffect(() => {        
        setPlayerInformationSubscriber(playerInformationSubscriber);
    })

    return (
        <div className="playerinfo drawn-border mb-2 p-2">
            <div className="playerinfo-wrap h-100 p-1 pt-0">
                <p className='m-0'><u><b>{t("game.playerInfo.player")}: {playerInformation?.playerName}</b></u></p>
                <span><u>{t("game.playerInfo.room")}:</u> {playerInformation?.room}</span> <br />
                <span><u>{t("game.playerInfo.inventory")}:</u><br />
                    <ul>
                        {playerInformation?.inventory.map(itemName => {
                            return ( <li key={itemName.item}> {itemName.item} [{itemName.count}] </li> )
                        })}
                    </ul>
                </span><br />
                <span><u>{t("game.playerInfo.stats")}:</u> <br />
                {playerInformation != undefined
                    ?   <div>
                            <ResourceBar variant='health' now={playerInformation?.currentStats.hp} max={playerInformation?.maxStats.hp} label='HP' />
                            <ResourceBar variant='mana' now={playerInformation?.currentStats.mana} max={playerInformation?.maxStats.mana} label='Mana' />
                            <ResourceBar variant='damage' now={playerInformation?.currentStats.dmg} max={playerInformation?.maxStats.dmg} label='Damage' />
                        </div>
                    :   ""
                }
                </span>

            </div>
        </div>
    )
}

export default PlayerInfo;    