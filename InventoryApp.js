/*
{
  "name": "Inventory",
  "description": "View and manage your virtual items and collectibles",
  "version": "1.0.0",
  "author": "Hyperfy",
  "icon": "🎒",
  "category": "Utility",
  "permissions": [
    "storage",
    "network",
    "world.inventory"
  ],
  "dependencies": {
    "@firebolt-dev/css": "^1.0.0"
  },
  "minOSVersion": "1.0.0",
  "supportedDevices": ["all"],
  "apiEndpoints": [
    "https://api.hyperfy.io/inventory",
    "https://api.hyperfy.io/items"
  ]
}
*/
import { css } from '@firebolt-dev/css'
import { useState } from 'react'

export function InventoryApp({
  items,
  onItemClick,
  onItemDrop,
  onItemUse,
  onItemEquip,
  onItemUnequip,
  equippedItems
}) {
  const [selectedItem, setSelectedItem] = useState(null)
  const [showItemActions, setShowItemActions] = useState(false)

  const handleItemClick = (item) => {
    setSelectedItem(item)
    setShowItemActions(true)
    if (onItemClick) onItemClick(item)
  }

  const handleAction = (action) => {
    if (!selectedItem) return
    
    switch (action) {
      case 'use':
        onItemUse(selectedItem)
        break
      case 'drop':
        onItemDrop(selectedItem)
        break
      case 'equip':
        onItemEquip(selectedItem)
        break
      case 'unequip':
        onItemUnequip(selectedItem)
        break
    }
    
    setShowItemActions(false)
    setSelectedItem(null)
  }

  const isEquipped = (item) => {
    return equippedItems?.some(equipped => equipped.id === item.id)
  }

  return (
    <div css={css`
      display: flex;
      flex-direction: column;
      height: 100%;
    `}>
      {/* Equipped Items */}
      <div css={css`
        padding: 15px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      `}>
        <div css={css`
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          margin-bottom: 10px;
        `}>
          Equipped Items
        </div>
        <div css={css`
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        `}>
          {equippedItems?.map((item, i) => (
            <div
              key={i}
              css={css`
                aspect-ratio: 1;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 8px;
                padding: 5px;
                cursor: pointer;
                transition: all 0.15s ease-out;
                position: relative;
                
                &:hover {
                  background: rgba(0, 0, 0, 0.3);
                }
              `}
              onClick={() => handleItemClick(item)}
            >
              <img
                src={item.image || 'https://hyperfy.xyz/logo-icon.svg'}
                alt={item.name}
                css={css`
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
                `}
              />
              {item.stackable && item.amount > 1 && (
                <div css={css`
                  position: absolute;
                  bottom: 5px;
                  right: 5px;
                  background: rgba(0, 0, 0, 0.8);
                  color: white;
                  font-size: 10px;
                  padding: 2px 4px;
                  border-radius: 4px;
                  min-width: 20px;
                  text-align: center;
                `}>
                  {item.amount}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Inventory Grid */}
      <div css={css`
        flex: 1;
        overflow-y: auto;
        padding: 15px;
        
        /* Custom Scrollbar */
        &::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        &::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        
        &::-webkit-scrollbar-thumb {
          background: rgba(85, 27, 249, 0.3);
          border-radius: 4px;
          
          &:hover {
            background: rgba(85, 27, 249, 0.5);
          }
        }
      `}>
        <div css={css`
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        `}>
          {items?.map((item, i) => (
            <div
              key={i}
              css={css`
                aspect-ratio: 1;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 8px;
                padding: 5px;
                cursor: pointer;
                transition: all 0.15s ease-out;
                position: relative;
                
                ${isEquipped(item) ? `
                  border: 2px solid #551bf9;
                ` : ''}
                
                &:hover {
                  background: rgba(0, 0, 0, 0.3);
                }
              `}
              onClick={() => handleItemClick(item)}
            >
              <img
                src={item.image || 'https://hyperfy.xyz/logo-icon.svg'}
                alt={item.name}
                css={css`
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
                `}
              />
              {item.stackable && item.amount > 1 && (
                <div css={css`
                  position: absolute;
                  bottom: 5px;
                  right: 5px;
                  background: rgba(0, 0, 0, 0.8);
                  color: white;
                  font-size: 10px;
                  padding: 2px 4px;
                  border-radius: 4px;
                  min-width: 20px;
                  text-align: center;
                `}>
                  {item.amount}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Item Actions Modal */}
      {showItemActions && selectedItem && (
        <div css={css`
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        `}>
          <div css={css`
            background: rgba(0, 0, 0, 0.9);
            border-radius: 12px;
            width: 100%;
            max-width: 300px;
            overflow: hidden;
          `}>
            {/* Item Preview */}
            <div css={css`
              padding: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 10px;
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            `}>
              <div css={css`
                width: 80px;
                height: 80px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 8px;
                padding: 10px;
              `}>
                <img
                  src={selectedItem.image || 'https://hyperfy.xyz/logo-icon.svg'}
                  alt={selectedItem.name}
                  css={css`
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                  `}
                />
              </div>
              <div css={css`
                text-align: center;
              `}>
                <div css={css`
                  color: white;
                  font-size: 16px;
                  font-weight: 500;
                  margin-bottom: 4px;
                `}>
                  {selectedItem.name}
                </div>
                {selectedItem.description && (
                  <div css={css`
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 12px;
                  `}>
                    {selectedItem.description}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div css={css`
              display: flex;
              flex-direction: column;
              padding: 10px;
            `}>
              {selectedItem.usable && (
                <button
                  css={css`
                    background: none;
                    border: none;
                    color: white;
                    padding: 12px;
                    text-align: left;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.15s ease-out;
                    
                    &:hover {
                      background: rgba(255, 255, 255, 0.1);
                    }
                  `}
                  onClick={() => handleAction('use')}
                >
                  Use Item
                </button>
              )}
              
              {selectedItem.equippable && !isEquipped(selectedItem) && (
                <button
                  css={css`
                    background: none;
                    border: none;
                    color: white;
                    padding: 12px;
                    text-align: left;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.15s ease-out;
                    
                    &:hover {
                      background: rgba(255, 255, 255, 0.1);
                    }
                  `}
                  onClick={() => handleAction('equip')}
                >
                  Equip Item
                </button>
              )}
              
              {isEquipped(selectedItem) && (
                <button
                  css={css`
                    background: none;
                    border: none;
                    color: white;
                    padding: 12px;
                    text-align: left;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.15s ease-out;
                    
                    &:hover {
                      background: rgba(255, 255, 255, 0.1);
                    }
                  `}
                  onClick={() => handleAction('unequip')}
                >
                  Unequip Item
                </button>
              )}
              
              <button
                css={css`
                  background: none;
                  border: none;
                  color: #ff4444;
                  padding: 12px;
                  text-align: left;
                  font-size: 14px;
                  cursor: pointer;
                  transition: all 0.15s ease-out;
                  
                  &:hover {
                    background: rgba(255, 68, 68, 0.1);
                  }
                `}
                onClick={() => handleAction('drop')}
              >
                Drop Item
              </button>
              
              <button
                css={css`
                  background: none;
                  border: none;
                  color: rgba(255, 255, 255, 0.6);
                  padding: 12px;
                  text-align: left;
                  font-size: 14px;
                  cursor: pointer;
                  transition: all 0.15s ease-out;
                  
                  &:hover {
                    background: rgba(255, 255, 255, 0.1);
                  }
                `}
                onClick={() => setShowItemActions(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 