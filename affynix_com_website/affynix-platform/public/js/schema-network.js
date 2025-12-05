/**
 * AFFYNIX SCHEMA NETWORK
 * Advanced structured data injection across domain network
 * 
 * SCALABLE ARCHITECTURE:
 * - Reads from /config/network-domains.js
 * - Generates comprehensive schema.org markup
 * - Establishes entity relationships for search engines
 * 
 * Automatically updates when domains added to config
 */

import { getActiveDomains, getDomainConfig } from '../../../config/network-domains.js';

class SchemaNetwork {
  constructor() {
    this.activeDomains = getActiveDomains();
    this.currentDomain = window.location.hostname;
    this.currentConfig = getDomainConfig(this.currentDomain);
    
    this.init();
  }
  
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.injectSchemas());
    } else {
      this.injectSchemas();
    }
  }
  
  injectSchemas() {
    this.injectBreadcrumbSchema();
    this.injectWebPageSchema();
    this.injectProductAggregateSchema();
  }
  
  /**
   * Inject BreadcrumbList schema for navigation hierarchy
   */
  injectBreadcrumbSchema() {
    const breadcrumbs = this.generateBreadcrumbs();
    if (breadcrumbs.length === 0) return;
    
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': crumb.name,
        'item': crumb.url
      }))
    };
    
    this.appendSchema(schema, 'breadcrumb');
  }
  
  /**
   * Inject WebPage schema with network context
   */
  injectWebPageSchema() {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `https://${this.currentDomain}${window.location.pathname}#webpage`,
      'url': window.location.href,
      'name': document.title,
      'description': this.getMetaDescription(),
      'isPartOf': {
        '@type': 'WebSite',
        '@id': `https://${this.currentDomain}/#website`,
        'name': this.currentConfig ? `Affynix ${this.currentConfig.name}` : 'Affynix',
        'publisher': {
          '@id': 'https://affynix.com/#organization'
        }
      },
      'about': {
        '@type': 'Thing',
        'name': this.currentConfig ? this.currentConfig.name : 'Solutions',
        'sameAs': this.activeDomains.map(d => `https://${d.domain}`)
      }
    };
    
    this.appendSchema(schema, 'webpage');
  }
  
  /**
   * Inject AggregateOffer schema for product listings
   */
  injectProductAggregateSchema() {
    // Only inject on subdomain pages with product content
    if (!this.currentConfig || this.currentConfig.priority === 1) return;
    
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'itemListElement': this.generateProductListItems(),
      'numberOfItems': this.activeDomains.filter(d => d.priority > 1).length
    };
    
    this.appendSchema(schema, 'itemlist');
  }
  
  /**
   * Generate breadcrumb navigation
   */
  generateBreadcrumbs() {
    const breadcrumbs = [];
    const path = window.location.pathname;
    
    // Always start with network root
    breadcrumbs.push({
      name: 'Affynix',
      url: 'https://affynix.com'
    });
    
    // Add current subdomain if not primary
    if (this.currentConfig && this.currentConfig.priority > 1) {
      breadcrumbs.push({
        name: this.currentConfig.name,
        url: `https://${this.currentDomain}`
      });
    }
    
    // Parse path segments
    const segments = path.split('/').filter(s => s.length > 0);
    let currentPath = '';
    
    segments.forEach(segment => {
      currentPath += `/${segment}`;
      breadcrumbs.push({
        name: this.formatSegmentName(segment),
        url: `https://${this.currentDomain}${currentPath}`
      });
    });
    
    return breadcrumbs;
  }
  
  /**
   * Generate product list items for schema
   */
  generateProductListItems() {
    return this.activeDomains
      .filter(d => d.priority > 1)
      .map((d, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'url': `https://${d.domain}`,
        'name': `Affynix ${d.name}`
      }));
  }
  
  /**
   * Get meta description from page
   */
  getMetaDescription() {
    const meta = document.querySelector('meta[name="description"]');
    return meta ? meta.content : '';
  }
  
  /**
   * Format URL segment for display
   */
  formatSegmentName(segment) {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  /**
   * Append schema to document head
   */
  appendSchema(schema, type) {
    // Check if already exists
    if (document.querySelector(`script[data-schema-type="${type}"]`)) return;
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema-type', type);
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }
}

// Auto-initialize
if (typeof window !== 'undefined') {
  new SchemaNetwork();
}

export default SchemaNetwork;
