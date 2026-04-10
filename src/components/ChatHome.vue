<script setup lang="ts">
import { computed } from 'vue';
import { useChatStore } from '../stores/chat';
import { useChat } from '../composables/useChat';

const store = useChatStore();
const { sendSuggestion } = useChat();

const mode = computed(() => store.widgetConfig.mode);

const botName = computed(() => {
  if (store.widgetConfig.botName) return store.widgetConfig.botName;
  switch (mode.value) {
    case 'shopping': return import.meta.env.VITE_SHOPPING_BOT_NAME || 'Asistente de Compras';
    case 'sales': return import.meta.env.VITE_SALES_BOT_NAME || 'Asesor Comercial';
    default: return import.meta.env.VITE_BOT_NAME || 'Soporte MiTienda';
  }
});

const greetingTitle = computed(() => {
  switch (mode.value) {
    case 'shopping': return '¡Bienvenido! 👋';
    case 'sales': return '¡Hola! 👋';
    default: return '¡Hola! 👋';
  }
});

const greeting = computed(() => {
  switch (mode.value) {
    case 'shopping': return '¿Qué producto estás buscando hoy?';
    case 'sales': return '¿Te gustaría vender por internet? Te ayudo a empezar.';
    default: return '¿En qué puedo ayudarte hoy?';
  }
});

const supportSuggestions = [
  '¿Cómo agrego productos a mi tienda?',
  '¿Cómo configuro los envíos?',
  '¿Cómo conecto una pasarela de pago?',
  '¿Cómo personalizo mi tienda?',
];

const salesSuggestions = [
  '¿Cuáles son los planes y precios?',
  '¿Qué incluye la prueba gratis?',
  '¿Qué pasarelas de pago puedo usar?',
  'Quiero agendar una demo',
];

const shoppingSuggestions = [
  '¿Qué productos tienen en oferta?',
  'Busco algo para regalar',
  '¿Cuáles son los más vendidos?',
  '¿Dónde está mi pedido?',
];

const suggestions = computed(() => {
  switch (mode.value) {
    case 'shopping': return shoppingSuggestions;
    case 'sales': return salesSuggestions;
    default: return supportSuggestions;
  }
});
</script>

<template>
  <div class="mt-flex-1 mt-flex mt-flex-col mt-items-center mt-justify-center mt-px-6 mt-py-8 mt-text-center mt-overflow-y-auto">
    <div class="mt-w-16 mt-h-16 mt-rounded-full mt-bg-primary/10 mt-flex mt-items-center mt-justify-center mt-mb-4">
      <!-- Shopping: bag icon -->
      <svg v-if="mode === 'shopping'" xmlns="http://www.w3.org/2000/svg" class="mt-w-8 mt-h-8 mt-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <!-- Sales: rocket icon -->
      <svg v-else-if="mode === 'sales'" xmlns="http://www.w3.org/2000/svg" class="mt-w-8 mt-h-8 mt-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
      <!-- Support: chat bubbles icon -->
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="mt-w-8 mt-h-8 mt-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    </div>

    <h2 class="mt-text-lg mt-font-semibold mt-text-gray-800 mt-mb-1">
      {{ greetingTitle }}
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
