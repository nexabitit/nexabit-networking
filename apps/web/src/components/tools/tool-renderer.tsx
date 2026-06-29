'use client';

import dynamic from 'next/dynamic';
import { getToolBySlug } from '@nexabit/shared';
import { Card, CardContent } from '@/components/ui/card';
import { ToolSessionProvider } from './tool-session-context';

const toolComponents: Record<string, React.ComponentType> = {
  'ip-lookup': dynamic(() => import('./ip-lookup').then((m) => m.IpLookupTool)),
  'cidr-calculator': dynamic(() => import('./cidr-calculator').then((m) => m.CidrCalculatorTool)),
  'ipv4-validator': dynamic(() => import('./ipv4-validator').then((m) => m.Ipv4ValidatorTool)),
  'ipv6-validator': dynamic(() => import('./ipv6-validator').then((m) => m.Ipv6ValidatorTool)),
  'port-checker': dynamic(() => import('./port-checker').then((m) => m.PortCheckerTool)),
  'ping': dynamic(() => import('./ping').then((m) => m.PingTool)),
  'traceroute': dynamic(() => import('./traceroute').then((m) => m.TracerouteTool)),
  'whois': dynamic(() => import('./whois').then((m) => m.WhoisTool)),
  'asn-lookup': dynamic(() => import('./asn-lookup').then((m) => m.AsnLookupTool)),
  'dns-lookup': dynamic(() => import('./dns-lookup').then((m) => m.DnsLookupTool)),
  'spf-checker': dynamic(() => import('./spf-checker').then((m) => m.SpfCheckerTool)),
  'dkim-checker': dynamic(() => import('./dkim-checker').then((m) => m.DkimCheckerTool)),
  'dmarc-checker': dynamic(() => import('./dmarc-checker').then((m) => m.DmarcCheckerTool)),
  'dns-propagation': dynamic(() => import('./dns-propagation').then((m) => m.DnsPropagationTool)),
  'ssl-checker': dynamic(() => import('./ssl-checker').then((m) => m.SslCheckerTool)),
  'ssl-expiry': dynamic(() => import('./ssl-expiry').then((m) => m.SslExpiryTool)),
  'pem-decoder': dynamic(() => import('./pem-decoder').then((m) => m.PemDecoderTool)),
  'password-generator': dynamic(() => import('./password-generator').then((m) => m.PasswordGeneratorTool)),
  'password-strength': dynamic(() => import('./password-strength').then((m) => m.PasswordStrengthTool)),
  'hash-generator': dynamic(() => import('./hash-generator').then((m) => m.HashGeneratorTool)),
  'jwt-decoder': dynamic(() => import('./jwt-decoder').then((m) => m.JwtDecoderTool)),
  'base64': dynamic(() => import('./base64').then((m) => m.Base64Tool)),
  'url-encoder': dynamic(() => import('./url-encoder').then((m) => m.UrlEncoderTool)),
  'uuid-generator': dynamic(() => import('./uuid-generator').then((m) => m.UuidGeneratorTool)),
  'json-formatter': dynamic(() => import('./json-formatter').then((m) => m.JsonFormatterTool)),
  'yaml-formatter': dynamic(() => import('./yaml-formatter').then((m) => m.YamlFormatterTool)),
  'xml-formatter': dynamic(() => import('./xml-formatter').then((m) => m.XmlFormatterTool)),
  'regex-tester': dynamic(() => import('./regex-tester').then((m) => m.RegexTesterTool)),
  'curl-generator': dynamic(() => import('./curl-generator').then((m) => m.CurlGeneratorTool)),
  'webhook-tester': dynamic(() => import('./webhook-tester').then((m) => m.WebhookTesterTool)),
  'chmod-calculator': dynamic(() => import('./chmod-calculator').then((m) => m.ChmodCalculatorTool)),
  'cron-generator': dynamic(() => import('./cron-generator').then((m) => m.CronGeneratorTool)),
  'docker-compose-validator': dynamic(() => import('./docker-compose-validator').then((m) => m.DockerComposeValidatorTool)),
  'kubernetes-yaml-validator': dynamic(() => import('./kubernetes-yaml-validator').then((m) => m.KubernetesYamlValidatorTool)),
  'csr-generator': dynamic(() => import('./csr-generator').then((m) => m.CsrGeneratorTool)),
  'http-security-headers': dynamic(() => import('./http-security-headers').then((m) => m.HttpSecurityHeadersTool)),
  'bulk-dns-lookup': dynamic(() => import('./bulk-dns-lookup').then((m) => m.BulkDnsLookupTool)),
  'ssl-expiry-monitor': dynamic(() => import('./ssl-expiry-monitor').then((m) => m.SslExpiryMonitorTool)),
};

export function ToolRenderer({ slug }: { slug: string }) {
  const Component = toolComponents[slug];
  const tool = getToolBySlug(slug);

  if (!Component) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          This tool is coming soon.
        </CardContent>
      </Card>
    );
  }

  return (
    <ToolSessionProvider slug={slug} toolName={tool?.name ?? slug}>
      <Component />
    </ToolSessionProvider>
  );
}
