/**
 * D'RENTALS Global Theme Configuration
 * Single source of truth for all design tokens.
 * Change values here to propagate across the entire site.
 */

export const theme = {
  // ─── Backgrounds ───────────────────────────────────────────
  bg: {
    page: "bg-zinc-950",            // Main page background
    section: "bg-zinc-950",         // Default section background
    sectionAlt: "bg-zinc-900",      // Alternating section background
    card: "bg-zinc-900",            // Card / tile background
    cardHover: "hover:bg-zinc-800", // Card hover state
    header: "bg-zinc-950",          // Sticky nav background
    footer: "bg-zinc-950",          // Footer background
    input: "bg-zinc-800",           // Form input background
    badge: "bg-zinc-800",           // Misc badge background
  },

  // ─── Borders ───────────────────────────────────────────────
  border: {
    default: "border-zinc-800",     // Default border
    strong: "border-zinc-700",      // Stronger border for inputs
    accent: "border-red-600",       // Red accent border
    accentSoft: "border-red-700",   // Softer red border
    separator: "bg-zinc-800",       // <Separator /> color
  },

  // ─── Text ──────────────────────────────────────────────────
  text: {
    primary: "text-white",
    secondary: "text-zinc-300",
    muted: "text-zinc-500",
    accent: "text-red-500",
    accentHover: "hover:text-red-400",
    heading: "font-heading",
    body: "font-body",
    mono: "font-mono",
  },

  // ─── Accent (Red) ──────────────────────────────────────────
  accent: {
    bg: "bg-red-600",
    bgHover: "hover:bg-red-700",
    bgMuted: "bg-red-950",
    text: "text-red-500",
    border: "border-red-600",
  },

  // ─── Page Header (inner pages) ─────────────────────────────
  pageHeader: {
    wrapper: "py-20 bg-zinc-950 border-b border-zinc-800",
    label: "inline-block mb-4 px-3 py-1 border border-red-600 bg-zinc-950",
    labelText: "text-red-500 font-mono text-sm tracking-widest",
    title: "font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6 tracking-wide leading-tight",
    description: "text-xl text-zinc-300 max-w-2xl font-body",
  },

  // ─── Section Header ────────────────────────────────────────
  sectionHeader: {
    wrapper: "flex items-center justify-between mb-10",
    title: "font-heading text-3xl text-red-500 tracking-wide",
    line: "h-px bg-red-600 flex-grow ml-6",
  },

  // ─── Cards ─────────────────────────────────────────────────
  card: {
    base: "bg-zinc-900 border border-zinc-800 rounded-none",
    hover: "hover:border-red-600 transition-colors duration-300",
    content: "p-6",
  },

  // ─── Buttons ───────────────────────────────────────────────
  button: {
    primary: "bg-red-600 hover:bg-red-700 text-white rounded-none font-heading",
    outline: "border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 hover:border-zinc-600 rounded-none font-heading",
    ghost: "text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-none",
  },
} as const
