'use client';

import Link from 'next/link';
import { FileDown, FileText, Users } from 'lucide-react';
import { SITE_CONFIG } from '@nexabit/shared';
import { useTeamProfile } from '@/hooks/use-team-session';
import { useRecentChecks, useWatchlist } from '@/hooks/use-user-session';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WorkspaceDashboard } from '@/components/workspace/workspace-dashboard';
import {
  exportAuditReportHtml,
  exportRecentChecksCsv,
  exportWatchlistCsv,
} from '@/lib/msp-export';
import { useState } from 'react';

export function TeamDashboard() {
  const { profile, save } = useTeamProfile();
  const { items } = useWatchlist();
  const { checks } = useRecentChecks();
  const [teamName, setTeamName] = useState(profile.name || '');
  const [ownerEmail, setOwnerEmail] = useState(profile.ownerEmail || '');
  const [membersText, setMembersText] = useState(profile.members.join('\n'));

  const alerts = items.filter((i) => i.lastStatus === 'warning' || i.lastStatus === 'error');

  const saveTeam = () => {
    save({
      name: teamName.trim(),
      ownerEmail: ownerEmail.trim(),
      members: membersText
        .split(/[\n,;]+/)
        .map((m) => m.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="space-y-10">
      <Card id="members">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" />
            Team profile
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Stored locally for MSP exports and audit reports. Upgrade for shared cloud team
            workspaces.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Team / MSP name</Label>
              <Input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Acme IT" />
            </div>
            <div className="space-y-2">
              <Label>Owner email</Label>
              <Input
                type="email"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                placeholder="ops@company.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Team members (one email per line)</Label>
            <textarea
              value={membersText}
              onChange={(e) => setMembersText(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              placeholder="engineer@company.com"
            />
          </div>
          <Button type="button" onClick={saveTeam}>
            Save team profile
          </Button>
        </CardContent>
      </Card>

      <section id="exports">
        <h2 className="mb-4 text-2xl font-bold">MSP exports</h2>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => exportWatchlistCsv(items)}>
            <FileDown className="h-3.5 w-3.5" />
            Export watchlist CSV
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => exportRecentChecksCsv(checks)}>
            <FileDown className="h-3.5 w-3.5" />
            Export recent checks CSV
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              exportAuditReportHtml({
                teamName: teamName || 'Team',
                watchlist: items,
                recentChecks: checks,
                alerts,
              })
            }
          >
            <FileText className="h-3.5 w-3.5" />
            Generate audit report (PDF)
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Audit report opens a print dialog — save as PDF from your browser. White-label exports
          available on Enterprise.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Operational workspace</h2>
        <WorkspaceDashboard />
      </section>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-6">
          <p className="font-semibold">Need scheduled monitoring, team SSO, or white-label reports?</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {SITE_CONFIG.company} provides managed IT, cloud, and custom tooling for SMEs, hospitals,
            and schools.
          </p>
          <a
            href={SITE_CONFIG.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ className: 'mt-4' })}
          >
            Talk to {SITE_CONFIG.company}
          </a>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/developers" className="text-primary hover:underline">
          API documentation
        </Link>
        {' · '}
        <Link href="/workspace" className="text-primary hover:underline">
          Personal workspace
        </Link>
      </p>
    </div>
  );
}
