'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label, Select } from '@/components/ui/label';
import { ApiToolShell, useApiTool, API_URL } from './api-tool-shell';

const RECORD_TYPES = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'SOA', 'CNAME', 'SRV'];

export function DnsLookupTool() {
  const [domain, setDomain] = useState('google.com');
  const [type, setType] = useState('A');
  const { loading, result, run } = useApiTool(() =>
    fetch(`${API_URL}/api/v1/dns/lookup?domain=${encodeURIComponent(domain)}&type=${type}`).then((r) => r.json()),
  );

  return (
    <ApiToolShell title="DNS Lookup" onSubmit={run} loading={loading} result={result}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="domain">Domain</Label>
          <Input id="domain" value={domain} onChange={(e) => setDomain(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Record Type</Label>
          <Select id="type" value={type} onChange={(e) => setType(e.target.value)}>
            {RECORD_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </div>
      </div>
    </ApiToolShell>
  );
}

export function SpfCheckerTool() {
  const [domain, setDomain] = useState('google.com');
  const { loading, result, run } = useApiTool(() =>
    fetch(`${API_URL}/api/v1/dns/spf?domain=${encodeURIComponent(domain)}`).then((r) => r.json()),
  );

  return (
    <ApiToolShell title="SPF Checker" onSubmit={run} loading={loading} result={result}>
      <div className="space-y-2">
        <Label htmlFor="domain">Domain</Label>
        <Input id="domain" value={domain} onChange={(e) => setDomain(e.target.value)} />
      </div>
    </ApiToolShell>
  );
}

export function DkimCheckerTool() {
  const [domain, setDomain] = useState('google.com');
  const [selector, setSelector] = useState('google');
  const { loading, result, run } = useApiTool(() =>
    fetch(`${API_URL}/api/v1/dns/dkim?domain=${encodeURIComponent(domain)}&selector=${encodeURIComponent(selector)}`).then((r) => r.json()),
  );

  return (
    <ApiToolShell title="DKIM Checker" onSubmit={run} loading={loading} result={result}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="domain">Domain</Label>
          <Input id="domain" value={domain} onChange={(e) => setDomain(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="selector">Selector</Label>
          <Input id="selector" value={selector} onChange={(e) => setSelector(e.target.value)} />
        </div>
      </div>
    </ApiToolShell>
  );
}

export function DmarcCheckerTool() {
  const [domain, setDomain] = useState('google.com');
  const { loading, result, run } = useApiTool(() =>
    fetch(`${API_URL}/api/v1/dns/dmarc?domain=${encodeURIComponent(domain)}`).then((r) => r.json()),
  );

  return (
    <ApiToolShell title="DMARC Checker" onSubmit={run} loading={loading} result={result}>
      <div className="space-y-2">
        <Label htmlFor="domain">Domain</Label>
        <Input id="domain" value={domain} onChange={(e) => setDomain(e.target.value)} />
      </div>
    </ApiToolShell>
  );
}

export function DnsPropagationTool() {
  const [domain, setDomain] = useState('google.com');
  const [type, setType] = useState('A');
  const { loading, result, run } = useApiTool(() =>
    fetch(`${API_URL}/api/v1/dns/propagation?domain=${encodeURIComponent(domain)}&type=${type}`).then((r) => r.json()),
  );

  return (
    <ApiToolShell title="DNS Propagation" onSubmit={run} loading={loading} result={result}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="domain">Domain</Label>
          <Input id="domain" value={domain} onChange={(e) => setDomain(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Record Type</Label>
          <Select id="type" value={type} onChange={(e) => setType(e.target.value)}>
            {['A', 'AAAA', 'MX', 'TXT', 'NS'].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </div>
      </div>
    </ApiToolShell>
  );
}
