'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateIPv4 } from '@nexabit/validators';
import { ClientToolShell } from './client-tool-shell';

export function Ipv4ValidatorTool() {
  const [input, setInput] = useState('');
  const result = input ? validateIPv4(input) : null;

  return (
    <ClientToolShell
      title="IPv4 Validator"
      description="Validate IPv4 addresses and detect public, private, or reserved ranges."
      result={result}
      resultFilename="ipv4-validator"
      showResults={!!input}
    >
      <div className="space-y-2">
        <Label htmlFor="ipv4">IPv4 Address</Label>
        <Input
          id="ipv4"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="192.168.1.1"
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground">Examples: 8.8.8.8 · 192.168.1.1 · 10.0.0.1</p>
      </div>
    </ClientToolShell>
  );
}
