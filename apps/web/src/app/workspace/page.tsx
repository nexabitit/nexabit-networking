import { SITE_CONFIG } from '@nexabit/shared';
import { PortalShell } from '@/components/portal/portal-shell';
import { WorkspaceDashboard } from '@/components/workspace/workspace-dashboard';

export const metadata = {
  title: 'Workspace — Recent Checks, Favorites & Watchlist',
  description: `Your personal workspace on ${SITE_CONFIG.name}. Recent checks, favorites, and watchlists stored locally in your browser.`,
};

export default function WorkspacePage() {
  return (
    <PortalShell
      title="Workspace"
      description="Recent checks, favorites, and watchlists — stored in your browser. No account required. Team shared watchlists and MSP exports are on the Team dashboard."
      variant="team"
    >
      <WorkspaceDashboard />
    </PortalShell>
  );
}
