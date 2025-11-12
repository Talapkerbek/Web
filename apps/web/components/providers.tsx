"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import {SessionProvider} from "next-auth/react";
import {NextIntlClientProvider} from "next-intl";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
        <SessionProvider>
          {children}
        </SessionProvider>
    </NextThemesProvider>
  )
}
