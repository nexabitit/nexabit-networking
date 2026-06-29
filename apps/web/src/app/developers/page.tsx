import { SITE_CONFIG } from '@nexabit/shared';
import { DeveloperLanding } from '@/components/portal/developer-portal';

export const metadata = {
  title: 'Developers — API Access, Plans & Documentation',
  description: `Developer API for ${SITE_CONFIG.name}. Free browser tools; programmatic access via verified developer accounts with free and paid plans.`,
};

export default function DevelopersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <DeveloperLanding />
    </div>
  );
}
