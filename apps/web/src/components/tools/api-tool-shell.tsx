'use client';

import { useState } from 'react';
import { ToolWorkspace } from './tool-workspace';
import { API_URL } from '@/lib/api-url';
import { useToolSessionOptional } from './tool-session-context';
import { addRecentCheck, isResultError } from '@/lib/user-session';

export function ApiToolShell({
  title,
  description,
  children,
  onSubmit,
  loading,
  result,
  resultFilename,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit: () => void;
  loading: boolean;
  result: unknown;
  resultFilename?: string;
}) {
  return (
    <ToolWorkspace
      title={title}
      description={description}
      onSubmit={onSubmit}
      loading={loading}
      result={result}
      resultFilename={resultFilename}
    >
      {children}
    </ToolWorkspace>
  );
}

export function useApiTool<T>(fetcher: () => Promise<T>, inputLabel?: string | (() => string)) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<T | null>(null);
  const session = useToolSessionOptional();

  const run = async () => {
    setLoading(true);
    try {
      const data = await fetcher();
      setResult(data);

      if (session && !isResultError(data)) {
        const label =
          typeof inputLabel === 'function' ? inputLabel() : inputLabel?.trim();
        if (label) {
          addRecentCheck({
            toolSlug: session.slug,
            toolName: session.toolName,
            input: label,
          });
        }
      }
    } catch (e) {
      setResult({ error: e instanceof Error ? e.message : 'Request failed' } as T);
    } finally {
      setLoading(false);
    }
  };

  return { loading, result, run, setResult };
}

export { API_URL };
