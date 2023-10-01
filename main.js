export function setup({ onCharacterLoaded, onInterfaceReady }) {
  const bankItems = [];
  const currentEquipSet = game.combat.player.selectedEquipmentSet;

  let currItem = {};

  // THE BELOW CODE BELONGS TO THE SEMI MOD MAKERS, NOT USING API METHOD TO ENSURE NO DEPS NEEDED.
  // https://gitlab.com/semi5/semi-core-and-utils IS THE SOURCE OF THE CODE.
  const equipmentSlotHasItem = (setID, slot, item) => game.combat.player.equipmentSets[setID].equipment.slots[slot].item == item;
  /**
   * Equip a item to a lot if valid, or unequip if empty.
   * @param {number} setID Equipment Set
   * @param {string} slot Slot ID
   * @param {Object} slotItem Object containing an item and quantity
   */
  const equipmentEquipSlot = (setID, slot, slotItem) => {
    // Slot is Empty
    if (slotItem.item == game.emptyEquipmentItem) {
      if (!equipmentSlotHasItem(setID, slot, slotItem.item) && !game.combat.player.unequipItem(setID, slot)) {
        return false;
      }
    }
    // Slot has Item, but is filled from another slot. (2H Weapons, etc)
    else if (slotItem.quantity <= 0) {
      return true;
    }
    // Slot has Item
    else if (!equipmentSlotHasItem(setID, slot, slotItem.item)) {
      if (!game.combat.player.equipItem(slotItem.item, setID, slot, slotItem.qty)) {
        return false;
      }
    }
    return true;
  };
  // CODE CREDITING ENDS HERE.

  onCharacterLoaded(ctx => {
    if (game.currentGamemode.localID !== 'AncientRelics') return null;

    game.bank.searchArray.filter(x => { if (x.name.match(/\w Lesser Relic/)) bankItems.push(x); })

    currItem = bankItems.filter(x => x.name.includes(game.activeAction?.localID) && x)[0]
    if (game.activeAction?.localID !== 'Combat' && game.activeAction?.localID !== 'Archaeology' && game.activeAction?.localID !== 'Cartography' && currItem) {
      equipmentEquipSlot(currentEquipSet, 'Consumable', currItem)
    }
  })

  onInterfaceReady(ctx => {
    if (game.currentGamemode.localID !== 'AncientRelics') return null;

    setInterval(() => {
      currItem = bankItems.filter(x => x.name.includes(game.activeAction?.localID) && x)[0]
      if (game.activeAction?.localID !== 'Combat' && game.activeAction?.localID !== 'Archaeology' && game.activeAction?.localID !== 'Cartography' && currItem && !equipmentSlotHasItem(currentEquipSet, 'Consumable', currItem)) {
        equipmentEquipSlot(currentEquipSet, 'Consumable', currItem)
      }
    }, 3000)
  })
}
