'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label, Select } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { validateJson, calculateChmod, validateCron } from '@nexabit/validators';
import {
  testRegex,
  generateCurl,
  formatXml,
  validateDockerCompose,
  validateKubernetesYaml,
} from '@nexabit/networking';
import { ApiToolShell, useApiTool, API_URL } from './api-tool-shell';
import { ClientToolShell } from './client-tool-shell';

export function JsonFormatterTool() {
  const [input, setInput] = useState('{"hello":"world"}');
  const result = validateJson(input);

  return (
    <ClientToolShell title="JSON Formatter" result={result} resultFilename="json" showResults>
      <Textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="font-mono" />
    </ClientToolShell>
  );
}

export function YamlFormatterTool() {
  const [input, setInput] = useState('key: value\nlist:\n  - item1');

  return (
    <ClientToolShell
      title="YAML Formatter"
      description="Edit YAML below. Use Docker Compose or Kubernetes validators for full schema checks."
      result={{ valid: true, output: input, label: 'YAML content' }}
      resultFilename="yaml"
      showResults
    >
      <Textarea value={input} onChange={(e) => setInput(e.target.value)} rows={10} className="font-mono" />
    </ClientToolShell>
  );
}

export function XmlFormatterTool() {
  const [input, setInput] = useState('<root><item>value</item></root>');
  const result = formatXml(input);

  return (
    <ClientToolShell title="XML Formatter" result={result} resultFilename="xml" showResults>
      <Textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} className="font-mono" />
    </ClientToolShell>
  );
}

export function RegexTesterTool() {
  const [pattern, setPattern] = useState('\\d+');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('Order 123 and 456');
  const result = testRegex(pattern, flags, text);

  return (
    <ClientToolShell
      title="Regex Tester"
      result={result.valid ? result : { valid: false, error: result.error }}
      resultFilename="regex"
      showResults
    >
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
    </ClientToolShell>
  );
}

export function CurlGeneratorTool() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://api.example.com/data');
  const [headers, setHeaders] = useState('Content-Type: application/json');
  const [body, setBody] = useState('');

  const headerObj = Object.fromEntries(
    headers
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const [k, ...v] = line.split(':');
        return [k.trim(), v.join(':').trim()];
      }),
  );

  const curl = generateCurl({ method, url, headers: headerObj, body: body || undefined });

  return (
    <ClientToolShell title="cURL Generator" result={{ curl }} resultFilename="curl" showResults>
      <div className="grid gap-4 sm:grid-cols-2">
        <Select value={method} onChange={(e) => setMethod(e.target.value)}>
          {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </Select>
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" />
      </div>
      <Textarea value={headers} onChange={(e) => setHeaders(e.target.value)} placeholder="Headers (one per line)" rows={3} />
      <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body (optional)" rows={3} />
    </ClientToolShell>
  );
}

export function WebhookTesterTool() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('POST');
  const [body, setBody] = useState('{}');
  const { loading, result, run } = useApiTool(
    () =>
      fetch(`${API_URL}/api/v1/dev/webhook-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          method,
          headers: { 'Content-Type': 'application/json' },
          body,
        }),
      }).then((r) => r.json()),
    () => url,
  );

  return (
    <ApiToolShell title="Webhook Tester" onSubmit={run} loading={loading} result={result} resultFilename="webhook">
      <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Webhook URL" />
      <Select value={method} onChange={(e) => setMethod(e.target.value)}>
        {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </Select>
      <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} />
    </ApiToolShell>
  );
}

export function ChmodCalculatorTool() {
  const [input, setInput] = useState('755');
  const result = calculateChmod(input);

  return (
    <ClientToolShell title="chmod Calculator" result={result} resultFilename="chmod" showResults>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="755 or rwxr-xr-x"
        className="font-mono"
      />
    </ClientToolShell>
  );
}

export function CronGeneratorTool() {
  const [expression, setExpression] = useState('0 0 * * *');
  const result = validateCron(expression);

  return (
    <ClientToolShell title="Cron Expression Generator" result={result} resultFilename="cron" showResults>
      <Input
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
        className="font-mono"
        placeholder="0 0 * * *"
      />
    </ClientToolShell>
  );
}

export function DockerComposeValidatorTool() {
  const [input, setInput] = useState('version: "3"\nservices:\n  web:\n    image: nginx');
  const result = validateDockerCompose(input);

  return (
    <ClientToolShell title="Docker Compose Validator" result={result} resultFilename="docker-compose" showResults>
      <Textarea value={input} onChange={(e) => setInput(e.target.value)} rows={10} className="font-mono" />
    </ClientToolShell>
  );
}

export function KubernetesYamlValidatorTool() {
  const [input, setInput] = useState('apiVersion: v1\nkind: Pod\nmetadata:\n  name: test');
  const result = validateKubernetesYaml(input);

  return (
    <ClientToolShell title="Kubernetes YAML Validator" result={result} resultFilename="kubernetes" showResults>
      <Textarea value={input} onChange={(e) => setInput(e.target.value)} rows={10} className="font-mono" />
    </ClientToolShell>
  );
}
