import Link from 'next/link';
import { ArrowRight, Code2, CreditCard } from 'lucide-react';
import { SITE_CONFIG } from '@nexabit/shared';
import { buttonVariants } from '@/components/ui/button';

export function ApiAccessSection() {
  return (
    <section className="border-y border-border bg-muted/40 py-14">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
              Developer API platform
            </p>
            <h2 className="text-2xl font-bold md:text-3xl">
              Paid API access with logged-in developer accounts
            </h2>
            <p className="mt-3 text-muted-foreground">
              Browse and run {SITE_CONFIG.name} tools in your browser without an account. For
              automation, integrations, and production workloads, use the Developer API with tiered
              monthly plans — API keys are issued only after login and email verification.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Free Developer ₹0 · Starter ₹999/mo · Growth ₹2,999/mo · Team ₹7,999/mo
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link href="/developers/login" className={buttonVariants({ size: 'lg' })}>
              Get API access
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/pricing" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
              <CreditCard className="h-4 w-4" />
              View pricing
            </Link>
            <Link href="/developers" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
              <Code2 className="h-4 w-4" />
              Developer portal
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
