import React from 'react'
import Lama from '../../assets/Lama.png'
type BusyProps = {}

const Busy: React.FC<BusyProps> = (props) => {
    return (
        <div>
            <img src={Lama} alt="Lama" />
        </div>
    )
}

export default Busy;