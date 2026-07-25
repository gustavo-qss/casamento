<script setup>
import { ref, computed, watch, onMounted } from 'vue';

/* ============================================================
   Painel administrativo — /adm
   Login 100% no front (sem backend). Depois de autenticado,
   busca todas as confirmações (RSVP) e mensagens (cartas),
   com filtro, paginação e edição direta no banco via API.
   Identidade visual do site de scroll (terracota / pergaminho).
   ============================================================ */

const API = import.meta.env.VITE_API_URL;

// Configuração dos dois recursos.
const RESOURCES = {
  rsvp: {
    path: 'rsvp',
    label: 'Confirmações',
    fields: [
      { key: 'name', label: 'Nome', type: 'text' },
      { key: 'phone', label: 'Telefone', type: 'text' },
      { key: 'guestsCount', label: 'Convidados', type: 'number' },
      { key: 'childrenUnder4', label: 'Crianças 0–4', type: 'number' },
      { key: 'childrenUnder10', label: 'Crianças 5–10', type: 'number' },
      { key: 'childrenAge11', label: 'Crianças 11+', type: 'number' },
      { key: 'dietary', label: 'Restrições alimentares', type: 'textarea' },
      { key: 'comprovanteUrl', label: 'Comprovante (URL)', type: 'url' },
    ],
    searchKeys: ['name', 'phone', 'dietary'],
  },
  letters: {
    path: 'letters',
    label: 'Mensagens',
    fields: [
      { key: 'guestName', label: 'Nome', type: 'text' },
      { key: 'message', label: 'Mensagem', type: 'textarea' },
    ],
    searchKeys: ['guestName', 'message'],
  },
};

const PER_PAGE = 8;

/* ---------------- Autenticação (backend) ---------------- */
const token = ref(sessionStorage.getItem('adm_token') || '');
const authed = ref(!!token.value);
const loginUser = ref('');
const loginPass = ref('');
const loginError = ref('');
const loggingIn = ref(false);

async function doLogin() {
  loginError.value = '';
  loggingIn.value = true;
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: loginUser.value.trim(),
        password: loginPass.value,
      }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || 'Login ou senha incorretos.');
    }
    const data = await res.json();
    token.value = data.token;
    sessionStorage.setItem('adm_token', data.token);
    authed.value = true;
    loginPass.value = '';
    loadAll();
  } catch (e) {
    loginError.value = e.message || 'Não foi possível entrar.';
  } finally {
    loggingIn.value = false;
  }
}

function logout(msg = '') {
  authed.value = false;
  token.value = '';
  sessionStorage.removeItem('adm_token');
  loginPass.value = '';
  editing.value = null;
  loginError.value = typeof msg === 'string' ? msg : '';
}

function authHeaders() {
  return token.value ? { Authorization: `Bearer ${token.value}` } : {};
}

/* ---------------- Helpers de campo ---------------- */
// Converte camelCase -> snake_case (guestName -> guest_name).
function camelToSnake(k) {
  return k.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
}

// Lê um campo aceitando camelCase OU snake_case (a API pode usar qualquer um).
function readField(row, key) {
  if (row == null) return undefined;
  if (row[key] !== undefined) return row[key];
  const snake = camelToSnake(key);
  return row[snake];
}

// Descobre qual estilo de chave o registro usa, para devolver igual no PATCH.
function writeKey(row, key) {
  const snake = camelToSnake(key);
  if (row && row[key] === undefined && row[snake] !== undefined) return snake;
  return key;
}

function recordId(row) {
  return row?.id ?? row?._id ?? row?.uuid;
}

