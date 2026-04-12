import { Category, Equipment } from './types';

export const API_BASE = 'https://rentals.penmenstudios.com/api';

// Wrapper that applies a timeout to any fetch call
async function fetchWithTimeout(url: string, timeoutMs = 10000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

export const getOptimizedImage = (url: string, _width: number = 1080): string => {
  if (!url) return '';
  const domain = 'https://rentals.penmenstudios.com';
  
  // Strip any existing /_next/image wrapper and return the direct URL
  // React Native doesn't benefit from Next.js image optimization (web-only)
  let actualUrl = url;
  if (url.includes('/_next/image')) {
    try {
      // Create a dummy base if url is relative, just to parse search params
      const parsed = new URL(url, domain);
      const inner = parsed.searchParams.get('url');
      if (inner) {
        actualUrl = inner;
      }
    } catch {
      // Continue with original url if parsing fails
    }
  }

  // Resolve relative paths to absolute URLs
  let finalUrl = actualUrl.startsWith('/') ? `${domain}${actualUrl}` : actualUrl;
  
  // React Native's Image decoders (especially Glide on Android) sometimes fail 
  // silently if a URL doesn't end in a standard image extension, even if the 
  // server returns the correct mime type. 
  // We append a dummy query parameter to help it recognize the image type.
  const hasExtension = /\.(jpe?g|png|webp|avif|gif|svg|HEIC)(\?.*)?$/i.test(finalUrl);
  if (!hasExtension) {
    // We default to jpg, but since we are trusting the server's Content-Type, 
    // the actual dummy extension type here doesn't matter much as long as it's an image extension
    finalUrl += (finalUrl.includes('?') ? '&' : '?') + 'ext=.jpg';
  }

  return finalUrl;
};

const transformEquipment = (eq: Equipment): Equipment => {
  // If imageUrls is empty but we have a mainImageUrl, use it as fallback
  const fallbackUrls = eq.imageUrls && eq.imageUrls.length > 0 
    ? eq.imageUrls 
    : (eq.mainImageUrl ? [eq.mainImageUrl] : []);
    
  return {
    ...eq,
    imageUrls: fallbackUrls.map(u => getOptimizedImage(u, 1080)),
    mainImageUrl: eq.mainImageUrl ? getOptimizedImage(eq.mainImageUrl, 1080) : undefined
  };
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetchWithTimeout(`${API_BASE}/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};

export const fetchFeaturedEquipment = async (): Promise<Equipment[]> => {
  const response = await fetchWithTimeout(`${API_BASE}/equipment?featured=true`);
  if (!response.ok) throw new Error('Failed to fetch featured equipment');
  const items: Equipment[] = await response.json();
  return items.map(transformEquipment);
};

export const fetchAllEquipment = async (categoryId?: number): Promise<Equipment[]> => {
  let url = `${API_BASE}/equipment`;
  if (categoryId) {
    url += `?categoryId=${categoryId}`;
  }
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

export const fetchPopularEquipment = async (): Promise<Equipment[]> => {
  const response = await fetchWithTimeout(`${API_BASE}/popular`);
  if (!response.ok) throw new Error('Failed to fetch popular equipment');
  const items: Equipment[] = await response.json();
  return items.map(transformEquipment);
};

export interface HomepageSection {
  id: number;
  title: string;
  type: 'hero' | 'carousel';
  displayOrder: number;
  items: Equipment[];
}

export const fetchHomepageSections = async (): Promise<HomepageSection[]> => {
  const response = await fetchWithTimeout(`${API_BASE}/mobile/homepage`);
  if (!response.ok) throw new Error('Failed to fetch homepage sections');
  const sections: HomepageSection[] = await response.json();
  return sections.map((section) => ({
    ...section,
    items: section.items.map(transformEquipment),
  }));
};

