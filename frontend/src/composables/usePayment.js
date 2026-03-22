import { ref } from 'vue';

export function usePayment() {
  const isLoading = ref(false);
  const error = ref(null);
  const loadingMsg = ref('');

  async function startCheckout(items, letterData = null) {
    isLoading.value = true;
    error.value = null;

    try {
      // 1. Salvar carta (não bloqueia o pagamento se falhar)
      if (letterData?.guestName) {
        loadingMsg.value = 'Salvando sua mensagem...';
        try {
          await fetch(`${import.meta.env.VITE_API_URL}/letters`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              guestName: letterData.guestName,
              message: letterData.message || '',
              items: items.map((i) => ({
                name: i.name,
                price: i.price,
                quantity: i.quantity,
              })),
            }),
          });
        } catch {
          // Falha silenciosa — carta não bloqueia o pagamento
        }
      }

      // 2. Criar preferência no Mercado Pago
      loadingMsg.value = 'Conectando ao Mercado Pago...';
      const res = await fetch(`${import.meta.env.VITE_API_URL}/payments/preference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            name: i.name,
            price: i.price,
            quantity: i.quantity,
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

  return { startCheckout, isLoading, error, loadingMsg };
}
