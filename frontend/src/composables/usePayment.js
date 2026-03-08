import { ref } from 'vue';

export function usePayment() {
  const isLoading = ref(false);
  const error = ref(null);

  async function startCheckout(items) {
    isLoading.value = true;
    error.value = null;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/payments/preference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      if (!res.ok) throw new Error('Resposta inválida do servidor');

      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch {
      error.value = 'Não foi possível iniciar o pagamento. Tente novamente.';
      isLoading.value = false;
    }
  }

  return { startCheckout, isLoading, error };
}
