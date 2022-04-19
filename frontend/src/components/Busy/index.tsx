import React from 'react'
import Lama from '../../assets/Lama.png'
import "./index.css"
type BusyProps = {}

const Busy: React.FC<BusyProps> = (props) => {
    return (
        <div>
            <img id="lama" src={Lama} alt="Lama" />
        </div>
    )
}

export default Busy;    