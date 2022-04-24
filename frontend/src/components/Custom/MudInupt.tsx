import React from "react"
import './index.css'

export interface MudInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    colmd: number;
}

const MudInput: React.FC<MudInputProps> = (props) => {
    return (
        <div className={"col-md-" + props.colmd}>
            <label htmlFor={props.name}><b>{props.placeholder}:</b></label>
            <input autoComplete="off" {...props} />
        </div>
    )
}

export default MudInput;