/**
 * @module Busy
 * @category React Components
 * @description Is displayed if data is loaded or the page is busy
 * @props {@linkcode BusyProps}
 */

import React from 'react'
import Lama from '../../assets/Lama.png'
import "./index.css"
export interface BusyProps { }

const Busy: React.FC<BusyProps> = (props) => {
    return (
        <div>
            <img id="lama" src={Lama} alt="Lama" />
        </div>
    )
}

export default Busy;    