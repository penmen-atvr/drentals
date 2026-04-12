import { db } from '../lib/db';
import { homepageSections, sectionItems } from '../lib/db/schema';
import { eq, asc } from 'drizzle-orm';

async function main() {
  const sections = await db.query.homepageSections.findMany({
    where: eq(homepageSections.isActive, true),
    orderBy: [asc(homepageSections.displayOrder)],
    with: {
      items: {
        orderBy: [asc(sectionItems.displayOrder)],
        with: {
          equipment: {
            with: { images: true }
          },
          category: true
        }
      }
    }
  });
  console.log(JSON.stringify(sections, null, 2));
  process.exit(0);
}
main();
