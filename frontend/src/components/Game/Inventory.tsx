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
            <span>INVENTORY</span>
            <div className="mock-placeholder inventory drawn-border">
                <p className='text-center p-5'>Inventory</p>
            </div>
        </div>
    )
}

export default Inventory;    