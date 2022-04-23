/**
 * @module Inventory
 * @category React Components
 * @description Inventory Component to display Items in your Inventory
 * @children
 * @props {@linkcode InventoryProps}
 */

import React from 'react'
export interface InventoryProps {
    items: any; //TODO: define item data
}

const Inventory: React.FC<InventoryProps> = ({ items }) => {
    return (
        <div>
            <p>INVENTORY</p>
            {/* TODO: List the items here */}
        </div>
    )
}

export default Inventory;    