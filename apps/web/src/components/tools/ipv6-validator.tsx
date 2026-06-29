'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/label';
import { validateIPv6 } from '@nexabit/validators';

export function Ipv6ValidatorTool() {
  const [input, setInput] = useState('');
  const result = input ? validateIPv6(input) : null;

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">IPv6 Validator</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ipv6">IPv6 Address</Label>
          <Input id="ipv6" value={input} onChange={(e) => setInput(e.target.value)} placeholder="2001:db8::1" />
        </div>
        {result && (
          <div className="space-y-2">
            <Badge variant={result.valid ? 'success' : 'destructive'}>
              {result.valid ? 'Valid' : 'Invalid'}
            </Badge>
            {result.expanded && (
              <p className="text-sm font-mono break-all">Expanded: {result.expanded}</p>
            )}
            {result.error && <p className="text-sm text-destructive">{result.error}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
