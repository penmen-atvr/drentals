require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT * FROM mobile_home_section_brand_items;').then(res => {
  console.table(res.rows);
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
