'use client';

import { createContext, useContext } from 'react';

const ToolSessionContext = createContext<{ slug: string; toolName: string } | null>(null);

export function ToolSessionProvider({
  slug,
  toolName,
  children,
}: {
  slug: string;
  toolName: string;
  children: React.ReactNode;
}) {
  return (
    <ToolSessionContext.Provider value={{ slug, toolName }}>{children}</ToolSessionContext.Provider>
  );
}

export function useToolSession() {
  const ctx = useContext(ToolSessionContext);
  if (!ctx) {
    throw new Error('useToolSession must be used within ToolSessionProvider');
  }
  return ctx;
}

export function useToolSessionOptional() {
  return useContext(ToolSessionContext);
}
