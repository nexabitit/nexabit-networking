'use client';

import {
  CodeBlock,
  DataTable,
  formatValue,
  GradeBadge,
  KeyValueTable,
  MetricCard,
  PermissionGrid,
  ProgressBar,
  SectionCard,
  StatusBadge,
  type Tone,
} from './result-ui';
import { IpGeoMap } from './ip-geo-map';

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function flattenObject(obj: Record<string, unknown>, prefix = ''): Array<{ key: string; value: unknown }> {
  const rows: Array<{ key: string; value: unknown }> = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (isObject(v) && !Array.isArray(v) && Object.keys(v).length <= 6) {
      rows.push(...flattenObject(v, key));
    } else {
      rows.push({ key, value: v });
    }
  }
  return rows;
}

function renderRecords(records: unknown): React.ReactNode {
  if (records === null || records === undefined) return '—';
  if (typeof records === 'string' || typeof records === 'number') return String(records);
  if (Array.isArray(records)) {
    if (records.length === 0) return '—';
    if (records.every((r) => typeof r === 'string' || typeof r === 'number')) {
      return (
        <ul className="space-y-1">
          {records.map((r, i) => (
            <li key={i} className="font-mono text-sm">
              {String(r)}
            </li>
          ))}
        </ul>
      );
    }
    if (records.every((r) => Array.isArray(r))) {
      return (
        <ul className="space-y-1">
          {(records as unknown[][]).map((r, i) => (
            <li key={i} className="font-mono text-sm">
              {r.join('')}
            </li>
          ))}
        </ul>
      );
    }
    return <CodeBlock content={JSON.stringify(records, null, 2)} />;
  }
  return formatValue(records);
}

function IpLookupView({ r }: { r: Record<string, unknown> }) {
  const locationLabel = [r.city, r.region, r.country].filter(Boolean).join(', ');

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="IP Address" value={r.ip} tone="info" />
        <MetricCard label="Country" value={r.country} />
        <MetricCard label="City" value={r.city} />
        <MetricCard label="Region" value={r.region} />
      </div>
      <IpGeoMap
        latitude={r.latitude}
        longitude={r.longitude}
        label={locationLabel || String(r.ip ?? '')}
      />
      <KeyValueTable
        rows={[
          { key: 'ISP', value: r.isp },
          { key: 'Organization', value: r.org },
          { key: 'ASN', value: r.asn },
          { key: 'Latitude', value: r.latitude },
          { key: 'Longitude', value: r.longitude },
        ]}
      />
    </div>
  );
}

function PortCheckView({ r }: { r: Record<string, unknown> }) {
  const open = r.open === true;
  return (
    <MetricCard
      label="TCP Port Status"
      value={open ? 'Open' : 'Closed'}
      tone={open ? 'success' : 'error'}
    />
  );
}

function CidrView({ r }: { r: Record<string, unknown> }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Network" value={`${r.network}/${r.cidr}`} tone="info" />
        <MetricCard label="Subnet Mask" value={r.subnetMask} />
        <MetricCard label="Usable Hosts" value={r.usableHosts} tone="success" />
        <MetricCard label="Total Hosts" value={r.totalHosts} />
      </div>
      <KeyValueTable
        rows={[
          { key: 'Broadcast', value: r.broadcast },
          { key: 'First Host', value: r.firstHost },
          { key: 'Last Host', value: r.lastHost },
          { key: 'Wildcard Mask', value: r.wildcardMask },
        ]}
      />
    </div>
  );
}

function DnsLookupView({ r }: { r: Record<string, unknown> }) {
  return (
    <SectionCard title={`${r.domain} · ${r.type}`}>
      <div className="space-y-3">
        <StatusBadge tone="success">Records found</StatusBadge>
        <div className="rounded-lg border border-border bg-muted/20 p-4">{renderRecords(r.records)}</div>
      </div>
    </SectionCard>
  );
}

