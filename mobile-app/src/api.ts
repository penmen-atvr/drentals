import { Category, Equipment } from './types';

export const API_BASE = process.env.EXPO_PUBLIC_API_URL || (__DEV__ ? 'http://192.168.29.65:3000/api' : 'https://rentals.penmenstudios.com/api');

async function fetchWithTimeout(url: string, timeoutMs = 10000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

const DOMAIN = 'https://rentals.penmenstudios.com';

export const getOptimizedImage = (url: string): string => {
  if (!url) return '';

  let actualUrl = url;
  if (url.includes('/_next/image')) {
    try {
      const parsed = new URL(url, DOMAIN);
      const inner = parsed.searchParams.get('url');
      if (inner) actualUrl = inner;
    } catch {
      // Ignore malformed wrapper URLs and continue with the original value.
    }
  }

  let finalUrl = actualUrl.startsWith('/') ? `${DOMAIN}${actualUrl}` : actualUrl;
  const hasExtension = /\.(jpe?g|png|webp|avif|gif|svg|heic)(\?.*)?$/i.test(finalUrl);
  if (!hasExtension) {
    finalUrl += `${finalUrl.includes('?') ? '&' : '?'}ext=.jpg`;
  }

  return finalUrl;
};

const transformEquipment = <T extends { imageUrls?: string[]; mainImageUrl?: string | null }>(equipment: T): T => {
  const fallbackUrls =
    equipment.imageUrls && equipment.imageUrls.length > 0
      ? equipment.imageUrls
      : equipment.mainImageUrl
        ? [equipment.mainImageUrl]
        : [];

  return {
    ...equipment,
    imageUrls: fallbackUrls.map((url) => getOptimizedImage(url)),
    mainImageUrl: equipment.mainImageUrl ? getOptimizedImage(equipment.mainImageUrl) : undefined,
  };
};

export const fetchCategories = async (cacheBustParam = ''): Promise<Category[]> => {
  const response = await fetchWithTimeout(`${API_BASE}/categories${cacheBustParam}`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};

export const fetchAllEquipment = async (categoryId?: number): Promise<Equipment[]> => {
  let url = `${API_BASE}/equipment`;
  if (categoryId) url += `?categoryId=${categoryId}`;
  const response = await fetchWithTimeout(url);
  if (!response.ok) throw new Error('Failed to fetch equipment');
  const items: Equipment[] = await response.json();
  return items.map(transformEquipment);
};

export const fetchEquipmentDetails = async (slug: string): Promise<Equipment> => {
  const response = await fetchWithTimeout(`${API_BASE}/equipment/${slug}`);
  if (!response.ok) throw new Error('Failed to fetch equipment details');
  const item: Equipment = await response.json();
  return transformEquipment(item);
};

export const fetchBrands = async (): Promise<string[]> => {
  const response = await fetchWithTimeout(`${API_BASE}/brands`);
  if (!response.ok) throw new Error('Failed to fetch brands');
  return response.json();
};

export const fetchEquipmentByBrand = async (brandSlug: string): Promise<Equipment[]> => {
  const response = await fetchWithTimeout(`${API_BASE}/brands/${encodeURIComponent(brandSlug)}`);
  if (!response.ok) throw new Error('Failed to fetch equipment for brand');
  const items: Equipment[] = await response.json();
  return items.map(transformEquipment);
};

export interface HomeEquipmentItem {
  id: number;
  name: string;
  slug: string;
  brand: string | null;
  dailyRate: string | number;
  status: string;
  mainImageUrl: string | null;
  imageUrls: string[];
  customImageUrl?: string | null;
}

export interface HomeCategoryItem {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  customImageUrl?: string | null;
}

export interface HomeBrandItem {
  brand: string;
  imageUrl: string | null;
  customImageUrl?: string | null;
}

interface HomeSectionBase {
  id: number;
  key: string;
  title: string;
  subtitle: string | null;
  displayOrder: number;
}

export type HomeSection =
  | (HomeSectionBase & {
      type: 'hero';
      items: HomeEquipmentItem[];
    })
  | (HomeSectionBase & {
      type: 'equipment_carousel';
      items: HomeEquipmentItem[];
    })
  | (HomeSectionBase & {
      type: 'kit_grid';
      items: HomeEquipmentItem[];
    })
  | (HomeSectionBase & {
      type: 'category_strip';
      items: HomeCategoryItem[];
    })
  | (HomeSectionBase & {
      type: 'brand_strip';
      items: HomeBrandItem[];
    });

function isHomeEquipmentItem(value: any): value is HomeEquipmentItem {
  return Boolean(value && value.id != null && typeof value.name === 'string');
}

function isHomeCategoryItem(value: any): value is HomeCategoryItem {
  return Boolean(value && value.id != null && typeof value.name === 'string');
}

function isHomeBrandItem(value: any): value is HomeBrandItem {
  return Boolean(value && typeof value.brand === 'string' && value.brand.trim().length > 0);
}

function normalizeHomeSection(section: any): HomeSection | null {
  if (!section || typeof section !== 'object') return null;
  if (typeof section.id !== 'number' || typeof section.key !== 'string' || typeof section.title !== 'string') {
    return null;
  }

  const baseSection = {
    id: section.id,
    key: section.key,
    title: section.title,
    subtitle: typeof section.subtitle === 'string' ? section.subtitle : null,
    displayOrder: typeof section.displayOrder === 'number' ? section.displayOrder : 0,
  };

  if (section.type === 'hero' || section.type === 'equipment_carousel' || section.type === 'kit_grid') {
    const items = Array.isArray(section.items)
      ? section.items.filter(isHomeEquipmentItem).map(transformEquipment)
      : [];

    return items.length > 0 ? { ...baseSection, type: section.type, items } : null;
  }

  if (section.type === 'category_strip') {
    const items = Array.isArray(section.items) ? section.items.filter(isHomeCategoryItem) : [];
    return items.length > 0 ? { ...baseSection, type: section.type, items } : null;
  }

  if (section.type === 'brand_strip') {
    const items = Array.isArray(section.items) ? section.items.filter(isHomeBrandItem) : [];
    return items.length > 0 ? { ...baseSection, type: section.type, items } : null;
  }

  return null;
}

export const fetchHomeSections = async (cacheBustParam = ''): Promise<HomeSection[]> => {
  const response = await fetchWithTimeout(`${API_BASE}/mobile/homepage${cacheBustParam}`);
  if (!response.ok) throw new Error('Failed to fetch home sections');

  const sections: any[] = await response.json();
  return sections
    .map(normalizeHomeSection)
    .filter((section): section is HomeSection => Boolean(section));
};
