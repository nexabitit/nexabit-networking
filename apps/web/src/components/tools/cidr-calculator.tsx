'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/label';
import { calculateCidr } from '@nexabit/validators';

export function CidrCalculatorTool() {
  const [input, setInput] = useState('192.168.1.0/24');
  const result = calculateCidr(input);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">CIDR / Subnet Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cidr">CIDR Notation</Label>
          <Input id="cidr" value={input} onChange={(e) => setInput(e.target.value)} placeholder="192.168.1.0/24" />
        </div>
        {result.valid ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ['Network', result.network],
              ['Broadcast', result.broadcast],
              ['First Host', result.firstHost],
              ['Last Host', result.lastHost],
              ['Subnet Mask', result.subnetMask],
              ['Wildcard Mask', result.wildcardMask],
              ['Total Hosts', result.totalHosts],
              ['Usable Hosts', result.usableHosts],
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-md border border-border p-3">
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className="font-mono font-medium">{value}</div>
              </div>
            ))}
          </div>
        ) : (
          <Badge variant="destructive">{result.error}</Badge>
        )}
      </CardContent>
    </Card>
  );
}
