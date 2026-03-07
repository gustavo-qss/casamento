# CLAUDE.md — Site de Casamento Rawane & Gustavo

Referência completa do projeto para uso em todas as sessões.

---

## Contexto do Projeto

Site de casamento fullscreen em Vue 3. Os convidados navegam por 6 telas e podem presentear o casal via lista de presentes com pagamento integrado ao Mercado Pago.

- **Casal:** Rawane & Gustavo
- **Data do casamento:** 26 de abril de 2026 (`2026-04-26T16:00:00`)
- **Repositorio frontend:** `C:\Users\lurik\Desktop\site-casamento\frontend`
- **Repositorio backend (a criar):** `casamento-api/` (NestJS, fora desta pasta)
- **Deploy frontend:** GitHub Pages (branch `main`)
- **Deploy backend (planejado):** Railway

---

## Estrutura do Monorepo

```
site-casamento/
├── frontend/          <- Vue 3 frontend (aqui esta o codigo do site)
├── casamento-api/     <- backend NestJS (ainda nao criado)
├── CLAUDE.md
└── .github/
    └── workflows/
        └── deploy.yml <- GitHub Actions para deploy do frontend
```

---

## Frontend — Vue 3

### Stack

| Item | Versao / Detalhe |
|---|---|
| Vue | 3.5.25 |
| Pinia | 3.0.4 |
| Vite | 7.2.4 |
| dayjs | 1.11.19 |
| qrcode | 1.5.4 (gera QR localmente — sera substituido pelo MP) |
| sass | 1.97.1 |
| Node | ^20.19.0 ou >=22.12.0 |

**Rodar dev:**
```bash
cd frontend
npm run dev     # porta 5173
npm run build
npm run preview
```

### Estrutura de Pastas

```
frontend/
├── index.html
├── vite.config.js
├── jsconfig.json
├── package.json
└── src/
├── assets/
│   └── styles/
│       ├── variables.css   <- tokens de design (cores, fontes, espacamentos)
│       ├── reset.css
│       ├── global.css
│       └── animations.css
├── components/
│   ├── screens/
│   │   ├── HeroScreen.vue          <- Tela 1
│   │   ├── StoriesScreen.vue       <- Tela 2
│   │   ├── ChurchScreen.vue        <- Tela 3
│   │   ├── ReceptionScreen.vue     <- Tela 4
│   │   ├── CountdownScreen.vue     <- Tela 5
│   │   └── GiftsScreen.vue         <- Tela 6 (lista de presentes)
│   ├── ui/
│   │   ├── GiftCard.vue
│   │   ├── ShoppingCart.vue        <- carrinho flutuante
│   │   ├── QRCodeModal.vue         <- modal PIX atual (sera substituido)
│   │   ├── BackButton.vue
│   │   ├── ScrollArrow.vue
│   │   ├── ProgressBar.vue
│   │   └── LocationCard.vue
│   └── layout/
│       └── FullscreenContainer.vue
├── composables/
│   ├── useCart.js          <- wrapper do store do carrinho
│   ├── useStories.js
│   └── useCountdown.js
├── stores/
│   ├── cart.js             <- Pinia store do carrinho
│   └── counter.js
├── data/
│   ├── gifts.json          <- lista de 10 presentes com preco e imagem
│   ├── stories.json
│   └── wedding-info.json   <- dados de igreja, recepcao, data
├── utils/
│   └── pix.js              <- geracao local de payload EMV (sera descontinuado)
├── App.vue                 <- controla navegacao entre as 6 telas
└── main.js
```

### Navegacao entre Telas

- Controlada por `currentScreen` (ref 1–6) no `App.vue`
- Transicoes CSS: `slide-up` (avancar) e `slide-down` (voltar)
- Sem Vue Router — SPA com troca de tela manual via `<Transition>`
- `StoriesScreen` emite `@complete` para pular para tela 3

### Design System (variables.css)

**Cores:**
```css
--primary-lavender: #b1b9e7
--primary-blue:     #bfd5ed
--soft-pink:        #f4d9e6
--cream:            #faf7f2
--gold:             #d4af37
--lavender-dark:    #9098c7
--blue-dark:        #8ca9c4
--text-dark:        #333333
--white:            #ffffff
--gray-light:       #f5f5f5
```

**Fontes (Google Fonts):**
```css
--font-display: 'Playfair Display', serif    /* titulos */
--font-body:    'Montserrat', sans-serif     /* corpo */
--font-script:  'Great Vibes', cursive       /* detalhes romanticos */
```

**Espacamentos:** `--spacing-xs` ate `--spacing-2xl` (0.5rem a 4rem)

**Raios de borda:** `--radius-sm` (8px) ate `--radius-full` (9999px)

