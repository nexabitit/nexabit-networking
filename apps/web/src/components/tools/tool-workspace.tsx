'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ResultPanel } from './result-panel';

export function ToolWorkspace({
  title,
  description,
  children,
  onSubmit,
  loading,
  result,
  submitLabel = 'Run',
  resultFilename,
  liveResult = false,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  loading?: boolean;
  result?: unknown;
  submitLabel?: string;
  resultFilename?: string;
  /** Always show results panel (e.g. live-updating client tools) */
  liveResult?: boolean;
}) {
  return (
    <div className="space-y-6">
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="border-b border-border/60 bg-muted/20">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-4">{children}</div>
          {onSubmit && (
            <Button onClick={onSubmit} disabled={loading} className="min-w-[120px]">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitLabel}
            </Button>
          )}
        </CardContent>
      </Card>

      {(onSubmit || liveResult || result !== null) && (
        <section aria-label="Tool results">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Results
          </h2>
          <ResultPanel result={result ?? null} filename={resultFilename} />
        </section>
      )}
    </div>
  );
}
