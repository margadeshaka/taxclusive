"use client";

import {
  Download,
  Upload,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import React, { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useConfig,
  useTheme,
  useContent,
  useBusiness,
  validateConfig,
  exportConfig,
  importConfig,
  getConfigHealth,
} from "@/lib/config";

/**
 * Configuration Admin Panel
 * Provides a UI for managing website configuration
 */
export function ConfigAdmin() {
  const { config, updateConfig, resetConfig, isLoading, errors } = useConfig();
  const { theme, updateTheme } = useTheme();
  const { content, updateContent } = useContent();
  const business = useBusiness();

  const [activeTab, setActiveTab] = useState("overview");
  const [validationResult, setValidationResult] = useState(validateConfig(config));
  const [healthScore, setHealthScore] = useState(getConfigHealth(config));

  // Update validation when config changes
  React.useEffect(() => {
    setValidationResult(validateConfig(config));
    setHealthScore(getConfigHealth(config));
  }, [config]);

  const handleExport = () => {
    const configJson = exportConfig(config);
    const blob = new Blob([configJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `taxclusive-config-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const configJson = e.target?.result as string;
          const importedConfig = importConfig(configJson);
          updateConfig(importedConfig);
        } catch (error) {
          console.error("Failed to import configuration:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading configuration...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Configuration Admin</h1>
            <p className="text-muted-foreground">Manage your website configuration</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Config
            </Button>
            <div className="relative">
              <Input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Import Config
              </Button>
            </div>
            <Button onClick={resetConfig} variant="destructive">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Health Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Configuration Health
              <Badge
                variant={
                  healthScore.score > 80
                    ? "default"
                    : healthScore.score > 60
                      ? "secondary"
                      : "destructive"
                }
              >
                {healthScore.score}/100
              </Badge>
            </CardTitle>
            <CardDescription>Overall health score of your website configuration</CardDescription>
          </CardHeader>
          <CardContent>
            {errors.length > 0 && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Configuration Errors</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-4 mt-2">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {validationResult.warnings.length > 0 && (
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warnings</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-4 mt-2">
                    {validationResult.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {validationResult.deprecated.length > 0 && (
              <Alert variant="secondary" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Deprecated Fields</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-4 mt-2">
                    {validationResult.deprecated.map((deprecated, index) => (
                      <li key={index}>{deprecated}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {healthScore.suggestions.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Suggestions:</h4>
                <ul className="list-disc pl-4 space-y-1">
                  {healthScore.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Configuration Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewTab config={config} />
          </TabsContent>

          <TabsContent value="theme" className="space-y-6">
            <ThemeTab theme={theme} updateTheme={updateTheme} />
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <ContentTab content={content} updateContent={updateContent} />
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            <BusinessTab business={business} updateContent={updateContent} />
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <FeaturesTab config={config} updateConfig={updateConfig} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Individual tab components
function OverviewTab({ config }: { config: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <Label className="text-sm text-muted-foreground">Name</Label>
            <p className="font-medium">{config.content.site.name}</p>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Version</Label>
            <p className="font-medium">{config.version}</p>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Environment</Label>
            <Badge variant="secondary">{config.environment}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <Label className="text-sm text-muted-foreground">Theme Name</Label>
            <p className="font-medium">{config.theme.name}</p>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Primary Font</Label>
            <p className="font-medium">{config.theme.fonts.primary.family}</p>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Secondary Font</Label>
            <p className="font-medium">{config.theme.fonts.secondary.family}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Dark Mode</span>
            <Badge variant={config.features.features.darkMode ? "default" : "secondary"}>
              {config.features.features.darkMode ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Blog</span>
            <Badge variant={config.features.features.blog ? "default" : "secondary"}>
              {config.features.features.blog ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Animations</span>
            <Badge variant={config.features.features.animations ? "default" : "secondary"}>
              {config.features.features.animations ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ThemeTab({ theme, updateTheme }: { theme: any; updateTheme: any }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
          <CardDescription>Customize the visual appearance of your website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme-name">Theme Name</Label>
            <Input
              id="theme-name"
              value={theme.name}
              onChange={(e) => updateTheme({ name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-font">Primary Font</Label>
              <Select
                value={theme.fonts.primary.family}
                onValueChange={(value) =>
                  updateTheme({
                    fonts: {
                      ...theme.fonts,
                      primary: { ...theme.fonts.primary, family: value },
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Poppins">Poppins</SelectItem>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary-font">Secondary Font</Label>
              <Select
                value={theme.fonts.secondary.family}
                onValueChange={(value) =>
                  updateTheme({
                    fonts: {
                      ...theme.fonts,
                      secondary: { ...theme.fonts.secondary, family: value },
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                  <SelectItem value="Merriweather">Merriweather</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Color Palette</CardTitle>
          <CardDescription>Preview of current color scheme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(theme.colors.light.primary).map(([shade, color]) => (
              <div key={shade} className="text-center">
                <div
                  className="w-full h-12 rounded border border-border"
                  style={{ backgroundColor: color as string }}
                />
                <p className="text-xs mt-1">{shade}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ContentTab({ content, updateContent }: { content: any; updateContent: any }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
          <CardDescription>Basic information about your website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-name">Site Name</Label>
            <Input
              id="site-name"
              value={content.site.name}
              onChange={(e) =>
                updateContent({
                  site: { ...content.site, name: e.target.value },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-tagline">Tagline</Label>
            <Input
              id="site-tagline"
              value={content.site.tagline}
              onChange={(e) =>
                updateContent({
                  site: { ...content.site, tagline: e.target.value },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-description">Description</Label>
            <Textarea
              id="site-description"
              value={content.site.description}
              rows={3}
              onChange={(e) =>
                updateContent({
                  site: { ...content.site, description: e.target.value },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Home Page Content</CardTitle>
          <CardDescription>Content for your homepage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hero-title">Hero Title</Label>
            <Input
              id="hero-title"
              value={content.pages.home.hero.title}
              onChange={(e) =>
                updateContent({
                  pages: {
                    ...content.pages,
                    home: {
                      ...content.pages.home,
                      hero: { ...content.pages.home.hero, title: e.target.value },
                    },
                  },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
            <Input
              id="hero-subtitle"
              value={content.pages.home.hero.subtitle}
              onChange={(e) =>
                updateContent({
                  pages: {
                    ...content.pages,
                    home: {
                      ...content.pages.home,
                      hero: { ...content.pages.home.hero, subtitle: e.target.value },
                    },
                  },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-description">Hero Description</Label>
            <Textarea
              id="hero-description"
              value={content.pages.home.hero.description}
              rows={3}
              onChange={(e) =>
                updateContent({
                  pages: {
                    ...content.pages,
                    home: {
                      ...content.pages.home,
                      hero: { ...content.pages.home.hero, description: e.target.value },
                    },
                  },
                })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BusinessTab({ business, updateContent }: { business: any; updateContent: any }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>Your company details and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="legal-name">Legal Name</Label>
              <Input
                id="legal-name"
                value={business.legalName}
                onChange={(e) =>
                  updateContent({
                    business: { ...business, legalName: e.target.value },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input
                id="display-name"
                value={business.displayName}
                onChange={(e) =>
                  updateContent({
                    business: { ...business, displayName: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="business-description">Business Description</Label>
            <Textarea
              id="business-description"
              value={business.description}
              rows={3}
              onChange={(e) =>
                updateContent({
                  business: { ...business, description: e.target.value },
                })
              }
            />
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={business.contact.phone}
                onChange={(e) =>
                  updateContent({
                    business: {
                      ...business,
                      contact: { ...business.contact, phone: e.target.value },
                    },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={business.contact.email}
                onChange={(e) =>
                  updateContent({
                    business: {
                      ...business,
                      contact: { ...business.contact, email: e.target.value },
                    },
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FeaturesTab({ config, updateConfig }: { config: any; updateConfig: any }) {
  const features = config.features.features;

  const toggleFeature = (featureName: string) => {
    updateConfig({
      features: {
        ...config.features,
        features: {
          ...features,
          [featureName]: !features[featureName],
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Website Features</CardTitle>
          <CardDescription>Enable or disable various website features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(features).map(([featureName, enabled]) => (
            <div key={featureName} className="flex items-center justify-between">
              <div>
                <Label className="font-medium">
                  {featureName.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {getFeatureDescription(featureName)}
                </p>
              </div>
              <Button
                variant={enabled ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFeature(featureName)}
              >
                {enabled ? "Enabled" : "Disabled"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function getFeatureDescription(featureName: string): string {
  const descriptions: Record<string, string> = {
    darkMode: "Allow users to switch between light and dark themes",
    multiLanguage: "Support for multiple languages",
    blog: "Enable blog functionality",
    testimonials: "Show customer testimonials",
    newsletter: "Newsletter signup functionality",
    search: "Site-wide search functionality",
    breadcrumbs: "Navigation breadcrumbs",
    progressIndicators: "Loading progress indicators",
    animations: "Enable CSS animations and transitions",
    lazyLoading: "Lazy load images and content",
    infiniteScroll: "Infinite scroll for long lists",
    socialSharing: "Social media sharing buttons",
    printFriendly: "Print-optimized layouts",
    offline: "Offline functionality",
    pwa: "Progressive Web App features",
  };

  return descriptions[featureName] || "Feature configuration";
}

export default ConfigAdmin;
