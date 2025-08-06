/**
 * Meta description utility functions for consistent SEO optimization
 */

// Maximum recommended length for meta descriptions
const MAX_META_DESCRIPTION_LENGTH = 160

// Base descriptions for different page types
const baseDescriptions = {
  home: "Rent professional cinema cameras, DSLRs, 4K cameras, lenses, and accessories in Hyderabad. Serving Kukatpally, Dilsukhnagar and all areas with quality equipment.",
  equipment:
    "Browse our extensive collection of professional cinema equipment available for rent in Hyderabad. Find cameras, lenses, lighting, and audio gear for your production.",
  equipmentDetail:
    "Rent the {name} from D'RENTALS in Hyderabad. Professional {category} with flexible rental periods and delivery options. Book now!",
  category:
    "Rent professional {category} equipment in Hyderabad. Browse our selection of {category} gear available for daily, weekly, or monthly rental.",
  brand:
    "Rent {brand} cinema equipment in Hyderabad. Professional {brand} cameras, lenses, and accessories with delivery across Telangana.",
  area: "Camera rental services in {area}, Hyderabad. Professional cinema equipment delivered to your location with flexible rental options.",
  about:
    "Learn about D'RENTALS by Penmen Studios, Hyderabad's premier camera rental service. Professional cinema equipment for filmmakers and content creators.",
  contact:
    "Contact D'RENTALS for camera and equipment rental inquiries in Hyderabad. Get in touch for availability, pricing, and delivery information.",
}

/**
 * Truncates a description to the recommended length while maintaining complete sentences
 */
export function truncateDescription(description: string): string {
  if (description.length <= MAX_META_DESCRIPTION_LENGTH) {
    return description
  }

  // Try to find a sentence break near the max length
  const truncated = description.substring(0, MAX_META_DESCRIPTION_LENGTH)
  const lastPeriod = truncated.lastIndexOf(".")
  const lastQuestion = truncated.lastIndexOf("?")
  const lastExclamation = truncated.lastIndexOf("!")

  // Find the last sentence break
  const lastBreak = Math.max(lastPeriod, lastQuestion, lastExclamation)

  if (lastBreak > MAX_META_DESCRIPTION_LENGTH * 0.7) {
    // If we found a good break point, use it
    return description.substring(0, lastBreak + 1)
  }

  // Otherwise find the last space to avoid cutting words
  const lastSpace = truncated.lastIndexOf(" ")
  return description.substring(0, lastSpace) + "..."
}

/**
 * Generates a meta description for equipment detail pages
 */
export function generateEquipmentDescription(equipment: {
  name: string
  brand?: string | null
  category_name?: string
  description?: string | null
  daily_rate?: number
}): string {
  if (equipment.description && equipment.description.length > 50) {
    // If the equipment has a good description, use it as a base
    return truncateDescription(equipment.description)
  }

  // Otherwise, generate a description based on equipment details
  let template = baseDescriptions.equipmentDetail
  template = template.replace("{name}", `${equipment.brand || ""} ${equipment.name}`.trim())
  template = template.replace("{category}", equipment.category_name || "cinema equipment")

  // Add pricing if available
  if (equipment.daily_rate) {
    const priceInfo = ` Available from ₹${equipment.daily_rate}/day.`

    // Check if adding price info would exceed max length
    if ((template + priceInfo).length <= MAX_META_DESCRIPTION_LENGTH) {
      template += priceInfo
    }
  }

  return template
}

/**
 * Generates a meta description for category pages
 */
export function generateCategoryDescription(category: {
  name: string
  description?: string | null
}): string {
  if (category.description && category.description.length > 50) {
    // If the category has a good description, use it as a base
    return truncateDescription(category.description)
  }

  // Otherwise, use the template
  let template = baseDescriptions.category
  template = template.replace(/{category}/g, category.name)

  return template
}

/**
 * Generates a meta description for brand pages
 */
export function generateBrandDescription(brand: string): string {
  let template = baseDescriptions.brand
  template = template.replace(/{brand}/g, brand)

  return template
}

/**
 * Generates a meta description for area pages
 */
export function generateAreaDescription(area: string): string {
  let template = baseDescriptions.area
  template = template.replace("{area}", area)

  return template
}

/**
 * Enhances a description with keywords for better SEO
 */
export function enhanceWithKeywords(description: string, keywords: string[]): string {
  // Only process if we have keywords and the description isn't too long
  if (keywords.length === 0 || description.length > MAX_META_DESCRIPTION_LENGTH * 0.8) {
    return description
  }

  // Check if important keywords are already in the description
  const missingKeywords = keywords
    .filter((keyword) => !description.toLowerCase().includes(keyword.toLowerCase()))
    .slice(0, 2) // Only use up to 2 missing keywords

  if (missingKeywords.length === 0) {
    return description
  }

  // Add keywords in a natural way
  const keywordPhrase = ` Find ${missingKeywords.join(" and ")}.`

  // Check if adding keywords would exceed max length
  if ((description + keywordPhrase).length <= MAX_META_DESCRIPTION_LENGTH) {
    return description + keywordPhrase
  }

  return description
}
