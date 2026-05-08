export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false

  // Check if it's a relative URL starting with /
  if (url.startsWith("/")) return true
  
  // Check if it's a data URI
  if (url.startsWith("data:")) return true

  try {
    const parsedUrl = new URL(url)
    // Accept standard web protocols
    return ["http:", "https:", "blob:"].includes(parsedUrl.protocol)
  } catch (e) {
    return false
  }
}

/**
 * Gets a placeholder image URL with specified dimensions
 */
export function getPlaceholderImage(width = 400, height = 300): string {
  return `/placeholder.svg?height=${height}&width=${width}`
}

/**
 * Gets a safe image URL, falling back to a placeholder if needed
 */
export function getSafeImageUrl(url: string | null | undefined, width = 400, height = 300): string {
  return isValidImageUrl(url) ? url! : getPlaceholderImage(width, height)
}

const SITE_BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://rentals.penmenstudios.com'

/**
 * Resolve a relative or already-absolute image URL to an absolute URL.
 * Used by server-side API routes to ensure mobile clients receive full URLs.
 */
export function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    // Handle data URIs (base64 images)
    if (url.startsWith('data:')) {
      return url
    }
    // Handle protocol-relative URLs
    if (url.startsWith('//')) {
      return encodeURI(decodeURI(`https:${url}`))
    }
    // If it's an absolute URL, return it properly encoded
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return encodeURI(decodeURI(url))
    }
    // If it's a relative URL, attach SITE_BASE and encode it
    const fullUrl = `${SITE_BASE}${url.startsWith('/') ? '' : '/'}${url}`
    return encodeURI(decodeURI(fullUrl))
  } catch (e) {
    return url
  }
}

/**
 * Build a deduplicated, ordered imageUrls array for an equipment item.
 * Relation images (ordered by displayOrder) come first; mainImageUrl is
 * appended as a fallback if it is not already present.
 */
export function buildEquipmentImageUrls(
  item: { mainImageUrl?: string | null; images?: { imageUrl: string }[] }
): string[] {
  const fromRelation = (item.images ?? [])
    .map((img) => resolveImageUrl(img.imageUrl))
    .filter((u): u is string => Boolean(u))

  const fromMain = resolveImageUrl(item.mainImageUrl)
  const all =
    fromMain && !fromRelation.includes(fromMain)
      ? [...fromRelation, fromMain]
      : fromRelation

  return all
}
