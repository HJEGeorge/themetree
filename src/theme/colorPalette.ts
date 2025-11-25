/**
 * Curated dark-mode color palette.
 * Each theme is designed to be visually distinct and appealing.
 * Colors are chosen for good contrast on dark backgrounds.
 */

export interface ThemeColors {
  name: string;
  primary: string;      // Main accent color
  primaryDark: string;  // Darker variant for backgrounds
  foreground: string;   // Text color on primary
}

/**
 * 12 carefully selected dark-mode themes.
 * Each is visually distinct and aesthetically pleasing.
 */
export const COLOR_PALETTE: ThemeColors[] = [
  {
    name: 'Ocean',
    primary: '#0078D4',      // Azure blue
    primaryDark: '#003d6b',
    foreground: '#ffffff',
  },
  {
    name: 'Forest',
    primary: '#2D7D46',      // Forest green
    primaryDark: '#1a4a29',
    foreground: '#ffffff',
  },
  {
    name: 'Sunset',
    primary: '#D83B01',      // Burnt orange
    primaryDark: '#6d1d00',
    foreground: '#ffffff',
  },
  {
    name: 'Violet',
    primary: '#8B5CF6',      // Vivid purple
    primaryDark: '#4c2889',
    foreground: '#ffffff',
  },
  {
    name: 'Rose',
    primary: '#DB2777',      // Deep pink
    primaryDark: '#6d133b',
    foreground: '#ffffff',
  },
  {
    name: 'Teal',
    primary: '#0D9488',      // Teal
    primaryDark: '#064a44',
    foreground: '#ffffff',
  },
  {
    name: 'Amber',
    primary: '#D97706',      // Amber
    primaryDark: '#6d3b03',
    foreground: '#ffffff',
  },
  {
    name: 'Crimson',
    primary: '#DC2626',      // Red
    primaryDark: '#6e1313',
    foreground: '#ffffff',
  },
  {
    name: 'Indigo',
    primary: '#4F46E5',      // Indigo
    primaryDark: '#272372',
    foreground: '#ffffff',
  },
  {
    name: 'Emerald',
    primary: '#059669',      // Emerald
    primaryDark: '#024b34',
    foreground: '#ffffff',
  },
  {
    name: 'Fuchsia',
    primary: '#C026D3',      // Fuchsia
    primaryDark: '#601369',
    foreground: '#ffffff',
  },
  {
    name: 'Cyan',
    primary: '#0891B2',      // Cyan
    primaryDark: '#044859',
    foreground: '#ffffff',
  },
];

/**
 * Get a theme from the palette based on an index.
 */
export function getThemeByIndex(index: number): ThemeColors {
  return COLOR_PALETTE[index % COLOR_PALETTE.length];
}

