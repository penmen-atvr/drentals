/**
 * Central app configuration.
 * Avoids scattering business constants (phone numbers, URLs) across screens.
 */

/** WhatsApp business number in international format (no +) */
export const WHATSAPP_NUMBER = '917794872701';

/** Production website domain (HTTPS only) */
export const PRODUCTION_DOMAIN = 'https://rentals.penmenstudios.com';

/** Allowed origins for the in-app WebView */
export const ALLOWED_WEBVIEW_ORIGINS = [
  PRODUCTION_DOMAIN,
  'https://drentals.in',
];
