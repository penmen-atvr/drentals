import { db } from "../lib/db";
import { mobileHomeSectionBrandItems, mobileHomeSections } from "../lib/db/schema";
import { eq } from "drizzle-orm";

async function check() {
  const items = await db.query.mobileHomeSectionBrandItems.findMany({
    with: { section: true }
  });
  console.log("ALL ROWS IN mobile_home_section_brand_items:");
  console.log(items.map(i => ({ brand: i.brand, displayOrder: i.displayOrder, customImage: i.customImageUrl })));
}

check().then(() => process.exit(0)).catch(console.error);
