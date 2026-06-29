import { SITE_CONFIG } from '@nexabit/shared';
import { DeveloperAuthForm } from '@/components/portal/developer-portal';

export const metadata = {
  title: 'Developer Login — API Key Access',
  description: `Log in or sign up for ${SITE_CONFIG.name} API access. Email verification required before key creation.`,
};

export default function DeveloperLoginPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <DeveloperAuthForm />
    </div>
  );
}
