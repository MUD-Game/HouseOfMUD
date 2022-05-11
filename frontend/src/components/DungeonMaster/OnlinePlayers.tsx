/**
 * @module OnlinePlayers
 * @category React Components
 * @description OnlinePlayers Component to show the players online
 * @children
 * @props {@linkcode OnlinePlayersProps}
 */

import React from 'react'
import { useTranslation } from 'react-i18next';
export interface OnlinePlayersProps {
    players: string[]; //TODO: define item data
}

const OnlinePlayers: React.FC<OnlinePlayersProps> = ({ players }) => {
    const {t} = useTranslation();

    return (
        <div className="onlineplayers drawn-border mb-2 p-2 pt-1">
            <div className="onlineplayers-wrap p-1">
                <p className='m-0'><u>{t("game.onlineplayers")}</u></p>

                <ul className='ps-4'>
                    {players.filter(player => player !== 'dungeonmaster').map((player) =>
                        <li key={player}>{ player }</li>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default OnlinePlayers;    