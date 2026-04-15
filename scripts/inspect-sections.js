const { neon } = require("@neondatabase/serverless");

const DB_URL = "postgresql://neondb_owner:npg_D9f8ORezlVrK@ep-fragrant-sky-a1wacf0n-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function main() {
  const sql = neon(DB_URL);

  const cats = await sql`SELECT id, name FROM equipment_categories ORDER BY id LIMIT 20`;
  console.log("CATEGORIES:", JSON.stringify(cats, null, 2));

  const eq = await sql`SELECT id, name, brand, slug, status, featured, daily_rate FROM equipment ORDER BY id LIMIT 30`;
  console.log("EQUIPMENT:", JSON.stringify(eq, null, 2));

  const sections = await sql`SELECT * FROM homepage_sections ORDER BY display_order`;
  console.log("SECTIONS:", JSON.stringify(sections, null, 2));

  const items = await sql`SELECT * FROM section_items ORDER BY section_id, display_order`;
  console.log("ITEMS:", JSON.stringify(items, null, 2));
}

main().catch(console.error);