function formatDate(row) {
  const raw =
    readField(row, 'createdAt') ?? readField(row, 'created_at') ?? row?.inserted_at;
  if (!raw) return '';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/* ---------------- Dados ---------------- */
const activeTab = ref('rsvp');
const lists = ref({ rsvp: [], letters: [] });
const loading = ref(false);
const loadError = ref('');

async function fetchList(type) {
  const res = await fetch(`${API}/${RESOURCES[type].path}`, { headers: authHeaders() });
  if (res.status === 401) {
    logout('Sessão expirada. Entre novamente.');
    throw new Error('Não autorizado.');
  }
  if (!res.ok) throw new Error(`Falha ao buscar ${RESOURCES[type].label} (HTTP ${res.status})`);
  const json = await res.json();
  // Aceita [ ... ] ou { data: [...] } ou { items: [...] }.
  if (Array.isArray(json)) return json;
  return json.data ?? json.items ?? json.results ?? [];
}

async function loadAll() {
  loading.value = true;
  loadError.value = '';
  try {
    const [rsvp, letters] = await Promise.all([
      fetchList('rsvp'),
      fetchList('letters'),
    ]);
    lists.value = { rsvp, letters };
  } catch (e) {
    loadError.value = e.message || 'Não foi possível carregar os dados.';
  } finally {
    loading.value = false;
  }
}

async function reloadCurrent() {
  loading.value = true;
  loadError.value = '';
  try {
    const data = await fetchList(activeTab.value);
    lists.value = { ...lists.value, [activeTab.value]: data };
  } catch (e) {
    loadError.value = e.message || 'Não foi possível recarregar.';
  } finally {
    loading.value = false;
  }
}

/* ---------------- Filtro + paginação ---------------- */
const search = ref('');
const page = ref(1);

const currentConfig = computed(() => RESOURCES[activeTab.value]);
const currentList = computed(() => lists.value[activeTab.value] || []);

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return currentList.value;
  const keys = currentConfig.value.searchKeys;
  return currentList.value.filter((row) =>
    keys.some((k) => String(readField(row, k) ?? '').toLowerCase().includes(q)),
  );
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / PER_PAGE)),
);

const paged = computed(() => {
  const start = (page.value - 1) * PER_PAGE;
  return filtered.value.slice(start, start + PER_PAGE);
});

watch([activeTab, search], () => {
  page.value = 1;
});
watch(totalPages, (tp) => {
  if (page.value > tp) page.value = tp;
});

/* ---------------- Resumo (RSVP) ---------------- */
const rsvpSummary = computed(() => {
  const list = lists.value.rsvp || [];
  let guests = 0;
  let kids = 0;
  for (const r of list) {
    guests += Number(readField(r, 'guestsCount')) || 0;
    kids +=
      (Number(readField(r, 'childrenUnder4')) || 0) +
      (Number(readField(r, 'childrenUnder10')) || 0) +
      (Number(readField(r, 'childrenAge11')) || 0);
  }
  return { records: list.length, guests, kids };
});

/* ---------------- Edição ---------------- */
const editing = ref(null); // { type, id, values, original }
const saving = ref(false);
const saveError = ref('');

function openEdit(row) {
  const type = activeTab.value;
  const values = {};
  for (const f of RESOURCES[type].fields) {
    const v = readField(row, f.key);
    values[f.key] = v == null ? '' : v;
  }
  editing.value = {
    type,
    id: recordId(row),
    values,
    original: row,
    items: readField(row, 'items') || null,
  };
  saveError.value = '';
}

function closeEdit() {
  if (saving.value) return;
  editing.value = null;
}

