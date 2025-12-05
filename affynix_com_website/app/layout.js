import { headers } from 'next/headers';
import { getDomainConfig, getAllDomains } from '@/lib/domain-config';
import { generateNetworkSchema, generateCrossDomainMeta } from '@/lib/seo-network';
import { initializeAnalytics, trackPageView } from '@/lib/analytics';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
});

export async function generateMetadata() {
  let hostname = 'affynix.com';
  try {
    const h = await headers();
    hostname = h.get('host') || hostname;
  } catch {}
  const config = getDomainConfig(hostname);
  const allDomains = getAllDomains();
  const currentDomain = (hostname === 'affynix.com' || hostname === 'www.affynix.com')
    ? 'affynix.com'
    : `${config.slug}.affynix.com`;
  const networkSchema = generateNetworkSchema(currentDomain);
  const crossDomainMeta = generateCrossDomainMeta(currentDomain);
  
  return {
    title: config.seo.metaTitle,
    description: config.seo.metaDescription,
    keywords: config.seo.keywords.join(', '),
    canonical: crossDomainMeta.canonical,
    alternates: {
      canonical: crossDomainMeta.canonical,
      languages: crossDomainMeta.alternate.reduce((acc, alt) => {
        acc[alt.hreflang] = alt.href;
        return acc;
      }, {})
    },
    openGraph: {
      title: config.seo.metaTitle,
      description: config.seo.metaDescription,
      images: [config.seo.ogImage],
      type: 'website',
      siteName: 'Affynix',
      url: crossDomainMeta.canonical
    },
    twitter: {
      card: config.seo.twitterCard,
      title: config.seo.metaTitle,
      description: config.seo.metaDescription,
      images: [config.seo.ogImage]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1
      }
    },
    other: {
      'affynix-network': JSON.stringify({
        domain: config.slug,
        authority: 88,
        network: allDomains,
        networkLinks: config.networkLinks
      }),
      'theme-color': config.theme.primary
    }
  };
}

export default async function RootLayout({ children }) {
  let hostname = 'affynix.com';
  try {
    const h = await headers();
    hostname = h.get('host') || hostname;
  } catch {}
  const config = getDomainConfig(hostname);
  const currentDomain = (hostname === 'affynix.com' || hostname === 'www.affynix.com')
    ? 'affynix.com'
    : `${config.slug}.affynix.com`;
  const networkSchema = generateNetworkSchema(currentDomain);
  const crossDomainMeta = generateCrossDomainMeta(currentDomain);
  
  return (
    <html lang="en">
      <head>
            <link rel="icon" href={config.favicon || '/logo/logo1.png'} />
        {/* Primary Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(config.seo.schema)
          }}
        />
        
        {/* Network Schema for SEO Authority */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(networkSchema)
          }}
        />
        
        {/* DNS Prefetch for Network Domains */}
        {config.networkLinks.map(link => (
          <link
            key={link.domain}
            rel="dns-prefetch"
            href={`https://${link.domain}`}
          />
        ))}
        
        {/* Preconnect for Critical Resources */}
        {crossDomainMeta.preconnect.map((url, index) => (
          <link
            key={index}
            rel="preconnect"
            href={url}
          />
        ))}
        
        {/* Preload Critical Resources */}
        <link
          rel="preload"
          href={config.seo.ogImage}
          as="image"
        />
        
        {/* Cross-Domain Hreflang Tags */}
        {crossDomainMeta.alternate.map((alt, index) => (
          <link
            key={index}
            rel="alternate"
            hrefLang={alt.hreflang}
            href={alt.href}
          />
        ))}
        
        {/* Cloudfilt Analytics */}
        {config.analytics.cloudfilt.enabled && (
          <script
            defer
            src="https://srv21019.cloudfilt.com/script.js"
            data-site={config.analytics.cloudfilt.siteId}
          />
        )}
        
        {/* ClickRank SEO */}
        {config.analytics.clickrank.enabled && (
          <script
            defer
            src="https://js.clickrank.ai/track.js"
            data-domain={config.analytics.clickrank.domain}
          />
        )}
        
        {/* Charla Chat Widget */}
        {config.analytics.charla.enabled && (
          <script
            defer
            src="https://app.getcharla.com/widget.js"
            data-widget={config.analytics.charla.widgetId}
          />
        )}
        
        {/* Google Analytics 4 */}
        {config.analytics.googleAnalyticsId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${config.analytics.googleAnalyticsId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${config.analytics.googleAnalyticsId}', {
                    page_title: '${config.seo.metaTitle}',
                    page_location: window.location.href
                  });
                `
              }}
            />
          </>
        )}
        
        {/* SEO Network Scripts - Loads all optimization modules */}
        <script async type="module" src="/js/seo-network-loader.js" />
        
        {/* Custom Affynix Analytics Initialization */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('DOMContentLoaded', function() {
                // Initialize analytics
                if (typeof initializeAnalytics === 'function') {
                  initializeAnalytics(${JSON.stringify(config)});
                }
                
                // Track page view
                if (typeof trackPageView === 'function') {
                  trackPageView(${JSON.stringify(config)});
                }
              });
            `
          }}
        />
      </head>
      
      <body 
        className={`${inter.className} ${inter.variable}`}
        suppressHydrationWarning={true}
        style={{
          '--theme-primary': config.theme.primary,
          '--theme-secondary': config.theme.secondary,
          '--theme-accent': config.theme.accent,
          '--theme-gradient': config.theme.gradient,
          '--theme-hero-gradient': config.theme.heroGradient
        }}
      >
        {children}
      </body>
    </html>
  );
}
