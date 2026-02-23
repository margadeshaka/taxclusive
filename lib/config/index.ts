/**
 * Configuration System Index
 * Main entry point for the website configuration system
 */

import { WEBSITE_CONFIG_CONSTANTS } from "./constants";
import { defaultConfig } from "./default-config";
import {
  backupConfig,
  createConfig,
  exportConfig,
  generateColorPalette,
  importConfig,
  restoreConfig,
} from "./config-utils";
import { getConfigHealth, validateConfig } from "./config-validator";
import type {
  ContentConfiguration,
  ThemeConfiguration,
  WebsiteConfiguration,
} from "./website-config";

// =============================================================================
// MAIN EXPORTS
// =============================================================================

// Core configuration types and interfaces
export type {
  WebsiteConfiguration,
  ThemeConfiguration,
  ThemeColors,
  ContentConfiguration,
  AssetConfiguration,
  FeatureConfiguration,
  ConfigValidation,
} from "./website-config";

// Default configuration
export { defaultConfig } from "./default-config";

// Configuration provider and hooks
export {
  ConfigProvider,
  useConfig,
  useTheme,
  useContent,
  useAssets,
  useFeatures,
  useBusiness,
  useSite,
  useNavigation,
  usePageContent,
  useSEO,
  useColorScheme,
  mergeConfigs,
} from "./config-provider";

// Validation system
export {
  validateConfig,
  getConfigHealth,
  validationRules,
  validateField,
  validateBusinessLogic,
  validatePerformance,
  validateAccessibility,
} from "./config-validator";

export type { ValidationResult } from "./config-validator";

// Utility functions
export {
  createConfig,
  exportConfig,
  importConfig,
  getConfigDiff,
  backupConfig,
  restoreConfig,
  generateCSSVariables,
  generateTailwindConfig,
  generateColorPalette,
  getLocalizedContent,
  generateBreadcrumbs,
  getPageTitle,
  generatePageStructuredData,
  getOptimizedImageUrl,
  getResponsiveImageSrcSet,
  analyzePerformanceImpact,
} from "./config-utils";

// Constants
export {
  WEBSITE_CONFIG_CONSTANTS,
  THEME_CONSTANTS,
  CONTENT_CONSTANTS,
  ASSET_CONSTANTS,
  FEATURE_CONSTANTS,
  SEO_CONSTANTS,
  VALIDATION_CONSTANTS,
  ENVIRONMENT_CONSTANTS,
  ACCESSIBILITY_CONSTANTS,
  PERFORMANCE_CONSTANTS,
} from "./constants";

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Initialize configuration system with custom settings
 */
export function initializeConfig(customConfig?: Partial<WebsiteConfiguration>) {
  return {
    config: customConfig ? createConfig(customConfig) : defaultConfig,
    validation: customConfig
      ? validateConfig(createConfig(customConfig))
      : validateConfig(defaultConfig),
  };
}

/**
 * Get configuration for specific environment
 */
export function getEnvironmentConfig(environment: "development" | "staging" | "production") {
  const envConfig = { ...defaultConfig };
  envConfig.environment = environment;

  // Environment-specific adjustments
  switch (environment) {
    case "development":
      envConfig.features.performance.compression = false;
      envConfig.features.performance.cdn.enabled = false;
      break;

    case "staging":
      envConfig.features.analytics = {}; // Disable analytics in staging
      break;

    case "production":
      // Production settings are in defaultConfig
      break;
  }

  return envConfig;
}

/**
 * Quick theme creation helper
 */
export function createTheme(options: {
  name: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontPrimary?: string;
  fontSecondary?: string;
}): Partial<ThemeConfiguration> {
  const theme: Partial<ThemeConfiguration> = {
    name: options.name,
  };

  if (options.primaryColor) {
    // Generate color palette from primary color
    const primaryPalette = generateColorPalette(options.primaryColor);
    theme.colors = {
      light: {
        ...defaultConfig.theme.colors.light,
        primary: primaryPalette,
      },
      dark: {
        ...defaultConfig.theme.colors.dark,
        primary: primaryPalette,
      },
    };
  }

  if (options.fontPrimary || options.fontSecondary) {
    theme.fonts = {
      ...defaultConfig.theme.fonts,
      ...(options.fontPrimary && {
        primary: {
          family: options.fontPrimary,
          fallback: ["system-ui", "sans-serif"],
          weights: [400, 500, 600, 700],
        },
      }),
      ...(options.fontSecondary && {
        secondary: {
          family: options.fontSecondary,
          fallback: ["Georgia", "serif"],
          weights: [400, 500, 600, 700],
        },
      }),
    };
  }

  return theme;
}

/**
 * Quick business information setup helper
 */
