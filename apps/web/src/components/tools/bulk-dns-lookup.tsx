'use client';

import { useRef, useState } from 'react';
import { Label, Select } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ApiToolShell, useApiTool, API_URL } from './api-tool-shell';
import { ResultPanel } from './result-panel';

const RECORD_TYPES = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME'];

function parseDomains(text: string): string[] {
  return text
    .split(/[\n,;]+/)
    .map((line) => line.trim().split(',')[0]?.trim() ?? '')
    .map((d) => d.replace(/^https?:\/\//, '').split('/')[0] ?? '')
    .filter(Boolean);
}

export function BulkDnsLookupTool() {
  const [domainsText, setDomainsText] = useState('google.com\ncloudflare.com\nnexabitit.com');
  const [type, setType] = useState('A');
  const fileRef = useRef<HTMLInputElement>(null);

  const { loading, result, run } = useApiTool(async () => {
    const domains = parseDomains(domainsText);
    const res = await fetch(`${API_URL}/api/v1/dns/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domains, type }),
    });
    return res.json();
  }, () => `${parseDomains(domainsText).length} domains (${type})`);

  const handleFile = async (file: File) => {
    const text = await file.text();
    setDomainsText(text);
  };

  return (
    <ApiToolShell
      title="Bulk DNS Lookup"
      description="Paste domains (one per line) or upload a CSV. Maximum 50 domains per run."
      onSubmit={run}
      loading={loading}
      result={result}
      resultFilename="bulk-dns-lookup"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="type">Record type</Label>
          <Select id="type" value={type} onChange={(e) => setType(e.target.value)}>
            {RECORD_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="domains">Domains</Label>
          <textarea
            id="domains"
            value={domainsText}
            onChange={(e) => setDomainsText(e.target.value)}
            rows={8}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-sm"
            placeholder={'example.com\nexample.org'}
          />
          <p className="text-xs text-muted-foreground">
            {parseDomains(domainsText).length} domain(s) detected (max 50)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.txt"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
          <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            Upload CSV / TXT
          </Button>
        </div>
      </div>
    </ApiToolShell>
  );
}
