'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateCidr } from '@nexabit/validators';
import { ToolWorkspace } from './tool-workspace';

export function CidrCalculatorTool() {
  const [input, setInput] = useState('192.168.1.0/24');
  const result = calculateCidr(input);

  return (
    <ToolWorkspace
      title="CIDR / Subnet Calculator"
      description="Enter CIDR notation (e.g. 192.168.1.0/24). Results update as you type."
      result={result}
      resultFilename="cidr-result"
      liveResult
    >
      <div className="space-y-2">
        <Label htmlFor="cidr">CIDR notation</Label>
        <Input
          id="cidr"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="192.168.1.0/24"
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground">
          Examples: 10.0.0.0/8 · 172.16.0.0/12 · 192.168.1.0/24
        </p>
      </div>
    </ToolWorkspace>
  );
}
