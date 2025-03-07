<script setup lang="ts">
import {ref, computed, onMounted, watch} from 'vue';
import {useProductStore} from '../store/products';

const store = useProductStore();
const scrollContainer = ref<HTMLElement | null>(null);
const itemHeight = 120;
const bufferSize = 10;
const startIndex = ref(0);
const endIndex = ref(0);

const totalHeight = computed(() => store.filteredProducts.length * itemHeight);

const visibleProducts = computed(() => {
  return store.filteredProducts.slice(startIndex.value, endIndex.value).map((product, index) => ({
    ...product,
    top: (startIndex.value + index) * itemHeight,
  }));
});

const isEmpty = computed(() => store.filteredProducts.length === 0);

const updateVisibleRange = () => {
  if (!scrollContainer.value) return;
  const scrollTop = scrollContainer.value.scrollTop;
  startIndex.value = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize);
  endIndex.value = Math.min(startIndex.value + Math.ceil(scrollContainer.value.clientHeight / itemHeight) + bufferSize, store.filteredProducts.length);
};

onMounted(() => {
  store.fetchProducts().then(() => {
    if (scrollContainer.value) {
      updateVisibleRange();
      scrollContainer.value.addEventListener('scroll', updateVisibleRange);
    }
  });
});

watch(() => store.filteredProducts, () => {
  updateVisibleRange();
});
</script>

<template>
  <div class="relative h-[600px] overflow-auto border border-gray-300 bg-white shadow-md rounded-xl"
       ref="scrollContainer">
    <div v-if="visibleProducts.length === 0" class="flex justify-center items-center h-full text-gray-500 text-lg">
      Товар не знайдено
    </div>
    <div v-else :style="{ height: totalHeight + 'px', position: 'relative' }">
      <template v-for="(product) in visibleProducts" :key="product.id">
        <div
            class="absolute w-full p-4 border-b border-gray-200 flex gap-4 items-center bg-white shadow-sm rounded-md"
            :style="{ top: `${product.top}px`, position: 'absolute', width: '100%' }">
          <img :src="product.thumbnail" alt="" class="w-20 h-20 object-cover rounded-lg shadow-md"/>
          <div>
            <h3 class="font-bold text-lg text-gray-800">{{ product.title }}</h3>
            <p class="text-sm text-gray-600">{{ product.description }}</p>
            <p class="text-xs text-gray-500">Brand: <span class="font-semibold">{{ product.brand }}</span> | Category:
              <span class="font-semibold">{{ product.category }}</span></p>
            <p class="text-xs text-gray-500">Rating: ⭐{{ product.rating }} | <span class="text-green-600 font-semibold">${{
                product.price
              }}</span> <span class="text-red-500">(-{{ product.discountPercentage }}%)</span></p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