**Z-index:** `--z-cart: 50`, `--z-modal: 100`

### Variáveis de Ambiente (frontend — `frontend/.env`)

```env
VITE_PIX_KEY=        <- chave PIX atual (CPF/telefone do casal)
VITE_PIX_NAME=       <- nome que aparece no QR Code PIX
VITE_API_URL=        <- URL do backend NestJS (http://localhost:3000/api em dev)
VITE_MP_PUBLIC_KEY=  <- Public Key do Mercado Pago (NAO e o Access Token)
```

---

## Dados do Casamento

### Locais

**Cerimonia:**
- Igreja Nossa Senhora de Fatima
- 16h00 — Rua das Flores, 123 - Centro

**Recepcao:**
- Espaco Jardim Encantado
- 18h00 — Av. Principal, 456 - Jardim Europa

### Lista de Presentes (gifts.json) — 10 itens

| ID | Nome | Preco |
|---|---|---|
| 1 | Jogo de Panelas Tramontina | R$ 450,00 |
| 2 | Liquidificador Philips Walita | R$ 280,00 |
| 3 | Jogo de Toalhas Premium | R$ 180,00 |
| 4 | Cafeteira Nespresso | R$ 650,00 |
| 5 | Jogo de Jantar Porcelana | R$ 380,00 |
| 6 | Micro-ondas Electrolux | R$ 520,00 |
| 7 | Aspirador Robo | R$ 890,00 |
| 8 | Jogo de Lencois King | R$ 220,00 |
| 9 | Air Fryer Philco | R$ 420,00 |
| 10 | Ferro a Vapor Arno | R$ 160,00 |

---

## Integracao Mercado Pago — Plano Definido

### Decisao de Arquitetura

Usar **Checkout Pro** do Mercado Pago.

- O formulario de pagamento (cartao, PIX, boleto) e hospedado no proprio MP
- O site redireciona o usuario para a pagina segura do MP
- Apos o pagamento, o MP redireciona de volta via `back_urls`
- O backend NestJS e necessario para criar a preferencia com o Access Token (que nao pode ficar exposto no frontend)

**Por que ainda precisa de backend mesmo com Checkout Pro:**
O Access Token do MP da acesso total a conta (sacar, reembolsar). Ele deve ficar apenas em variavel de ambiente do servidor, nunca no codigo do frontend.

### Fluxo Completo

```
1. Usuario clica "Finalizar Compra" no GiftsScreen
2. Frontend chama POST /api/payments/preference (NestJS)
3. NestJS chama MP API com Access Token (secreto) e cria preferencia
4. NestJS retorna { preferenceId, checkoutUrl } para o frontend
5. Frontend redireciona o usuario para checkoutUrl (pagina do MP)
6. Usuario paga no ambiente seguro do Mercado Pago
7. MP redireciona para seusite.com/?payment=success&payment_id=xxx
8. Frontend le os query params e exibe tela de confirmacao
9. MP envia webhook para POST /api/webhook/mp (confirmacao assincrona)
```

---

## Backend — NestJS (a criar)

### Stack

| Item | Detalhe |
|---|---|
| Framework | NestJS |
| SDK | `mercadopago` (oficial) |
| Validacao | `class-validator` + `class-transformer` |
| Config | `@nestjs/config` |
| Porta dev | 3000 |

**Criar o projeto:**
```bash
npm install -g @nestjs/cli
nest new casamento-api
cd casamento-api
npm install mercadopago @nestjs/config class-validator class-transformer
```

### Estrutura de Pastas

```
casamento-api/
├── src/
│   ├── payments/
│   │   ├── payments.module.ts
│   │   ├── payments.controller.ts
│   │   ├── payments.service.ts
│   │   └── dto/
│   │       ├── create-preference.dto.ts
│   │       └── cart-item.dto.ts
│   ├── webhook/
│   │   ├── webhook.module.ts
│   │   └── webhook.controller.ts
│   ├── app.module.ts
│   └── main.ts
├── .env
└── .env.example
```

### Variáveis de Ambiente (backend — .env)

```env
MP_ACCESS_TOKEN=APP_USR-...     <- secreto, NUNCA expor no frontend
BACKEND_URL=https://...         <- URL publica do backend (para webhook do MP)
FRONTEND_URL=http://localhost:5173
PORT=3000
```

### Endpoints

| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/api/payments/preference` | Cria preferencia Checkout Pro (cartao + PIX + boleto) |
| GET | `/api/payments/status/:id` | Consulta status de um pagamento pelo ID |
| POST | `/api/webhook/mp` | Recebe notificacoes de pagamento do MP |

### Configuracao do main.ts

```ts
app.enableCors({ origin: process.env.FRONTEND_URL });
app.useGlobalPipes(new ValidationPipe());
app.setGlobalPrefix('api');
```

### Logica do payments.service.ts

```ts
// Inicializar SDK
const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

