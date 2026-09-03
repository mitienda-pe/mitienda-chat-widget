<script setup lang="ts">
/**
 * Lo que ve el comprador mientras espera.
 *
 * Con `label` cuenta qué está haciendo el asistente —"Buscando polos…"— en vez de
 * tres puntitos mudos. Una espera explicada se siente más corta que una igual de
 * larga sin explicación, y además deja claro que el chat no se colgó.
 */
defineProps<{ label?: string | null }>();
</script>

<template>
  <div class="mt-flex mt-justify-start">
    <div class="mt-bg-gray-100 mt-rounded-2xl mt-rounded-bl-md mt-px-4 mt-py-3 mt-flex mt-items-center mt-gap-2">
      <span class="mt-flex mt-items-center mt-gap-1">
        <span class="mt-w-2 mt-h-2 mt-bg-gray-400 mt-rounded-full mt-animate-bounce" style="animation-delay: 0ms" />
        <span class="mt-w-2 mt-h-2 mt-bg-gray-400 mt-rounded-full mt-animate-bounce" style="animation-delay: 150ms" />
        <span class="mt-w-2 mt-h-2 mt-bg-gray-400 mt-rounded-full mt-animate-bounce" style="animation-delay: 300ms" />
      </span>
      <span v-if="label" class="mt-text-xs mt-text-gray-500">{{ label }}</span>
    </div>
  </div>
</template>
