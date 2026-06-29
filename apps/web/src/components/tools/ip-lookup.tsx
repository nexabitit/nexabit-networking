'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiToolShell, useApiTool, API_URL } from './api-tool-shell';

export function IpLookupTool() {
  const [ip, setIp] = useState('8.8.8.8');
  const { loading, result, run } = useApiTool(
    () =>
      fetch(`${API_URL}/api/v1/network/ip-lookup?ip=${encodeURIComponent(ip)}`).then((r) => r.json()),
    () => ip,
  );

  return (
    <ApiToolShell title="IP Lookup" onSubmit={run} loading={loading} result={result} resultFilename="ip-lookup">
      <div className="space-y-2">
        <Label htmlFor="ip">IP Address</Label>
        <Input id="ip" value={ip} onChange={(e) => setIp(e.target.value)} placeholder="8.8.8.8" />
        <p className="text-xs text-muted-foreground">Example: 8.8.8.8, 1.1.1.1, 2001:4860:4860::8888</p>
      </div>
    </ApiToolShell>
  );
}
