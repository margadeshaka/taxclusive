'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { WebsiteConfiguration } from './website-config';
import { defaultConfig } from './default-config';
import { validateConfig } from './config-validator';

// =============================================================================
// CONFIGURATION CONTEXT
// =============================================================================

interface ConfigContextType {
  config: WebsiteConfiguration;
  updateConfig: (newConfig: Partial<WebsiteConfiguration>) => void;
  resetConfig: () => void;
  isLoading: boolean;
  errors: string[];
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

// =============================================================================
// CONFIGURATION PROVIDER
// =============================================================================

interface ConfigProviderProps {
  children: React.ReactNode;
  initialConfig?: Partial<WebsiteConfiguration>;
  enableLocalStorage?: boolean;
  enableValidation?: boolean;
}

export function ConfigProvider({
  children,
  initialConfig,
  enableLocalStorage = true,
  enableValidation = true,
}: ConfigProviderProps) {
  const [config, setConfig] = useState<WebsiteConfiguration>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  // Load configuration from localStorage or use default
  useEffect(() => {
    const loadConfig = async () => {
      try {
        let loadedConfig = { ...defaultConfig };

        // Merge with initial config if provided
        if (initialConfig) {
          loadedConfig = mergeConfigs(loadedConfig, initialConfig);
        }

        // Load from localStorage if enabled
        if (enableLocalStorage && typeof window !== 'undefined') {
          const savedConfig = localStorage.getItem('website-config');
          if (savedConfig) {
            const parsedConfig = JSON.parse(savedConfig);
            loadedConfig = mergeConfigs(loadedConfig, parsedConfig);
          }
        }

        // Validate configuration if enabled
        if (enableValidation) {
          const validationResult = validateConfig(loadedConfig);
          if (!validationResult.isValid) {
            setErrors(validationResult.errors);
            console.warn('Configuration validation failed:', validationResult.errors);
          } else {
            setErrors([]);
          }
        }

        setConfig(loadedConfig);
      } catch (error) {
        console.error('Failed to load configuration:', error);
        setErrors(['Failed to load configuration']);
        setConfig(defaultConfig);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, [initialConfig, enableLocalStorage, enableValidation]);

  // Update configuration
  const updateConfig = (newConfig: Partial<WebsiteConfiguration>) => {
    try {
      const updatedConfig = mergeConfigs(config, newConfig);
      
      // Validate if enabled
      if (enableValidation) {
        const validationResult = validateConfig(updatedConfig);
        if (!validationResult.isValid) {
          setErrors(validationResult.errors);
          console.warn('Configuration update validation failed:', validationResult.errors);
          return; // Don't update if validation fails
        } else {
          setErrors([]);
        }
      }

      setConfig(updatedConfig);

      // Save to localStorage if enabled
      if (enableLocalStorage && typeof window !== 'undefined') {
        localStorage.setItem('website-config', JSON.stringify(updatedConfig));
      }
    } catch (error) {
      console.error('Failed to update configuration:', error);
      setErrors(['Failed to update configuration']);
    }
  };

  // Reset configuration to default
  const resetConfig = () => {
    setConfig(defaultConfig);
    setErrors([]);
    
    if (enableLocalStorage && typeof window !== 'undefined') {
      localStorage.removeItem('website-config');
    }
  };

  const contextValue: ConfigContextType = {
    config,
    updateConfig,
    resetConfig,
    isLoading,
    errors,
  };

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
}

// =============================================================================
// CONFIGURATION HOOKS
// =============================================================================

// Main hook to access configuration
export function useConfig(): ConfigContextType {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}

// Hook for theme configuration
export function useTheme() {
  const { config, updateConfig } = useConfig();
  
  return {
    theme: config.theme,
    updateTheme: (newTheme: Partial<typeof config.theme>) => {
      updateConfig({ theme: mergeConfigs(config.theme, newTheme) });
    },
  };
}

// Hook for content configuration
export function useContent() {
  const { config, updateConfig } = useConfig();
  
  return {
    content: config.content,
    updateContent: (newContent: Partial<typeof config.content>) => {
      updateConfig({ content: mergeConfigs(config.content, newContent) });
    },
  };
}

// Hook for assets configuration
export function useAssets() {
  const { config, updateConfig } = useConfig();
  
  return {
    assets: config.assets,
    updateAssets: (newAssets: Partial<typeof config.assets>) => {
      updateConfig({ assets: mergeConfigs(config.assets, newAssets) });
    },
  };
}

// Hook for features configuration
export function useFeatures() {
  const { config, updateConfig } = useConfig();
  
  return {
    features: config.features,
    updateFeatures: (newFeatures: Partial<typeof config.features>) => {
      updateConfig({ features: mergeConfigs(config.features, newFeatures) });
    },
  };
}

// Hook for business information
export function useBusiness() {
  const { config } = useConfig();
  return config.content.business;
}

// Hook for site information
export function useSite() {
  const { config } = useConfig();
  return config.content.site;
}

// Hook for navigation
export function useNavigation() {
  const { config, updateConfig } = useConfig();
  
  return {
    navigation: config.content.navigation,
    updateNavigation: (newNavigation: Partial<typeof config.content.navigation>) => {
      updateConfig({ 
        content: { 
          ...config.content, 
          navigation: mergeConfigs(config.content.navigation, newNavigation) 
        } 
      });
    },
  };
}

// Hook for page content
export function usePageContent<T extends keyof typeof config.content.pages>(
  page: T
): typeof config.content.pages[T] {
  const { config } = useConfig();
  return config.content.pages[page];
}

// Hook for SEO configuration
export function useSEO() {
  const { config, updateConfig } = useConfig();
  
  return {
    seo: config.content.seo,
    updateSEO: (newSEO: Partial<typeof config.content.seo>) => {
      updateConfig({ 
        content: { 
          ...config.content, 
          seo: mergeConfigs(config.content.seo, newSEO) 
        } 
      });
    },
  };
}

// Hook for color scheme
export function useColorScheme() {
  const { config } = useConfig();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check system preference
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDark(mediaQuery.matches);
      
      const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  return {
    colors: isDark ? config.theme.colors.dark : config.theme.colors.light,
    isDark,
    theme: config.theme,
  };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Deep merge two configuration objects
function mergeConfigs<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    if (source[key] !== undefined) {
      if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key]) &&
        typeof target[key] === 'object' &&
        target[key] !== null &&
        !Array.isArray(target[key])
      ) {
        result[key] = mergeConfigs(target[key], source[key]!);
      } else {
        result[key] = source[key]!;
      }
    }
  }

  return result;
}

// Export utility functions
export { mergeConfigs };