function DnsPropagationView({ r }: { r: Record<string, unknown> }) {
  const results = (r.results as Array<Record<string, unknown>>) ?? [];
  return (
    <DataTable
      columns={[
        { key: 'resolver', label: 'Resolver' },
        { key: 'server', label: 'Server' },
        { key: 'status', label: 'Status' },
        { key: 'records', label: 'Records' },
      ]}
      rows={results.map((row) => ({
        resolver: String(row.resolver),
        server: <span className="font-mono text-xs">{String(row.server)}</span>,
        status: (
          <StatusBadge tone={row.success ? 'success' : 'error'}>
            {row.success ? 'OK' : 'Failed'}
          </StatusBadge>
        ),
        records: row.success ? renderRecords(row.records) : String(row.error ?? '—'),
      }))}
    />
  );
}

function BulkDnsView({ r }: { r: Record<string, unknown> }) {
  const results = (r.results as Array<Record<string, unknown>>) ?? [];
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Total" value={r.total} />
        <MetricCard label="Succeeded" value={r.succeeded} tone="success" />
        <MetricCard label="Failed" value={r.failed} tone={(r.failed as number) > 0 ? 'error' : 'neutral'} />
      </div>
      <DataTable
        columns={[
          { key: 'domain', label: 'Domain' },
          { key: 'status', label: 'Status' },
          { key: 'records', label: 'Records' },
        ]}
        rows={results.map((row) => ({
          domain: <span className="font-medium">{String(row.domain)}</span>,
          status: (
            <StatusBadge tone={row.success ? 'success' : 'error'}>
              {row.success ? 'OK' : 'Failed'}
            </StatusBadge>
          ),
          records: row.success ? renderRecords(row.records) : String(row.error ?? '—'),
        }))}
      />
    </div>
  );
}

function EmailAuthView({ r }: { r: Record<string, unknown> }) {
  const record = (r.spf ?? r.dmarc ?? r.records) as string | null | undefined;
  const valid = r.valid === true;
  return (
    <div className="space-y-4">
      <StatusBadge tone={valid ? 'success' : 'warning'}>
        {valid ? 'Record found' : 'Record missing or invalid'}
      </StatusBadge>
      {record && typeof record === 'string' && (
        <CodeBlock content={record} label="TXT Record" />
      )}
      {r.records != null && !record && (
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          {renderRecords(r.records)}
        </div>
      )}
    </div>
  );
}

function SslView({ r }: { r: Record<string, unknown> }) {
  const days = r.daysRemaining as number | null | undefined;
  let tone: Tone = 'success';
  if (r.expired) tone = 'error';
  else if (r.expiringSoon) tone = 'warning';

  const certRows: Array<{ key: string; value: unknown }> = [];
  if (r.subject) certRows.push({ key: 'Subject', value: formatValue(r.subject) });
  if (r.issuer) certRows.push({ key: 'Issuer', value: formatValue(r.issuer) });
  if (r.validFrom) certRows.push({ key: 'Valid From', value: formatValue(r.validFrom) });
  if (r.validTo) certRows.push({ key: 'Valid To', value: formatValue(r.validTo) });
  if (r.serialNumber) certRows.push({ key: 'Serial', value: formatValue(r.serialNumber) });
  if (r.fingerprint256) certRows.push({ key: 'SHA-256', value: formatValue(r.fingerprint256) });
  if (r.subjectAltName) certRows.push({ key: 'SAN', value: formatValue(r.subjectAltName) });

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Hostname" value={r.hostname} tone="info" />
        {days != null && (
          <MetricCard label="Days Remaining" value={days} tone={tone} />
        )}
        <MetricCard
          label="Status"
          value={r.expired ? 'Expired' : r.expiringSoon ? 'Expiring soon' : 'Valid'}
          tone={tone}
        />
      </div>
      {certRows.length > 0 && <KeyValueTable rows={certRows} columns={1} />}
    </div>
  );
}

