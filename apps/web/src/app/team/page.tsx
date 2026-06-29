import { TeamGatedDashboard } from '@/components/portal/team-portal';

export const metadata = {
  title: 'Team Dashboard — Shared API Usage & MSP Exports',
  description:
    'Team workspace for IT teams and MSPs. Shared usage, exports, and monitoring — requires Growth or Team plan.',
};

export default function TeamPage() {
  return <TeamGatedDashboard />;
}