export function createBusinessConfig(businessInfo: {
  name: string;
  displayName?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  website?: string;
}): Partial<ContentConfiguration["business"]> {
  return {
    legalName: businessInfo.name,
    displayName: businessInfo.displayName || businessInfo.name,
    description:
      businessInfo.description || `Professional services provided by ${businessInfo.name}`,
    contact: {
      phone: businessInfo.phone || "",
      email: businessInfo.email || "",
      website: businessInfo.website || "",
      supportEmail: businessInfo.email || "",
      salesEmail: businessInfo.email || "",
    },
    address: {
      streetAddress: businessInfo.address || "",
      addressLocality: businessInfo.city || "",
      addressRegion: businessInfo.state || "",
      postalCode: "",
      addressCountry: businessInfo.country || "IN",
      countryCode: businessInfo.country || "IN",
    },
  };
}

/**
 * Configuration migration helper
 */
export function migrateConfig(
  oldConfig: any,
  fromVersion: string,
  toVersion: string
): WebsiteConfiguration {
  // This would contain migration logic for different versions
  // Migration from ${fromVersion} to ${toVersion}

  // For now, merge with current default config
  return createConfig(oldConfig);
}

// =============================================================================
// CONFIGURATION PRESETS
// =============================================================================

/**
 * Predefined configuration presets for different business types
 */
export const CONFIG_PRESETS = {
  TAX_AND_FINANCIAL_SERVICES: {
    name: "Tax and Financial Services Preset",
    theme: {
      name: "Professional Tax Services Theme",
      colors: {
        light: {
          ...defaultConfig.theme.colors.light,
          primary: {
            ...defaultConfig.theme.colors.light.primary,
            500: "#1e40af", // Professional blue
          },
        },
        dark: {
          ...defaultConfig.theme.colors.dark,
          primary: {
            ...defaultConfig.theme.colors.dark.primary,
            500: "#3b82f6", // Lighter blue for dark mode
          },
        },
      },
    },
    content: {
      ...defaultConfig.content,
      pages: {
        ...defaultConfig.content.pages,
        home: {
          ...defaultConfig.content.pages.home,
          hero: {
            ...defaultConfig.content.pages.home.hero,
            title: "Professional Tax and Financial Services",
            subtitle: "Your Trusted Financial Partner",
          },
        },
      },
    },
  },

  LAW_FIRM: {
    name: "Law Firm Preset",
    theme: {
      name: "Legal Professional Theme",
      colors: {
        light: {
          ...defaultConfig.theme.colors.light,
          primary: {
            ...defaultConfig.theme.colors.light.primary,
            500: "#7c2d12", // Deep brown/red
          },
        },
        dark: {
          ...defaultConfig.theme.colors.dark,
          primary: {
            ...defaultConfig.theme.colors.dark.primary,
            500: "#dc2626", // Red for dark mode
          },
        },
      },
    },
  },

  CONSULTING_FIRM: {
    name: "Consulting Firm Preset",
    theme: {
      name: "Business Consulting Theme",
      colors: {
        light: {
          ...defaultConfig.theme.colors.light,
          primary: {
            ...defaultConfig.theme.colors.light.primary,
            500: "#059669", // Professional green
          },
        },
        dark: {
          ...defaultConfig.theme.colors.dark,
          primary: {
            ...defaultConfig.theme.colors.dark.primary,
            500: "#10b981", // Lighter green for dark mode
          },
        },
      },
    },
  },

  HEALTHCARE: {
    name: "Healthcare Preset",
    theme: {
      name: "Healthcare Professional Theme",
      colors: {
        light: {
          ...defaultConfig.theme.colors.light,
          primary: {
            ...defaultConfig.theme.colors.light.primary,
            500: "#0891b2", // Medical blue
          },
        },
        dark: {
          ...defaultConfig.theme.colors.dark,
          primary: {
            ...defaultConfig.theme.colors.dark.primary,
            500: "#06b6d4", // Lighter cyan for dark mode
          },
        },
      },
    },
  },

  TECHNOLOGY: {
    name: "Technology Preset",
    theme: {
      name: "Modern Tech Theme",
      colors: {
        light: {
          ...defaultConfig.theme.colors.light,
          primary: {
            ...defaultConfig.theme.colors.light.primary,
            500: "#7c3aed", // Tech purple
          },
        },
        dark: {
          ...defaultConfig.theme.colors.dark,
          primary: {
            ...defaultConfig.theme.colors.dark.primary,
            500: "#8b5cf6", // Lighter purple for dark mode
          },
        },
      },
    },
  },
} as const;

// Make sure all exports are available at the top level
export default {
  // Configuration
  defaultConfig,
  createConfig,
  initializeConfig,
  getEnvironmentConfig,

  // Validation
  validateConfig,
  getConfigHealth,

  // Utilities
  exportConfig,
  importConfig,
  backupConfig,
  restoreConfig,

  // Presets
  CONFIG_PRESETS,
  createTheme,
  createBusinessConfig,

  // Constants
  CONSTANTS: WEBSITE_CONFIG_CONSTANTS,
};
