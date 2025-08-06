import { generateOrganizationSchema, generateProductSchema, generateLocalBusinessSchema } from "@/lib/seo-config"
import type { Equipment } from "@/lib/types"

export function OrganizationSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateOrganizationSchema()),
      }}
    />
  )
}

export function LocalBusinessSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateLocalBusinessSchema()), // Use the function from seo-config
      }}
    />
  )
}

export function ProductSchema({ equipment }: { equipment: Equipment }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateProductSchema(equipment)),
      }}
    />
  )
}
