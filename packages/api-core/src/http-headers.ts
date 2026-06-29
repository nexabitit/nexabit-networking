const HEADER_CHECKS = [
  {
    key: 'strict-transport-security',
    name: 'Strict-Transport-Security (HSTS)',
    recommendation: 'Enforce HTTPS for all future requests.',
    required: true,
  },
  {
    key: 'content-security-policy',
    name: 'Content-Security-Policy',
    recommendation: 'Mitigate XSS and data injection attacks.',
    required: true,
  },
  {
    key: 'x-frame-options',
    name: 'X-Frame-Options',
    recommendation: 'Prevent clickjacking by controlling iframe embedding.',
    required: true,
  },
  {
    key: 'x-content-type-options',
    name: 'X-Content-Type-Options',
    recommendation: 'Set to nosniff to block MIME-type sniffing.',
    required: true,
  },
  {
    key: 'referrer-policy',
    name: 'Referrer-Policy',
    recommendation: 'Control how much referrer data is sent with requests.',
    required: false,
  },
  {
    key: 'permissions-policy',
    name: 'Permissions-Policy',
    recommendation: 'Restrict browser features such as camera and geolocation.',
    required: false,
  },
  {
    key: 'cross-origin-opener-policy',
    name: 'Cross-Origin-Opener-Policy',
    recommendation: 'Isolate browsing context from cross-origin documents.',
    required: false,
  },
  {
    key: 'cross-origin-resource-policy',
    name: 'Cross-Origin-Resource-Policy',
    recommendation: 'Control which origins may load this resource.',
    required: false,
  },
] as const;

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) throw new Error('URL is required');
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function analyzeHeaders(headers: Record<string, string>) {
  const lower = Object.fromEntries(
    Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]),
  );

  const checks = HEADER_CHECKS.map((check) => {
    const value = lower[check.key] ?? null;
    return {
      header: check.name,
      key: check.key,
      present: value !== null,
      value,
      recommendation: check.recommendation,
      required: check.required,
      status: value ? ('present' as const) : check.required ? ('missing' as const) : ('optional' as const),
    };
  });

  const requiredMissing = checks.filter((c) => c.required && !c.present).length;
  const optionalMissing = checks.filter((c) => !c.required && !c.present).length;
  const present = checks.filter((c) => c.present).length;

  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  if (requiredMissing === 0 && optionalMissing <= 1) grade = 'A';
  else if (requiredMissing === 0) grade = 'B';
  else if (requiredMissing === 1) grade = 'C';
  else if (requiredMissing === 2) grade = 'D';
  else grade = 'F';

  return {
    grade,
    present,
    total: checks.length,
    requiredMissing,
    optionalMissing,
    checks,
  };
}

export async function httpSecurityHeaders(input: string) {
  let url: string;
  try {
    url = normalizeUrl(input);
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Invalid URL' };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    let response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
    });

    if (response.status === 405 || response.status === 501) {
      response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
      });
    }

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const analysis = analyzeHeaders(headers);

    return {
      success: true,
      url: response.url,
      requestedUrl: url,
      status: response.status,
      statusText: response.statusText,
      headers,
      analysis,
    };
  } catch (e) {
    const message =
      e instanceof Error && e.name === 'AbortError'
        ? 'Request timed out'
        : e instanceof Error
          ? e.message
          : 'Request failed';
    return { success: false, url, error: message };
  } finally {
    clearTimeout(timeout);
  }
}
