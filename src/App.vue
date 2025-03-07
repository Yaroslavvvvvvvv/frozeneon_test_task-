<template>
  <header class="header bg-blue-600 text-white shadow-lg">
    <div class="app-container text-center text-lg font-semibold">Hello from Header</div>
  </header>
  <main class="main">
    <div class="app-container">
      <h1 class="text-2xl font-bold text-center mb-6">Product Search</h1>
      <div class="p-4 flex flex-col items-center justify-center">
        <input
            v-model="searchQuery"
            @input="updateSearchQuery"
            class="w-full md:w-2/3 p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-200 text-base"
            placeholder="Введіть назву товара"
        />
      </div>
      <VirtualList/>
    </div>
  </main>
  <footer class="footer bg-gray-800 text-white">
    <div class="app-container text-center text-sm">Hello from Footer</div>
  </footer>
</template>

<script setup lang="ts">
import VirtualList from "./components/VirtualList.vue";
import {ref} from 'vue';
import {useProductStore} from './store/products.ts';

const store = useProductStore();
const searchQuery = ref(store.searchQuery);

const updateSearchQuery = () => {
  store.setSearchQuery(searchQuery.value);
};
</script>
