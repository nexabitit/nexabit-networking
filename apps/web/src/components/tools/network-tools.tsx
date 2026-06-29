'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiToolShell, useApiTool, API_URL } from './api-tool-shell';

export function PortCheckerTool() {
  const [host, setHost] = useState('google.com');
  const [port, setPort] = useState('443');
  const { loading, result, run } = useApiTool(() =>
    fetch(`${API_URL}/api/v1/network/port-check?host=${encodeURIComponent(host)}&port=${port}`).then((r) => r.json()),
  );

  return (
    <ApiToolShell title="Port Checker" onSubmit={run} loading={loading} result={result}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="host">Host</Label>
          <Input id="host" value={host} onChange={(e) => setHost(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="port">Port</Label>
          <Input id="port" type="number" value={port} onChange={(e) => setPort(e.target.value)} />
        </div>
      </div>
    </ApiToolShell>
  );
}

export function PingTool() {
  const [host, setHost] = useState('8.8.8.8');
  const { loading, result, run } = useApiTool(() =>
    fetch(`${API_URL}/api/v1/network/ping?host=${encodeURIComponent(host)}`).then((r) => r.json()),
  );

  return (
    <ApiToolShell title="Ping" onSubmit={run} loading={loading} result={result}>
      <div className="space-y-2">
        <Label htmlFor="host">Host</Label>
        <Input id="host" value={host} onChange={(e) => setHost(e.target.value)} />
      </div>
    </ApiToolShell>
  );
}

export function TracerouteTool() {
  const [host, setHost] = useState('8.8.8.8');
  const { loading, result, run } = useApiTool(() =>
    fetch(`${API_URL}/api/v1/network/traceroute?host=${encodeURIComponent(host)}`).then((r) => r.json()),
  );

  return (
    <ApiToolShell title="Traceroute" onSubmit={run} loading={loading} result={result}>
      <div className="space-y-2">
        <Label htmlFor="host">Host</Label>
        <Input id="host" value={host} onChange={(e) => setHost(e.target.value)} />
      </div>
    </ApiToolShell>
  );
}

export function WhoisTool() {
  const [query, setQuery] = useState('google.com');
  const { loading, result, run } = useApiTool(() =>
    fetch(`${API_URL}/api/v1/network/whois?query=${encodeURIComponent(query)}`).then((r) => r.json()),
  );

  return (
    <ApiToolShell title="WHOIS Lookup" onSubmit={run} loading={loading} result={result}>
      <div className="space-y-2">
        <Label htmlFor="query">Domain or IP</Label>
        <Input id="query" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
    </ApiToolShell>
  );
}

export function AsnLookupTool() {
  const [query, setQuery] = useState('AS15169');
  const { loading, result, run } = useApiTool(() =>
    fetch(`${API_URL}/api/v1/network/asn-lookup?query=${encodeURIComponent(query)}`).then((r) => r.json()),
  );

  return (
    <ApiToolShell title="ASN Lookup" onSubmit={run} loading={loading} result={result}>
      <div className="space-y-2">
        <Label htmlFor="query">ASN or IP Prefix</Label>
        <Input id="query" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="AS15169 or 8.8.8.0/24" />
      </div>
    </ApiToolShell>
  );
}
