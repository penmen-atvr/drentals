import { NextResponse } from "next/server";
import { and, asc, desc, eq, sql as drizzleSql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  equipment,
  equipmentCategories,
  mobileHomeSectionBrandItems,
  mobileHomeSectionCategoryItems,
  mobileHomeSectionEquipmentItems,
  mobileHomeSections,
} from "@/lib/db/schema";
import { buildEquipmentImageUrls, resolveImageUrl } from "@/lib/image-utils";

export const dynamic = "force-dynamic";

type EquipmentPayload = {
  id: number;
  name: string;
  slug: string;
  brand: string | null;
  dailyRate: string | number;
  status: string;
  mainImageUrl: string | null;
  imageUrls: string[];
};

type CategoryPayload = {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
};

type BrandPayload = {
  brand: string;
  imageUrl: string | null;
};

type HomeSection =
  | {
      id: number;
      key: string;
      title: string;
      subtitle: string | null;
      type: "hero" | "equipment_carousel" | "kit_grid";
      displayOrder: number;
      items: Array<EquipmentPayload & { customImageUrl?: string | null }>;
    }
  | {
      id: number;
      key: string;
      title: string;
      subtitle: string | null;
      type: "category_strip";
      displayOrder: number;
      items: Array<CategoryPayload & { customImageUrl?: string | null }>;
    }
  | {
      id: number;
      key: string;
      title: string;
      subtitle: string | null;
      type: "brand_strip";
      displayOrder: number;
      items: Array<BrandPayload & { customImageUrl?: string | null }>;
    };

function toEquipmentPayload(item: {
  id: number;
  name: string;
  slug: string | null;
  brand: string | null;
  dailyRate: string | number;
  status: string;
  mainImageUrl: string | null;
  images?: { imageUrl: string }[];
}) {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug ?? String(item.id),
    brand: item.brand,
    dailyRate: item.dailyRate,
    status: item.status,
    mainImageUrl: resolveImageUrl(item.mainImageUrl),
    imageUrls: buildEquipmentImageUrls(item),
  };
}

async function buildFallbackSections(): Promise<HomeSection[]> {
  const [heroItems, featuredItems, kitItems, categories, brands] = await Promise.all([
    db.query.equipment.findMany({
      where: eq(equipment.status, "available"),
      with: { images: true },
      orderBy: [desc(equipment.featured), desc(equipment.dailyRate)],
      limit: 4,
    }),
    db.query.equipment.findMany({
      where: and(eq(equipment.featured, true), eq(equipment.status, "available")),
      with: { images: true },
      orderBy: [desc(equipment.updatedAt)],
      limit: 10,
    }),
    db.query.equipment.findMany({
      where: and(eq(equipment.isKit, true), eq(equipment.status, "available")),
      with: { images: true },
      orderBy: [desc(equipment.updatedAt)],
      limit: 6,
    }),
    db.query.equipmentCategories.findMany({
      orderBy: [equipmentCategories.name],
      limit: 12,
    }),
    db
      .selectDistinct({ brand: equipment.brand })
      .from(equipment)
      .where(drizzleSql`${equipment.brand} IS NOT NULL AND ${equipment.brand} != ''`)
      .orderBy(equipment.brand)
      .limit(12),
  ]);

  const sections: HomeSection[] = [];

  if (heroItems.length > 0) {
    sections.push({
      id: -1,
      key: "fallback-hero",
      title: "Featured Gear",
      subtitle: "Always available from your latest catalog",
      type: "hero",
      displayOrder: 0,
      items: heroItems.map((item) => ({ ...toEquipmentPayload(item), customImageUrl: null })),
    });
  }

  if (featuredItems.length > 0) {
    sections.push({
      id: -2,
      key: "fallback-featured",
      title: "Popular Picks",
      subtitle: "Curated from featured inventory",
      type: "equipment_carousel",
      displayOrder: 1,
      items: featuredItems.map((item) => ({ ...toEquipmentPayload(item), customImageUrl: null })),
    });
  }

  if (categories.length > 0) {
    sections.push({
      id: -3,
      key: "fallback-categories",
      title: "Browse by Category",
      subtitle: "Jump straight into the gear you need",
      type: "category_strip",
      displayOrder: 2,
      items: categories.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        imageUrl: null,
        customImageUrl: null,
      })),
    });
  }

  if (brands.length > 0) {
    sections.push({
      id: -4,
      key: "fallback-brands",
      title: "Brands We Stock",
      subtitle: "Explore gear by manufacturer",
      type: "brand_strip",
      displayOrder: 3,
      items: brands
        .map((entry) => entry.brand)
        .filter((brand): brand is string => Boolean(brand))
        .map((brand) => ({
          brand,
          imageUrl: null,
          customImageUrl: null,
        })),
    });
  }

  if (kitItems.length > 0) {
    sections.push({
      id: -5,
      key: "fallback-kits",
      title: "Ready-to-Rent Kits",
      subtitle: "Bundles that ship together cleanly",
      type: "kit_grid",
      displayOrder: 4,
      items: kitItems.map((item) => ({ ...toEquipmentPayload(item), customImageUrl: null })),
    });
  }

  return sections;
}

