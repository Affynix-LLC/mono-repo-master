/**
 * AFFYNIX NETWORK DOMAIN CONFIGURATION
 * Central registry for all subdomains in the network
 * 
 * Add new subdomains here - all SEO scripts automatically inherit
 * Priority determines authority flow and link placement
 */

export const NETWORK_CONFIG = {
  // Primary domain
  primary: {
    domain: 'affynix.com',
    name: 'Affynix Network',
    authority: 95,
    priority: 1
  },
  
  // Active subdomains (Phase 1)
  subdomains: [
    {
      domain: 'business.affynix.com',
      name: 'Business',
      authority: 88,
      priority: 2,
      categories: ['Digital Marketing', 'Business Development'],
      active: true
    },
    {
      domain: 'money.affynix.com',
      name: 'Money',
      authority: 88,
      priority: 3,
      categories: ['Investing & Trading', 'Personal Finance', 'Real Estate'],
      active: true
    },
    {
      domain: 'health.affynix.com',
      name: 'Health',
      authority: 88,
      priority: 4,
      categories: ['Fitness & Training', 'Nutrition & Supplements', 'Mental Wellness'],
      active: true
    },
    {
      domain: 'lifestyle.affynix.com',
      name: 'Lifestyle',
      authority: 88,
      priority: 5,
      categories: ['Home & Garden', 'Sustainable Living', 'Life Skills'],
      active: true
    }
  ],
  
  // Planned subdomains (Phase 2) - Set active: true when ready to launch
  planned: [
    {
      domain: 'tech.affynix.com',
      name: 'Tech',
      authority: 85,
      priority: 6,
      categories: ['Software & SaaS', 'AI & Automation', 'Development Resources'],
      active: false  // Set to true when ready to launch
    },
    {
      domain: 'relationships.affynix.com',
      name: 'Relationships',
      authority: 85,
      priority: 7,
      categories: ['Dating & Attraction', 'Relationship Development', 'Social Confidence'],
      active: false
    },
    // Add future domains here...
  ]
};

/**
 * Get all active domains (primary + active subdomains)
 * Used by SEO scripts for link injection and authority distribution
 */
export function getActiveDomains() {
  const active = [NETWORK_CONFIG.primary];
  
  NETWORK_CONFIG.subdomains
    .filter(d => d.active)
    .forEach(d => active.push(d));
    
  NETWORK_CONFIG.planned
    .filter(d => d.active)
    .forEach(d => active.push(d));
    
  return active.sort((a, b) => a.priority - b.priority);
}

/**
 * Get domain configuration by hostname
 */
export function getDomainConfig(hostname) {
  if (hostname === NETWORK_CONFIG.primary.domain) {
    return NETWORK_CONFIG.primary;
  }
  
  const subdomain = [...NETWORK_CONFIG.subdomains, ...NETWORK_CONFIG.planned]
    .find(d => d.domain === hostname);
    
  return subdomain || null;
}

/**
 * Get all domain names for DNS prefetch, schema markup, etc.
 */
export function getAllDomainNames() {
  return getActiveDomains().map(d => d.domain);
}

/**
 * Calculate network-wide authority scores
 * Used for PageRank-style authority distribution
 */
export function getNetworkAuthorityMap() {
  const map = {};
  getActiveDomains().forEach(d => {
    map[d.domain] = d.authority;
  });
  return map;
}
