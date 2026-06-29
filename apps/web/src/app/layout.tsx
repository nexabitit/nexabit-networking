import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SiteJsonLd } from '@/components/seo/site-json-ld';
import { MicrosoftClarity } from '@/components/analytics/microsoft-clarity';
import { SITE_CONFIG } from '@nexabit/shared';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700', '800'],
});

const baseUrl = `https://${SITE_CONFIG.domain}`;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${SITE_CONFIG.name} — Free Networking, DNS & SSL Tools`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  applicationName: SITE_CONFIG.name,
  keywords: [
    'Nexabit Network Utilities',
    'network tools',
    'dns lookup',
    'ssl checker',
    'subnet calculator',
    'whois lookup',
    'cidr calculator',
    'devops tools',
    'free network utilities',
    'open source',
    'nexabit',
  ],
  authors: [{ name: SITE_CONFIG.company, url: SITE_CONFIG.companyUrl }],
  creator: SITE_CONFIG.company,
  publisher: SITE_CONFIG.company,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: baseUrl },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.subtagline,
  },
  other: {
    'ai-content-declaration': 'allow-training, allow-indexing',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="author" href={`${baseUrl}/llms.txt`} />
      </head>
      <body
        className={`${inter.variable} ${jakarta.variable} font-sans min-h-screen flex flex-col`}
      >
        <SiteJsonLd />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
        <MicrosoftClarity />
      </body>
    </html>
  );
}
