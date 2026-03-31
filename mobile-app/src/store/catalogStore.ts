import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Equipment, Category } from '../types';
import { fetchAllEquipment, fetchCategories, fetchBrands, fetchFeaturedEquipment, fetchPopularEquipment } from '../api';

interface CatalogState {
  equipment: Equipment[];
  categories: Category[];
  brands: string[];
  featured: Equipment[];
  popular: Equipment[];
  lastFetched: number | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchCatalog: (forceRefresh?: boolean) => Promise<void>;
  clearCache: () => void;
}

const CACHE_LIFETIME = 1000 * 60 * 60; // 1 hour

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set, get) => ({
      equipment: [],
      categories: [],
      brands: [],
      featured: [],
      popular: [],
      lastFetched: null,
      isLoading: false,
      error: null,

      fetchCatalog: async (forceRefresh = false) => {
        const { lastFetched } = get();
        const now = Date.now();
        
        // If we have data and it's not stale, and not forced, we can skip fetching
        // BUT we actually want to fetch in the background (stale-while-revalidate)
        // So we only set isLoading: true if we don't have ANY data yet
        const hasData = get().equipment.length > 0;
        
        if (!hasData) {
          set({ isLoading: true, error: null });
        }

        try {
          const [eq, cats, br, feat, pop] = await Promise.all([
            fetchAllEquipment(),
            fetchCategories(),
            fetchBrands(),
            fetchFeaturedEquipment(),
            fetchPopularEquipment()
          ]);

          set({
            equipment: eq,
            categories: cats,
            brands: br,
            featured: feat,
            popular: pop,
            lastFetched: now,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error("Failed to fetch catalog", error);
          if (!hasData) {
            set({ error: "Failed to load catalog. Please check connection.", isLoading: false });
          } else {
            // If we have cached data, just gracefully hide the error and rely on cache
            set({ isLoading: false });
          }
        }
      },
      clearCache: () => {
        set({
          equipment: [],
          categories: [],
          brands: [],
          featured: [],
          popular: [],
          lastFetched: null
        });
      }
    }),
    {
      name: 'drentals-catalog-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // We don't want to persist isLoading or error state
      partialize: (state) => ({
        equipment: state.equipment,
        categories: state.categories,
        brands: state.brands,
        featured: state.featured,
        popular: state.popular,
        lastFetched: state.lastFetched,
      }),
    }
  )
);
