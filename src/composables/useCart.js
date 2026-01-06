import { computed } from 'vue';
import { useCartStore } from '@/stores/cart';

export function useCart() {
  const cartStore = useCartStore();

  const items = computed(() => cartStore.items);
  const itemCount = computed(() => cartStore.itemCount);
  const total = computed(() => cartStore.total);

  const addItem = (gift) => {
    cartStore.addItem(gift);
  };

  const removeItem = (giftId) => {
    cartStore.removeItem(giftId);
  };

  const clearCart = () => {
    cartStore.clearCart();
  };

  const getQuantity = (giftId) => {
    return cartStore.getQuantity(giftId);
  };

  return {
    items,
    itemCount,
    total,
    addItem,
    removeItem,
    clearCart,
    getQuantity,
  };
}