export async function GET() {
  try {
    const sections = await db.query.mobileHomeSections.findMany({
      where: eq(mobileHomeSections.isActive, true),
      orderBy: [asc(mobileHomeSections.displayOrder)],
      with: {
        equipmentItems: {
          orderBy: [asc(mobileHomeSectionEquipmentItems.displayOrder)],
          with: {
            equipment: {
              with: {
                images: true,
              },
            },
          },
        },
        categoryItems: {
          orderBy: [asc(mobileHomeSectionCategoryItems.displayOrder)],
          with: {
            category: true,
          },
        },
        brandItems: {
          orderBy: [asc(mobileHomeSectionBrandItems.displayOrder)],
        },
      },
    });

    const response = sections
      .map<HomeSection | null>((section) => {
        const baseSection = {
          id: section.id,
          key: section.key,
          title: section.title,
          subtitle: section.subtitle,
          displayOrder: section.displayOrder,
        };

        if (section.type === "hero" || section.type === "equipment_carousel" || section.type === "kit_grid") {
          const items = section.equipmentItems
            .filter((item) => Boolean(item.equipment))
            .filter((item) => item.equipment!.status === "available")
            .map((item) => ({
              ...toEquipmentPayload(item.equipment!),
              customImageUrl: resolveImageUrl(item.customImageUrl),
            }));

          if (items.length === 0) return null;
          return { ...baseSection, type: section.type, items };
        }

        if (section.type === "category_strip") {
          const items = section.categoryItems
            .map((item) => ({
              id: item.category.id,
              name: item.category.name,
              description: item.category.description,
              imageUrl: null,
              customImageUrl: resolveImageUrl(item.customImageUrl),
            }));

          if (items.length === 0) return null;
          return { ...baseSection, type: section.type, items };
        }

        if (section.type === "brand_strip") {
          const items = section.brandItems
            .map((item) => ({
              brand: item.brand.trim(),
              imageUrl: null,
              customImageUrl: resolveImageUrl(item.customImageUrl),
            }))
            .filter((item) => item.brand.length > 0);

          if (items.length === 0) return null;
          return { ...baseSection, type: section.type, items };
        }

        return null;
      })
      .filter((section): section is HomeSection => Boolean(section));

    const payload = response.length > 0 ? response : await buildFallbackSections();

    return NextResponse.json(payload);
  } catch (error) {
    console.error("[/api/mobile/homepage] Error:", error);

    try {
      const fallback = await buildFallbackSections();
      return NextResponse.json(fallback);
    } catch (fallbackError) {
      console.error("[/api/mobile/homepage] Fallback Error:", fallbackError);
      return NextResponse.json(
        { error: "Failed to load homepage" },
        { status: 500 }
      );
    }
  }
}
