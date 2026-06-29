import Link from 'next/link';
import { ArrowRight, Code2 } from 'lucide-react';
import { SITE_CONFIG } from '@nexabit/shared';
import { buttonVariants } from '@/components/ui/button';

export function ApiAccessSection() {
  return (
    <section className="border-y border-border bg-muted/40 py-14">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
              Developer API
            </p>
            <h2 className="text-2xl font-bold md:text-3xl">
              Browser tools are free. API access uses developer plans.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Run every utility in your browser at no cost. For automation and integrations, use the
              Developer API with free and paid monthly plans — keys are issued after login and email
              verification.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Free plan: 10,000 requests/month · Starter from ₹999/month · Team plans for MSPs.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link href="/developers/login" className={buttonVariants({ size: 'lg' })}>
              Get API access
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/developers" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
              <Code2 className="h-4 w-4" />
              Developer overview
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
