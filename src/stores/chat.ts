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
}

export type WidgetMode = 'support' | 'shopping';

export interface WidgetConfig {
  mode: WidgetMode;
  tiendaId?: number;
  botName?: string;
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
    addMessage,
    toggleOpen,
    startConversation,
    clearHistory,
    setWidgetConfig,
  };
});
