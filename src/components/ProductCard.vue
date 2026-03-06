<script setup lang="ts">
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  product_url: string;
  permalink: string;
  brand?: string;
  category?: string;
}

defineProps<{ product: Product }>();

function formatPrice(price: number): string {
  return `S/ ${price.toFixed(2)}`;
}
</script>

<template>
  <div class="mt-flex-shrink-0 mt-w-44 mt-bg-white mt-rounded-xl mt-border mt-border-gray-200 mt-overflow-hidden mt-shadow-sm hover:mt-shadow-md mt-transition">
    <a :href="product.product_url" target="_blank" rel="noopener noreferrer" class="mt-block mt-no-underline">
      <div class="mt-w-full mt-h-36 mt-bg-gray-100 mt-overflow-hidden">
        <img
          v-if="product.image"
          :src="product.image"
          :alt="product.name"
          class="mt-w-full mt-h-full mt-object-cover"
          loading="lazy"
        />
        <div v-else class="mt-w-full mt-h-full mt-flex mt-items-center mt-justify-center mt-text-gray-400">
          <svg class="mt-w-10 mt-h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    </a>
    <div class="mt-p-2.5">
      <p class="mt-text-xs mt-text-gray-800 mt-font-medium mt-leading-tight mt-line-clamp-2 mt-mb-1 mt-m-0">
        {{ product.name }}
      </p>
      <p v-if="product.brand" class="mt-text-[10px] mt-text-gray-400 mt-m-0 mt-mb-1">
        {{ product.brand }}
      </p>
      <p class="mt-text-sm mt-font-bold mt-text-primary mt-m-0 mt-mb-2">
        {{ formatPrice(product.price) }}
      </p>
      <div class="mt-flex mt-flex-col mt-gap-1">
        <a
          :href="product.permalink"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-block mt-text-center mt-text-[11px] mt-font-medium mt-text-white mt-bg-primary mt-rounded-lg mt-py-1.5 mt-px-2 mt-no-underline hover:mt-opacity-90 mt-transition"
        >
          Comprar ahora
        </a>
        <a
          :href="product.product_url"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-block mt-text-center mt-text-[11px] mt-font-medium mt-text-primary mt-bg-transparent mt-border mt-border-primary/30 mt-rounded-lg mt-py-1.5 mt-px-2 mt-no-underline hover:mt-bg-primary/5 mt-transition"
        >
          Ver producto
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mt-line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
