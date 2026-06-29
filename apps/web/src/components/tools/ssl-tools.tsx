'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiToolShell, useApiTool, API_URL } from './api-tool-shell';

export function SslCheckerTool() {
  const [hostname, setHostname] = useState('google.com');
  const { loading, result, run } = useApiTool(
    () =>
      fetch(`${API_URL}/api/v1/ssl/check?hostname=${encodeURIComponent(hostname)}`).then((r) => r.json()),
    () => hostname,
  );

  return (
    <ApiToolShell title="SSL Checker" onSubmit={run} loading={loading} result={result}>
      <div className="space-y-2">
        <Label htmlFor="hostname">Hostname</Label>
        <Input id="hostname" value={hostname} onChange={(e) => setHostname(e.target.value)} />
      </div>
    </ApiToolShell>
  );
}

export function SslExpiryTool() {
  const [hostname, setHostname] = useState('google.com');
  const { loading, result, run } = useApiTool(
    () =>
      fetch(`${API_URL}/api/v1/ssl/expiry?hostname=${encodeURIComponent(hostname)}`).then((r) => r.json()),
    () => hostname,
  );

  return (
    <ApiToolShell title="SSL Expiry Checker" onSubmit={run} loading={loading} result={result}>
      <div className="space-y-2">
        <Label htmlFor="hostname">Hostname</Label>
        <Input id="hostname" value={hostname} onChange={(e) => setHostname(e.target.value)} />
      </div>
    </ApiToolShell>
  );
}
