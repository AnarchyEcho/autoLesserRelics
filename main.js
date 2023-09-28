export function setup({ onCharacterSelectionLoaded, onCharacterLoaded, onInterfaceReady }) {
  const items = [];
  const bankItems = [];
  const currentEquipSet = game.combat.player.selectedEquipmentSet;
  let activeAction = null;

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

  onCharacterSelectionLoaded(ctx => {
    console.log('Loaded Auto Relics Char Selection')
  });

  onCharacterLoaded(ctx => {
    if (game.currentGamemode.localID !== 'AncientRelics') return null;
    if (game.activeAction) { activeAction = game.activeAction }

    const itemParentMap = Object.fromEntries(
      Object.fromEntries(
        game.items.equipment.namespaceMaps
      )["melvorAoD"]
    );

    game.skills.allObjects.forEach(skill => {
      if (itemParentMap[`${skill.name}_Lesser_Relic`] !== undefined) { items.push(itemParentMap[`${skill.name}_Lesser_Relic`]) }
    });

    items.forEach(item => {
      game.bank.searchArray.filter(x => x.name === item.name && bankItems.push(x))
    })

    console.log(items);

  })

  onInterfaceReady(ctx => {
    if (game.currentGamemode.localID !== 'AncientRelics') return null;
    if (game.activeAction) { activeAction = game.activeAction }
    console.log(ctx)

    equipmentEquipSlot(currentEquipSet, 'Consumable',)

  })
}