async function saveEdit() {
  if (!editing.value) return;
  const { type, id, values, original } = editing.value;
  if (id == null) {
    saveError.value = 'Este registro não tem um id — não dá para editar.';
    return;
  }
  saving.value = true;
  saveError.value = '';

  // Monta o corpo respeitando o estilo de chave do registro original.
  const body = {};
  for (const f of RESOURCES[type].fields) {
    let val = values[f.key];
    if (f.type === 'number') val = val === '' || val == null ? null : Number(val);
    if (typeof val === 'string') val = val.trim();
    body[writeKey(original, f.key)] = val;
  }

  try {
    const res = await fetch(`${API}/${RESOURCES[type].path}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(body),
    });
    if (res.status === 401) {
      logout('Sessão expirada. Entre novamente.');
      throw new Error('Não autorizado.');
    }
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `Erro ao salvar (HTTP ${res.status})`);
    }
    // Atualiza localmente (usa a resposta se vier, senão o merge otimista).
    const updated = await res.json().catch(() => null);
    const merged = updated && typeof updated === 'object' ? { ...original, ...updated } : { ...original, ...body };
    const arr = lists.value[type].map((r) => (recordId(r) === id ? merged : r));
    lists.value = { ...lists.value, [type]: arr };
    showToast('Alterações salvas.');
    editing.value = null;
  } catch (e) {
    saveError.value = e.message || 'Não foi possível salvar.';
  } finally {
    saving.value = false;
  }
}

/* ---------------- Toast ---------------- */
const toast = ref('');
let toastTimer = null;
function showToast(msg) {
  toast.value = msg;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.value = ''), 3000);
}

/* ---------------- Init ---------------- */
onMounted(() => {
  if (token.value) loadAll();
});
</script>

<template>
  <div class="admin">
    <!-- ============ LOGIN ============ -->
    <div v-if="!authed" class="login-wrap">
      <form class="login-card" @submit.prevent="doLogin">
        <div class="login-ornament">
          <span class="o-line"></span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              stroke="var(--terracotta)" stroke-width="1.5" fill="none" stroke-linejoin="round"
            />
          </svg>
          <span class="o-line"></span>
        </div>

        <span class="login-eyebrow">Área restrita</span>
        <h1 class="login-title">Painel</h1>
        <p class="login-sub">Acesso dos noivos</p>

        <label class="field">
          <span class="field-label">Login</span>
          <input v-model="loginUser" type="text" autocomplete="username" placeholder="seu login" />
        </label>

        <label class="field">
          <span class="field-label">Senha</span>
          <input v-model="loginPass" type="password" autocomplete="current-password" placeholder="sua senha" />
        </label>

        <p v-if="loginError" class="login-error">{{ loginError }}</p>

        <button type="submit" class="btn btn-primary btn-block" :disabled="loggingIn">
          {{ loggingIn ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
    </div>

    <!-- ============ PAINEL ============ -->
    <div v-else class="panel">
      <header class="panel-header">
        <div>
          <span class="panel-eyebrow">Administração</span>
          <h1 class="panel-title">Painel dos noivos</h1>
        </div>
        <button class="btn btn-ghost" @click="logout()">Sair</button>
      </header>

      <!-- Abas -->
      <div class="tabs">
        <button
          v-for="(cfg, key) in RESOURCES"
          :key="key"
          class="tab"
          :class="{ active: activeTab === key }"
          @click="activeTab = key"
        >
          {{ cfg.label }}
          <span class="tab-count">{{ (lists[key] || []).length }}</span>
        </button>
      </div>

      <!-- Resumo (RSVP) -->
      <div v-if="activeTab === 'rsvp'" class="summary">
        <div class="summary-chip">
          <strong>{{ rsvpSummary.records }}</strong><span>confirmações</span>
        </div>
        <div class="summary-chip">
          <strong>{{ rsvpSummary.guests }}</strong><span>convidados</span>
        </div>
        <div class="summary-chip">
          <strong>{{ rsvpSummary.kids }}</strong><span>crianças</span>
        </div>
      </div>
      <div v-else class="summary">
        <div class="summary-chip">
          <strong>{{ (lists.letters || []).length }}</strong><span>mensagens</span>
        </div>
      </div>

      <!-- Barra de ferramentas -->
      <div class="toolbar">
        <div class="search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input v-model="search" type="text" :placeholder="`Buscar em ${currentConfig.label.toLowerCase()}...`" />
          <button v-if="search" class="search-clear" @click="search = ''" aria-label="Limpar">×</button>
        </div>
        <button class="btn btn-outline" :disabled="loading" @click="reloadCurrent">
          {{ loading ? 'Atualizando...' : 'Atualizar' }}
        </button>
      </div>

      <!-- Estados -->
      <div v-if="loading && !currentList.length" class="state">Carregando...</div>
      <div v-else-if="loadError" class="state state-error">
        {{ loadError }}
        <button class="btn btn-outline" @click="loadAll">Tentar de novo</button>
      </div>
      <div v-else-if="!filtered.length" class="state">
        {{ search ? 'Nada encontrado para a busca.' : 'Nenhum registro ainda.' }}
      </div>

      <!-- Cards -->
      <div v-else class="cards">
        <article v-for="row in paged" :key="recordId(row) || Math.random()" class="card">
          <div class="card-top">
            <h3 class="card-name">
              {{ readField(row, activeTab === 'rsvp' ? 'name' : 'guestName') || '— sem nome —' }}
            </h3>
            <button class="btn btn-edit" @click="openEdit(row)">Editar</button>
          </div>

          <span v-if="formatDate(row)" class="card-date">{{ formatDate(row) }}</span>

          <!-- Campos RSVP -->
          <template v-if="activeTab === 'rsvp'">
            <dl class="card-fields">
              <div v-if="readField(row, 'phone')"><dt>Telefone</dt><dd>{{ readField(row, 'phone') }}</dd></div>
              <div><dt>Convidados</dt><dd>{{ readField(row, 'guestsCount') ?? '—' }}</dd></div>
              <div v-if="readField(row, 'childrenUnder4')"><dt>Crianças 0–4</dt><dd>{{ readField(row, 'childrenUnder4') }}</dd></div>
              <div v-if="readField(row, 'childrenUnder10')"><dt>Crianças 5–10</dt><dd>{{ readField(row, 'childrenUnder10') }}</dd></div>
              <div v-if="readField(row, 'childrenAge11')"><dt>Crianças 11+</dt><dd>{{ readField(row, 'childrenAge11') }}</dd></div>
            </dl>
            <p v-if="readField(row, 'dietary')" class="card-note">
              <span class="note-label">Restrições:</span> {{ readField(row, 'dietary') }}
            </p>
            <a v-if="readField(row, 'comprovanteUrl')" class="card-link" :href="readField(row, 'comprovanteUrl')" target="_blank" rel="noopener">
              Ver comprovante ↗
            </a>
          </template>

          <!-- Campos Cartas -->
          <template v-else>
            <p v-if="readField(row, 'message')" class="card-message">"{{ readField(row, 'message') }}"</p>
            <p v-else class="card-message card-message-empty">(sem mensagem)</p>
            <ul v-if="Array.isArray(readField(row, 'items')) && readField(row, 'items').length" class="card-items">
              <li v-for="(it, i) in readField(row, 'items')" :key="i">
                {{ it.quantity ? it.quantity + '× ' : '' }}{{ it.name }}
              </li>
            </ul>
          </template>
        </article>
      </div>

      <!-- Paginação -->
      <div v-if="filtered.length > PER_PAGE" class="pagination">
        <button class="btn btn-outline" :disabled="page <= 1" @click="page--">‹ Anterior</button>
        <span class="page-info">{{ page }} de {{ totalPages }}</span>
        <button class="btn btn-outline" :disabled="page >= totalPages" @click="page++">Próxima ›</button>
      </div>
    </div>

    <!-- ============ MODAL DE EDIÇÃO ============ -->
    <Transition name="modal">
      <div v-if="editing" class="modal-overlay" @click.self="closeEdit">
        <div class="modal">
          <header class="modal-header">
            <h2>Editar {{ editing.type === 'rsvp' ? 'confirmação' : 'mensagem' }}</h2>
            <button class="modal-close" @click="closeEdit" aria-label="Fechar">×</button>
          </header>

          <div class="modal-body">
            <label v-for="f in RESOURCES[editing.type].fields" :key="f.key" class="field">
              <span class="field-label">{{ f.label }}</span>
              <textarea
                v-if="f.type === 'textarea'"
                v-model="editing.values[f.key]"
                rows="3"
              ></textarea>
              <input
                v-else
                v-model="editing.values[f.key]"
                :type="f.type === 'number' ? 'number' : 'text'"
                :inputmode="f.type === 'number' ? 'numeric' : undefined"
              />
            </label>

            <div v-if="Array.isArray(editing.items) && editing.items.length" class="modal-items">
              <span class="field-label">Presentes (somente leitura)</span>
              <ul>
                <li v-for="(it, i) in editing.items" :key="i">
                  {{ it.quantity ? it.quantity + '× ' : '' }}{{ it.name }}
                  <span v-if="it.price"> — R$ {{ it.price }}</span>
                </li>
              </ul>
            </div>

            <p v-if="saveError" class="login-error">{{ saveError }}</p>
          </div>

          <footer class="modal-footer">
            <button class="btn btn-ghost" :disabled="saving" @click="closeEdit">Cancelar</button>
            <button class="btn btn-primary" :disabled="saving" @click="saveEdit">
              {{ saving ? 'Salvando...' : 'Salvar' }}
            </button>
          </footer>
        </div>
      </div>
    </Transition>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast" class="toast">{{ toast }}</div>
    </Transition>
  </div>
</template>

<style scoped>
.admin {
  min-height: 100vh;
  color: var(--brown-deep);
  font-family: var(--font-body);
}

/* ---------------- LOGIN ---------------- */
.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
}

.login-card {
  width: 100%;
  max-width: 380px;
  background: var(--white);
  border: 1px solid rgba(74, 42, 28, 0.14);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  padding: clamp(2rem, 6vw, 2.8rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.login-ornament {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 110px;
  margin-bottom: 0.4rem;
}
.o-line { flex: 1; height: 1px; background: rgba(74, 42, 28, 0.15); }

.login-eyebrow {
  font-size: 0.65rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(74, 42, 28, 0.45);
  font-weight: 300;
}

.login-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 8vw, 2.6rem);
  font-weight: 400;
  color: var(--brown-deep);
  margin: 0;
}

.login-sub {
  font-size: 0.85rem;
  color: rgba(74, 42, 28, 0.5);
  margin: 0 0 var(--spacing-sm);
}

.login-error {
  color: #9b2c2c;
  font-size: 0.82rem;
  margin: 0;
  text-align: center;
  width: 100%;
}

/* ---------------- CAMPOS ---------------- */
.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 100%;
}

.field-label {
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(74, 42, 28, 0.55);
  font-weight: 500;
}

.field input,
.field textarea {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 1px solid rgba(74, 42, 28, 0.22);
  border-radius: var(--radius-md);
  background: var(--pale-sand);
  color: var(--brown-deep);
  font-family: var(--font-body);
  font-size: 0.92rem;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.field textarea { resize: vertical; line-height: 1.5; }

.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--terracotta);
  box-shadow: 0 0 0 3px rgba(184, 95, 53, 0.15);
}

/* ---------------- BOTÕES ---------------- */
.btn {
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 1.5px solid transparent;
  padding: 0.6rem 1.3rem;
}
.btn:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-primary {
  background: var(--brown-deep);
  color: var(--cream-accent);
  border-color: var(--brown-deep);
}
.btn-primary:not(:disabled):hover {
  background: var(--clay);
  border-color: var(--clay);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(74, 42, 28, 0.22);
}

.btn-outline {
  background: transparent;
  color: var(--brown-deep);
  border-color: rgba(74, 42, 28, 0.3);
}
.btn-outline:not(:disabled):hover { background: rgba(74, 42, 28, 0.06); }

.btn-ghost {
  background: transparent;
  color: rgba(74, 42, 28, 0.6);
  border-color: transparent;
}
.btn-ghost:not(:disabled):hover { color: var(--brown-deep); background: rgba(74, 42, 28, 0.06); }

.btn-edit {
  background: transparent;
  color: var(--terracotta);
  border-color: rgba(184, 95, 53, 0.4);
  padding: 0.4rem 1rem;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.btn-edit:hover { background: var(--terracotta); color: var(--white); border-color: var(--terracotta); }

.btn-block { width: 100%; padding: 0.85rem; margin-top: 0.4rem; }

/* ---------------- PAINEL ---------------- */
.panel {
  max-width: 1000px;
  margin: 0 auto;
  padding: clamp(1.5rem, 5vw, 3rem) var(--spacing-md) 4rem;
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.panel-eyebrow {
  font-size: 0.65rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(74, 42, 28, 0.45);
}

.panel-title {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 6vw, 2.8rem);
  font-weight: 400;
  color: var(--brown-deep);
  margin: 0.2rem 0 0;
}

/* Abas */
.tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid rgba(74, 42, 28, 0.14);
  margin-bottom: var(--spacing-md);
}
.tab {
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 0.7rem 1rem;
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: rgba(74, 42, 28, 0.5);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: color var(--transition-fast), border-color var(--transition-fast);
  margin-bottom: -1px;
}
.tab.active { color: var(--brown-deep); border-bottom-color: var(--terracotta); }
.tab-count {
  font-size: 0.68rem;
  background: rgba(74, 42, 28, 0.1);
  color: var(--brown-mid);
  padding: 0.1rem 0.5rem;
  border-radius: var(--radius-full);
}
.tab.active .tab-count { background: var(--terracotta); color: var(--white); }

/* Resumo */
.summary {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: var(--spacing-md);
}
.summary-chip {
  display: inline-flex;
  align-items: baseline;
  gap: 0.4rem;
  background: var(--white);
  border: 1px solid rgba(74, 42, 28, 0.12);
  border-radius: var(--radius-full);
  padding: 0.5rem 1rem;
}
.summary-chip strong {
  font-family: var(--font-display);
  font-size: 1.2rem;
  color: var(--terracotta);
}
.summary-chip span {
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(74, 42, 28, 0.5);
}

/* Toolbar */
.toolbar {
  display: flex;
  gap: 0.6rem;
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
}
.search {
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--white);
  border: 1px solid rgba(74, 42, 28, 0.2);
  border-radius: var(--radius-full);
  padding: 0.15rem 0.9rem;
  color: rgba(74, 42, 28, 0.5);
}
.search:focus-within { border-color: var(--terracotta); }
.search input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.55rem 0;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--brown-deep);
}
.search input:focus { outline: none; }
.search-clear {
  border: none;
  background: transparent;
  font-size: 1.2rem;
  line-height: 1;
  color: rgba(74, 42, 28, 0.4);
  cursor: pointer;
}

/* Estados */
.state {
  text-align: center;
  padding: 3rem var(--spacing-md);
  color: rgba(74, 42, 28, 0.5);
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}
.state-error { color: #9b2c2c; }

/* Cards */
.cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-sm);
}
@media (min-width: 700px) {
  .cards { grid-template-columns: 1fr 1fr; }
}

.card {
  background: var(--white);
  border: 1px solid rgba(74, 42, 28, 0.12);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.6rem;
}
.card-name {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 500;
  color: var(--brown-deep);
  margin: 0;
  line-height: 1.3;
}
.card-date {
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  color: rgba(74, 42, 28, 0.4);
}

.card-fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 0.5rem 0.8rem;
  margin: 0.2rem 0 0;
}
.card-fields dt {
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(74, 42, 28, 0.45);
}
.card-fields dd {
  margin: 0.1rem 0 0;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--brown-deep);
}

.card-note {
  font-size: 0.85rem;
  color: var(--brown-mid);
  margin: 0;
  line-height: 1.5;
}
.note-label { font-weight: 600; color: var(--brown-deep); }

.card-link {
  font-size: 0.8rem;
  color: var(--terracotta);
  font-weight: 500;
  text-decoration: none;
  align-self: flex-start;
}
.card-link:hover { text-decoration: underline; }

.card-message {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1rem;
  color: var(--brown-mid);
  line-height: 1.6;
  margin: 0;
}
.card-message-empty { color: rgba(74, 42, 28, 0.35); font-style: normal; }
.card-items {
  list-style: none;
  padding: 0;
  margin: 0.2rem 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}
.card-items li {
  font-size: 0.72rem;
  background: rgba(184, 95, 53, 0.1);
  color: var(--clay);
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
}

/* Paginação */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
}
.page-info {
  font-size: 0.85rem;
  color: rgba(74, 42, 28, 0.55);
  min-width: 70px;
  text-align: center;
}

/* ---------------- MODAL ---------------- */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(42, 24, 18, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  backdrop-filter: blur(2px);
}
.modal {
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--pearl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(74, 42, 28, 0.15);
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  border-bottom: 1px solid rgba(74, 42, 28, 0.12);
}
.modal-header h2 {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 400;
  color: var(--brown-deep);
  margin: 0;
}
.modal-close {
  border: none;
  background: transparent;
  font-size: 1.6rem;
  line-height: 1;
  color: rgba(74, 42, 28, 0.5);
  cursor: pointer;
}
.modal-close:hover { color: var(--brown-deep); }
.modal-body {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
.modal-items ul {
  list-style: none;
  padding: 0;
  margin: 0.4rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.modal-items li {
  font-size: 0.85rem;
  color: var(--brown-mid);
  padding: 0.4rem 0.7rem;
  background: rgba(74, 42, 28, 0.05);
  border-radius: var(--radius-sm);
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  padding: var(--spacing-md);
  border-top: 1px solid rgba(74, 42, 28, 0.12);
}

.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal, .modal-leave-active .modal { transition: transform 0.25s ease; }
.modal-enter-from .modal, .modal-leave-to .modal { transform: translateY(20px); }

/* ---------------- TOAST ---------------- */
.toast {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 320;
  background: var(--brown-deep);
  color: var(--cream-accent);
  padding: 0.8rem 1.5rem;
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  box-shadow: var(--shadow-md);
}
.toast-enter-active, .toast-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 10px); }
</style>
