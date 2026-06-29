import { SITE_CONFIG } from '@nexabit/shared';
import { TeamDashboard } from '@/components/team/team-dashboard';

export const metadata = {
  title: 'Team Dashboard — API Keys, MSP Exports & Monitoring',
  description: `Team workspace for ${SITE_CONFIG.name}. API keys, usage tiers, MSP CSV/PDF exports, and shared monitoring.`,
};

export default function TeamPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold md:text-4xl">Team dashboard</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          API keys, rate tiers, MSP exports, and team monitoring — built for IT teams and MSPs using{' '}
          {SITE_CONFIG.name}.
        </p>
      </header>
      <TeamDashboard />
    </div>
  );
}
