import { blogPosts } from './blog-posts-data'
import { db, equipment, equipmentCategories, equipmentImages } from "./db"
import { cache } from "react"
import type { Category, Equipment, EquipmentImage, BlogPost } from "./types"
import { eq, and, or, desc, sql as drizzleSql } from "drizzle-orm"
import { resolveImageUrl, buildEquipmentImageUrls } from "./image-utils"

export const getCategories = cache(async (): Promise<Category[]> => {
  return await db.query.equipmentCategories.findMany({
    orderBy: [equipmentCategories.name]
  }) as Category[]
})

export const getFeaturedEquipment = cache(async (): Promise<Equipment[]> => {
  const result = await db.query.equipment.findMany({
    where: eq(equipment.featured, true),
    with: {
      category: true,
      images: true,
    },
    orderBy: [equipment.name]
  })

  // Map to align with the Equipment type if necessary (e.g., category_name)
  const formattedResult = result.map(item => ({
    ...item,
    categoryName: item.category?.name,
    imageUrls: buildEquipmentImageUrls(item)
  }))

  return formattedResult as unknown as Equipment[]
})

export const getAllEquipment = cache(async (categoryId?: number, isKit?: boolean, searchQuery?: string): Promise<Equipment[]> => {
  const whereConditions = []
  if (categoryId) whereConditions.push(eq(equipment.categoryId, categoryId))
  if (isKit !== undefined) whereConditions.push(eq(equipment.isKit, isKit))
  
  if (searchQuery) {
    const searchTokens = searchQuery.trim().split(/\s+/).filter(Boolean)
    
    if (searchTokens.length > 0) {
      const tokenConditions = searchTokens.map(token => {
        const searchParam = `%${token}%`
        return or(
          drizzleSql`${equipment.name} ILIKE ${searchParam}`,
          drizzleSql`${equipment.brand} ILIKE ${searchParam}`,
          drizzleSql`${equipment.description} ILIKE ${searchParam}`
        )
      })
      
      whereConditions.push(and(...tokenConditions.filter(Boolean)))
    }
  }

  const result = await db.query.equipment.findMany({
    where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
    with: {
      category: true,
      images: true,
    },
    orderBy: [equipment.name]
  })

  return result.map(item => ({
    ...item,
    categoryName: item.category?.name,
    imageUrls: buildEquipmentImageUrls(item)
  })) as unknown as Equipment[]
})

