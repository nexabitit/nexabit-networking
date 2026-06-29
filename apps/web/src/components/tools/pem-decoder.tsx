'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/label';
import { decodePem } from '@nexabit/networking';

export function PemDecoderTool() {
  const [input, setInput] = useState('');
  const result = input.trim() ? decodePem(input) : null;

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">PEM Decoder</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pem">PEM Certificate or Key</Label>
          <Textarea id="pem" value={input} onChange={(e) => setInput(e.target.value)} rows={8} placeholder="-----BEGIN CERTIFICATE-----..." />
        </div>
        {result && (
          <div className="space-y-2">
            <Badge variant={result.valid ? 'success' : 'destructive'}>
              {result.valid ? `Type: ${result.type}` : 'Invalid PEM'}
            </Badge>
            {result.content && (
              <pre className="overflow-auto rounded-md bg-muted p-4 text-xs font-mono break-all">{result.content}</pre>
            )}
            {result.error && <p className="text-sm text-destructive">{result.error}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function CsrGeneratorTool() {
  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">CSR Generator</CardTitle></CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          CSR generation requires server-side cryptographic operations. Use the API endpoint
          <code className="mx-1 rounded bg-muted px-1">POST /api/v1/ssl/csr</code>
          or OpenSSL locally: <code className="rounded bg-muted px-1">openssl req -new -newkey rsa:2048 -nodes -keyout key.pem -out csr.pem</code>
        </p>
      </CardContent>
    </Card>
  );
}
