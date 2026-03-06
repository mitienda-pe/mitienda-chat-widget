<script setup lang="ts">
import { computed } from 'vue';
import { useChatStore } from '../stores/chat';
import { useChat } from '../composables/useChat';

const store = useChatStore();
const { sendSuggestion } = useChat();

const isShopping = computed(() => store.widgetConfig.mode === 'shopping');

const botName = computed(() =>
  store.widgetConfig.botName ||
  (isShopping.value
    ? import.meta.env.VITE_SHOPPING_BOT_NAME || 'Asistente de Compras'
    : import.meta.env.VITE_BOT_NAME || 'Soporte MiTienda')
);

const greeting = computed(() =>
  isShopping.value
    ? '¿Qué producto estás buscando hoy?'
    : '¿En qué puedo ayudarte hoy?'
);

const supportSuggestions = [
  '¿Cuáles son los planes y precios?',
  '¿Cómo agrego productos?',
  '¿Cuál es la política de envíos?',
  '¿Cómo funciona la devolución?',
];

const shoppingSuggestions = [
  '¿Qué productos tienen en oferta?',
  'Busco algo para regalar',
  '¿Cuáles son los más vendidos?',
  'Necesito una recomendación',
];

const suggestions = computed(() =>
  isShopping.value ? shoppingSuggestions : supportSuggestions
);
</script>

<template>
  <div class="mt-flex-1 mt-flex mt-flex-col mt-items-center mt-justify-center mt-px-6 mt-py-8 mt-text-center">
    <div class="mt-w-16 mt-h-16 mt-rounded-full mt-bg-primary/10 mt-flex mt-items-center mt-justify-center mt-mb-4">
      <svg v-if="isShopping" xmlns="http://www.w3.org/2000/svg" class="mt-w-8 mt-h-8 mt-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="mt-w-8 mt-h-8 mt-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    </div>

    <h2 class="mt-text-lg mt-font-semibold mt-text-gray-800 mt-mb-1">
      {{ isShopping ? '¡Bienvenido!' : '¡Hola!' }} 👋
    </h2>
    <p class="mt-text-sm mt-text-gray-500 mt-mb-6">
      Soy {{ botName }}. {{ greeting }}
    </p>

    <div class="mt-w-full mt-space-y-2">
      <button
        v-for="suggestion in suggestions"
        :key="suggestion"
        @click="sendSuggestion(suggestion)"
        class="mt-w-full mt-text-left mt-px-4 mt-py-2.5 mt-text-sm mt-text-gray-700 mt-bg-gray-50 mt-rounded-xl mt-border mt-border-gray-200 hover:mt-bg-primary/5 hover:mt-border-primary/30 hover:mt-text-primary mt-transition mt-cursor-pointer"
      >
        {{ suggestion }}
      </button>
    </div>
  </div>
</template>
