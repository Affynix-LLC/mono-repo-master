/**
 * SEO INJECTOR COMPONENT
 * Schema.org + meta generation for optimal SEO
 */

import { generateNetworkSchema, generateCrossDomainMeta } from '../lib/seo-network.js';

export default function SEOInjector({ domainConfig }) {
  if (!domainConfig) {
    return null;
  }
  
  const { seo } = domainConfig;
  const networkSchema = generateNetworkSchema(domainConfig.slug + '.affynix.com');
  const crossDomainMeta = generateCrossDomainMeta(domainConfig.slug + '.affynix.com');
  
  return (
    <>
      {/* Primary Meta Tags */}
      <title>{seo.metaTitle}</title>
      <meta name="description" content={seo.metaDescription} />
      <meta name="keywords" content={seo.keywords.join(', ')} />
      <link rel="canonical" href={crossDomainMeta.canonical} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={seo.metaTitle} />
      <meta property="og:description" content={seo.metaDescription} />
      <meta property="og:image" content={seo.ogImage} />
      <meta property="og:url" content={crossDomainMeta.canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Affynix" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={seo.twitterCard} />
      <meta name="twitter:title" content={seo.metaTitle} />
      <meta name="twitter:description" content={seo.metaDescription} />
      <meta name="twitter:image" content={seo.ogImage} />
      
      {/* Cross-Domain Meta Tags */}
      {crossDomainMeta.alternate.map((alt, index) => (
        <link key={index} rel="alternate" hrefLang={alt.hreflang} href={alt.href} />
      ))}
      
      {/* DNS Prefetch for Performance */}
      {crossDomainMeta['dns-prefetch'].map((domain, index) => (
        <link key={index} rel="dns-prefetch" href={`//${domain}`} />
      ))}
      
      {/* Preconnect for Critical Resources */}
      {crossDomainMeta.preconnect.map((url, index) => (
        <link key={index} rel="preconnect" href={url} />
      ))}
      
      {/* Structured Data - JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(seo.schema)
        }}
      />
      
      {/* Network Schema - JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(networkSchema)
        }}
      />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content={domainConfig.theme.primary} />
      
      {/* Performance Hints */}
      <link rel="preload" href={seo.ogImage} as="image" />
      
      {/* Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      
      {/* Additional Schema for Products */}
      {domainConfig.productSource && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: `${domainConfig.title} - Product Collection`,
              description: domainConfig.tagline,
              url: crossDomainMeta.canonical,
              numberOfItems: 'Dynamic', // Will be updated by client-side
              itemListElement: [] // Will be populated by client-side
            })
          }}
        />
      )}
    </>
  );
}
