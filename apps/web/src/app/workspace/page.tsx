import { SITE_CONFIG } from '@nexabit/shared';
import { WorkspaceDashboard } from '@/components/workspace/workspace-dashboard';

export const metadata = {
  title: 'Workspace — Recent Checks, Favorites & Watchlist',
  description: `Your personal workspace on ${SITE_CONFIG.name}. Recent checks, favorites, and watchlists stored locally in your browser.`,
};

export default function WorkspacePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold md:text-4xl">Workspace</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Recent checks, favorites, and watchlists — stored in your browser for faster repeat
          diagnostics. No account required.
        </p>
      </header>
      <WorkspaceDashboard />
    </div>
  );
}
