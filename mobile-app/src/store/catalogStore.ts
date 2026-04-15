/**
 * catalogStore — Zustand store for the Catalog screen only.
 *
 * HomeScreen now manages its own data (sections + categories) via local
 * component state and useFocusEffect. This store is ONLY used by:
 *  - CatalogScreen (equipment, brands)
 *  - BrandsScreen / BrandDetailScreen (brands)
 *
 * Data is persisted to AsyncStorage with a 10-minute TTL so browse sessions
 * feel snappy, but a force-refresh (pull-to-refresh) always bypasses it.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category, Equipment } from '../types';
import { fetchAllEquipment, fetchBrands, fetchCategories } from '../api';

const CATALOG_CACHE_MS = 1000 * 60 * 10; // 10 minutes

interface CatalogState {
  equipment: Equipment[];
  categories: Category[];
  brands: string[];
  lastFetched: number | null;
  isLoading: boolean;
  error: string | null;

  fetchCatalogData: (forceRefresh?: boolean) => Promise<void>;
  clearCache: () => void;
}

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set, get) => ({
      equipment: [],
      categories: [],
      brands: [],
      lastFetched: null,
      isLoading: false,
      error: null,

      fetchCatalogData: async (forceRefresh = false) => {
        const { lastFetched, equipment } = get();
        const now = Date.now();

        const isFresh = lastFetched !== null && now - lastFetched < CATALOG_CACHE_MS;
        const hasData = equipment.length > 0;

        // Skip if data is fresh, unless explicitly forced
        if (!forceRefresh && isFresh && hasData) return;

        // Only show skeleton on a cold start (no cached data)
        if (!hasData) set({ isLoading: true, error: null });

        try {
          const [eq, categories, br] = await Promise.all([
            fetchAllEquipment(),
            fetchCategories(),
            fetchBrands(),
          ]);
          set({
            equipment: eq,
            categories,
            brands: br,
            lastFetched: now,
            isLoading: false,
            error: null,
          });
        } catch (err) {
          console.error('[fetchCatalogData]', err);
          set({
            isLoading: false,
            error: hasData ? null : 'Failed to load catalog. Check your connection.',
          });
        }
      },

      clearCache: () => set({ equipment: [], categories: [], brands: [], lastFetched: null }),
    }),
    {
      name: 'drentals-catalog-v3',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        equipment: state.equipment,
        categories: state.categories,
        brands: state.brands,
        lastFetched: state.lastFetched,
      }),
    }
  )
);
