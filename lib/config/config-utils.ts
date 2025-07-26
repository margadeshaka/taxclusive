/**
 * Configuration Utilities
 * Helper functions for working with website configuration
 */

import { defaultConfig } from "./default-config";
import { WebsiteConfiguration, ThemeColors } from "./website-config";

// =============================================================================
// CONFIGURATION UTILITIES
// =============================================================================

/**
 * Create a custom configuration by merging with defaults
 */
export function createConfig(customConfig: Partial<WebsiteConfiguration>): WebsiteConfiguration {
  return deepMerge(defaultConfig, customConfig);
}

/**
 * Export configuration to JSON
 */
export function exportConfig(config: WebsiteConfiguration): string {
  return JSON.stringify(config, null, 2);
}

/**
 * Import configuration from JSON
 */
export function importConfig(jsonConfig: string): WebsiteConfiguration {
  try {
    const parsed = JSON.parse(jsonConfig);
    return createConfig(parsed);
  } catch (error) {
    throw new Error(
      `Invalid configuration JSON: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Get configuration difference between two configs
 */
export function getConfigDiff(
  config1: WebsiteConfiguration,
  config2: WebsiteConfiguration
): Record<string, { old: any; new: any }> {
  const differences: Record<string, { old: any; new: any }> = {};

  function findDifferences(obj1: any, obj2: any, path: string = "") {
    for (const key in obj1) {
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof obj1[key] === "object" && obj1[key] !== null && !Array.isArray(obj1[key])) {
        if (typeof obj2[key] === "object" && obj2[key] !== null && !Array.isArray(obj2[key])) {
          findDifferences(obj1[key], obj2[key], currentPath);
        } else {
          differences[currentPath] = { old: obj1[key], new: obj2[key] };
        }
      } else if (obj1[key] !== obj2[key]) {
        differences[currentPath] = { old: obj1[key], new: obj2[key] };
      }
    }

    // Check for new keys in obj2
    for (const key in obj2) {
      const currentPath = path ? `${path}.${key}` : key;
      if (!(key in obj1)) {
        differences[currentPath] = { old: undefined, new: obj2[key] };
      }
    }
  }

  findDifferences(config1, config2);
  return differences;
}

/**
 * Backup current configuration
 */
export function backupConfig(config: WebsiteConfiguration): string {
  const backup = {
    config,
    timestamp: new Date().toISOString(),
    version: config.version,
  };

  return JSON.stringify(backup, null, 2);
}

/**
 * Restore configuration from backup
 */
export function restoreConfig(backupJson: string): WebsiteConfiguration {
  try {
    const backup = JSON.parse(backupJson);
    if (!backup.config || !backup.timestamp) {
      throw new Error("Invalid backup format");
    }
    return backup.config;
  } catch (error) {
    throw new Error(
      `Invalid backup JSON: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

// =============================================================================
// THEME UTILITIES
// =============================================================================

/**
 * Generate CSS custom properties from theme configuration
 */
export function generateCSSVariables(theme: WebsiteConfiguration["theme"]): string {
  const { colors } = theme;
  let css = ":root {\n";

  // Light theme variables
  css += "  /* Light Theme */\n";
  css += generateColorVariables(colors.light, "");

  css += "\n  /* Dark Theme */\n";
  css += "}\n\n";
  css += '[data-theme="dark"] {\n';
  css += generateColorVariables(colors.dark, "");
  css += "}\n\n";

  // Media query for system preference
  css += "@media (prefers-color-scheme: dark) {\n";
  css += "  :root {\n";
  css += generateColorVariables(colors.dark, "    ");
  css += "  }\n";
  css += "}\n";

  // Font variables
  css += "\n/* Fonts */\n";
  css += `:root {\n`;
  css += `  --font-primary: "${theme.fonts.primary.family}", ${theme.fonts.primary.fallback.join(", ")};\n`;
  css += `  --font-secondary: "${theme.fonts.secondary.family}", ${theme.fonts.secondary.fallback.join(", ")};\n`;
  css += `  --font-mono: "${theme.fonts.mono.family}", ${theme.fonts.mono.fallback.join(", ")};\n`;
  css += "}\n";

  // Spacing variables
  css += "\n/* Spacing */\n";
  css += ":root {\n";
  Object.entries(theme.spacing).forEach(([key, value]) => {
    css += `  --spacing-${key}: ${value};\n`;
  });
  css += "}\n";

  // Border radius variables
  css += "\n/* Border Radius */\n";
  css += ":root {\n";
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    css += `  --radius-${key}: ${value};\n`;
  });
  css += "}\n";

  // Shadow variables
  css += "\n/* Shadows */\n";
  css += ":root {\n";
  Object.entries(theme.shadows).forEach(([key, value]) => {
    css += `  --shadow-${key}: ${value};\n`;
  });
  css += "}\n";

  return css;
}

/**
 * Generate Tailwind CSS configuration from theme
 */
export function generateTailwindConfig(theme: WebsiteConfiguration["theme"]): object {
  return {
    theme: {
      extend: {
        colors: {
          primary: generateTailwindColorScale(theme.colors.light.primary),
          secondary: generateTailwindColorScale(theme.colors.light.secondary),
          accent: generateTailwindColorScale(theme.colors.light.accent),
          neutral: generateTailwindColorScale(theme.colors.light.neutral),
          success: generateTailwindColorScale(theme.colors.light.success),
          warning: generateTailwindColorScale(theme.colors.light.warning),
          error: generateTailwindColorScale(theme.colors.light.error),
        },
        fontFamily: {
          primary: [theme.fonts.primary.family, ...theme.fonts.primary.fallback],
          secondary: [theme.fonts.secondary.family, ...theme.fonts.secondary.fallback],
          mono: [theme.fonts.mono.family, ...theme.fonts.mono.fallback],
        },
        spacing: theme.spacing,
        borderRadius: theme.borderRadius,
        boxShadow: theme.shadows,
        animation: {
          "fade-in": "fadeIn 0.5s ease-in-out",
          "slide-up": "slideUp 0.5s ease-out",
          "bounce-in": "bounceIn 0.6s ease-out",
        },
        keyframes: {
          fadeIn: {
            "0%": { opacity: "0" },
            "100%": { opacity: "1" },
          },
          slideUp: {
            "0%": { transform: "translateY(20px)", opacity: "0" },
            "100%": { transform: "translateY(0)", opacity: "1" },
          },
          bounceIn: {
            "0%": { transform: "scale(0.3)", opacity: "0" },
            "50%": { transform: "scale(1.05)" },
            "70%": { transform: "scale(0.9)" },
            "100%": { transform: "scale(1)", opacity: "1" },
          },
        },
      },
    },
  };
}

/**
 * Create a color palette from a base color
 */
export function generateColorPalette(baseColor: string): ThemeColors["primary"] {
  // This is a simplified version - in a real implementation,
  // you'd use a color manipulation library like chroma-js
  const shades = {
    50: lightenColor(baseColor, 0.9),
    100: lightenColor(baseColor, 0.8),
    200: lightenColor(baseColor, 0.6),
    300: lightenColor(baseColor, 0.4),
    400: lightenColor(baseColor, 0.2),
    500: baseColor,
    600: darkenColor(baseColor, 0.1),
    700: darkenColor(baseColor, 0.2),
    800: darkenColor(baseColor, 0.3),
    900: darkenColor(baseColor, 0.4),
    950: darkenColor(baseColor, 0.5),
  };

  return shades;
}

// =============================================================================
// CONTENT UTILITIES
// =============================================================================

/**
 * Get localized content based on language
 */
export function getLocalizedContent(
  config: WebsiteConfiguration,
  language: string = "en-IN"
): WebsiteConfiguration["content"] {
  // For now, return default content
  // In future, this could support multiple language configurations
  return config.content;
}

/**
 * Generate breadcrumbs from current path
 */
export function generateBreadcrumbs(
  path: string,
  config: WebsiteConfiguration
): Array<{ name: string; url: string }> {
  const segments = path.split("/").filter(Boolean);
  const breadcrumbs: Array<{ name: string; url: string }> = [];

  // Add home
  breadcrumbs.push({
    name: "Home",
    url: "/",
  });

  // Add path segments
  let currentPath = "";
  for (const segment of segments) {
    currentPath += `/${segment}`;

    // Try to find a friendly name from navigation
    const friendlyName =
      findNavItemName(segment, config.content.navigation.header.menu) ||
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

    breadcrumbs.push({
      name: friendlyName,
      url: currentPath,
    });
  }

  return breadcrumbs;
}

/**
 * Get page title with template
 */
export function getPageTitle(pageTitle: string | undefined, config: WebsiteConfiguration): string {
  const { seo } = config.content;

  if (!pageTitle) {
    return seo.defaultTitle;
  }

  return seo.titleTemplate.replace("%s", pageTitle);
}

/**
 * Generate structured data for a page
 */
export function generatePageStructuredData(
  pageType: string,
  pageData: any,
  config: WebsiteConfiguration
): object {
  const { business } = config.content;

  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageData.title,
    description: pageData.description,
    url: `${business.contact.website}${pageData.path || ""}`,
    isPartOf: {
      "@type": "WebSite",
      name: business.displayName,
      url: business.contact.website,
    },
  };

  // Add page-specific structured data based on type
  switch (pageType) {
    case "service":
      return {
        ...baseStructuredData,
        "@type": "Service",
        provider: {
          "@type": "Organization",
          name: business.displayName,
        },
      };

    case "contact":
      return {
        ...baseStructuredData,
        "@type": "ContactPage",
        mainEntity: {
          "@type": "Organization",
          name: business.displayName,
          contactPoint: {
            "@type": "ContactPoint",
            telephone: business.contact.phone,
            email: business.contact.email,
          },
        },
      };

    default:
      return baseStructuredData;
  }
}

