import { db } from "../lib/db";
import { equipment, mobileHomeSections, mobileHomeSectionBrandItems } from "../lib/db/schema";
import { eq } from "drizzle-orm";

async function syncBrands() {
  console.log("Syncing unique brands from equipment table to mobile homepage sections...");
  const brandSection = await db.query.mobileHomeSections.findFirst({
    where: eq(mobileHomeSections.type, "brand_strip"),
  });

  if (!brandSection) {
    console.log("No active brand strip section found.");
    process.exit(0);
  }

  const existingItems = await db.query.mobileHomeSectionBrandItems.findMany({
    where: eq(mobileHomeSectionBrandItems.sectionId, brandSection.id),
  });
  const existingBrands = existingItems.map((e) => e.brand);

  const allEquipment = await db.query.equipment.findMany();
  const allBrandsInUse = [...new Set(allEquipment.map((e) => e.brand).filter((b): b is string => Boolean(b)))];

  const missingBrands = allBrandsInUse.filter((b) => !existingBrands.includes(b));
  
  if (missingBrands.length === 0) {
    console.log("All brands in inventory are already featured on the homepage!");
    process.exit(0);
  }

  const startingOrder = existingItems.length;

  for (let i = 0; i < missingBrands.length; i++) {
    const newBrand = missingBrands[i];
    await db.insert(mobileHomeSectionBrandItems).values({
      sectionId: brandSection.id,
      brand: newBrand,
      displayOrder: startingOrder + i,
    });
    console.log(`+ Added missing brand to homepage strip: ${newBrand}`);
  }

  console.log("Brand sync successfully complete!");
  process.exit(0);
}

syncBrands().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
