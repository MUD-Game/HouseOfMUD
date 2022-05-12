/**
 * @module OnlinePlayers
 * @category React Components
 * @description OnlinePlayers Component to show the players online
 * @children
 * @props {@linkcode OnlinePlayersProps}
 */

import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useRabbitMQ } from 'src/hooks/useRabbitMQ';
import { X } from 'react-bootstrap-icons';

export interface OnlinePlayersData {
    players: [{
        character: string,
        room: string
    }]
}

export interface OnlinePlayersProps {
    setPlayers: (players: string[]) => void,

}

const OnlinePlayers: React.FC<OnlinePlayersProps> = ({ setPlayers }) => {
    const { t } = useTranslation();
    const { sendPlayerInformation, setOnlinePlayersSubscriber } = useRabbitMQ();
    const [onlinePlayers, setOnlinePlayers] = React.useState<OnlinePlayersData>();

    const playerInformation = (playerName: string) => {
        sendPlayerInformation(playerName, () => { }, console.error);
    }

    const onlinePlayerSubscriber = (players: OnlinePlayersData) => {
        setOnlinePlayers(players);
        let playersList: string[] = [];
        players.players.forEach((player) => {
            playersList.push(player.character);
        });
        setPlayers(playersList);
    }

    useEffect(() => {
        setOnlinePlayersSubscriber(onlinePlayerSubscriber);
    })

    return (
        <div className="onlineplayers drawn-border mb-2 p-2 pt-1">
            <div className="onlineplayers-wrap p-1">
                <p className='m-0'><u>{t("game.onlineplayers")}</u></p>
                {onlinePlayers && onlinePlayers.players.length > 1 ?
                    <ul className='ps-4'>
                        {onlinePlayers?.players.filter(onlinePlayer => onlinePlayer.character !== 'dungeonmaster').map((onlinePlayer) =>
                            <li className="link-li ps-1" key={onlinePlayer.character} onClick={() => { playerInformation(onlinePlayer.character) }}>{`${onlinePlayer.character} [${onlinePlayer.room}]`}</li>
                        )}
                    </ul>
                    : t("game.noplayers")}
            </div>
        </div>
    )
}

export default OnlinePlayers;    