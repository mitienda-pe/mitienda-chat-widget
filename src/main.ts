import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ChatWidget from './components/ChatWidget.vue';
import { useChatStore } from './stores/chat';
import type { WidgetMode } from './stores/chat';
import './style.css';

// Read config from script tag data attributes
const scriptTag = document.querySelector('script[data-mode]') || document.currentScript;
const dataMode = (scriptTag?.getAttribute('data-mode') || 'support') as WidgetMode;
const dataTiendaId = scriptTag?.getAttribute('data-tienda-id');
const dataBotName = scriptTag?.getAttribute('data-bot-name');

const mountEl = document.getElementById('mitienda-chat') || (() => {
  const el = document.createElement('div');
  el.id = 'mitienda-chat';
  document.body.appendChild(el);
  return el;
})();

const app = createApp(ChatWidget);
const pinia = createPinia();
app.use(pinia);
app.mount(mountEl);

// Configure widget mode after mount
const store = useChatStore();
store.setWidgetConfig({
  mode: dataMode,
  tiendaId: dataTiendaId ? parseInt(dataTiendaId, 10) : undefined,
  botName: dataBotName || undefined,
});
