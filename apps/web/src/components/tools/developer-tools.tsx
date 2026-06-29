'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label, Select, Badge } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { validateJson, calculateChmod, validateCron } from '@nexabit/validators';
import { testRegex, generateCurl, formatXml, validateDockerCompose, validateKubernetesYaml } from '@nexabit/networking';
import { ApiToolShell, useApiTool, API_URL } from './api-tool-shell';

export function JsonFormatterTool() {
  const [input, setInput] = useState('{"hello":"world"}');
  const result = validateJson(input);

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">JSON Formatter</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} />
        <Badge variant={result.valid ? 'success' : 'destructive'}>{result.valid ? 'Valid JSON' : 'Invalid'}</Badge>
        {result.formatted && <Textarea readOnly value={result.formatted} rows={8} />}
        {result.error && <p className="text-sm text-destructive">{result.error}</p>}
      </CardContent>
    </Card>
  );
}

export function YamlFormatterTool() {
  const [input, setInput] = useState('key: value\nlist:\n  - item1');
  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">YAML Formatter</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} rows={10} className="font-mono" />
        <p className="text-sm text-muted-foreground">YAML validation uses structure checks. For full validation, use Docker Compose or Kubernetes validators.</p>
      </CardContent>
    </Card>
  );
}

export function XmlFormatterTool() {
  const [input, setInput] = useState('<root><item>value</item></root>');
  const result = formatXml(input);

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">XML Formatter</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} />
        <Badge variant={result.valid ? 'success' : 'destructive'}>{result.valid ? 'Formatted' : 'Error'}</Badge>
        {result.formatted && <Textarea readOnly value={result.formatted} rows={8} />}
      </CardContent>
    </Card>
  );
}

export function RegexTesterTool() {
  const [pattern, setPattern] = useState('\\d+');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('Order 123 and 456');
  const result = testRegex(pattern, flags, text);

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Regex Tester</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Pattern</Label>
            <Input value={pattern} onChange={(e) => setPattern(e.target.value)} className="font-mono" />
          </div>
          <div className="space-y-2">
            <Label>Flags</Label>
            <Input value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="gim" />
          </div>
        </div>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} />
        {result.valid ? (
          <div>
            <Badge variant="success">{result.matches.length} match(es)</Badge>
            <pre className="mt-2 rounded-md bg-muted p-4 text-sm font-mono">{JSON.stringify(result.matches, null, 2)}</pre>
          </div>
        ) : (
          <Badge variant="destructive">{result.error}</Badge>
        )}
      </CardContent>
    </Card>
  );
}

export function CurlGeneratorTool() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://api.example.com/data');
  const [headers, setHeaders] = useState('Content-Type: application/json');
  const [body, setBody] = useState('');

  const headerObj = Object.fromEntries(
    headers.split('\n').filter(Boolean).map((line) => {
      const [k, ...v] = line.split(':');
      return [k.trim(), v.join(':').trim()];
    }),
  );

  const curl = generateCurl({ method, url, headers: headerObj, body: body || undefined });

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">cURL Generator</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Select value={method} onChange={(e) => setMethod(e.target.value)}>
            {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => <option key={m} value={m}>{m}</option>)}
          </Select>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" />
        </div>
        <Textarea value={headers} onChange={(e) => setHeaders(e.target.value)} placeholder="Headers (one per line)" rows={3} />
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body (optional)" rows={3} />
        <pre className="overflow-auto rounded-md bg-muted p-4 text-sm font-mono">{curl}</pre>
      </CardContent>
    </Card>
  );
}

export function WebhookTesterTool() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('POST');
  const [body, setBody] = useState('{}');
  const { loading, result, run } = useApiTool(() =>
    fetch(`${API_URL}/api/v1/dev/webhook-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, method, headers: { 'Content-Type': 'application/json' }, body }),
    }).then((r) => r.json()),
  );

  return (
    <ApiToolShell title="Webhook Tester" onSubmit={run} loading={loading} result={result}>
      <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Webhook URL" />
      <Select value={method} onChange={(e) => setMethod(e.target.value)}>
        {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => <option key={m} value={m}>{m}</option>)}
      </Select>
      <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} />
    </ApiToolShell>
  );
}

export function ChmodCalculatorTool() {
  const [input, setInput] = useState('755');
  const result = calculateChmod(input);

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">chmod Calculator</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="755 or rwxr-xr-x" className="font-mono" />
        {result.valid ? (
          <div className="grid gap-2 sm:grid-cols-2">
            <p>Numeric: <strong className="font-mono">{result.numeric}</strong></p>
            <p>Symbolic: <strong className="font-mono">{result.symbolic}</strong></p>
          </div>
        ) : (
          <Badge variant="destructive">{result.error}</Badge>
        )}
      </CardContent>
    </Card>
  );
}

export function CronGeneratorTool() {
  const [expression, setExpression] = useState('0 0 * * *');
  const result = validateCron(expression);

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Cron Expression</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Input value={expression} onChange={(e) => setExpression(e.target.value)} className="font-mono" placeholder="0 0 * * *" />
        {result.valid ? (
          <p className="text-sm text-muted-foreground">{result.description}</p>
        ) : (
          <Badge variant="destructive">{result.error}</Badge>
        )}
      </CardContent>
    </Card>
  );
}

export function DockerComposeValidatorTool() {
  const [input, setInput] = useState('version: "3"\nservices:\n  web:\n    image: nginx');
  const result = validateDockerCompose(input);

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Docker Compose Validator</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} rows={10} />
        <Badge variant={result.valid ? 'success' : 'destructive'}>{result.valid ? `Valid (${result.services?.join(', ')})` : result.error}</Badge>
      </CardContent>
    </Card>
  );
}

export function KubernetesYamlValidatorTool() {
  const [input, setInput] = useState('apiVersion: v1\nkind: Pod\nmetadata:\n  name: test');
  const result = validateKubernetesYaml(input);

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Kubernetes YAML Validator</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} rows={10} />
        {result.valid ? (
          <p className="text-sm">Valid <strong>{result.kind}</strong> ({result.apiVersion})</p>
        ) : (
          <Badge variant="destructive">{result.error}</Badge>
        )}
      </CardContent>
    </Card>
  );
}
