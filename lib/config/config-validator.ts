/**
 * Configuration Validation System
 * Validates website configuration for completeness and correctness
 */

import { WebsiteConfiguration, ConfigValidation } from './website-config';

// =============================================================================
// VALIDATION RULES
// =============================================================================

const validationRules: ConfigValidation = {
  required: [
    'version',
    'environment',
    'theme',
    'content.site.name',
    'content.business.legalName',
    'content.business.contact.email',
    'content.business.contact.phone',
    'content.business.address',
    'assets.images.logo.main',
  ],
  optional: [
    'content.business.socialMedia',
    'features.analytics',
    'assets.videos',
  ],
  deprecated: [
    'theme.oldColorScheme', // Example deprecated field
  ],
  validation: {
    'content.business.contact.email': {
      type: 'email',
      pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
    },
    'content.business.contact.phone': {
      type: 'phone',
      pattern: '^[+]?[0-9]{10,15}$',
    },
    'content.business.geo.latitude': {
      type: 'number',
      min: -90,
      max: 90,
    },
    'content.business.geo.longitude': {
      type: 'number',
      min: -180,
      max: 180,
    },
    'content.business.rating.value': {
      type: 'string',
      pattern: '^[1-5](\\.\\d)?$',
    },
    'assets.images.logo.main': {
      type: 'string',
      pattern: '^/.+\\.(png|jpg|jpeg|svg|webp)$',
    },
    'environment': {
      type: 'string',
      enum: ['development', 'staging', 'production'],
    },
  },
};

// =============================================================================
// VALIDATION RESULT INTERFACE
// =============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  deprecated: string[];
}

// =============================================================================
// MAIN VALIDATION FUNCTION
// =============================================================================

export function validateConfig(config: WebsiteConfiguration): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const deprecated: string[] = [];

  try {
    // Check required fields
    for (const field of validationRules.required) {
      if (!getNestedValue(config, field)) {
        errors.push(`Required field '${field}' is missing or empty`);
      }
    }

    // Check deprecated fields
    for (const field of validationRules.deprecated) {
      if (getNestedValue(config, field)) {
        deprecated.push(`Deprecated field '${field}' is still in use`);
      }
    }

    // Validate field values
    for (const [field, rule] of Object.entries(validationRules.validation)) {
      const value = getNestedValue(config, field);
      if (value !== undefined) {
        const fieldErrors = validateField(field, value, rule);
        errors.push(...fieldErrors);
      }
    }

    // Business logic validations
    const businessValidationErrors = validateBusinessLogic(config);
    errors.push(...businessValidationErrors);

    // Performance and SEO validations
    const performanceWarnings = validatePerformance(config);
    warnings.push(...performanceWarnings);

    // Accessibility validations
    const accessibilityWarnings = validateAccessibility(config);
    warnings.push(...accessibilityWarnings);

  } catch (error) {
    errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    deprecated,
  };
}

// =============================================================================
// FIELD VALIDATION
// =============================================================================

function validateField(fieldPath: string, value: any, rule: any): string[] {
  const errors: string[] = [];

  // Type validation
  if (rule.type && typeof value !== rule.type) {
    errors.push(`Field '${fieldPath}' should be of type '${rule.type}', got '${typeof value}'`);
    return errors; // Stop further validation if type is wrong
  }

  // Pattern validation
  if (rule.pattern && typeof value === 'string') {
    const regex = new RegExp(rule.pattern);
    if (!regex.test(value)) {
      errors.push(`Field '${fieldPath}' does not match required pattern`);
    }
  }

  // Enum validation
  if (rule.enum && !rule.enum.includes(value)) {
    errors.push(`Field '${fieldPath}' must be one of: ${rule.enum.join(', ')}`);
  }

  // Number range validation
  if (rule.type === 'number') {
    if (rule.min !== undefined && value < rule.min) {
      errors.push(`Field '${fieldPath}' must be greater than or equal to ${rule.min}`);
    }
    if (rule.max !== undefined && value > rule.max) {
      errors.push(`Field '${fieldPath}' must be less than or equal to ${rule.max}`);
    }
  }

  // String length validation
  if (rule.type === 'string') {
    if (rule.minLength !== undefined && value.length < rule.minLength) {
      errors.push(`Field '${fieldPath}' must be at least ${rule.minLength} characters long`);
    }
    if (rule.maxLength !== undefined && value.length > rule.maxLength) {
      errors.push(`Field '${fieldPath}' must be no more than ${rule.maxLength} characters long`);
    }
  }

  return errors;
}

// =============================================================================
// BUSINESS LOGIC VALIDATION
// =============================================================================

function validateBusinessLogic(config: WebsiteConfiguration): string[] {
  const errors: string[] = [];

  // Validate social media URLs
  if (config.content.business.socialMedia) {
    for (const [platform, url] of Object.entries(config.content.business.socialMedia)) {
      if (url && !isValidUrl(url)) {
        errors.push(`Invalid URL for social media platform '${platform}': ${url}`);
      }
    }
  }

  // Validate service areas
  if (config.content.business.serviceAreas) {
    for (const area of config.content.business.serviceAreas) {
      if (!area.name || !area.type) {
        errors.push('Service area must have both name and type');
      }
      if (!['city', 'state', 'country'].includes(area.type)) {
        errors.push(`Invalid service area type: ${area.type}`);
      }
    }
  }

  // Validate opening hours format
  if (config.content.business.openingHours) {
    for (const hours of config.content.business.openingHours) {
      if (!isValidOpeningHours(hours)) {
        errors.push(`Invalid opening hours format: ${hours}`);
      }
    }
  }

  // Validate theme colors
  if (config.theme.colors) {
    const colorErrors = validateThemeColors(config.theme.colors);
    errors.push(...colorErrors);
  }

  // Validate navigation structure
  if (config.content.navigation.header.menu) {
    const navErrors = validateNavigation(config.content.navigation.header.menu);
    errors.push(...navErrors);
  }

  return errors;
}