// Criar preferencia (aceita cartao, PIX, boleto — tudo configurado no MP)
const preference = new Preference(mp);
const result = await preference.create({
  body: {
    items: dto.items.map(item => ({
      title: item.name,
      unit_price: item.price,
      quantity: item.quantity,
      currency_id: 'BRL',
    })),
    back_urls: {
      success: `${FRONTEND_URL}?payment=success`,
      failure: `${FRONTEND_URL}?payment=failure`,
      pending: `${FRONTEND_URL}?payment=pending`,
    },
    auto_return: 'approved',
    notification_url: `${BACKEND_URL}/api/webhook/mp`,
  },
});
// Retornar: { preferenceId: result.id, checkoutUrl: result.init_point }

// Consultar status
const payment = new Payment(mp);
const result = await payment.get({ id: paymentId });
// Retornar: { status: result.status, statusDetail: result.status_detail }
```

---

## Componentes a Criar / Modificar (frontend)

| Arquivo | Acao | Descricao |
|---|---|---|
| `frontend/src/composables/usePayment.js` | **Criar** | Chama a API NestJS, faz redirect para MP |
| `frontend/src/components/ui/CheckoutModal.vue` | **Criar** | Substitui QRCodeModal; mostra resumo e botao "Pagar com MP" |
| `frontend/src/components/ui/PaymentSuccess.vue` | **Criar** | Tela de confirmacao pos-pagamento (le query params) |
| `frontend/src/components/screens/GiftsScreen.vue` | **Modificar** | Usar CheckoutModal no lugar de QRCodeModal |
| `frontend/src/App.vue` | **Modificar** | Detectar `?payment=success` na URL e exibir PaymentSuccess |

### Logica do usePayment.js

```js
const API_BASE = import.meta.env.VITE_API_URL

async function startCheckout(amount, items) {
  const res = await fetch(`${API_BASE}/payments/preference`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, items }),
  })
  const { checkoutUrl } = await res.json()
  window.location.href = checkoutUrl  // redireciona para o MP
}
```

---

## Deploy

### Frontend (GitHub Pages — atual)

- Branch `main` e publicado automaticamente
- Configurado via `.github/workflows/deploy.yml` (na raiz do repo, fora de `frontend/`)
- O workflow entra em `./frontend` para rodar `npm ci` e `npm run build`
- O artifact publicado vem de `./frontend/dist`
- URL atual gerada pelo GitHub Pages

### Backend NestJS (Railway — planejado)

1. Criar projeto no Railway conectado ao repositorio `casamento-api`
2. Configurar variaveis de ambiente no painel do Railway
3. Railway gera URL HTTPS automaticamente (usar como `BACKEND_URL` e no webhook do MP)
4. Deploy automatico a cada push na branch `main`

**Requisito de producao:** O MP precisa conseguir fazer POST no webhook. A URL do Railway e publica e HTTPS por padrao — isso resolve sem configuracao extra.

---

## Convencoes de Codigo

- **Sem TypeScript no frontend** — projeto Vue usa JavaScript puro
- **Composables** para logica reutilizavel (padrao `useXxx.js`)
- **Pinia stores** para estado global (carrinho)
- **CSS Scoped** em todos os componentes Vue
- **CSS Variables** do `variables.css` para todas as cores, fontes e espacamentos — nunca hardcodar valores
- **Mobile-first** — breakpoints: 576px, 768px, 992px, 1200px
- **Sem Vue Router** — navegacao manual via `currentScreen` no App.vue
- Alias `@` aponta para `src/`

---

## Referencias

### Mercado Pago
- Checkout Pro (visao geral): https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/landing
- Criar aplicacao MP: https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/create-application
- Criar preferencia (API): https://www.mercadopago.com.br/developers/pt/reference/preferences/_checkout_preferences/post
- Consultar pagamento (API): https://www.mercadopago.com.br/developers/pt/reference/payments/_payments_id/get
- Webhooks / Notificacoes: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
- SDK Node.js oficial: https://github.com/mercadopago/sdk-nodejs
- SDK JS frontend: https://www.mercadopago.com.br/developers/pt/docs/sdks-library/client-side/mp-js-v2

### NestJS
- Documentacao oficial: https://docs.nestjs.com
- ConfigModule: https://docs.nestjs.com/techniques/configuration
- ValidationPipe: https://docs.nestjs.com/techniques/validation

### Frontend
- Vue 3: https://vuejs.org
- Pinia: https://pinia.vuejs.org
- Vite: https://vitejs.dev

### Deploy
- Railway: https://railway.app
- GitHub Pages: https://pages.github.com
