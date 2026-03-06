<script setup lang="ts">
import { useChatStore } from '../stores/chat';
import ChatLauncher from './ChatLauncher.vue';
import ChatPanel from './ChatPanel.vue';

const store = useChatStore();
</script>

<template>
  <div class="mt-fixed mt-bottom-4 mt-right-4 mt-z-[9999] mt-font-sans">
    <Transition
      enter-active-class="mt-transition mt-duration-300 mt-ease-out"
      enter-from-class="mt-opacity-0 mt-scale-95 mt-translate-y-4"
      enter-to-class="mt-opacity-100 mt-scale-100 mt-translate-y-0"
      leave-active-class="mt-transition mt-duration-200 mt-ease-in"
      leave-from-class="mt-opacity-100 mt-scale-100 mt-translate-y-0"
      leave-to-class="mt-opacity-0 mt-scale-95 mt-translate-y-4"
    >
      <ChatPanel v-if="store.isOpen" />
    </Transition>
    <ChatLauncher />
  </div>
</template>
