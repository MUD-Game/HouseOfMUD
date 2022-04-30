/**
 * @module PlayerInfo
 * @category React Components
 * @description Player information from a specific player
 * @props {@linkcode PlayerInfoProps}
 */

 import React from 'react'
 export interface PlayerInfoProps {
     player: any; //TODO: define item data
 }
 
 const PlayerInfo: React.FC<PlayerInfoProps> = ({ player }) => {
     return (
         <div className="playerinfo drawn-border mb-2">
             <p className='text-center pt-5'>Player-Info</p>
         </div>
     )
 }
 
 export default PlayerInfo;    