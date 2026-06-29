'use client';

import { useState } from 'react';
import { Check, Copy, Download, Link2, Braces, LayoutList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResultView } from './result-view';
import { cn } from '@/lib/utils';

export function summarizeResult(result: unknown): {
  variant: 'idle' | 'success' | 'error';
  title: string;
  detail: string;
} {
  if (result === null || result === undefined) {
    return {
      variant: 'idle',
      title: 'Awaiting input',
      detail: 'Configure the fields above and run the tool to see results.',
    };
  }

  const r = result as Record<string, unknown>;

  if (r.error && r.success !== true && r.valid !== true && r.open === undefined) {
    return { variant: 'error', title: 'Error', detail: String(r.error) };
  }
  if (r.success === false) {
    return {
      variant: 'error',
      title: 'Request failed',
      detail: String(r.error || r.message || 'The operation did not complete successfully.'),
    };
  }
  if (r.open === false) {
    return {
      variant: 'error',
      title: 'Port closed',
      detail: String(r.error || 'No TCP connection could be established.'),
    };
  }
  if (r.open === true) {
    return { variant: 'success', title: 'Port open', detail: 'TCP connection succeeded.' };
  }
  if (r.valid === false) {
    return {
      variant: 'error',
      title: 'Validation failed',
      detail: String(r.error || 'Input did not pass validation.'),
    };
  }
  if (r.valid === true) {
    const detail =
      typeof r.network === 'string'
        ? `Network ${r.network}${r.cidr != null ? `/${r.cidr}` : ''}`
        : 'Input passed validation checks.';
    return { variant: 'success', title: 'Valid', detail };
  }
  if (r.expired === true) {
    return { variant: 'error', title: 'Certificate expired', detail: 'SSL certificate has expired.' };
  }
  if (r.expiringSoon === true) {
    return {
      variant: 'success',
      title: 'Expiring soon',
      detail: `Certificate expires in ${r.daysRemaining} days.`,
    };
  }
  const analysis = r.analysis as { grade?: string; requiredMissing?: number } | undefined;
  if (analysis?.grade) {
    const missing = analysis.requiredMissing ?? 0;
    return {
      variant: missing > 0 ? 'error' : 'success',
      title: `Security grade ${analysis.grade}`,
      detail:
        missing > 0
          ? `${missing} required header(s) missing.`
          : 'All required security headers present.',
    };
  }
  if (r.success === true || r.country || r.records || r.hops || r.formatted) {
    return { variant: 'success', title: 'Completed', detail: 'Results are ready below.' };
  }

  return { variant: 'success', title: 'Completed', detail: 'Results are ready below.' };
}

export function ExportActions({
  data,
  filename = 'nexabit-result',
}: {
  data: unknown;
  filename?: string;
}) {
  const [copied, setCopied] = useState<'copy' | 'link' | null>(null);

  if (data === null || data === undefined) return null;

  const json = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(json);
    setCopied('copy');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied('link');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
        {copied === 'copy' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        Copy JSON
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={handleDownload}>
        <Download className="h-3.5 w-3.5" />
        Download
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={handleShare}>
        {copied === 'link' ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
        Share link
      </Button>
    </div>
  );
}

export function ResultSummary({ result }: { result: unknown }) {
  const summary = summarizeResult(result);
  const styles = {
    idle: 'border-border bg-muted/50 text-muted-foreground',
    success: 'border-success/30 bg-success/5 text-success',
    error: 'border-destructive/30 bg-destructive/5 text-destructive',
  };

  return (
    <div className={`rounded-xl border px-4 py-3 ${styles[summary.variant]}`}>
      <p className="font-semibold">{summary.title}</p>
      <p className="mt-0.5 text-sm opacity-90">{summary.detail}</p>
    </div>
  );
}

export function ResultPanel({
  result,
  filename,
}: {
  result: unknown;
  filename?: string;
}) {
  const [view, setView] = useState<'visual' | 'json'>('visual');

  if (result === null || result === undefined) return null;

  const hasVisual =
    typeof result === 'object' &&
    result !== null &&
    !(
      Object.keys(result as object).length === 1 &&
      'error' in (result as object) &&
      (result as Record<string, unknown>).success === undefined
    );

  return (
    <div className="space-y-3">
      <ResultSummary result={result} />
      <ExportActions data={result} filename={filename} />

      <div className="flex gap-1 rounded-lg border border-border bg-muted/30 p-1 w-fit">
        <button
          type="button"
          onClick={() => setView('visual')}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
            view === 'visual' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <LayoutList className="h-3.5 w-3.5" />
          Visual
        </button>
        <button
          type="button"
          onClick={() => setView('json')}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
            view === 'json' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <Braces className="h-3.5 w-3.5" />
          JSON
        </button>
      </div>

      {view === 'visual' && hasVisual ? (
        <div className="rounded-xl border border-border bg-card p-4">
          <ResultView result={result} />
        </div>
      ) : (
        <pre className="max-h-[480px] overflow-auto rounded-xl border border-border bg-slate-950 p-4 text-sm font-mono leading-relaxed text-slate-100 dark:bg-slate-900">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
