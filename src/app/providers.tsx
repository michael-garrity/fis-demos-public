"use client";

import QueryProvider from "@/providers/QueryProvider";
import { HeroUIProvider } from "@heroui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <HeroUIProvider>{children}</HeroUIProvider>
    </QueryProvider>
  );
}
