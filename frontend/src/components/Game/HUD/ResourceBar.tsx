/**
 * @module ResourceBar
 * @category React Components
 * @description ResourceBar Component to display the Health, Mana and Damage Bars
 * @props {@linkcode ResourceBarProps}
 */

import React from 'react'
import { ProgressBar, ProgressBarProps } from 'react-bootstrap';
export interface ResourceBarProps extends ProgressBarProps {
    variant: 'mana' | 'health' | 'damage';
}

const ResourceBar: React.FC<ResourceBarProps> = ({ variant, now, max, label }) => {
    return (
        <div className="my-1" >
                <ProgressBar animated variant={variant} now={now} max={max} label={`${now}/${max} ${label}`} />
        </div>
    )
}

export default ResourceBar;    