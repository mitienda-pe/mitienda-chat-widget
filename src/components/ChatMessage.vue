<script setup lang="ts">
import { computed } from 'vue';
import { renderMarkdown } from '../utils/markdown';
import type { Message } from '../stores/chat';
import ProductCarousel from './ProductCarousel.vue';

const props = defineProps<{ message: Message }>();

const isUser = computed(() => props.message.role === 'user');

const htmlContent = computed(() => {
  if (isUser.value) return '';
  return renderMarkdown(props.message.content);
});

const hasProducts = computed(() => (props.message.products?.length ?? 0) > 0);
</script>

<template>
  <div :class="['mt-flex mt-flex-col', isUser ? 'mt-items-end' : 'mt-items-start']">
    <div
      :class="[
        'mt-max-w-[85%] mt-rounded-2xl mt-px-4 mt-py-2.5 mt-text-sm mt-leading-relaxed',
        isUser
          ? 'mt-bg-primary mt-text-white mt-rounded-br-md'
          : 'mt-bg-gray-100 mt-text-gray-800 mt-rounded-bl-md',
      ]"
    >
      <template v-if="isUser">
        {{ message.content }}
      </template>
      <div
        v-else
        class="chat-markdown"
        v-html="htmlContent"
      />
      <div
        v-if="!isUser && message.sources?.length"
        class="mt-flex mt-flex-wrap mt-gap-1.5 mt-mt-2 mt-pt-2 mt-border-t mt-border-gray-200"
      >
        <a
          v-for="source in message.sources"
          :key="source.url"
          :href="source.url"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-inline-flex mt-items-center mt-gap-1 mt-px-2 mt-py-0.5 mt-bg-white mt-border mt-border-gray-200 mt-rounded-full mt-text-xs mt-text-primary mt-no-underline hover:mt-bg-gray-50 mt-transition-colors"
        >
          <svg class="mt-w-3 mt-h-3 mt-flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {{ source.title }}
        </a>
      </div>
    </div>
    <ProductCarousel
      v-if="hasProducts"
      :products="message.products!"
      class="mt-mt-2 mt-w-full"
    />
  </div>
</template>

<style scoped>
.chat-markdown :deep(p) {
  margin: 0.25rem 0;
}
.chat-markdown :deep(p:first-child) {
  margin-top: 0;
}
.chat-markdown :deep(p:last-child) {
  margin-bottom: 0;
}
.chat-markdown :deep(ul),
.chat-markdown :deep(ol) {
  margin: 0.25rem 0;
  padding-left: 1.25rem;
}
.chat-markdown :deep(li) {
  margin: 0.125rem 0;
}
.chat-markdown :deep(a) {
  color: #00b2a6;
  text-decoration: underline;
}
.chat-markdown :deep(strong) {
  font-weight: 600;
}
.chat-markdown :deep(code) {
  background: rgba(0, 0, 0, 0.06);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.85em;
}
</style>
