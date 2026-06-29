import { JsonLd } from '@/components/seo/json-ld';
import {
  organizationJsonLd,
  websiteJsonLd,
  softwareApplicationJsonLd,
} from '@/lib/seo/json-ld';

export function SiteJsonLd() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={softwareApplicationJsonLd()} />
    </>
  );
}
