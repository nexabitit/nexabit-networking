'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/label';
import { validateIPv4 } from '@nexabit/validators';

export function Ipv4ValidatorTool() {
  const [input, setInput] = useState('');
  const result = input ? validateIPv4(input) : null;

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">IPv4 Validator</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ipv4">IPv4 Address</Label>
          <Input id="ipv4" value={input} onChange={(e) => setInput(e.target.value)} placeholder="192.168.1.1" />
        </div>
        {result && (
          <div className="space-y-2">
            <Badge variant={result.valid ? 'success' : 'destructive'}>
              {result.valid ? 'Valid' : 'Invalid'}
            </Badge>
            {result.valid && (
              <p className="text-sm">Classification: <strong>{result.classification}</strong></p>
            )}
            {result.error && <p className="text-sm text-destructive">{result.error}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
