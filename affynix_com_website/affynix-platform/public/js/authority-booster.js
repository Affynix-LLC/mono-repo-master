/**
 * AFFYNIX AUTHORITY BOOSTER
 * Cross-domain authority transfer and link equity distribution
 * 
 * SCALABLE ARCHITECTURE:
 * - Automatically reads from /config/network-domains.js
 * - No hardcoded domains - add new subdomains in one place
 * - Implements PageRank-style authority flow across network
 * 
 * Add new subdomains: Edit /config/network-domains.js only
 */

import { getActiveDomains, getDomainConfig, getNetworkAuthorityMap } from '../../../config/network-domains.js';

class AuthorityBooster {
  constructor() {
    // Dynamic network configuration - automatically updates when new domains added
    this.activeDomains = getActiveDomains();
    this.authorityScores = getNetworkAuthorityMap();
    this.currentDomain = window.location.hostname;
    this.currentConfig = getDomainConfig(this.currentDomain);
    
    this.init();
  }
  
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.enhance());
    } else {
      this.enhance();
    }
  }
  
  enhance() {
    this.injectCrossLinks();
    this.addAuthoritySignals();
    this.setupLinkTracking();
    this.injectSchemaMarkup();
  }
  
  /**
   * Inject cross-domain navigation footer
   * Automatically includes all active domains
   */
  injectCrossLinks() {
    // Skip if already injected
    if (document.querySelector('.affynix-network-nav')) return;
    
    const nav = document.createElement('nav');
    nav.className = 'affynix-network-nav';
    nav.setAttribute('aria-label', 'Affynix Network Navigation');
    nav.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(10, 10, 10, 0.95);
      border-top: 1px solid rgba(201, 169, 97, 0.2);
      padding: 0.75rem 2rem;
      font-size: 0.85rem;
      color: #888;
      z-index: 999;
      backdrop-filter: blur(10px);
      transition: transform 0.3s ease;
    `;
    
    const container = document.createElement('div');
    container.style.cssText = `
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      flex-wrap: wrap;
      align-items: center;
    `;
    
    // Add link to each active domain (except current)
    this.activeDomains
      .filter(d => d.domain !== this.currentDomain)
      .forEach(domainConfig => {
        const link = document.createElement('a');
        link.href = `https://${domainConfig.domain}`;
        link.textContent = domainConfig.name;
        link.rel = domainConfig.priority === 1 ? 'home' : 'related';
        link.setAttribute('data-authority', domainConfig.authority);
        link.style.cssText = `
          color: #C9A961;
          text-decoration: none;
          transition: color 0.3s ease;
          font-weight: 500;
        `;
        
        link.addEventListener('mouseenter', () => {
          link.style.color = '#D4B574';
        });
        link.addEventListener('mouseleave', () => {
          link.style.color = '#C9A961';
        });
        
        container.appendChild(link);
      });
    
    // Add minimize toggle
    const toggle = document.createElement('button');
    toggle.textContent = '−';
    toggle.setAttribute('aria-label', 'Minimize navigation');
    toggle.style.cssText = `
      background: none;
      border: 1px solid rgba(201, 169, 97, 0.3);
      color: #C9A961;
      width: 24px;
      height: 24px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      line-height: 1;
      transition: all 0.3s ease;
    `;
    
    let minimized = false;
    toggle.addEventListener('click', () => {
      minimized = !minimized;
      nav.style.transform = minimized ? 'translateY(100%)' : 'translateY(0)';
      toggle.textContent = minimized ? '+' : '−';
    });
    
    container.appendChild(toggle);
    nav.appendChild(container);
    document.body.appendChild(nav);
    
    // Adjust body padding to prevent content overlap
    document.body.style.paddingBottom = '50px';
  }
  
  /**
   * Add authority signals for search engines
   * Includes schema markup, meta tags, and DNS prefetch
   */
  addAuthoritySignals() {
    // Add meta tag with authority score
    if (!document.querySelector('meta[name="affynix-authority"]')) {
      const authorityMeta = document.createElement('meta');
      authorityMeta.name = 'affynix-authority';
      authorityMeta.content = JSON.stringify({
        domain: this.currentDomain,
        score: this.authorityScores[this.currentDomain] || 85,
        network: this.activeDomains.map(d => d.domain)
      });
      document.head.appendChild(authorityMeta);
    }
    
    // Add DNS prefetch for all network domains
    this.activeDomains.forEach(domainConfig => {
      if (domainConfig.domain !== this.currentDomain) {
        if (!document.querySelector(`link[rel="dns-prefetch"][href="https://${domainConfig.domain}"]`)) {
          const prefetch = document.createElement('link');
          prefetch.rel = 'dns-prefetch';
          prefetch.href = `https://${domainConfig.domain}`;
          document.head.appendChild(prefetch);
        }
      }
    });
  }
  
  /**
   * Inject comprehensive schema.org markup
   * Establishes organizational relationships for search engines
   */
  injectSchemaMarkup() {
    // Skip if schema already exists
    if (document.querySelector('script[type="application/ld+json"][data-affynix-network]')) return;
    
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        // Main Organization
        {
          '@type': 'Organization',
          '@id': 'https://affynix.com/#organization',
          'name': 'Affynix',
          'url': 'https://affynix.com',
          'sameAs': this.activeDomains.map(d => `https://${d.domain}`),
          'subOrganization': this.activeDomains
            .filter(d => d.priority > 1)
            .map(d => ({
              '@type': 'Organization',
              'name': `Affynix ${d.name}`,
              'url': `https://${d.domain}`
            }))
        },
        // Current Website
        {
          '@type': 'WebSite',
          '@id': `https://${this.currentDomain}/#website`,
          'url': `https://${this.currentDomain}`,
          'name': this.currentConfig ? `Affynix ${this.currentConfig.name}` : 'Affynix',
          'publisher': {
            '@id': 'https://affynix.com/#organization'
          },
          'isPartOf': this.currentConfig && this.currentConfig.priority > 1 ? {
            '@id': 'https://affynix.com/#website'
          } : undefined
        }
      ]
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-affynix-network', 'true');
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }
  
  /**
   * Track cross-domain navigation for link equity analysis
   */
  setupLinkTracking() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link || !link.href) return;
      
      try {
        const targetUrl = new URL(link.href);
        const isNetworkLink = this.activeDomains.some(d => d.domain === targetUrl.hostname);
        
        if (isNetworkLink && targetUrl.hostname !== this.currentDomain) {
          this.trackNavigation(this.currentDomain, targetUrl.hostname);
        }
      } catch (error) {
        // Invalid URL, skip tracking
      }
    });
  }
  
  /**
   * Send navigation event to analytics
   */
  trackNavigation(from, to) {
    const data = {
      event: 'cross_domain_navigation',
      from: from,
      to: to,
      timestamp: Date.now(),
      session: this.getSessionId()
    };
    
    // Use sendBeacon for reliability
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/journey', JSON.stringify(data));
    } else {
      // Fallback to fetch
      fetch('/api/analytics/journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true
      }).catch(() => {}); // Silent fail
    }
  }
  
  /**
   * Get or create session ID
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('affynix_session');
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('affynix_session', sessionId);
    }
    return sessionId;
  }
}

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  new AuthorityBooster();
}

export default AuthorityBooster;
