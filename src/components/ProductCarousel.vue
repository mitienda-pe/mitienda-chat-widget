<script setup lang="ts">
import ProductCard from './ProductCard.vue';
import type { Product } from './ProductCard.vue';

defineProps<{ products: Product[] }>();
</script>

<template>
  <div class="mt-w-full mt-overflow-x-auto mt-py-1 mt-scrollbar-thin">
    <div class="mt-flex mt-gap-2.5 mt-px-1" :style="{ minWidth: 'max-content' }">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<style scoped>
.mt-scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}
.mt-scrollbar-thin::-webkit-scrollbar {
  height: 4px;
}
.mt-scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.mt-scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 2px;
}
</style>
