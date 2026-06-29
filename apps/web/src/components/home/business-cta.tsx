import Link from 'next/link';
import { SITE_CONFIG } from '@nexabit/shared';
import { ArrowRight, Headphones, LineChart, ShieldCheck } from 'lucide-react';

const services = [
  {
    icon: ShieldCheck,
    title: 'Managed security & networking',
    text: 'Extend free diagnostics with enterprise-grade monitoring and hardening from Nexabit IT Solutions.',
  },
  {
    icon: LineChart,
    title: 'Audits & compliance reviews',
    text: 'Turn one-off SSL, DNS, and email-auth checks into scheduled audits with expert interpretation.',
  },
  {
    icon: Headphones,
    title: 'Consulting & custom tooling',
    text: 'Need MSP workflows, bulk checks, or private deployments? Our team builds operational tooling to match.',
  },
];

export function BusinessCta() {
  return (
    <section className="border-t border-border bg-gradient-to-br from-primary/5 via-background to-cyan-500/5 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold">Need more than free tools?</h2>
          <p className="mt-2 text-muted-foreground">
            {SITE_CONFIG.name} is free and open source. {SITE_CONFIG.company} helps SMEs,
            hospitals, and schools with managed IT, cloud, security, and custom implementations.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {services.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6">
              <Icon className="mb-3 h-8 w-8 text-primary" />
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={SITE_CONFIG.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Talk to Nexabit IT Solutions
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/api-docs"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold hover:bg-accent"
          >
            Explore the API
          </Link>
        </div>
      </div>
    </section>
  );
}
