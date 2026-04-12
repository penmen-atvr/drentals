import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { homepageSections, sectionItems } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

const SITE_BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://rentals.penmenstudios.com";

function resolveUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${SITE_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

function buildImageUrls(item: { mainImageUrl?: string | null; images?: { imageUrl: string }[] }): string[] {
  const fromRelation = (item.images ?? [])
    .map((img) => resolveUrl(img.imageUrl))
    .filter((u): u is string => Boolean(u));
  const fromMain = resolveUrl(item.mainImageUrl);
  const all = fromMain && !fromRelation.includes(fromMain)
    ? [...fromRelation, fromMain]
    : fromRelation;
  return all;
}

export async function GET() {
  try {
    const sections = await db.query.homepageSections.findMany({
      where: eq(homepageSections.isActive, true),
      orderBy: [asc(homepageSections.displayOrder)],
      with: {
        items: {
          orderBy: [asc(sectionItems.displayOrder)],
          with: {
            equipment: {
              with: {
                images: true,
              },
            },
            category: true,
          },
        },
      },
    });

    const response = sections.map((section) => ({
      id: section.id,
      title: section.title,
      type: section.type,
      displayOrder: section.displayOrder,
      items: section.items
        .map((si) => {
          const customImg = resolveUrl(si.customImageUrl);
          
          if (si.targetType === "equipment" && si.equipment) {
            const eq = si.equipment;
            if (eq.status !== "available") return null;
            return {
              targetType: "equipment",
              customImageUrl: customImg,
              payload: {
                id: eq.id,
                name: eq.name,
                slug: eq.slug ?? String(eq.id),
                brand: eq.brand,
                dailyRate: eq.dailyRate,
                status: eq.status,
                mainImageUrl: resolveUrl(eq.mainImageUrl),
                imageUrls: buildImageUrls(eq),
              }
            };
          }
          
          if (si.targetType === "category" && si.category) {
            return {
              targetType: "category",
              customImageUrl: customImg,
              payload: {
                categoryId: si.category.id,
                name: si.category.name,
              }
            };
          }

          if (si.targetType === "brand" && si.brand) {
            return {
              targetType: "brand",
              customImageUrl: customImg,
              payload: {
                brandName: si.brand,
                name: si.brand,
              }
            };
          }

          return null;
        })
        .filter(Boolean),
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error("[/api/mobile/homepage] Error:", error);
    return NextResponse.json({ error: "Failed to load homepage sections" }, { status: 500 });
  }
}
