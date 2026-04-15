const { Client } = require('pg');

const c = new Client({
  connectionString: 'postgresql://neondb_owner:npg_D9f8ORezlVrK@ep-fragrant-sky-a1wacf0n-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await c.connect();

  const tables = await c.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name"
  );
  console.log('=== TABLES ===');
  console.log(tables.rows.map(r => r.table_name).join(', '));

  const sections = await c.query('SELECT id, key, title, type, is_active, display_order FROM mobile_home_sections ORDER BY display_order');
  console.log('\n=== mobile_home_sections ===');
  console.log(JSON.stringify(sections.rows, null, 2));

  const eqItems = await c.query('SELECT section_id, equipment_id, display_order FROM mobile_home_section_equipment_items ORDER BY section_id, display_order');
  console.log('\n=== mobile_home_section_equipment_items ===');
  console.log(JSON.stringify(eqItems.rows, null, 2));

  const catItems = await c.query('SELECT section_id, category_id, display_order FROM mobile_home_section_category_items ORDER BY section_id, display_order');
  console.log('\n=== mobile_home_section_category_items ===');
  console.log(JSON.stringify(catItems.rows, null, 2));

  const brandItems = await c.query('SELECT section_id, brand, display_order FROM mobile_home_section_brand_items ORDER BY section_id, display_order');
  console.log('\n=== mobile_home_section_brand_items ===');
  console.log(JSON.stringify(brandItems.rows, null, 2));

  await c.end();
}

main().catch(e => { console.error('ERROR:', e.message); c.end(); });
