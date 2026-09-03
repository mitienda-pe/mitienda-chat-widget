import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface Source {
  title: string;
  url: string;
}

export interface ProductItem {
  id: number;
  name: string;
  price: number;
  image: string;
  product_url: string;
  permalink: string;
  brand?: string;
  category?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sources?: Source[];
  products?: ProductItem[];
  /** El mensaje se está escribiendo ahora mismo: no se guarda hasta terminar. */
  streaming?: boolean;
}

export type WidgetMode = 'support' | 'shopping' | 'sales';

export interface WidgetConfig {
  mode: WidgetMode;
  tiendaId?: number;
  botName?: string;
  country?: string;
}

const STORAGE_KEY = 'mitienda-chat-history';
const SESSION_KEY = 'mitienda-chat-session';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function loadSession(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = generateId();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

function loadMessages(): Message[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<Message[]>(loadMessages());
  const isOpen = ref(false);
  const isLoading = ref(false);
  const sessionId = ref(loadSession());
  const showHome = ref(messages.value.length === 0);
  const widgetConfig = ref<WidgetConfig>({ mode: 'support' });
  /** Qué está haciendo el asistente ahora: "Buscando polos…". */
  const progressLabel = ref<string | null>(null);

  const history = computed(() =>
    messages.value.map((m) => ({ role: m.role, content: m.content }))
  );

  function saveMessages() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value));
  }

  function addMessage(role: 'user' | 'assistant', content: string, sources?: Source[], products?: ProductItem[]) {
    messages.value.push({
      id: generateId(),
      role,
      content,
      timestamp: Date.now(),
      ...(sources?.length ? { sources } : {}),
      ...(products?.length ? { products } : {}),
    });
    saveMessages();
  }

  /**
   * Abre un mensaje del asistente vacío para irlo llenando.
   *
   * Nada de esto toca localStorage hasta que el mensaje termina: guardar en cada
   * fragmento serializaría la conversación entera decenas de veces por respuesta.
   */
  function startAssistantMessage(): string {
    const id = generateId();
    messages.value.push({
      id,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      streaming: true,
    });
    return id;
  }

  function findMessage(id: string): Message | undefined {
    return messages.value.find((m) => m.id === id);
  }

  function appendToMessage(id: string, text: string) {
    const msg = findMessage(id);
    if (msg) msg.content += text;
  }

  /** El asistente estaba pensando en voz alta y luego fue a buscar: se descarta. */
  function resetMessageContent(id: string) {
    const msg = findMessage(id);
    if (msg) msg.content = '';
  }

  function setMessageProducts(id: string, products: ProductItem[]) {
    const msg = findMessage(id);
    if (msg && products.length) msg.products = products;
  }

  function finishMessage(id: string, content?: string) {
    const msg = findMessage(id);
    if (!msg) return;
    // El evento final trae el texto completo: si algún fragmento se perdió, esto
    // lo deja consistente con lo que el servidor realmente respondió.
    if (content) msg.content = content;
    msg.streaming = false;
    progressLabel.value = null;
    saveMessages();
  }

  function dropMessage(id: string) {
    messages.value = messages.value.filter((m) => m.id !== id);
  }

  function setWidgetConfig(cfg: WidgetConfig) {
    widgetConfig.value = cfg;
  }

  function toggleOpen() {
    isOpen.value = !isOpen.value;
  }

  function startConversation() {
    showHome.value = false;
  }

  function clearHistory() {
    messages.value = [];
    localStorage.removeItem(STORAGE_KEY);
    const newSession = generateId();
    sessionId.value = newSession;
    localStorage.setItem(SESSION_KEY, newSession);
    showHome.value = true;
  }

  return {
    messages,
    isOpen,
    isLoading,
    sessionId,
    showHome,
    history,
    widgetConfig,
    progressLabel,
    addMessage,
    startAssistantMessage,
    appendToMessage,
    resetMessageContent,
    setMessageProducts,
    finishMessage,
    dropMessage,
    toggleOpen,
    startConversation,
    clearHistory,
    setWidgetConfig,
  };
});