export interface GetEquipmentOptions {
  categoryId?: number;
  isKit?: boolean;
  searchQuery?: string;
  brand?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export const getEquipmentPaginated = cache(async (options: GetEquipmentOptions): Promise<{ data: Equipment[], total: number }> => {
  const { categoryId, isKit, searchQuery, brand, sort, page = 1, limit = 12 } = options;
  const offset = (page - 1) * limit;

  const whereConditions = []
  if (categoryId) whereConditions.push(eq(equipment.categoryId, categoryId))
  if (isKit !== undefined) whereConditions.push(eq(equipment.isKit, isKit))
  if (brand) whereConditions.push(eq(equipment.brand, brand))
  
  if (searchQuery) {
    const searchTokens = searchQuery.trim().split(/\s+/).filter(Boolean)
    if (searchTokens.length > 0) {
      const tokenConditions = searchTokens.map(token => {
        const searchParam = `%${token}%`
        return or(
          drizzleSql`${equipment.name} ILIKE ${searchParam}`,
          drizzleSql`${equipment.brand} ILIKE ${searchParam}`,
          drizzleSql`${equipment.description} ILIKE ${searchParam}`
        )
      })
      whereConditions.push(and(...tokenConditions.filter(Boolean)))
    }
  }

  const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined

  let orderByClause = [equipment.name] as any[]; // default 'name_asc'
  if (sort === 'price_asc') orderByClause = [equipment.dailyRate];
  if (sort === 'price_desc') orderByClause = [desc(equipment.dailyRate)];
  if (sort === 'name_asc') orderByClause = [equipment.name];

  const result = await db.query.equipment.findMany({
    where: whereClause,
    with: { category: true, images: true },
    orderBy: orderByClause,
    limit: limit,
    offset: offset,
  })

  // To get the total count for true pagination mathematics
  const countResult = await db.select({ count: drizzleSql<number>`count(*)` }).from(equipment).where(whereClause);
  const total = Number(countResult[0]?.count || 0);

  const data = result.map(item => ({
    ...item,
    categoryName: item.category?.name,
    imageUrls: buildEquipmentImageUrls(item)
  })) as unknown as Equipment[];

  return { data, total };
})

export const getEquipmentById = cache(async (id: number): Promise<Equipment | undefined> => {
  const item = await db.query.equipment.findFirst({
    where: eq(equipment.id, id),
    with: {
      category: true,
      images: true,
      kitComponents: {
        with: {
          item: true
        }
      }
    }
  })

  if (!item) return undefined

  return {
    ...item,
    categoryName: item.category?.name,
    imageUrls: buildEquipmentImageUrls(item)
  } as unknown as Equipment
})

export const getEquipmentBySlug = cache(async (slug: string): Promise<Equipment | undefined> => {
  const numericId = parseInt(slug, 10);
  const isValidId = !isNaN(numericId);

  const item = await db.query.equipment.findFirst({
    where: isValidId 
      ? or(eq(equipment.slug, slug), eq(equipment.id, numericId))
      : eq(equipment.slug, slug),
    with: {
      category: true,
      images: true,
      kitComponents: {
        with: {
          item: true
        }
      }
    }
  })

  if (!item) return undefined

  return {
    ...item,
    categoryName: item.category?.name,
    imageUrls: buildEquipmentImageUrls(item)
  } as unknown as Equipment
})

export const getEquipmentImages = cache(async (equipmentId: number): Promise<EquipmentImage[]> => {
  return await db.query.equipmentImages.findMany({
    where: eq(equipmentImages.equipmentId, equipmentId),
    orderBy: [equipmentImages.displayOrder]
  }) as EquipmentImage[]
})

export const getEquipmentByBrand = cache(async (brand: string): Promise<Equipment[]> => {
  const result = await db.query.equipment.findMany({
    where: drizzleSql`${equipment.brand} ILIKE ${`%${brand}%`}`,
    with: {
      category: true,
      images: true,
    },
    orderBy: [equipment.name]
  })

  return result.map(item => ({
    ...item,
    categoryName: item.category?.name,
    imageUrls: buildEquipmentImageUrls(item)
  })) as unknown as Equipment[]
})

export const getAllBrands = cache(async (): Promise<string[]> => {
  const result = await db.selectDistinct({ brand: equipment.brand })
    .from(equipment)
    .where(drizzleSql`${equipment.brand} IS NOT NULL AND ${equipment.brand} != ''`)
    .orderBy(equipment.brand)

  return result.map(r => r.brand!)
})

export const getPopularEquipmentForArea = cache(async (limit = 4): Promise<Equipment[]> => {
  const result = await db.query.equipment.findMany({
    where: or(eq(equipment.featured, true), eq(equipment.status, 'available')),
    with: {
      category: true,
      images: true,
    },
    orderBy: [desc(equipment.dailyRate)],
    limit: limit
  })

  return result.map(item => ({
    ...item,
    categoryName: item.category?.name,
    imageUrls: buildEquipmentImageUrls(item)
  })) as unknown as Equipment[]
})

export const getRelatedEquipment = cache(
  async (currentEquipmentId: number, categoryId: number, limit = 4): Promise<Equipment[]> => {
    const result = await db.query.equipment.findMany({
      where: and(eq(equipment.categoryId, categoryId), drizzleSql`${equipment.id} != ${currentEquipmentId}`),
      with: {
        category: true
      },
      orderBy: [drizzleSql`RANDOM()`],
      limit: limit
    })

    return result.map(item => ({
      ...item,
      categoryName: item.category?.name
    })) as unknown as Equipment[]
  },
)

export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
  return blogPosts
})

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPost | undefined> => {
  const posts = await getBlogPosts()
  return posts.find((post) => post.slug === slug)
})

