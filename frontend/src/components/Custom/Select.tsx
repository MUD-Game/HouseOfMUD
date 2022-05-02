import React from "react"
import './index.css'

export interface MudSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    colmd: number;
    label: string;
}

const MudSelect: React.FC<MudSelectProps> = (props) => {
    return (
        <div className={"col-md-" + props.colmd}>
            <label htmlFor={props.name}><b>{props.label}:</b></label>
            <select  {...props} />

        </div>
    )
}

export default MudSelect;