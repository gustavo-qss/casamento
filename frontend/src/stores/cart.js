import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [], // { giftId, name, price, quantity, image }
  }),

  getters: {
    itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),

    total: (state) => state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),

    getQuantity: (state) => (giftId) => {
      const item = state.items.find(item => item.giftId === giftId);
      return item ? item.quantity : 0;
    },
  },

  actions: {
    addItem(gift) {
      const existingItem = this.items.find(item => item.giftId === gift.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        const price = typeof gift.price === 'string'
          ? parseFloat(gift.price.replace(/\./g, '').replace(',', '.'))
          : gift.price;
        this.items.push({
          giftId: gift.id,
          name: gift.name,
          price,
          image: gift.image,
          quantity: 1,
        });
      }
    },

    removeItem(giftId) {
      const existingItem = this.items.find(item => item.giftId === giftId);
      if (existingItem) {
        existingItem.quantity--;
        if (existingItem.quantity === 0) {
          this.items = this.items.filter(item => item.giftId !== giftId);
        }
      }
    },

    clearCart() {
      this.items = [];
    },
  },
});
