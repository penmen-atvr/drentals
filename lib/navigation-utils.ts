/**
 * Navigation utility functions
 */

/**
 * Scrolls to the top of the page smoothly
 */
export function scrollToTop(smooth = true) {
  try {
    // Try to use modern scrollTo with behavior
    window.scrollTo({
      top: 0,
      behavior: smooth ? "smooth" : "auto",
    })
  } catch (error) {
    // Fallback for older browsers
    window.scrollTo(0, 0)
  }
}

/**
 * Scrolls to a specific element by ID
 */
export function scrollToElement(elementId: string, smooth = true) {
  const element = document.getElementById(elementId)
  if (element) {
    try {
      // Try to use modern scrollIntoView with behavior
      element.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "start",
      })
    } catch (error) {
      // Fallback for older browsers
      element.scrollIntoView()
    }
  }
}

/**
 * Creates a clean URL without unnecessary query parameters
 */
export function createCleanUrl(path: string, params?: Record<string, string>) {
  if (!params || Object.keys(params).length === 0) {
    return path
  }

  // Filter out empty or undefined parameters
  const filteredParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== "")
    .reduce(
      (obj, [key, value]) => {
        obj[key] = value
        return obj
      },
      {} as Record<string, string>,
    )

  if (Object.keys(filteredParams).length === 0) {
    return path
  }

  const searchParams = new URLSearchParams(filteredParams)
  return `${path}?${searchParams.toString()}`
}

/**
 * Checks if the user has scrolled past a certain threshold
 */
export function hasScrolledPast(threshold: number): boolean {
  if (typeof window === "undefined") return false
  return window.scrollY > threshold
}