function HttpHeadersView({ r }: { r: Record<string, unknown> }) {
  const analysis = r.analysis as {
    grade?: string;
    checks?: Array<{
      header: string;
      status: string;
      value: string | null;
      recommendation: string;
    }>;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-6">
        {analysis?.grade && <GradeBadge grade={analysis.grade} />}
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Response</p>
          <p className="font-mono text-sm">
            HTTP {String(r.status)} · {String(r.url)}
          </p>
        </div>
      </div>
      {analysis?.checks && (
        <DataTable
          columns={[
            { key: 'header', label: 'Header' },
            { key: 'status', label: 'Status' },
            { key: 'value', label: 'Value' },
          ]}
          rows={analysis.checks.map((c) => ({
            header: c.header,
            status: (
              <StatusBadge
                tone={
                  c.status === 'present' ? 'success' : c.status === 'missing' ? 'error' : 'neutral'
                }
              >
                {c.status}
              </StatusBadge>
            ),
            value: c.value ? (
              <span className="font-mono text-xs">{c.value}</span>
            ) : (
              <span className="text-muted-foreground">{c.recommendation}</span>
            ),
          }))}
        />
      )}
    </div>
  );
}

function SslMonitorView({ r }: { r: Record<string, unknown> }) {
  const results = (r.results as Array<Record<string, unknown>>) ?? [];
  return (
    <DataTable
      columns={[
        { key: 'hostname', label: 'Hostname' },
        { key: 'status', label: 'Status' },
        { key: 'days', label: 'Days left' },
        { key: 'expires', label: 'Expires' },
      ]}
      rows={results.map((row) => ({
        hostname: String(row.hostname),
        status: (
          <StatusBadge
            tone={
              row.expired ? 'error' : row.expiringSoon ? 'warning' : row.success ? 'success' : 'error'
            }
          >
            {row.expired ? 'Expired' : row.expiringSoon ? 'Expiring' : row.success ? 'OK' : 'Error'}
          </StatusBadge>
        ),
        days: row.daysRemaining ?? '—',
        expires: row.validTo ?? row.error ?? '—',
      }))}
    />
  );
}

