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
  isFetchingNextPage: boolean;
  error: string | null;
  page: number;
  hasNextPage: boolean;

  fetchCatalogData: (
    page?: number,
    categoryId?: number | null,
    sort?: string | null,
    brand?: string | null,
    q?: string | null,
    forceRefresh?: boolean
  ) => Promise<void>;
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
      isFetchingNextPage: false,
      error: null,
      page: 1,
      hasNextPage: false,

      fetchCatalogData: async (
        page = 1,
        categoryId = null,
        sort = null,
        brand = null,
        q = null,
        forceRefresh = false
      ) => {
        const { equipment, lastFetched } = get();
        const now = Date.now();
        const isFresh = lastFetched !== null && now - lastFetched < CATALOG_CACHE_MS;
        const isInitialPage = page === 1;
        const hasData = equipment.length > 0;

        // Skip cache bypass if we're aggressively fetching the same fresh base page
        if (!forceRefresh && isFresh && isInitialPage && hasData) return;

        if (isInitialPage) {
          set({ isLoading: !hasData, error: null });
        } else {
          set({ isFetchingNextPage: true, error: null });
        }

        try {
          const [eqRes, categories, br] = await Promise.all([
            fetchAllEquipment(page, 12, categoryId, sort, brand, q),
            fetchCategories(),
            fetchBrands(),
          ]);

          set((state) => ({
            equipment: isInitialPage ? eqRes.data : [...state.equipment, ...eqRes.data],
            hasNextPage: eqRes.hasNextPage,
            page: page,
            categories,
            brands: br,
            lastFetched: now,
            isLoading: false,
            isFetchingNextPage: false,
            error: null,
          }));
        } catch (err) {
          console.error('[fetchCatalogData]', err);
          set({
            isLoading: false,
            isFetchingNextPage: false,
            error: isInitialPage && !hasData ? 'Failed to load catalog. Check your connection.' : null,
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
