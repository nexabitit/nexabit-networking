'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, Mail, Shield } from 'lucide-react';
import { SITE_CONFIG, TOOL_COUNT } from '@nexabit/shared';
import { useDeveloperAccount } from '@/hooks/use-developer-session';
import { getPendingVerificationCode } from '@/lib/developer-session';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PricingTeaser } from '@/components/portal/pricing-table';

const steps = [
  'Sign up or log in to the developer portal',
  'Verify your email address',
  'Create your first application',
  'Generate an API key (shown once)',
  'Test with the REST docs or your automation',
  'Monitor usage and upgrade when you need more quota',
];

export function DeveloperLanding() {
  return (
    <>
      <section className="mb-12 max-w-3xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
          Developer API
        </p>
        <h1 className="text-3xl font-bold md:text-4xl">Integrate {SITE_CONFIG.name}</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {SITE_CONFIG.name} is a professional Developer API platform for network, DNS, SSL, and
          diagnostics automation. Browser tools are available without login; programmatic access
          requires a verified developer account and an active API plan.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/developers/login" className={buttonVariants({ size: 'lg' })}>
            Log in / Sign up
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/pricing" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
            View API pricing
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          API keys are available after login and email verification. No account required to use tools
          in your browser.
        </p>
      </section>

      <section className="mb-12 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Who it&apos;s for</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Engineers, MSPs, and SaaS teams automating DNS, SSL, and network diagnostics in runbooks
            and monitoring pipelines.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Browser tools</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {TOOL_COUNT} diagnostic utilities — browse and run in your browser with no developer
            account required.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Developer API</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Gated programmatic access with Free Developer and paid monthly plans. Keys issued after
            login and email verification.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Team & workspace</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Personal workspace for browser retention; Team dashboard for Growth+ plans with shared
            MSP exports and operator seats.
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="mb-2 text-2xl font-bold">API plans</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Starting prices shown below.{' '}
          <Link href="/developers/login" className="text-primary hover:underline">
            Log in for full plan details
          </Link>{' '}
          and upgrades.
        </p>
        <PricingTeaser />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Onboarding flow</h2>
        <ol className="space-y-3">
          {steps.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl border border-border bg-muted/30 p-6">
        <h2 className="text-lg font-semibold">Authentication example</h2>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-background p-4 font-mono text-xs">
{`curl -H "X-API-Key: nxb_your_key_here" \\
  "https://${SITE_CONFIG.domain}/api/v1/network/ip-lookup?ip=8.8.8.8"`}
        </pre>
      </section>
    </>
  );
}

export function DeveloperAuthForm({ mode: initialMode = 'login' }: { mode?: 'login' | 'signup' }) {
  const router = useRouter();
  const { account, isVerified, signup, login, verifyEmail, requestReset, resetPassword } =
    useDeveloperAccount();
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>(initialMode);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [code, setCode] = useState('');
  const [resetPreviewCode, setResetPreviewCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pendingCode = account && !isVerified ? getPendingVerificationCode() : null;

  useEffect(() => {
    if (account && isVerified) {
      router.replace('/developers/dashboard');
    }
  }, [account, isVerified, router]);

  if (account && isVerified) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          Redirecting to dashboard…
        </CardContent>
      </Card>
    );
  }

  if (account && !isVerified) {
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Verify your email
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            API keys are issued only after email verification. Enter the 6-digit code sent to{' '}
            <strong>{account.email}</strong>.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingCode && (
            <p className="rounded-lg border border-dashed border-amber-500/40 bg-amber-500/5 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">
              Launch preview: your verification code is <strong>{pendingCode}</strong> (email
              delivery coming soon).
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="verify-code">Verification code</Label>
            <Input
              id="verify-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000000"
              maxLength={6}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            type="button"
            className="w-full"
            disabled={loading || code.length < 6}
            onClick={() => {
              setLoading(true);
              setError(null);
              const ok = verifyEmail(code);
              setLoading(false);
              if (!ok) setError('Invalid code. Check your email and try again.');
              else router.push('/developers/dashboard');
            }}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Verify and continue
          </Button>
        </CardContent>
      </Card>
    );
  }

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (mode === 'reset') {
        if (!resetPreviewCode) {
          const result = await requestReset(email);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          setResetPreviewCode(result.resetCode);
        } else {
          const result = await resetPassword(email, code, newPassword);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          setMode('login');
          setResetPreviewCode(null);
          setCode('');
          setNewPassword('');
          setError(null);
        }
        return;
      }
      if (mode === 'signup') {
        const result = await signup({ email, name, password });
        if (!result.ok) {
          setError(result.error);
          return;
        }
      } else {
        const result = await login(email, password);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        if (!result.needsVerification) {
          router.push('/developers/dashboard');
        }
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'reset') {
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Reset password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {resetPreviewCode && (
            <p className="rounded-lg border border-dashed border-amber-500/40 bg-amber-500/5 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">
              Preview: reset code <strong>{resetPreviewCode}</strong> (email via Microsoft Graph when
              configured).
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="reset-email">Account email</Label>
            <Input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={Boolean(resetPreviewCode)}
            />
          </div>
          {resetPreviewCode && (
            <>
              <div className="space-y-2">
                <Label htmlFor="reset-code">Reset code</Label>
                <Input id="reset-code" value={code} onChange={(e) => setCode(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reset-password">New password</Label>
                <Input
                  id="reset-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                />
              </div>
            </>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="button" className="w-full" disabled={loading || !email} onClick={submit}>
            {resetPreviewCode ? 'Update password' : 'Send reset code'}
          </Button>
          <button
            type="button"
            className="w-full text-center text-sm text-primary hover:underline"
            onClick={() => {
              setMode('login');
              setResetPreviewCode(null);
              setError(null);
            }}
          >
            Back to login
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Developer portal
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {mode === 'login' ? 'Log in to manage API keys and usage.' : 'Create a developer account.'}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {mode === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor="dev-name">Full name</Label>
            <Input id="dev-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="dev-email">Work email</Label>
          <Input
            id="dev-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dev-password">Password</Label>
          <Input
            id="dev-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
          />
        </div>
        {mode === 'login' && (
          <button
            type="button"
            className="text-xs text-primary hover:underline"
            onClick={() => {
              setMode('reset');
              setError(null);
            }}
          >
            Forgot password?
          </button>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          type="button"
          className="w-full"
          disabled={loading || !email || !password || (mode === 'signup' && !name)}
          onClick={submit}
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === 'login' ? 'Log in' : 'Create account'}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          {mode === 'login' ? (
            <>
              No account?{' '}
              <button type="button" className="text-primary hover:underline" onClick={() => setMode('signup')}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already registered?{' '}
              <button type="button" className="text-primary hover:underline" onClick={() => setMode('login')}>
                Log in
              </button>
            </>
          )}
        </p>
        <p className="text-center text-xs text-muted-foreground">
          <Link href="/developers" className="hover:underline">
            ← Back to developer overview
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
