<script setup lang="ts">
import { ref } from 'vue';
import { useChatStore } from '../stores/chat';
import { useChat } from '../composables/useChat';

const store = useChatStore();
const { sendMessage } = useChat();
const inputText = ref('');

function handleSubmit() {
  if (!inputText.value.trim() || store.isLoading) return;
  sendMessage(inputText.value);
  inputText.value = '';
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSubmit();
  }
}
</script>

<template>
  <div class="mt-border-t mt-border-gray-200 mt-px-4 mt-py-3 mt-shrink-0">
    <form @submit.prevent="handleSubmit" class="mt-flex mt-items-end mt-gap-2">
      <textarea
        v-model="inputText"
        @keydown="handleKeydown"
        :disabled="store.isLoading"
        placeholder="Escribe tu mensaje..."
        rows="1"
        class="mt-flex-1 mt-resize-none mt-border mt-border-gray-300 mt-rounded-xl mt-px-3 mt-py-2 mt-text-sm mt-text-gray-800 mt-outline-none focus:mt-border-primary focus:mt-ring-1 focus:mt-ring-primary mt-transition disabled:mt-opacity-50 mt-bg-white"
      />
      <button
        type="submit"
        :disabled="!inputText.trim() || store.isLoading"
        class="mt-flex mt-items-center mt-justify-center mt-w-9 mt-h-9 mt-rounded-full mt-bg-primary mt-text-white disabled:mt-opacity-40 mt-transition mt-shrink-0 mt-border-0 mt-cursor-pointer disabled:mt-cursor-not-allowed"
        aria-label="Enviar mensaje"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="mt-w-4 mt-h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </form>
  </div>
</template>