function ValidationView({ r }: { r: Record<string, unknown> }) {
  const valid = r.valid === true;

  if (r.network && r.cidr != null) return <CidrView r={r} />;

  if (r.owner && r.group && r.others) {
    return (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <MetricCard label="Numeric" value={r.numeric} tone="info" />
          <MetricCard label="Symbolic" value={r.symbolic} tone="info" />
        </div>
        <PermissionGrid
          owner={r.owner as { read: boolean; write: boolean; execute: boolean }}
          group={r.group as { read: boolean; write: boolean; execute: boolean }}
          others={r.others as { read: boolean; write: boolean; execute: boolean }}
        />
      </div>
    );
  }

  if (r.label && r.score != null) {
    const score = r.score as number;
    const tone: Tone = score >= 4 ? 'success' : score >= 2 ? 'warning' : 'error';
    return (
      <div className="space-y-4">
        <MetricCard label="Strength" value={r.label} tone={tone} />
        <ProgressBar value={score} max={4} label="Score" tone={tone} />
        <MetricCard label="Entropy" value={`~${r.entropy} bits`} />
        {Array.isArray(r.feedback) && r.feedback.length > 0 && (
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            {(r.feedback as string[]).map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (r.formatted && typeof r.formatted === 'string') {
    return (
      <div className="space-y-3">
        <StatusBadge tone={valid ? 'success' : 'error'}>{valid ? 'Valid' : 'Invalid'}</StatusBadge>
        <CodeBlock content={r.formatted} label="Formatted output" />
      </div>
    );
  }

  if (r.description && valid) {
    return (
      <div className="space-y-3">
        <StatusBadge tone="success">Valid cron expression</StatusBadge>
        <p className="text-sm leading-relaxed text-muted-foreground">{String(r.description)}</p>
        {Array.isArray(r.nextRuns) && (
          <KeyValueTable
            rows={(r.nextRuns as string[]).slice(0, 5).map((run, i) => ({
              key: `Run ${i + 1}`,
              value: run,
            }))}
          />
        )}
      </div>
    );
  }

  if (r.services && Array.isArray(r.services)) {
    return (
      <div className="space-y-3">
        <StatusBadge tone="success">Valid Docker Compose</StatusBadge>
        <KeyValueTable
          rows={[{ key: 'Services', value: (r.services as string[]).join(', ') }]}
        />
      </div>
    );
  }

  if (r.kind && r.apiVersion) {
    return (
      <KeyValueTable
        rows={[
          { key: 'Kind', value: r.kind },
          { key: 'API Version', value: r.apiVersion },
          { key: 'Name', value: r.name },
        ]}
      />
    );
  }

  if (r.classification) {
    return (
      <KeyValueTable
        rows={[
          { key: 'Status', value: <StatusBadge tone={valid ? 'success' : 'error'}>{valid ? 'Valid' : 'Invalid'}</StatusBadge> },
          { key: 'Classification', value: r.classification },
          { key: 'Expanded', value: r.expanded },
        ]}
      />
    );
  }

  if (r.type && r.content) {
    return (
      <div className="space-y-3">
        <StatusBadge tone={valid ? 'success' : 'error'}>{String(r.type)}</StatusBadge>
        <CodeBlock content={String(r.content)} label="Decoded content" />
      </div>
    );
  }

  const extraRows = Object.entries(r).filter(
    ([k]) => !['valid', 'error', 'success'].includes(k),
  );
  if (valid && extraRows.length > 0) {
    return (
      <div className="space-y-3">
        <StatusBadge tone="success">Valid</StatusBadge>
        <KeyValueTable rows={extraRows.map(([key, value]) => ({ key, value: formatValue(value) }))} />
      </div>
    );
  }

  return null;
}

function RegexView({ r }: { r: Record<string, unknown> }) {
  const matches = r.matches as Array<Record<string, unknown>>;
  return (
    <div className="space-y-3">
      <StatusBadge tone="success">{matches.length} match(es)</StatusBadge>
      <DataTable
        columns={[
          { key: 'match', label: 'Match' },
          { key: 'index', label: 'Index' },
          { key: 'groups', label: 'Groups' },
        ]}
        rows={matches.map((m) => ({
          match: <span className="font-mono">{String(m.match ?? m[0] ?? '')}</span>,
          index: m.index ?? '—',
          groups: m.groups ? JSON.stringify(m.groups) : '—',
        }))}
      />
    </div>
  );
}

function JwtView({ r }: { r: Record<string, unknown> }) {
  return (
    <div className="space-y-4">
      <StatusBadge tone={r.valid ? 'success' : 'warning'}>
        {r.valid ? 'Valid structure' : 'Invalid token'}
      </StatusBadge>
      {r.header != null && <CodeBlock content={JSON.stringify(r.header, null, 2)} label="Header" />}
      {r.payload != null && <CodeBlock content={JSON.stringify(r.payload, null, 2)} label="Payload" />}
      {r.signature != null && (
        <KeyValueTable rows={[{ key: 'Signature', value: formatValue(r.signature) }]} />
      )}
    </div>
  );
}

function TextOutputView({ r }: { r: Record<string, unknown> }) {
  if (r.hash) {
    return (
      <div className="space-y-3">
        <KeyValueTable rows={[{ key: 'Algorithm', value: r.algorithm ?? '—' }]} />
        <CodeBlock content={String(r.hash)} label="Hash" />
      </div>
    );
  }
  if (r.output) return <CodeBlock content={String(r.output)} label={String(r.label ?? 'Output')} />;
  if (r.curl) return <CodeBlock content={String(r.curl)} label="cURL command" />;
  if (r.password) return <CodeBlock content={String(r.password)} label="Generated password" />;
  if (r.uuids && Array.isArray(r.uuids)) {
    return (
      <ul className="space-y-2">
        {(r.uuids as string[]).map((u) => (
          <li key={u} className="rounded-lg border border-border bg-muted/30 px-3 py-2 font-mono text-sm">
            {u}
          </li>
        ))}
      </ul>
    );
  }
  return null;
}

function WhoisView({ r }: { r: Record<string, unknown> }) {
  const data = r.data as Record<string, unknown> | undefined;
  if (!data) return null;
  const rows = flattenObject(data).map(({ key, value }) => ({ key, value: formatValue(value) }));
  return <KeyValueTable rows={rows.slice(0, 40)} columns={1} />;
}

function GenericView({ r }: { r: Record<string, unknown> }) {
  const skip = new Set(['success']);
  const entries = Object.entries(r).filter(([k]) => !skip.has(k));

  if (entries.length === 0) return null;

  const arrayEntry = entries.find(([, v]) => Array.isArray(v) && (v as unknown[]).length > 0);
  if (arrayEntry) {
    const [key, arr] = arrayEntry;
    const items = arr as Record<string, unknown>[];
    if (items.every((item) => isObject(item))) {
      const keys = [...new Set(items.flatMap((item) => Object.keys(item)))].slice(0, 8);
      return (
        <DataTable
          columns={keys.map((k) => ({ key: k, label: k }))}
          rows={items.map((item) =>
            Object.fromEntries(keys.map((k) => [k, formatValue(item[k])])),
          )}
        />
      );
    }
  }

  const flat = entries.filter(([, v]) => typeof v !== 'object' || v === null);
  if (flat.length > 0) {
    return (
      <KeyValueTable
        rows={flat.map(([key, value]) => ({ key, value: formatValue(value) }))}
      />
    );
  }

  return (
    <KeyValueTable
      rows={flattenObject(r)
        .filter(({ key }) => !skip.has(key))
        .map(({ key, value }) => ({ key, value: formatValue(value) }))}
      columns={1}
    />
  );
}

export function ResultView({ result }: { result: unknown }) {
  if (result === null || result === undefined) return null;

  const r = result as Record<string, unknown>;

  if (r.error && r.success !== true && r.valid !== true && r.open === undefined) {
    return (
      <SectionCard>
        <p className="text-sm text-destructive">{String(r.error)}</p>
        {r.serverless === true && (
          <p className="mt-2 text-xs text-muted-foreground">
            This diagnostic requires a VPS or Docker deployment for full functionality.
          </p>
        )}
      </SectionCard>
    );
  }

  if (r.open !== undefined) return <PortCheckView r={r} />;
  if (r.country || (r.ip && r.isp)) return <IpLookupView r={r} />;
  if (r.domain && r.type && r.records !== undefined && !r.results) return <DnsLookupView r={r} />;
  if (r.domain && Array.isArray(r.results) && (r.results[0] as Record<string, unknown>)?.resolver) {
    return <DnsPropagationView r={r} />;
  }
  if (r.total != null && Array.isArray(r.results) && (r.results[0] as Record<string, unknown>)?.domain) {
    return <BulkDnsView r={r} />;
  }
  if (r.spf !== undefined || r.dmarc !== undefined) return <EmailAuthView r={r} />;
  if (r.analysis && (r.analysis as Record<string, unknown>).checks) return <HttpHeadersView r={r} />;
  if (r.checked != null && Array.isArray(r.results) && (r.results[0] as Record<string, unknown>)?.hostname) {
    return <SslMonitorView r={r} />;
  }
  if (r.hostname && (r.validTo || r.subject || r.daysRemaining != null)) return <SslView r={r} />;
  if (r.valid !== undefined) {
    const inner = ValidationView({ r });
    if (inner) return inner;
  }
  if (Array.isArray(r.matches)) return <RegexView r={r} />;
  if (r.header !== undefined || (r.payload !== undefined && r.signature !== undefined)) return <JwtView r={r} />;
  if (r.hash || r.output || r.curl || r.password || r.uuids) return <TextOutputView r={r} />;
  if (r.query && r.data) return <WhoisView r={r} />;
  if (r.query && !r.data) return <GenericView r={r} />;

  return <GenericView r={r} />;
}
