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
        <div className="inventory drawn-border mb-2">
            <p className='text-center pt-5'>Inventory</p>
        </div>
    )
}

export default Inventory;    