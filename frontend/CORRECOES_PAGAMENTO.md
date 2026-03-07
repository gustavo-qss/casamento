# Integração com Cartão de Crédito e Confirmação de Pagamento

---

## PARTE 1: Cartão de Crédito com Parcelamento

### Opções de Plataforma de Pagamento

Para aceitar cartão de crédito com parcelamento em um site estático (sem backend), é necessário usar um gateway de pagamento que ofereça checkout client-side ou redirect. Abaixo as melhores opções para o Brasil:

---

### Opção 1: Mercado Pago (Recomendada)

**Por que:** Mais popular no Brasil, aceita todas as bandeiras, suporta parcelamento nativo, tem checkout transparente e modal.

**Como funciona:**
1. Criar conta no Mercado Pago (https://www.mercadopago.com.br/developers)
2. Obter credenciais (public key + access token)
3. Usar o SDK JavaScript do Mercado Pago para criar uma "preferência de pagamento" e redirecionar o usuário ao checkout

**Integração (Checkout Pro - redirect):**
```javascript
// Cria link de pagamento via API (precisa de um endpoint/serverless function)
// POST https://api.mercadopago.com/checkout/preferences
{
  "items": [{ "title": "Presente - Jogo de Panelas", "quantity": 1, "unit_price": 350 }],
  "payment_methods": {
    "installments": 12,              // até 12x
    "default_installments": 1
  },
  "back_urls": {
    "success": "https://seusite.com/obrigado",
    "failure": "https://seusite.com/presentes"
  }
}
```

**Parcelamento:** Até 12x. Você pode configurar se absorve os juros ou se o comprador paga.

**Taxas:** ~4.99% por transação + taxa de parcelamento (varia).

**Prós:**
- Checkout pronto e seguro (PCI compliant)
- Suporte a PIX + cartão + boleto tudo em um
- Não precisa lidar com dados de cartão
- Parcelamento automático com juros configuráveis

**Contras:**
- Precisa de um pequeno backend (ou serverless) para criar a preferência
- Taxa por transação

**Implementação com serverless (sem backend):**
Pode usar uma Vercel Serverless Function ou Netlify Function para criar a preferência:

```javascript
// api/create-preference.js (Vercel serverless function)
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

export default async function handler(req, res) {
  const { items } = req.body;

  const preference = new Preference(client);
  const result = await preference.create({
    body: {
      items: items.map(item => ({
        title: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: 'BRL'
      })),
      payment_methods: {
        installments: 12
      },
      back_urls: {
        success: 'https://seusite.com/obrigado',
        failure: 'https://seusite.com/presentes'
      },
      auto_return: 'approved'
    }
  });

  res.json({ init_point: result.init_point });
}
```

No frontend:
```javascript
const response = await fetch('/api/create-preference', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ items: cartItems })
});
const { init_point } = await response.json();
window.location.href = init_point; // Redireciona para checkout do MP
```

---

### Opção 2: Stripe (alternativa internacional)

**Por que:** Excelente DX (developer experience), muito bem documentado, aceita cartões internacionais.

**Como funciona:**
1. Criar conta no Stripe (https://stripe.com/br)
2. Usar Stripe Checkout (redirect) ou Stripe Elements (embedded)

**Parcelamento:** Stripe no Brasil suporta parcelamento em até 12x via Stripe Checkout.

**Taxas:** 3.99% + R$ 0.39 por transação.

**Prós:**
- API muito bem documentada
- Dashboard excelente
- Aceita cartões internacionais
- Stripe Checkout é pronto e seguro

**Contras:**
- Também precisa de backend/serverless para criar a session
- Menos conhecido entre usuários brasileiros que MP

---

### Opção 3: PagSeguro

**Por que:** Tradicional no Brasil, similar ao Mercado Pago.

**Parcelamento:** Até 18x.

**Taxas:** ~4.99% por transação.

Funciona de forma similar ao Mercado Pago com checkout redirect.

---

### Opção 4: Link de pagamento manual (sem código)

A forma mais simples se não quiser implementar integração:

1. Criar links de pagamento no **Mercado Pago** ou **PagSeguro** para valores pré-definidos
2. Armazenar os links no `gifts.json`
3. Quando o usuário clicar "Pagar com Cartão", redirecionar para o link

```json
// gifts.json - adicionar campo paymentLink
{
  "id": 1,
  "name": "Jogo de Panelas",
  "price": 350.00,
  "image": "/images/presentes/panelas.webp",
  "paymentLink": "https://mpago.la/XXXXXXX"
}
```

**Prós:** Zero código de backend, zero configuração complexa.
**Contras:** Um link por produto/valor, não funciona com carrinho combinado.

---

### Comparação

| Aspecto | Mercado Pago | Stripe | Link Manual |
|---------|-------------|--------|-------------|
| Complexidade | Média | Média | Baixa |
| Parcelamento | Até 12x | Até 12x | Até 12x |
| Backend necessário | Sim (serverless) | Sim (serverless) | Não |
| PIX integrado | Sim | Não nativo | Depende |
| UX brasileira | Excelente | Boa | Boa |

**Recomendação:**

1. **Mercado Pago Checkout Pro** para cartão de crédito — melhor UX para brasileiros e já inclui PIX como método alternativo
2. Se quiser algo **rápido sem backend**, usar links de pagamento do Mercado Pago por presente

---

### Mudanças necessárias no projeto para integrar cartão

1. **Mover deploy para Vercel** (se não estiver lá) para ter acesso a serverless functions
2. **Criar `api/create-preference.js`** — endpoint serverless para Mercado Pago
3. **Adicionar variável de ambiente** `MP_ACCESS_TOKEN` no Vercel
4. **Instalar SDK:** `npm install mercadopago`
5. **Modificar `ShoppingCart.vue`** — adicionar opção de método de pagamento (PIX ou Cartão) antes de abrir o modal

### Exemplo de UI no checkout

```
┌─────────────────────────────┐
│   Como deseja pagar?        │
│                             │
│   [  PIX (à vista)     ]    │
│   [ Cartão (até 12x)  ]    │
│                             │
└─────────────────────────────┘
```

Ao escolher PIX → abre o QRCodeModal atual.
Ao escolher Cartão → redireciona para checkout do Mercado Pago.

---

## PARTE 2: Confirmação de Pagamento no Site

Para mostrar no site que o pagamento foi confirmado, existem abordagens diferentes para PIX e Cartão:

---

### Para Cartão (Mercado Pago / Stripe)

O gateway redireciona o usuário de volta para o site com parâmetros na URL indicando o status.

**1. Configurar `back_urls` na preferência:**
```javascript
back_urls: {
  success: 'https://seusite.com/?payment=success',
  failure: 'https://seusite.com/?payment=failure',
  pending: 'https://seusite.com/?payment=pending'
},
auto_return: 'approved'
```

**2. Criar componente de feedback no App.vue:**

Ao carregar o site, verificar se existe o parâmetro `payment` na URL e exibir o feedback adequado.

```javascript
// composables/usePaymentStatus.js
import { ref, onMounted } from 'vue';

export function usePaymentStatus() {
  const paymentStatus = ref(null); // 'success' | 'failure' | 'pending' | null
  const showPaymentFeedback = ref(false);

  onMounted(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('payment');

    if (status) {
      paymentStatus.value = status;
      showPaymentFeedback.value = true;

      // Limpar parâmetro da URL sem recarregar
      const url = new URL(window.location.href);
      url.searchParams.delete('payment');
      window.history.replaceState({}, '', url);
    }
  });

  const dismissFeedback = () => {
    showPaymentFeedback.value = false;
    paymentStatus.value = null;
  };

  return { paymentStatus, showPaymentFeedback, dismissFeedback };
}
```

**3. Componente visual `PaymentFeedback.vue`:**
```vue
<template>
  <div v-if="show" class="payment-feedback-overlay" @click="$emit('dismiss')">
    <div class="payment-feedback" @click.stop>
      <!-- Sucesso -->
      <template v-if="status === 'success'">
        <div class="feedback-icon success">✓</div>
        <h2>Pagamento Confirmado!</h2>
        <p>Muito obrigado pelo presente! Seu carinho significa muito para nós.</p>
      </template>

      <!-- Falha -->
      <template v-else-if="status === 'failure'">
        <div class="feedback-icon failure">✗</div>
        <h2>Pagamento não realizado</h2>
        <p>Houve um problema com o pagamento. Tente novamente ou escolha outro método.</p>
      </template>

      <!-- Pendente -->
      <template v-else-if="status === 'pending'">
        <div class="feedback-icon pending">⏳</div>
        <h2>Pagamento Pendente</h2>
        <p>Seu pagamento está sendo processado. Você receberá a confirmação em breve.</p>
      </template>

      <button @click="$emit('dismiss')" class="btn-dismiss">Fechar</button>
    </div>
  </div>
</template>
```

**4. Usar no App.vue:**
```vue
<script setup>
import { usePaymentStatus } from '@/composables/usePaymentStatus';
import PaymentFeedback from '@/components/ui/PaymentFeedback.vue';

const { paymentStatus, showPaymentFeedback, dismissFeedback } = usePaymentStatus();
</script>

<template>
  <div class="app-container">
    <!-- ... telas existentes ... -->

    <PaymentFeedback
      v-if="showPaymentFeedback"
      :status="paymentStatus"
      :show="showPaymentFeedback"
      @dismiss="dismissFeedback"
    />
  </div>
</template>
```

---

### Para PIX (confirmação manual)

O PIX no formato atual (QR Code estático) **não tem como confirmar automaticamente** se o pagamento foi feito, porque não há backend recebendo webhooks.

**Opções:**

**A. Confirmação manual (atual) — mais simples:**
O usuário clica "Concluir" após pagar. O site confia que o pagamento foi feito.
Já está implementado no `QRCodeModal.vue` com o botão "Concluir".

**B. Webhook do Mercado Pago — automático:**
Se migrar o PIX para o Mercado Pago (em vez de QR Code manual), o MP envia webhooks quando o pagamento é confirmado.

Fluxo:
1. Frontend cria preferência via serverless function (igual ao cartão)
2. Mercado Pago gera o QR Code PIX dele
3. Quando o pagamento é confirmado, MP envia webhook para seu endpoint
4. Endpoint atualiza um banco de dados ou serviço (ex: Firebase Realtime Database)
5. Frontend escuta mudanças em tempo real e mostra confirmação

```javascript
// api/webhook.js (recebe notificação do MP)
export default async function handler(req, res) {
  const { type, data } = req.body;

  if (type === 'payment') {
    const paymentId = data.id;
    // Consultar status do pagamento na API do MP
    // Atualizar Firebase/banco de dados
    // O frontend escuta em tempo real
  }

  res.status(200).send('OK');
}
```

**C. Polling simples (sem webhook):**
Se usar Mercado Pago, o frontend pode ficar consultando o status do pagamento periodicamente:

```javascript
// Após gerar preferência, guardar o ID
const checkPaymentStatus = async (preferenceId) => {
  const response = await fetch(`/api/check-payment?id=${preferenceId}`);
  const { status } = await response.json();
  return status; // 'approved', 'pending', 'rejected'
};

// Polling a cada 5 segundos enquanto modal está aberto
const interval = setInterval(async () => {
  const status = await checkPaymentStatus(currentPreferenceId);
  if (status === 'approved') {
    clearInterval(interval);
    showSuccessMessage();
  }
}, 5000);
```

---

### Resumo: O que implementar

| Funcionalidade | Complexidade | Requer Backend |
|---|---|---|
| Feedback de cartão via URL params | Baixa | Não |
| Confirmação PIX manual (botão "Concluir") | Já existe | Não |
| Confirmação PIX automática (webhook) | Alta | Sim (serverless + DB) |
| Polling de status do pagamento | Média | Sim (serverless) |

**Recomendação prática:**
1. Implementar `PaymentFeedback.vue` + `usePaymentStatus.js` para feedback visual de cartão (baixa complexidade)
2. Manter confirmação manual do PIX (botão "Concluir" já existente)
3. Futuramente, migrar PIX para Mercado Pago para ter confirmação automática
