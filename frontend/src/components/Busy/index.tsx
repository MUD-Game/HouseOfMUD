/**
 * @module Busy
 * @category React Components
 * @description Is displayed if data is loaded or the page is busy
 * @props {@linkcode BusyProps}
 */

import React from 'react'
import { Container } from 'react-bootstrap'
import Lama from '../../assets/Lama.png'
import "./index.css"
export interface BusyProps { }

const Busy: React.FC<BusyProps> = (props) => {
    return (
        <Container className="text-center">
            <div className="lama-wrapper">
                <img id="lama" src={Lama} alt="Lama" />
            </div>
        </Container>
    )
}

export default Busy;    