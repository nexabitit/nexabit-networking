'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ApiToolShell, useApiTool, API_URL } from './api-tool-shell';

export function IpLookupTool() {
  const [ip, setIp] = useState('8.8.8.8');
  const { loading, result, run } = useApiTool(() =>
    fetch(`${API_URL}/api/v1/network/ip-lookup?ip=${encodeURIComponent(ip)}`).then((r) => r.json()),
  );

  return (
    <ApiToolShell title="IP Lookup" onSubmit={run} loading={loading} result={result}>
      <div className="space-y-2">
        <Label htmlFor="ip">IP Address</Label>
        <Input id="ip" value={ip} onChange={(e) => setIp(e.target.value)} placeholder="8.8.8.8" />
      </div>
    </ApiToolShell>
  );
}
