'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { decodePem } from '@nexabit/networking';
import { ClientToolShell } from './client-tool-shell';

export function PemDecoderTool() {
  const [input, setInput] = useState('');
  const result = input.trim() ? decodePem(input) : null;

  return (
    <ClientToolShell
      title="PEM Decoder"
      description="Decode PEM-encoded certificates and keys."
      result={result}
      resultFilename="pem"
      showResults={!!input.trim()}
    >
      <div className="space-y-2">
        <Label htmlFor="pem">PEM Certificate or Key</Label>
        <Textarea
          id="pem"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          placeholder="-----BEGIN CERTIFICATE-----..."
          className="font-mono text-xs"
        />
      </div>
    </ClientToolShell>
  );
}

export function CsrGeneratorTool() {
  return (
    <ClientToolShell
      title="CSR Generator"
      result={{
        valid: false,
        error:
          'CSR generation requires server-side crypto. Use OpenSSL: openssl req -new -newkey rsa:2048 -nodes -keyout key.pem -out csr.pem',
      }}
      showResults
    >
      <p className="text-sm text-muted-foreground">
        Certificate signing requests need a secure key pair generated on the server or locally with
        OpenSSL.
      </p>
    </ClientToolShell>
  );
}
