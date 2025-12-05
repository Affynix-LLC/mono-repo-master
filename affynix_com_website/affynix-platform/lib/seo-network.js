/**
 * SEO NETWORK SYSTEM
 * Authority transfer logic and cross-domain SEO optimization
 */

import { getDomainAuthority, getAllDomains, DOMAIN_CONFIGS } from './domain-config.js';

/**
 * Calculate network authority boost for a domain
 * Based on cross-linking and topical relevance
 */
export function calculateNetworkAuthority(domain, linkingDomains = []) {
  const baseAuthority = getDomainAuthority(domain);
  let networkBoost = 0;
  
  // Calculate boost from cross-domain links
  linkingDomains.forEach(linkingDomain => {
    const linkingAuthority = getDomainAuthority(linkingDomain);
    const relevanceScore = calculateRelevanceScore(domain, linkingDomain);
    networkBoost += (linkingAuthority * 0.1) * relevanceScore;
  });
  
  return Math.min(baseAuthority + networkBoost, 100);
}

/**
 * Calculate topical relevance between domains
 * Higher relevance = more authority transfer
 */
function calculateRelevanceScore(domain1, domain2) {
  const domainTopics = {
    'business.affynix.com': ['business', 'marketing', 'entrepreneurship'],
    'money.affynix.com': ['finance', 'investing', 'wealth'],
    'health.affynix.com': ['fitness', 'wellness', 'nutrition'],
    'lifestyle.affynix.com': ['relationships', 'personal-development', 'lifestyle']
  };
  
  const topics1 = domainTopics[domain1] || [];
  const topics2 = domainTopics[domain2] || [];
  
  // Calculate Jaccard similarity
  const intersection = topics1.filter(topic => topics2.includes(topic));
  const union = [...new Set([...topics1, ...topics2])];
  
  return intersection.length / union.length;
}

/**
 * Generate cross-domain link structure for SEO
 */
export function generateCrossDomainLinks(currentDomain) {
  const currentConfig = DOMAIN_CONFIGS[currentDomain];
  if (!currentConfig) return [];
  
  return currentConfig.networkLinks.map(link => ({
    ...link,
    url: `https://${link.domain}`,
    authority: getDomainAuthority(link.domain),
    relevance: calculateRelevanceScore(currentDomain, link.domain)
  }));
}

/**
 * Generate structured data for network authority
 */
export function generateNetworkSchema(currentDomain) {
  const crossDomainLinks = generateCrossDomainLinks(currentDomain);
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Affynix Network',
    url: `https://${currentDomain}`,
    potentialAction: {
      '@type': 'SearchAction',
      target: `https://${currentDomain}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Affynix',
      url: 'https://affynix.com',
      sameAs: crossDomainLinks.map(link => link.url)
    },
    mainEntity: {
      '@type': 'ItemList',
      name: 'Affynix Network Sites',
      itemListElement: crossDomainLinks.map((link, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: link.label,
        url: link.url
      }))
    }
  };
}

/**
 * Generate meta tags for cross-domain SEO
 */
export function generateCrossDomainMeta(currentDomain) {
  const crossDomainLinks = generateCrossDomainLinks(currentDomain);
  
  return {
    'canonical': `https://${currentDomain}`,
    'alternate': crossDomainLinks.map(link => ({
      hreflang: link.domain === 'affynix.com' ? 'en' : 'en',
      href: link.url
    })),
    'dns-prefetch': crossDomainLinks.map(link => link.domain),
    'preconnect': crossDomainLinks.map(link => `https://${link.domain}`)
  };
}

/**
 * Track cross-domain navigation for analytics
 */
export function trackCrossDomainNavigation(fromDomain, toDomain) {
  if (typeof window !== 'undefined') {
    // Google Analytics 4 event
    if (window.gtag) {
      window.gtag('event', 'cross_domain_navigation', {
        from_domain: fromDomain,
        to_domain: toDomain,
        network_authority: getDomainAuthority(toDomain)
      });
    }
    
    // Custom analytics
    if (window.affynixAnalytics) {
      window.affynixAnalytics.track('cross_domain_navigation', {
        from: fromDomain,
        to: toDomain,
        timestamp: Date.now()
      });
    }
  }
}

/**
 * Optimize internal linking structure
 */
export function optimizeInternalLinking(products, currentDomain) {
  const crossDomainLinks = generateCrossDomainLinks(currentDomain);
  
  return products.map(product => ({
    ...product,
    internalLinks: crossDomainLinks.filter(link => 
      calculateRelevanceScore(currentDomain, link.domain) > 0.3
    ).map(link => ({
      domain: link.domain,
      label: link.label,
      url: link.url,
      relevance: calculateRelevanceScore(currentDomain, link.domain)
    }))
  }));
}
