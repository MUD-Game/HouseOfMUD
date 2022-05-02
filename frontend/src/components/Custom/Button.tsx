import React from "react"
import './index.css'

export interface MudButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { }

const MudButton: React.FC<MudButtonProps> = (props) => {
    return (
        <button {...props} className={"btn" + props.className} />
    )
}

export default MudButton;