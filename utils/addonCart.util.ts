export const addAddonItem = (
  cart: { [key: string]: number },
  selectedItems: any[],
  setCart: Function,
  setSelectedItems: Function,
  item: any
) => {
  setCart({ ...cart, [item.id]: (cart[item.id] || 0) + 1 });
  const exists = selectedItems.find((i) => i.id === item.id);
  if (!exists) setSelectedItems([...selectedItems, item]);
};

export const incrementAddon = (
  cart: { [key: string]: number },
  setCart: Function,
  itemId: string
) => {
  setCart({ ...cart, [itemId]: (cart[itemId] || 0) + 1 });
};

export const decrementAddon = (
  cart: { [key: string]: number },
  selectedItems: any[],
  setCart: Function,
  setSelectedItems: Function,
  itemId: string
) => {
  const currentQty = cart[itemId] || 0;

  if (currentQty <= 1) {
    const updatedCart = { ...cart };
    delete updatedCart[itemId];
    setCart(updatedCart);

    setSelectedItems(selectedItems.filter((i) => i.id !== itemId));
  } else {
    setCart({ ...cart, [itemId]: currentQty - 1 });
  }
};

export const clearAddonCart = (
  setCart: Function,
  setSelectedItems: Function
) => {
  setCart({});
  setSelectedItems([]);
};
