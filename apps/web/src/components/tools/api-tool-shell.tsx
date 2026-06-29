'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { API_URL } from '@/lib/api-url';

export function ApiToolShell({
  title,
  children,
  onSubmit,
  loading,
  result,
}: {
  title: string;
  children: React.ReactNode;
  onSubmit: () => void;
  loading: boolean;
  result: unknown;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
        <Button onClick={onSubmit} disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Run
        </Button>
        {result !== null && result !== undefined && (
          <pre className="overflow-auto rounded-md bg-muted p-4 text-sm font-mono">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}

export function useApiTool<T>(fetcher: () => Promise<T>) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<T | null>(null);

  const run = async () => {
    setLoading(true);
    try {
      const data = await fetcher();
      setResult(data);
    } catch (e) {
      setResult({ error: e instanceof Error ? e.message : 'Request failed' } as T);
    } finally {
      setLoading(false);
    }
  };

  return { loading, result, run, setResult };
}

export { API_URL };
