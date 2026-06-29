'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiToolShell, useApiTool, API_URL } from './api-tool-shell';

export function HttpSecurityHeadersTool() {
  const [url, setUrl] = useState('https://nexabitit.com');
  const { loading, result, run } = useApiTool(
    () =>
      fetch(`${API_URL}/api/v1/network/http-headers?url=${encodeURIComponent(url)}`).then((r) =>
        r.json(),
      ),
    () => url,
  );

  return (
    <ApiToolShell
      title="HTTP Security Headers Checker"
      description="Enter a URL to analyze security-related HTTP response headers."
      onSubmit={run}
      loading={loading}
      result={result}
      resultFilename="http-security-headers"
    >
      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground">
          Examples: nexabitit.com · https://google.com
        </p>
      </div>
    </ApiToolShell>
  );
}
