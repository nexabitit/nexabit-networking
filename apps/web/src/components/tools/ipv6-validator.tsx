'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateIPv6 } from '@nexabit/validators';
import { ClientToolShell } from './client-tool-shell';

export function Ipv6ValidatorTool() {
  const [input, setInput] = useState('');
  const result = input ? validateIPv6(input) : null;

  return (
    <ClientToolShell
      title="IPv6 Validator"
      description="Validate IPv6 addresses and expand compressed notation."
      result={result}
      resultFilename="ipv6-validator"
      showResults={!!input}
    >
      <div className="space-y-2">
        <Label htmlFor="ipv6">IPv6 Address</Label>
        <Input
          id="ipv6"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="2001:db8::1"
          className="font-mono"
        />
      </div>
    </ClientToolShell>
  );
}
