import { NextRequest } from 'next/server';
import { getFeaturedEquipment, getEquipmentByBrand, getPopularEquipmentForArea, getEquipmentPaginated } from '@/lib/data';
import { corsOptions, corsJson, corsError } from '@/lib/cors';

export async function OPTIONS() {
  return corsOptions();
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const categoryId = searchParams.get('categoryId');
  const featured = searchParams.get('featured');
  const brand = searchParams.get('brand');
  const popular = searchParams.get('popular');
  const isKit = searchParams.get('isKit');

  const page = searchParams.get('page');
  const limit = searchParams.get('limit');
  const sort = searchParams.get('sort');
  const q = searchParams.get('q');

  const pageNum = page ? parseInt(page) : 1;
  const limitNum = limit ? parseInt(limit) : 12;

  try {
    // Legacy static fetches (should ideally be migrated to the unified paginated engine in the future)
    if (featured === 'true') {
      const result = await getFeaturedEquipment();
      return corsJson({ data: result, hasNextPage: false }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
    } else if (brand && !page && !sort) {
      // Legacy exact brand fetch
      const result = await getEquipmentByBrand(brand);
      return corsJson({ data: result, hasNextPage: false }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
    } else if (popular === 'true') {
      const result = await getPopularEquipmentForArea(10);
      return corsJson({ data: result, hasNextPage: false }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
    }

    // Unified Paginated Fetch
    const result = await getEquipmentPaginated({
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      isKit: isKit ? isKit === 'true' : undefined,
      brand: brand || undefined,
      searchQuery: q || undefined,
      sort: sort || undefined,
      page: pageNum,
      limit: limitNum
    });

    const hasNextPage = (pageNum * limitNum) < result.total;

    return corsJson({ data: result.data, hasNextPage }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
  } catch (error) {
    console.error('Error fetching equipment API:', error);
    return corsError('Failed to fetch equipment', 500);
  }
}
