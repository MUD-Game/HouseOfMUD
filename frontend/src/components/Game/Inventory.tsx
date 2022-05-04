/**
 * @module Inventory
 * @category React Components
 * @description Inventory Component to display Items in your Inventory
 * @children
 * @props {@linkcode InventoryProps}
 */

import React, { useState } from 'react'
import { useRabbitMQ } from '../../hooks/useRabbitMQ';
export interface InventoryProps {
    inventoryData: { item: string
        count: number; }[]; //TODO: define item data
}

const Inventory: React.FC<InventoryProps> = ({ inventoryData }) => {

    return (
        <div className="inventory drawn-border mb-2">
            <ul>
                {inventoryData.map(itemName => {
                    return ( <li key={itemName.item}> {itemName.item} [{itemName.count}] </li> )
                })}
            </ul>
        </div>
    )
}

export default Inventory;    