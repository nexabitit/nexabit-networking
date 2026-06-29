'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Key, Loader2, Trash2, Check, Lock } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStoredApiKey } from '@/hooks/use-team-session';
import { API_URL } from '@/lib/api-url';

interface ApiKeyManagerProps {
  id?: string;
  requireVerified?: boolean;
  developerEmail?: string;
  developerName?: string;
  maxKeys?: number;
}

export function ApiKeyManager({
  id,
  requireVerified = false,
  developerEmail = '',
  developerName = '',
  maxKeys = 1,
}: ApiKeyManagerProps) {
  const { key, meta, store, clear } = useStoredApiKey();
  const [email, setEmail] = useState(developerEmail);
  const [name, setName] = useState(developerName);
  const [keyName, setKeyName] = useState('Production');
  const [appName, setAppName] = useState('Default app');
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<unknown>(null);
  const [copied, setCopied] = useState(false);

  if (requireVerified && !developerEmail) {
    return (
      <Card id={id}>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          <Lock className="mx-auto mb-2 h-6 w-6" />
          <Link href="/developers/login" className={buttonVariants({ size: 'sm' })}>
            Log in and verify email to create API keys
          </Link>
        </CardContent>
      </Card>
    );
  }

  const atKeyLimit = meta && maxKeys <= 1;

  const createKey = async () => {
    setLoading(true);
    setError(null);
    setNewKey(null);
    try {
      const res = await fetch(`${API_URL}/api/v1/account/keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email || developerEmail,
          name: name || developerName,
          keyName: `${keyName} (${appName})`,
          teamName: teamName || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to create key');
        return;
      }
      setNewKey(data.apiKey);
      store(data.apiKey, {
        name: data.key.name,
        tier: data.key.tier,
        rateLimit: data.key.rateLimit,
      });
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const verifyKey = async () => {
    if (!key) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/v1/account/verify`, {
        headers: { 'X-API-Key': key },
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? 'Invalid key');
      else setUsage(data);
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const loadUsage = async () => {
    if (!key) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/account/usage`, {
        headers: { 'X-API-Key': key },
      });
      setUsage(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const copyKey = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card id={id}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Key className="h-5 w-5" />
          API keys
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Keys are shown once at creation, hashed in storage, and tied to your account. Pass as{' '}
          <code className="rounded bg-muted px-1">X-API-Key</code> on requests. Plan limit:{' '}
          {maxKeys} active key{maxKeys === 1 ? '' : 's'}.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {key && meta ? (
          <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm">
            <p className="font-medium">{meta.name}</p>
            <p className="font-mono text-muted-foreground">{meta.prefix}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Tier: {meta.tier} · {meta.rateLimit}/min
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="outline" onClick={verifyKey} disabled={loading}>
                Verify key
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={loadUsage} disabled={loading}>
                Load usage
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={clear}>
                <Trash2 className="h-3.5 w-3.5" />
                Revoke locally
              </Button>
            </div>
          </div>
        ) : null}

        {newKey && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              New API key — copy now (shown once)
            </p>
            <code className="mt-2 block break-all rounded bg-background p-2 text-xs">{newKey}</code>
            <Button type="button" size="sm" className="mt-2" onClick={() => copyKey(newKey)}>
              {copied ? <Check className="h-3.5 w-3.5" /> : 'Copy key'}
            </Button>
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        {usage ? (
          <pre className="max-h-48 overflow-auto rounded-lg bg-muted p-3 text-xs">
            {JSON.stringify(usage, null, 2)}
          </pre>
        ) : null}

        {!atKeyLimit && (
          <>
            <div className="grid gap-4 sm:grid-cols-2" id="create-key">
              {!requireVerified && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="api-email">Work email</Label>
                    <Input
                      id="api-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api-name">Your name</Label>
                    <Input id="api-name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="app-name">Application</Label>
                <Input id="app-name" value={appName} onChange={(e) => setAppName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="key-name">Key label / environment</Label>
                <Input id="key-name" value={keyName} onChange={(e) => setKeyName(e.target.value)} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="team-name">Team name (optional)</Label>
                <Input id="team-name" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
              </div>
            </div>

            <Button
              type="button"
              onClick={createKey}
              disabled={
                loading ||
                (!requireVerified && (!email || !name)) ||
                (requireVerified && (!developerEmail || !developerName))
              }
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Generate API key
            </Button>
          </>
        )}

        {atKeyLimit && !newKey && (
          <p className="text-sm text-muted-foreground">
            You have reached the active key limit for your plan. Revoke the local key or upgrade at{' '}
            <Link href="/developers/dashboard#pricing" className="text-primary hover:underline">
              Pricing
            </Link>
            .
          </p>
        )}
      </CardContent>
    </Card>
  );
}
