/**
 * Validates if a URL is likely to be a valid image URL
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false

  // Check if it's a relative URL starting with /
  if (url.startsWith("/")) return true

  try {
    const parsedUrl = new URL(url)
    return !!parsedUrl.protocol && !!parsedUrl.host
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