// =============================================================================
// PERFORMANCE VALIDATION
// =============================================================================

function validatePerformance(config: WebsiteConfiguration): string[] {
  const warnings: string[] = [];

  // Check for performance features
  if (!config.features.performance.lazyImages) {
    warnings.push('Consider enabling lazy image loading for better performance');
  }

  if (!config.features.performance.compression) {
    warnings.push('Consider enabling compression for better performance');
  }

  // Check image optimization
  if (config.assets.images.hero.home && !isOptimizedImageFormat(config.assets.images.hero.home)) {
    warnings.push('Consider using optimized image formats (WebP, AVIF) for hero images');
  }

  // Check CDN usage
  if (!config.features.performance.cdn.enabled) {
    warnings.push('Consider enabling CDN for better global performance');
  }

  return warnings;
}

// =============================================================================
// ACCESSIBILITY VALIDATION
// =============================================================================

function validateAccessibility(config: WebsiteConfiguration): string[] {
  const warnings: string[] = [];

  // Check color contrast (basic check)
  if (config.theme.colors) {
    const contrastWarnings = validateColorContrast(config.theme.colors);
    warnings.push(...contrastWarnings);
  }

  // Check for alt texts in images
  if (config.content.pages.home.hero.backgroundImage && 
      !config.content.pages.home.hero.backgroundImage.includes('alt=')) {
    warnings.push('Consider adding alt text descriptions for background images');
  }

  return warnings;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidOpeningHours(hours: string): boolean {
  // Validate format like "Mo-Fr 09:00-18:00" or "Sa 09:00-14:00"
  const pattern = /^(Mo|Tu|We|Th|Fr|Sa|Su)(-((Mo|Tu|We|Th|Fr|Sa|Su)))?\s+\d{2}:\d{2}-\d{2}:\d{2}$/;
  return pattern.test(hours);
}

function isOptimizedImageFormat(imagePath: string): boolean {
  return /\.(webp|avif)$/i.test(imagePath);
}

function validateThemeColors(colors: any): string[] {
  const errors: string[] = [];

  const validateColorPalette = (palette: any, themeName: string) => {
    const requiredShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
    
    for (const colorName of ['primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error']) {
      if (palette[colorName]) {
        for (const shade of requiredShades) {
          if (!palette[colorName][shade]) {
            errors.push(`Missing ${colorName}-${shade} color in ${themeName} theme`);
          } else if (!isValidHexColor(palette[colorName][shade])) {
            errors.push(`Invalid hex color for ${colorName}-${shade} in ${themeName} theme`);
          }
        }
      }
    }
  };

  if (colors.light) validateColorPalette(colors.light, 'light');
  if (colors.dark) validateColorPalette(colors.dark, 'dark');

  return errors;
}

function validateNavigation(menu: any[]): string[] {
  const errors: string[] = [];

  for (const item of menu) {
    if (!item.id || !item.label || !item.url) {
      errors.push('Navigation menu item must have id, label, and url');
    }

    if (item.children) {
      for (const child of item.children) {
        if (!child.id || !child.label || !child.url) {
          errors.push('Navigation submenu item must have id, label, and url');
        }
      }
    }
  }

  return errors;
}

function validateColorContrast(colors: any): string[] {
  const warnings: string[] = [];

  // Basic contrast validation (simplified)
  const checkContrast = (fg: string, bg: string, context: string) => {
    if (fg && bg) {
      const fgLuminance = getColorLuminance(fg);
      const bgLuminance = getColorLuminance(bg);
      
      if (fgLuminance !== null && bgLuminance !== null) {
        const contrast = Math.max(fgLuminance, bgLuminance) / Math.min(fgLuminance, bgLuminance);
        
        if (contrast < 4.5) { // WCAG AA standard for normal text
          warnings.push(`Low color contrast in ${context}: ${contrast.toFixed(2)} (minimum 4.5)`);
        }
      }
    }
  };

  if (colors.light) {
    checkContrast(colors.light.foreground, colors.light.background, 'light theme');
  }

  if (colors.dark) {
    checkContrast(colors.dark.foreground, colors.dark.background, 'dark theme');
  }

  return warnings;
}

function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

function getColorLuminance(hex: string): number | null {
  if (!isValidHexColor(hex)) return null;

  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  // Calculate relative luminance
  const sRGB = [r, g, b].map(c => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

// =============================================================================
// CONFIGURATION HEALTH CHECK
// =============================================================================

export function getConfigHealth(config: WebsiteConfiguration): {
  score: number;
  issues: number;
  suggestions: string[];
} {
  const validation = validateConfig(config);
  const totalIssues = validation.errors.length + validation.warnings.length;
  
  // Calculate health score (0-100)
  const maxPossibleIssues = validationRules.required.length + 
                           Object.keys(validationRules.validation).length + 
                           10; // Estimated other checks
  
  const score = Math.max(0, Math.round((1 - totalIssues / maxPossibleIssues) * 100));

  const suggestions: string[] = [];

  if (validation.errors.length > 0) {
    suggestions.push('Fix critical configuration errors');
  }

  if (validation.warnings.length > 3) {
    suggestions.push('Address performance and accessibility warnings');
  }

  if (validation.deprecated.length > 0) {
    suggestions.push('Update deprecated configuration fields');
  }

  if (score < 70) {
    suggestions.push('Review and improve overall configuration quality');
  }

  return {
    score,
    issues: totalIssues,
    suggestions,
  };
}

// Export validation functions
export {
  validationRules,
  validateField,
  validateBusinessLogic,
  validatePerformance,
  validateAccessibility,
};