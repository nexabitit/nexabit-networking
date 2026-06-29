import { PricingTeaser, PricingTableFull } from '@/components/portal/pricing-table';

/** @deprecated Use PricingTeaser or PricingTableFull from portal/pricing-table */
export function PricingTiers({
  highlight,
  loggedIn,
  full,
}: {
  highlight?: string;
  loggedIn?: boolean;
  full?: boolean;
}) {
  if (full) {
    return <PricingTableFull highlight={highlight} />;
  }
  return <PricingTeaser />;
}
