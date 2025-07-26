"use client";

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps as NextThemeProviderProps,
} from "next-themes";
import type * as React from "react";

interface ThemeProviderProps extends NextThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
