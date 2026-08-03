/**
 * Global brand configuration for Indonesia Vibes.
 * Every surface (nav, footer, metadata, copy) reads from here so the platform
 * can be re-skinned or re-named from a single file.
 */

export const brand = {
  name: "Indonesia Vibes",
  shortName: "IV",
  tagline: "Culture in motion, from the archipelago to the world.",
  mission:
    "The digital front door to Indonesian cultural diplomacy — a place to discover, understand, experience, connect and collaborate.",
  locale: "en",
  organisation: "Indonesia Vibes Cultural Diplomacy Initiative",
  email: "hello@indonesiavibes.org",
  colors: {
    brandRed: "#EC3118",
    deepRed: "#A80F0F",
    pink: "#FA9F9F",
    blush: "#FEECEC",
    ink: "#3A1E1E",
    clay: "#5C2121",
    mutedBrown: "#614B4B",
    warmGrey: "#897878",
    neutral: "#B0A5A5",
    white: "#FFFFFF",
  },
  typography: {
    display: "DM Sans",
    body: "DM Sans",
  },
  /** 17 wave lines in the Garuda mark — one for Independence Day, 17 August. */
  markMeaning:
    "A Garuda formed from seventeen waves: seventeen for the day of independence, waves for an archipelago that has always moved outward.",
  journey: ["Discover", "Understand", "Experience", "Connect", "Collaborate"] as const,
  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "YouTube", href: "https://youtube.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ],
} as const;

export type Brand = typeof brand;