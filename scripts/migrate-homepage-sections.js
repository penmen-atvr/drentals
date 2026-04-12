const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf-8');
const dbUrlMatch = envFile.match(/DATABASE_URL=(.+)/);
const dbUrl = dbUrlMatch ? dbUrlMatch[1].trim() : process.env.DATABASE_URL;

const sql = neon(dbUrl);
const db = drizzle(sql);

async function main() {
  console.log("Starting DB migration for homepage sections...");

  try {
    // 1. Create tables directly if they don't exist
    await sql`
      CREATE TABLE IF NOT EXISTS homepage_sections (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        type TEXT DEFAULT 'carousel' NOT NULL,
        is_active BOOLEAN DEFAULT true NOT NULL,
        display_order INTEGER DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS section_items (
        id SERIAL PRIMARY KEY,
        section_id INTEGER REFERENCES homepage_sections(id) ON DELETE CASCADE NOT NULL,
        equipment_id INTEGER REFERENCES equipment(id) ON DELETE CASCADE NOT NULL,
        display_order INTEGER DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    console.log("Tables created/verified successfully.");

    // 2. Check if we already have data
    const existingSections = await sql`SELECT count(*) as count FROM homepage_sections`;
    if (parseInt(existingSections[0].count) > 0) {
      console.log("Sections already exist, skipping seed.");
      return;
    }

    // 3. Seed "Featured Gear" (Hero)
    const featuredSection = await sql`
      INSERT INTO homepage_sections (title, type, display_order)
      VALUES ('Featured Gear', 'hero', 0)
      RETURNING id
    `;
    const featuredId = featuredSection[0].id;

    // Get current featured gear
    const featuredItems = await sql`
      SELECT id FROM equipment WHERE featured = true AND status = 'available' LIMIT 5
    `;
    
    for (let i = 0; i < featuredItems.length; i++) {
      await sql`
        INSERT INTO section_items (section_id, equipment_id, display_order)
        VALUES (${featuredId}, ${featuredItems[i].id}, ${i})
      `;
    }

    console.log(`Seeded Featured Gear (Hero) with ${featuredItems.length} items`);

    // 4. Seed "Trending Now" (Carousel)
    const popularSection = await sql`
      INSERT INTO homepage_sections (title, type, display_order)
      VALUES ('Trending Now', 'carousel', 1)
      RETURNING id
    `;
    const popularId = popularSection[0].id;

    // Get a mix of items
    const popularItems = await sql`
      SELECT id FROM equipment WHERE status = 'available' ORDER BY updated_at DESC LIMIT 10
    `;

    for (let i = 0; i < popularItems.length; i++) {
      await sql`
        INSERT INTO section_items (section_id, equipment_id, display_order)
        VALUES (${popularId}, ${popularItems[i].id}, ${i})
      `;
    }

    console.log(`Seeded Trending Now (Carousel) with ${popularItems.length} items`);

    console.log("Migration complete!");
  } catch (err) {
    console.error("Migration failed:", err);
  }
}

main();