// =============================================================================
// ASSET UTILITIES
// =============================================================================

/**
 * Get optimized image URL
 */
export function getOptimizedImageUrl(
  imagePath: string,
  config: WebsiteConfiguration,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "webp" | "avif" | "jpg" | "png";
  } = {}
): string {
  // If CDN is enabled, use CDN URL
  if (config.features.performance.cdn.enabled && config.features.performance.cdn.url) {
    const params = new URLSearchParams();

    if (options.width) params.append("w", options.width.toString());
    if (options.height) params.append("h", options.height.toString());
    if (options.quality) params.append("q", options.quality.toString());
    if (options.format) params.append("f", options.format);

    const queryString = params.toString();
    return `${config.features.performance.cdn.url}${imagePath}${queryString ? `?${queryString}` : ""}`;
  }

  // Return original path for now
  return imagePath;
}

/**
 * Get responsive image srcset
 */
export function getResponsiveImageSrcSet(
  imagePath: string,
  config: WebsiteConfiguration,
  widths: number[] = [400, 800, 1200, 1600]
): string {
  return widths
    .map((width) => `${getOptimizedImageUrl(imagePath, config, { width })} ${width}w`)
    .join(", ");
}

// =============================================================================
// PRIVATE HELPER FUNCTIONS
// =============================================================================

