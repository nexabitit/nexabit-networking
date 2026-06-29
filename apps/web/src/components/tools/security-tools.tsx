'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label, Select, Badge } from '@/components/ui/label';
import { generatePassword, generateUuid, hashText, base64Encode, base64Decode, decodeJwt, urlEncode, urlDecode, htmlEncode, htmlDecode, type HashAlgorithm } from '@nexabit/crypto';
import { checkPasswordStrength } from '@nexabit/validators';

export function PasswordGeneratorTool() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: true });

  const generate = () => setPassword(generatePassword({ length, ...opts }));

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Password Generator</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Input readOnly value={password} placeholder="Click Generate" className="font-mono" />
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
      </CardContent>
    </Card>
  );
}

export function PasswordStrengthTool() {
  const [password, setPassword] = useState('');
  const result = password ? checkPasswordStrength(password) : null;

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Password Strength</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
        {result && (
          <div className="space-y-2">
            <Badge>{result.label}</Badge>
            <p className="text-sm">Entropy: ~{result.entropy} bits</p>
            {result.feedback.map((f, i) => <p key={i} className="text-sm text-muted-foreground">• {f}</p>)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function HashGeneratorTool() {
  const [text, setText] = useState('');
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [hash, setHash] = useState('');

  const generate = async () => {
    if (!text) return;
    setHash(await hashText(text, algorithm));
  };

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Hash Generator</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <TextareaLike value={text} onChange={setText} placeholder="Text to hash" />
        <Select value={algorithm} onChange={(e) => setAlgorithm(e.target.value as HashAlgorithm)}>
          {(['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const).map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </Select>
        <Button onClick={generate}>Generate Hash</Button>
        {hash && <pre className="rounded-md bg-muted p-4 text-sm font-mono break-all">{hash}</pre>}
      </CardContent>
    </Card>
  );
}

export function JwtDecoderTool() {
  const [token, setToken] = useState('');
  const result = token.trim() ? decodeJwt(token) : null;

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">JWT Decoder</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <TextareaLike value={token} onChange={setToken} placeholder="Paste JWT token" rows={4} />
        {result && (
          <pre className="overflow-auto rounded-md bg-muted p-4 text-sm font-mono">
            {JSON.stringify({ header: result.header, payload: result.payload, signature: result.signature, valid: result.valid, error: result.error }, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}

export function Base64Tool() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const output = mode === 'encode' ? (text ? base64Encode(text) : '') : (text ? base64Decode(text).text || base64Decode(text).error : '');

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Base64 Encode / Decode</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button variant={mode === 'encode' ? 'default' : 'outline'} size="sm" onClick={() => setMode('encode')}>Encode</Button>
          <Button variant={mode === 'decode' ? 'default' : 'outline'} size="sm" onClick={() => setMode('decode')}>Decode</Button>
        </div>
        <TextareaLike value={text} onChange={setText} placeholder="Input" />
        {output && <pre className="rounded-md bg-muted p-4 text-sm font-mono break-all">{output}</pre>}
      </CardContent>
    </Card>
  );
}

export function UrlEncoderTool() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'url-encode' | 'url-decode' | 'html-encode' | 'html-decode'>('url-encode');

  const output = text ? {
    'url-encode': urlEncode(text),
    'url-decode': urlDecode(text),
    'html-encode': htmlEncode(text),
    'html-decode': htmlDecode(text),
  }[mode] : '';

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">URL / HTML Encode & Decode</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
          <option value="url-encode">URL Encode</option>
          <option value="url-decode">URL Decode</option>
          <option value="html-encode">HTML Encode</option>
          <option value="html-decode">HTML Decode</option>
        </Select>
        <TextareaLike value={text} onChange={setText} placeholder="Input" />
        {output && <pre className="rounded-md bg-muted p-4 text-sm font-mono break-all">{output}</pre>}
      </CardContent>
    </Card>
  );
}

export function UuidGeneratorTool() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);

  const generate = () => setUuids(Array.from({ length: count }, () => generateUuid()));

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">UUID Generator</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Label>Count: {count}</Label>
          <input type="range" min={1} max={10} value={count} onChange={(e) => setCount(+e.target.value)} />
        </div>
        <Button onClick={generate}>Generate</Button>
        {uuids.map((u) => <p key={u} className="font-mono text-sm">{u}</p>)}
      </CardContent>
    </Card>
  );
}

function TextareaLike({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
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
