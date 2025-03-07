import { defineStore } from 'pinia';

interface Product {
    id: number;
    title: string;
    description: string;
    brand: string;
    category: string;
    rating: number;
    price: number;
    discountPercentage: number;
    thumbnail: string;
}

export const useProductStore = defineStore('product', {
    state: () => ({
        products: [] as Product[],
        searchQuery: '',
    }),
    actions: {
        async fetchProducts() {
            const response = await fetch('https://dummyjson.com/products?limit=100');
            const data = await response.json();
            this.products = new Array(10000).fill(null).map((_, index) => {
                const originalProduct = data.products[index % 100];
                return {
                    ...originalProduct,
                    id: index + 1,
                };
            });
        },
        setSearchQuery(query: string) {
            this.searchQuery = query;
        }
    },
    getters: {
        filteredProducts: (state) => {
            const normalizedQuery = state.searchQuery.trim().toLowerCase();
            if (!normalizedQuery) return state.products;
            return state.products.filter((product) => {
                const title = product.title.toLowerCase().replace(/\s+/g, '');
                const words = product.title.toLowerCase().split(/\s+/);
                return words.some(word => word.includes(normalizedQuery)) || title.includes(normalizedQuery);
            });
        },
    },
});