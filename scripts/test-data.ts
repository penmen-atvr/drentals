import { asc, eq } from 'drizzle-orm';
import { db } from '../lib/db';
import {
  mobileHomeSectionBrandItems,
  mobileHomeSectionCategoryItems,
  mobileHomeSectionEquipmentItems,
  mobileHomeSections,
} from '../lib/db/schema';

async function main() {
  const sections = await db.query.mobileHomeSections.findMany({
    where: eq(mobileHomeSections.isActive, true),
    orderBy: [asc(mobileHomeSections.displayOrder)],
    with: {
      equipmentItems: {
        orderBy: [asc(mobileHomeSectionEquipmentItems.displayOrder)],
        with: {
          equipment: {
            with: { images: true },
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

  console.log(JSON.stringify(sections, null, 2));
  process.exit(0);
}

main();
