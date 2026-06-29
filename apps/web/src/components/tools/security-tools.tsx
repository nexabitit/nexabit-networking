'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label, Select } from '@/components/ui/label';
import {
  generatePassword,
  generateUuid,
  hashText,
  base64Encode,
  base64Decode,
  decodeJwt,
  urlEncode,
  urlDecode,
  htmlEncode,
  htmlDecode,
  type HashAlgorithm,
} from '@nexabit/crypto';
import { checkPasswordStrength } from '@nexabit/validators';
import { ClientToolShell } from './client-tool-shell';

function TextareaLike({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    />
  );
}

export function PasswordGeneratorTool() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: true });

  const generate = () => setPassword(generatePassword({ length, ...opts }));

  return (
    <ClientToolShell
      title="Password Generator"
      result={password ? { password } : null}
      resultFilename="password"
      showResults={!!password}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Length: {length}</Label>
          <input type="range" min={8} max={64} value={length} onChange={(e) => setLength(+e.target.value)} className="w-full" />
        </div>
        <div className="flex flex-wrap gap-4">
          {(['uppercase', 'lowercase', 'numbers', 'symbols'] as const).map((k) => (
            <label key={k} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={opts[k]} onChange={(e) => setOpts({ ...opts, [k]: e.target.checked })} />
              {k}
            </label>
          ))}
        </div>
        <Button onClick={generate}>Generate</Button>
      </div>
    </ClientToolShell>
  );
}

export function PasswordStrengthTool() {
  const [password, setPassword] = useState('');
  const result = password ? checkPasswordStrength(password) : null;

  return (
    <ClientToolShell
      title="Password Strength Checker"
      result={result}
      resultFilename="password-strength"
      showResults={!!password}
    >
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password to analyze"
      />
    </ClientToolShell>
  );
}

export function HashGeneratorTool() {
  const [text, setText] = useState('');
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [result, setResult] = useState<{ algorithm: string; hash: string } | null>(null);

  const generate = async () => {
    if (!text) return;
    setResult({ algorithm, hash: await hashText(text, algorithm) });
  };

  return (
    <ClientToolShell title="Hash Generator" result={result} resultFilename="hash" showResults={!!result}>
      <div className="space-y-4">
        <TextareaLike value={text} onChange={setText} placeholder="Text to hash" />
        <Select value={algorithm} onChange={(e) => setAlgorithm(e.target.value as HashAlgorithm)}>
          {(['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const).map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </Select>
        <Button onClick={generate}>Generate Hash</Button>
      </div>
    </ClientToolShell>
  );
}

export function JwtDecoderTool() {
  const [token, setToken] = useState('');
  const result = token.trim() ? decodeJwt(token) : null;

  return (
    <ClientToolShell title="JWT Decoder" result={result} resultFilename="jwt" showResults={!!token.trim()}>
      <TextareaLike value={token} onChange={setToken} placeholder="Paste JWT token" rows={4} />
    </ClientToolShell>
  );
}

export function Base64Tool() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const decoded = text ? base64Decode(text) : null;
  const output =
    mode === 'encode'
      ? text
        ? base64Encode(text)
        : ''
      : decoded?.text || decoded?.error || '';

  const result = output
    ? { output, label: mode === 'encode' ? 'Base64 encoded' : 'Base64 decoded', mode }
    : null;

  return (
    <ClientToolShell title="Base64 Encode / Decode" result={result} resultFilename="base64" showResults={!!output}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button variant={mode === 'encode' ? 'default' : 'outline'} size="sm" onClick={() => setMode('encode')}>
            Encode
          </Button>
          <Button variant={mode === 'decode' ? 'default' : 'outline'} size="sm" onClick={() => setMode('decode')}>
            Decode
          </Button>
        </div>
        <TextareaLike value={text} onChange={setText} placeholder="Input" />
      </div>
    </ClientToolShell>
  );
}

export function UrlEncoderTool() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'url-encode' | 'url-decode' | 'html-encode' | 'html-decode'>('url-encode');

  const output = text
    ? {
        'url-encode': urlEncode(text),
        'url-decode': urlDecode(text),
        'html-encode': htmlEncode(text),
        'html-decode': htmlDecode(text),
      }[mode]
    : '';

  const result = output ? { output, label: mode.replace('-', ' ') } : null;

  return (
    <ClientToolShell title="URL / HTML Encode & Decode" result={result} resultFilename="url-encode" showResults={!!output}>
      <div className="space-y-4">
        <Select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
          <option value="url-encode">URL Encode</option>
          <option value="url-decode">URL Decode</option>
          <option value="html-encode">HTML Encode</option>
          <option value="html-decode">HTML Decode</option>
        </Select>
        <TextareaLike value={text} onChange={setText} placeholder="Input" />
      </div>
    </ClientToolShell>
  );
}

export function UuidGeneratorTool() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);

  const generate = () => setUuids(Array.from({ length: count }, () => generateUuid()));

  return (
    <ClientToolShell
      title="UUID Generator"
      result={uuids.length ? { uuids } : null}
      resultFilename="uuids"
      showResults={uuids.length > 0}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Label>Count: {count}</Label>
          <input type="range" min={1} max={10} value={count} onChange={(e) => setCount(+e.target.value)} className="flex-1" />
        </div>
        <Button onClick={generate}>Generate</Button>
      </div>
    </ClientToolShell>
  );
}
