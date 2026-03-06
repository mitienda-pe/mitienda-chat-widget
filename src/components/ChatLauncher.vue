<script setup lang="ts">
import { useChatStore } from '../stores/chat';

const store = useChatStore();
</script>

<template>
  <button
    @click="store.toggleOpen()"
    class="mt-mt-3 mt-ml-auto mt-flex mt-items-center mt-justify-center mt-w-14 mt-h-14 mt-rounded-full mt-bg-primary mt-text-white mt-shadow-lg hover:mt-shadow-xl mt-transition-all mt-duration-200 hover:mt-scale-105 mt-cursor-pointer mt-border-0"
    :aria-label="store.isOpen ? 'Cerrar chat' : 'Abrir chat'"
  >
    <svg v-if="!store.isOpen" xmlns="http://www.w3.org/2000/svg" class="mt-w-7 mt-h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="mt-w-7 mt-h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
</template>
