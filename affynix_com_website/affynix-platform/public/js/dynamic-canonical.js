/**
 * AFFYNIX DYNAMIC CANONICAL URLS
 * Smart canonical URL management across network
 * 
 * SCALABLE ARCHITECTURE:
 * - Prevents duplicate content penalties
 * - Manages canonical attribution dynamically
 * - Handles subdomain consolidation
 * 
 * Automatically updates when domains added to config
 */

import { getDomainConfig } from '../../../config/network-domains.js';

class DynamicCanonical {
  constructor() {
    this.currentDomain = window.location.hostname;
    this.currentConfig = getDomainConfig(this.currentDomain);
    this.currentPath = window.location.pathname;
    this.currentSearch = window.location.search;
    
    this.init();
  }
  
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setCanonical());
    } else {
      this.setCanonical();
    }
  }
  
  /**
   * Set or update canonical URL
   */
  setCanonical() {
    const canonicalUrl = this.determineCanonicalUrl();
    
    let canonical = document.querySelector('link[rel="canonical"]');
    
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    
    canonical.href = canonicalUrl;
    
    // Add alternate for subdomain relationships
    this.addAlternateLinks();
  }
  
  /**
   * Determine the canonical URL based on content and context
   */
  determineCanonicalUrl() {
    // Remove tracking parameters
    const cleanPath = this.cleanPath(this.currentPath);
    const cleanSearch = this.cleanSearchParams(this.currentSearch);
    
    // Build canonical URL
    const canonical = `https://${this.currentDomain}${cleanPath}${cleanSearch}`;
    
    return canonical;
  }
  
  /**
   * Clean path of unnecessary segments
   */
  cleanPath(path) {
    // Remove trailing slashes except for root
    if (path !== '/' && path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    
    // Remove index.html if present
    path = path.replace(/\/index\.html?$/, '');
    
    return path || '/';
  }
  
  /**
   * Clean search parameters of tracking codes
   */
  cleanSearchParams(search) {
    if (!search) return '';
    
    const params = new URLSearchParams(search);
    
    // Remove common tracking parameters
    const trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'fbclid', 'gclid', 'msclkid', 'ref', 'referrer', 'source'
    ];
    
    trackingParams.forEach(param => params.delete(param));
    
    const cleanParams = params.toString();
    return cleanParams ? `?${cleanParams}` : '';
  }
  
  /**
   * Add alternate links for related subdomains
   */
  addAlternateLinks() {
    // Only add for subdomains with related content
    if (!this.currentConfig || this.currentConfig.priority === 1) return;
    
    // Add hreflang for same content across domains (if applicable)
    // This is a placeholder for future i18n expansion
    const hreflang = document.createElement('link');
    hreflang.rel = 'alternate';
    hreflang.hreflang = 'x-default';
    hreflang.href = `https://${this.currentDomain}${this.currentPath}`;
    
    // Only add if doesn't exist
    if (!document.querySelector(`link[rel="alternate"][hreflang="x-default"]`)) {
      document.head.appendChild(hreflang);
    }
  }
  
  /**
   * Update canonical on navigation (for SPAs)
   */
  updateOnNavigation() {
    // Listen for popstate (browser navigation)
    window.addEventListener('popstate', () => {
      this.currentPath = window.location.pathname;
      this.currentSearch = window.location.search;
      this.setCanonical();
    });
    
    // Listen for pushState/replaceState (programmatic navigation)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.currentPath = window.location.pathname;
      this.currentSearch = window.location.search;
      this.setCanonical();
    };
    
    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      this.currentPath = window.location.pathname;
      this.currentSearch = window.location.search;
      this.setCanonical();
    };
  }
}

// Auto-initialize
if (typeof window !== 'undefined') {
  const canonical = new DynamicCanonical();
  canonical.updateOnNavigation(); // Enable SPA support
}

export default DynamicCanonical;
