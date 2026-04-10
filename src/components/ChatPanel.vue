<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useChatStore } from '../stores/chat';
import ChatHome from './ChatHome.vue';
import ChatMessage from './ChatMessage.vue';
import ChatInput from './ChatInput.vue';
import ChatTypingIndicator from './ChatTypingIndicator.vue';
import { nextTick, ref, watch } from 'vue';

const store = useChatStore();
const messagesContainer = ref<HTMLElement | null>(null);
const prevMessageCount = ref(store.messages.length);

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '51967797232';

const mode = computed(() => store.widgetConfig.mode);

const BOT_NAME = computed(() => {
  if (store.widgetConfig.botName) return store.widgetConfig.botName;
  switch (mode.value) {
    case 'shopping': return import.meta.env.VITE_SHOPPING_BOT_NAME || 'Asistente de Compras';
    case 'sales': return import.meta.env.VITE_SALES_BOT_NAME || 'Asesor Comercial';
    default: return import.meta.env.VITE_BOT_NAME || 'Soporte MiTienda';
  }
});

function openWhatsApp() {
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Hola, necesito ayuda`, '_blank');
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

function scrollToLastMessage() {
  if (!messagesContainer.value) return;
  const children = messagesContainer.value.children;
  if (children.length < 2) {
    scrollToBottom();
    return;
  }
  // Scroll to the start of the last message element
  const lastMsg = children[children.length - 1] as HTMLElement;
  lastMsg.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// On mount: scroll to bottom to show latest messages (restored from localStorage)
onMounted(async () => {
  await nextTick();
  scrollToBottom();
});

watch(
  () => store.messages.length,
  async (newLen) => {
    const wasUser = newLen > prevMessageCount.value &&
      store.messages[newLen - 1]?.role === 'user';
    prevMessageCount.value = newLen;

    await nextTick();

    if (wasUser) {
      // User sent a message: scroll to bottom so they see the typing indicator
      scrollToBottom();
    } else {
      // Bot responded: scroll to the start of the new message
      scrollToLastMessage();
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
          <svg v-if="mode === 'shopping'" xmlns="http://www.w3.org/2000/svg" class="mt-w-5 mt-h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <svg v-else-if="mode === 'sales'" xmlns="http://www.w3.org/2000/svg" class="mt-w-5 mt-h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
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
