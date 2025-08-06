import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  // Base URL for the site
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rentals.penmenstudios.com"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
