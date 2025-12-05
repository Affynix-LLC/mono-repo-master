/**
 * AFFYNIX CONTENT SYNDICATION
 * Content relationship mapping and cross-linking strategy
 * 
 * SCALABLE ARCHITECTURE:
 * - Dynamic content discovery across network
 * - Intelligent internal linking recommendations
 * - Related content injection for SEO and engagement
 * 
 * Automatically scales with network expansion
 */

import { getActiveDomains, getDomainConfig } from '../../../config/network-domains.js';

class ContentSyndication {
  constructor() {
    this.activeDomains = getActiveDomains();
    this.currentDomain = window.location.hostname;
    this.currentConfig = getDomainConfig(this.currentDomain);
    this.currentPath = window.location.pathname;
    
    this.init();
  }
  
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.syndicate());
    } else {
      this.syndicate();
    }
  }
  
  syndicate() {
    this.injectRelatedContent();
    this.enhanceInternalLinks();
    this.addContentSchema();
  }
  
  /**
   * Inject related content module
   */
  injectRelatedContent() {
    // Skip on homepage
    if (this.currentPath === '/' || this.currentPath === '') return;
    
    const relatedContent = this.generateRelatedContent();
    if (relatedContent.length === 0) return;
    
    const container = document.createElement('aside');
    container.className = 'affynix-related-content';
    container.setAttribute('aria-label', 'Related Content');
    container.style.cssText = `
      max-width: 1400px;
      margin: 4rem auto;
      padding: 2rem;
      background: rgba(26, 26, 26, 0.8);
      border: 1px solid rgba(201, 169, 97, 0.2);
      border-radius: 8px;
    `;
    
    const title = document.createElement('h2');
    title.textContent = 'Explore More Affynix Solutions';
    title.style.cssText = `
      font-size: 1.5rem;
      font-weight: 700;
      color: #C9A961;
      margin-bottom: 1.5rem;
      text-align: center;
    `;
    container.appendChild(title);
    
    const grid = document.createElement('div');
    grid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    `;
    
    relatedContent.forEach(item => {
      const card = this.createRelatedCard(item);
      grid.appendChild(card);
    });
    
    container.appendChild(grid);
    
    // Insert before footer or at end of body
    const footer = document.querySelector('footer');
    if (footer) {
      footer.parentNode.insertBefore(container, footer);
    } else {
      document.body.appendChild(container);
    }
  }
  
  /**
   * Create related content card
   */
  createRelatedCard(item) {
    const card = document.createElement('a');
    card.href = item.url;
    card.rel = 'related';
    card.style.cssText = `
      display: block;
      padding: 1.5rem;
      background: rgba(10, 10, 10, 0.6);
      border: 1px solid rgba(201, 169, 97, 0.1);
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.3s ease;
      color: inherit;
    `;
    
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = '#C9A961';
      card.style.transform = 'translateY(-2px)';
      card.style.boxShadow = '0 4px 20px rgba(201, 169, 97, 0.2)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = 'rgba(201, 169, 97, 0.1)';
      card.style.transform = 'none';
      card.style.boxShadow = 'none';
    });
    
    const cardTitle = document.createElement('h3');
    cardTitle.textContent = item.title;
    cardTitle.style.cssText = `
      font-size: 1.1rem;
      font-weight: 600;
      color: #C9A961;
      margin-bottom: 0.5rem;
    `;
    card.appendChild(cardTitle);
    
    const cardDesc = document.createElement('p');
    cardDesc.textContent = item.description;
    cardDesc.style.cssText = `
      font-size: 0.9rem;
      color: #888;
      line-height: 1.5;
    `;
    card.appendChild(cardDesc);
    
    return card;
  }
  
  /**
   * Generate related content based on current page
   */
  generateRelatedContent() {
    const related = [];
    
    // Get other active domains
    const otherDomains = this.activeDomains.filter(d => 
      d.domain !== this.currentDomain && d.priority > 1
    );
    
    // Limit to 3 related items
    otherDomains.slice(0, 3).forEach(domain => {
      related.push({
        title: `Affynix ${domain.name}`,
        description: this.getSubdomainDescription(domain.name),
        url: `https://${domain.domain}`,
        authority: domain.authority
      });
    });
    
    return related;
  }
  
  /**
   * Get description for subdomain
   */
  getSubdomainDescription(name) {
    const descriptions = {
      'Business': 'Curated tools and training for digital marketing and business development',
      'Money': 'Expert training in investing, trading, and financial independence',
      'Health': 'Evidence-based programs for fitness, nutrition, and optimal health',
      'Lifestyle': 'Sustainable living, home improvement, and practical life skills',
      'Tech': 'Software, SaaS tools, and digital resources for modern professionals',
      'Relationships': 'Psychology-backed training for dating, connection, and communication'
    };
    
    return descriptions[name] || `Explore ${name} solutions`;
  }
  
  /**
   * Enhance internal links with SEO attributes
   */
  enhanceInternalLinks() {
    const links = document.querySelectorAll('a[href]');
    
    links.forEach(link => {
      try {
        const url = new URL(link.href);
        const isInternalNetwork = this.activeDomains.some(d => d.domain === url.hostname);
        
        if (isInternalNetwork) {
          // Add rel attribute for network links
          if (url.hostname === this.activeDomains[0].domain) {
            link.rel = link.rel ? `${link.rel} home` : 'home';
          } else if (url.hostname !== this.currentDomain) {
            link.rel = link.rel ? `${link.rel} related` : 'related';
          }
          
          // Add data attribute for authority
          const domainConfig = getDomainConfig(url.hostname);
          if (domainConfig) {
            link.setAttribute('data-authority', domainConfig.authority);
          }
        }
      } catch (error) {
        // Invalid URL, skip
      }
    });
  }
  
  /**
   * Add Article schema for content pages
   */
  addContentSchema() {
    // Only add on content pages (not homepage)
    if (this.currentPath === '/' || this.currentPath === '') return;
    
    // Check if schema already exists
    if (document.querySelector('script[data-schema-type="article"]')) return;
    
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `https://${this.currentDomain}${this.currentPath}#webpage`,
      'url': window.location.href,
      'name': document.title,
      'description': this.getMetaDescription(),
      'isPartOf': {
        '@type': 'WebSite',
        '@id': `https://${this.currentDomain}/#website`
      },
      'about': {
        '@type': 'Organization',
        '@id': 'https://affynix.com/#organization'
      },
      'mentions': this.activeDomains.map(d => ({
        '@type': 'WebPage',
        'url': `https://${d.domain}`,
        'name': `Affynix ${d.name}`
      }))
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema-type', 'article');
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }
  
  /**
   * Get meta description
   */
  getMetaDescription() {
    const meta = document.querySelector('meta[name="description"]');
    return meta ? meta.content : '';
  }
}

// Auto-initialize
if (typeof window !== 'undefined') {
  new ContentSyndication();
}

export default ContentSyndication;