function deepMerge<T>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    if (source[key] !== undefined) {
      if (
        typeof source[key] === "object" &&
        source[key] !== null &&
        !Array.isArray(source[key]) &&
        typeof result[key] === "object" &&
        result[key] !== null &&
        !Array.isArray(result[key])
      ) {
        result[key] = deepMerge(result[key], source[key]!);
      } else {
        result[key] = source[key]!;
      }
    }
  }

  return result;
}

function generateColorVariables(colors: any, indent: string = "  "): string {
  let css = "";

  // Generate color scale variables
  for (const [colorName, colorScale] of Object.entries(colors)) {
    if (typeof colorScale === "object" && colorScale !== null) {
      for (const [shade, value] of Object.entries(colorScale)) {
        css += `${indent}--color-${colorName}-${shade}: ${value};\n`;
      }
    } else if (typeof colorScale === "string") {
      css += `${indent}--color-${colorName}: ${colorScale};\n`;
    }
  }

  return css;
}

function generateTailwindColorScale(colorScale: any): object {
  return colorScale;
}

function lightenColor(color: string, factor: number): string {
  // Simplified color manipulation - use a proper color library in production
  return color; // Placeholder
}

function darkenColor(color: string, factor: number): string {
  // Simplified color manipulation - use a proper color library in production
  return color; // Placeholder
}

function findNavItemName(segment: string, menuItems: any[]): string | null {
  for (const item of menuItems) {
    if (item.url === `/${segment}` || item.url.endsWith(`/${segment}`)) {
      return item.label;
    }

    if (item.children) {
      const childName = findNavItemName(segment, item.children);
      if (childName) return childName;
    }
  }

  return null;
}

// =============================================================================
// PERFORMANCE UTILITIES
// =============================================================================

/**
 * Analyze configuration performance impact
 */
export function analyzePerformanceImpact(config: WebsiteConfiguration): {
  score: number;
  recommendations: string[];
} {
  const recommendations: string[] = [];
  let score = 100;

  // Check image optimization
  if (!config.features.performance.lazyImages) {
    score -= 10;
    recommendations.push("Enable lazy image loading");
  }

  // Check compression
  if (!config.features.performance.compression) {
    score -= 15;
    recommendations.push("Enable compression");
  }

  // Check CDN
  if (!config.features.performance.cdn.enabled) {
    score -= 20;
    recommendations.push("Consider using a CDN for better performance");
  }

  // Check caching
  if (config.features.performance.caching.staticAssets < 86400) {
    score -= 5;
    recommendations.push("Increase static asset cache duration");
  }

  return { score: Math.max(0, score), recommendations };
}

// Export all utilities
export * from "./website-config";
export { defaultConfig } from "./default-config";
