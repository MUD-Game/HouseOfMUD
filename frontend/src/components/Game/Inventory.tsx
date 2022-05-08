/**
 * @module Inventory
 * @category React Components
 * @description Inventory Component to display Items in your Inventory
 * @children
 * @props {@linkcode InventoryProps}
 */

import React from 'react'
import { useTranslation } from 'react-i18next';
export interface InventoryProps {
    inventoryData: { item: string
        count: number; }[]; //TODO: define item data
}

const Inventory: React.FC<InventoryProps> = ({ inventoryData }) => {
    const {t} = useTranslation();

    return (
        <div className="inventory drawn-border mb-2 p-2 pt-1">
            <div className="inventory-wrap">
                <p className='m-0'><u>{t("game.inventory")}</u></p>
                <ul className="ps-4">
                    {inventoryData.map(itemName => {
                        return ( <li key={itemName.item}> {itemName.item} [{itemName.count}] </li> )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default Inventory;    