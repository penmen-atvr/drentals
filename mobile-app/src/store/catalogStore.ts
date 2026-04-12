import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Equipment, Category } from '../types';
import { fetchAllEquipment, fetchCategories, fetchBrands, fetchFeaturedEquipment, fetchPopularEquipment, fetchHomepageSections, HomepageSection } from '../api';

interface CatalogState {
  equipment: Equipment[];
  categories: Category[];
  brands: string[];
  featured: Equipment[];
  popular: Equipment[];
  homepageSections: HomepageSection[];
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
      homepageSections: [],
      lastFetched: null,
      isLoading: false,
      error: null,

      fetchCatalog: async (forceRefresh = false) => {
        const { lastFetched } = get();
        const now = Date.now();
        
        const hasData = get().equipment.length > 0;
        
        if (!hasData) {
          set({ isLoading: true, error: null });
        }

        try {
          const [eq, cats, br, feat, pop, sections] = await Promise.all([
            fetchAllEquipment(),
            fetchCategories(),
            fetchBrands(),
            fetchFeaturedEquipment(),
            fetchPopularEquipment(),
            fetchHomepageSections(),
          ]);

          set({
            equipment: eq,
            categories: cats,
            brands: br,
            featured: feat,
            popular: pop,
            homepageSections: sections,
            lastFetched: now,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error("Failed to fetch catalog", error);
          if (!hasData) {
            set({ error: "Failed to load catalog. Please check connection.", isLoading: false });
          } else {
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
          homepageSections: [],
          lastFetched: null
        });
      }
    }),
    {
      name: 'drentals-catalog-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        equipment: state.equipment,
        categories: state.categories,
        brands: state.brands,
        featured: state.featured,
        popular: state.popular,
        homepageSections: state.homepageSections,
        lastFetched: state.lastFetched,
      }),
    }
  )
);
