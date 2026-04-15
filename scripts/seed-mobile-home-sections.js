const { neon } = require('@neondatabase/serverless');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf-8');
const dbUrlMatch = envFile.match(/DATABASE_URL=(.+)/);
const dbUrl = dbUrlMatch ? dbUrlMatch[1].trim() : process.env.DATABASE_URL;

const sql = neon(dbUrl);

async function main() {
  console.log("Starting DB seed for mobile home sections...");

  try {
    // Clean up existing sections
    console.log("Cleaning up existing sections...");
    await sql`DELETE FROM mobile_home_sections`;

    // 1. Hero
    console.log("Seeding Hero...");
    let hero = await sql`
      INSERT INTO mobile_home_sections (key, title, subtitle, type, display_order)
      VALUES ('home_hero', 'Discover Premium Gear', 'Rent the best cameras and lenses', 'hero', 0)
      RETURNING id
    `;
    let heroId = hero[0].id;
    
    let equip = await sql`SELECT id FROM equipment WHERE status = 'available' LIMIT 5`;
    for(let i=0; i<equip.length; i++) {
        await sql`INSERT INTO mobile_home_section_equipment_items (section_id, equipment_id, display_order) VALUES (${heroId}, ${equip[i].id}, ${i})`;
    }

    // 2. Category Strip
    console.log("Seeding Category Strip...");
    let catStrip = await sql`
      INSERT INTO mobile_home_sections (key, title, type, display_order)
      VALUES ('browse_categories', 'Browse By Category', 'category_strip', 1)
      RETURNING id
    `;
    let catStripId = catStrip[0].id;
    
    let cats = await sql`SELECT id FROM equipment_categories LIMIT 5`;
    for(let i=0; i<cats.length; i++) {
        await sql`INSERT INTO mobile_home_section_category_items (section_id, category_id, display_order) VALUES (${catStripId}, ${cats[i].id}, ${i})`;
    }

    // 3. Equipment Carousel
    console.log("Seeding Equipment Carousel...");
    let eqCarousel = await sql`
      INSERT INTO mobile_home_sections (key, title, type, display_order)
      VALUES ('trending_gear', 'Trending Gear', 'equipment_carousel', 2)
      RETURNING id
    `;
    let eqCarouselId = eqCarousel[0].id;
    
    let moreEq = await sql`SELECT id FROM equipment WHERE status = 'available' ORDER BY created_at DESC LIMIT 6`;
    for(let i=0; i<moreEq.length; i++) {
        await sql`INSERT INTO mobile_home_section_equipment_items (section_id, equipment_id, display_order) VALUES (${eqCarouselId}, ${moreEq[i].id}, ${i})`;
    }

    // 4. Brand Strip
    console.log("Seeding Brand Strip...");
    let brandStrip = await sql`
      INSERT INTO mobile_home_sections (key, title, type, display_order)
      VALUES ('top_brands', 'Top Brands', 'brand_strip', 3)
      RETURNING id
    `;
    let brandStripId = brandStrip[0].id;
    
    let brands = ['Sony', 'Canon', 'RED', 'ARRI', 'DJI'];
    for(let i=0; i<brands.length; i++) {
        await sql`INSERT INTO mobile_home_section_brand_items (section_id, brand, display_order) VALUES (${brandStripId}, ${brands[i]}, ${i})`;
    }

    // 5. Kit Grid
    console.log("Seeding Kit Grid...");
    let kitGrid = await sql`
      INSERT INTO mobile_home_sections (key, title, subtitle, type, display_order)
      VALUES ('production_kits', 'Production Kits', 'Everything you need in one bundle', 'kit_grid', 4)
      RETURNING id
    `;
    let kitGridId = kitGrid[0].id;
    
    let kits = await sql`SELECT id FROM equipment WHERE is_kit = true LIMIT 4`;
    // If no kits found, we just do nothing for items, we've inserted the section at least
    for(let i=0; i<kits.length; i++) {
        await sql`INSERT INTO mobile_home_section_equipment_items (section_id, equipment_id, display_order) VALUES (${kitGridId}, ${kits[i].id}, ${i})`;
    }

    console.log("Seed complete!");
  } catch (err) {
    console.error("Migration failed:", err);
  }
}

main();
