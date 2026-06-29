export type DnsRecordType =
  | 'A'
  | 'AAAA'
  | 'MX'
  | 'TXT'
  | 'NS'
  | 'SOA'
  | 'PTR'
  | 'SRV'
  | 'CNAME';

export interface CurlRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
}

export function generateCurl(request: CurlRequest): string {
  const parts = ['curl', '-X', request.method.toUpperCase()];

  for (const [key, value] of Object.entries(request.headers)) {
    parts.push('-H', `'${key}: ${value}'`);
  }

  if (request.body) {
    parts.push('-d', `'${request.body.replace(/'/g, "'\\''")}'`);
  }

  parts.push(`'${request.url}'`);

  return parts.join(' ');
}

export interface RegexTestResult {
  valid: boolean;
  matches: Array<{ match: string; index: number; groups: string[] }>;
  error?: string;
}

export function testRegex(pattern: string, flags: string, text: string): RegexTestResult {
  try {
    const regex = new RegExp(pattern, flags);
    const matches: RegexTestResult['matches'] = [];
    let match: RegExpExecArray | null;

    if (flags.includes('g')) {
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
        });
        if (match[0].length === 0) regex.lastIndex++;
      }
    } else {
      match = regex.exec(text);
      if (match) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
        });
      }
    }

    return { valid: true, matches };
  } catch (e) {
    return {
      valid: false,
      matches: [],
      error: e instanceof Error ? e.message : 'Invalid regex',
    };
  }
}

export function formatXml(xml: string): { valid: boolean; formatted?: string; error?: string } {
  try {
    const trimmed = xml.trim();
    if (!trimmed.startsWith('<')) {
      return { valid: false, error: 'Input does not appear to be XML' };
    }

    let formatted = '';
    let indent = 0;
    const lines = trimmed.replace(/>\s*</g, '><').split(/(?=<)|(?<=>)/).join('').split(/(?=<)/);

    for (const line of lines.filter(Boolean)) {
      if (line.match(/^<\/\w/)) indent = Math.max(0, indent - 1);
      formatted += '  '.repeat(indent) + line.trim() + '\n';
      if (line.match(/^<\w[^>]*[^/]>$/)) indent++;
    }

    return { valid: true, formatted: formatted.trim() };
  } catch (e) {
    return { valid: false, error: e instanceof Error ? e.message : 'Invalid XML' };
  }
}

export function validateDockerCompose(yaml: string): {
  valid: boolean;
  services?: string[];
  error?: string;
} {
  const lines = yaml.split('\n');
  if (!yaml.includes('services:') && !yaml.match(/^version:/m)) {
    return { valid: false, error: 'Missing services or version section' };
  }

  const services: string[] = [];
  let inServices = false;

  for (const line of lines) {
    if (line.match(/^services:\s*$/)) {
      inServices = true;
      continue;
    }
    if (inServices && line.match(/^\S/) && !line.startsWith(' ')) {
      inServices = false;
    }
    if (inServices) {
      const serviceMatch = line.match(/^  (\w[\w-]*):/);
      if (serviceMatch) services.push(serviceMatch[1]);
    }
  }

  if (services.length === 0 && !yaml.includes('services:')) {
    return { valid: false, error: 'No services defined' };
  }

  return { valid: true, services };
}

export function validateKubernetesYaml(yaml: string): {
  valid: boolean;
  kind?: string;
  apiVersion?: string;
  error?: string;
} {
  const kindMatch = yaml.match(/^kind:\s*(.+)$/m);
  const apiMatch = yaml.match(/^apiVersion:\s*(.+)$/m);

  if (!kindMatch || !apiMatch) {
    return { valid: false, error: 'Kubernetes manifest requires kind and apiVersion' };
  }

  return {
    valid: true,
    kind: kindMatch[1].trim(),
    apiVersion: apiMatch[1].trim(),
  };
}

export interface PemDecodeResult {
  valid: boolean;
  type?: string;
  content?: string;
  error?: string;
}

export function decodePem(input: string): PemDecodeResult {
  const trimmed = input.trim();
  const match = trimmed.match(
    /-----BEGIN ([A-Z ]+)-----\s*([\s\S]*?)\s*-----END \1-----/,
  );

  if (!match) {
    return { valid: false, error: 'Invalid PEM format' };
  }

  return {
    valid: true,
    type: match[1],
    content: match[2].replace(/\s/g, ''),
  };
}

export const DNS_RESOLVERS = [
  { name: 'Google', host: '8.8.8.8' },
  { name: 'Cloudflare', host: '1.1.1.1' },
  { name: 'Quad9', host: '9.9.9.9' },
  { name: 'OpenDNS', host: '208.67.222.222' },
];
