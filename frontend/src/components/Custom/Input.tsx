import { t } from "i18next";
import React from "react"
import './index.css'

export interface MudInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    colmd: number;
    name: string;
    noconstraint?: number; // Free as in "free value", if its not free it has a constraint
}

const MudInput: React.FC<MudInputProps> = (props) => {
    return (
        <div className={"col-md-" + props.colmd}>
            <label htmlFor={props.name}><b>{props.placeholder}{!props.noconstraint ? ` (${t("constraint.max")} ${t(`constraint.${props.name}`)}${props.type === "number" ? "" : " "+t("common.string_chars")})`: "" }:</b></label>
            <input spellCheck={false} autoComplete="off" {...props} className={props.className + " input-standard drawn-border"}/>
        </div>
    )
}

export default MudInput;