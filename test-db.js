const { neon } = require('@neondatabase/serverless');
const sql = neon('postgresql://neondb_owner:npg_D9f8ORezlVrK@ep-fragrant-sky-a1wacf0n-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require');

async function test() {
  try {
    const res = await sql`SELECT equipment_id, count(*) as c FROM equipment_images GROUP BY equipment_id HAVING count(*) > 0 LIMIT 10`;
    console.log(JSON.stringify(res, null, 2));

    const totalImages = await sql`SELECT count(*) as total FROM equipment_images`;
    console.log("Total images in DB:", totalImages[0].total);
    
    // Let's get an example item's images
    const singleEq = await sql`SELECT image_url FROM equipment_images WHERE equipment_id = 9`;
    console.log("Images for equipment_id 9:", JSON.stringify(singleEq, null, 2));
  } catch (err) {
    console.error("DB Error:", err);
  }
}
test();
