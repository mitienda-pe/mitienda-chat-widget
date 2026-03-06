<script setup lang="ts">
import { computed } from 'vue';
import { useChatStore } from '../stores/chat';
import ChatHome from './ChatHome.vue';
import ChatMessage from './ChatMessage.vue';
import ChatInput from './ChatInput.vue';
import ChatTypingIndicator from './ChatTypingIndicator.vue';
import { nextTick, ref, watch } from 'vue';

const store = useChatStore();
const messagesContainer = ref<HTMLElement | null>(null);

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '51967797232';

const isShopping = computed(() => store.widgetConfig.mode === 'shopping');

const BOT_NAME = computed(() =>
  store.widgetConfig.botName ||
  (isShopping.value
    ? import.meta.env.VITE_SHOPPING_BOT_NAME || 'Asistente de Compras'
    : import.meta.env.VITE_BOT_NAME || 'Soporte MiTienda')
);

function openWhatsApp() {
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Hola, necesito ayuda`, '_blank');
}

watch(
  () => store.messages.length,
  async () => {
    await nextTick();
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  }
);
</script>

<template>
  <div class="mt-w-[380px] mt-max-w-[calc(100vw-2rem)] mt-h-[520px] mt-max-h-[calc(100vh-6rem)] mt-bg-white mt-rounded-2xl mt-shadow-2xl mt-flex mt-flex-col mt-overflow-hidden mt-border mt-border-gray-200">
    <!-- Header -->
    <div class="mt-bg-primary mt-text-white mt-px-4 mt-py-3 mt-flex mt-items-center mt-justify-between mt-shrink-0">
      <div class="mt-flex mt-items-center mt-gap-2">
        <div class="mt-w-8 mt-h-8 mt-rounded-full mt-bg-white/20 mt-flex mt-items-center mt-justify-center">
          <svg v-if="isShopping" xmlns="http://www.w3.org/2000/svg" class="mt-w-5 mt-h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="mt-w-5 mt-h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div>
          <div class="mt-font-semibold mt-text-sm">{{ BOT_NAME }}</div>
          <div class="mt-text-xs mt-text-white/80">En línea</div>
        </div>
      </div>
      <button
        @click="store.toggleOpen()"
        class="mt-text-white/80 hover:mt-text-white mt-transition mt-bg-transparent mt-border-0 mt-cursor-pointer mt-p-1"
        aria-label="Cerrar chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="mt-w-5 mt-h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Body -->
    <template v-if="store.showHome">
      <ChatHome />
    </template>
    <template v-else>
      <div ref="messagesContainer" class="mt-flex-1 mt-overflow-y-auto mt-px-4 mt-py-3 mt-space-y-3">
        <ChatMessage
          v-for="msg in store.messages"
          :key="msg.id"
          :message="msg"
        />
        <ChatTypingIndicator v-if="store.isLoading" />
      </div>

      <!-- WhatsApp button -->
      <div class="mt-px-4 mt-pb-1">
        <button
          @click="openWhatsApp"
          class="mt-w-full mt-text-xs mt-text-gray-500 hover:mt-text-primary mt-transition mt-bg-transparent mt-border-0 mt-cursor-pointer mt-py-1"
        >
          ¿Necesitas hablar con una persona? Chatea por WhatsApp
        </button>
      </div>
    </template>

    <ChatInput />
  </div>
</template>
