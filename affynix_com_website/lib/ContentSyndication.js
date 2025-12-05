class AffynixContentSyndication {
  constructor() {
    if (typeof window === 'undefined') return;
    
    this.subdomainNetwork = [
      'affynix.com',
      'finance.affynix.com',
      'health.affynix.com',
      'business.affynix.com',
      'tech.affynix.com'
    ];
    
    this.currentDomain = window.location.hostname;
    this.init();
  }

  init() {
    this.addContentSyndicationMeta();
    this.addCrossDomainContentLinks();
    this.addContentNetworkSchema();
    this.trackContentSyndication();
  }

  addContentSyndicationMeta() {
    const syndicationMeta = document.createElement('meta');
    syndicationMeta.name = 'affynix-content-syndication';
    syndicationMeta.content = JSON.stringify({
      currentDomain: this.currentDomain,
      syndicationNetwork: this.generateSyndicationNetwork(),
      contentRelationships: this.generateContentRelationships(),
      lastUpdated: Date.now()
    });
    document.head.appendChild(syndicationMeta);
  }

  generateSyndicationNetwork() {
    const network = {};
    
    this.subdomainNetwork.forEach(domain => {
      if (domain !== this.currentDomain) {
        network[domain] = {
          syndicationType: this.getSyndicationType(domain),
          contentRelevance: this.calculateContentRelevance(domain),
          syndicationWeight: this.calculateSyndicationWeight(domain)
        };
      }
    });
    
    return network;
  }

  getSyndicationType(targetDomain) {
    const types = {
      'affynix.com': 'hub-syndication',
      'finance.affynix.com': 'vertical-syndication',
      'health.affynix.com': 'vertical-syndication',
      'business.affynix.com': 'vertical-syndication',
      'tech.affynix.com': 'vertical-syndication'
    };
    
    return types[targetDomain] || 'cross-syndication';
  }

  calculateContentRelevance(targetDomain) {
    const relevanceMatrix = {
      'affynix.com': {
        'finance.affynix.com': 0.9,
        'health.affynix.com': 0.9,
        'business.affynix.com': 0.9,
        'tech.affynix.com': 0.9
      }
    };
    
    return relevanceMatrix[this.currentDomain]?.[targetDomain] || 0.5;
  }

  calculateSyndicationWeight(targetDomain) {
    const relevance = this.calculateContentRelevance(targetDomain);
    const authority = this.getDomainAuthority(targetDomain);
    
    return Math.min(relevance * authority * 0.1, 1.0);
  }

  getDomainAuthority(domain) {
    const authorities = {
      'affynix.com': 0.95,
      'finance.affynix.com': 0.88,
      'health.affynix.com': 0.88,
      'business.affynix.com': 0.88,
      'tech.affynix.com': 0.88
    };
    
    return authorities[domain] || 0.8;
  }

  generateContentRelationships() {
    const relationships = [];
    
    this.subdomainNetwork.forEach(domain => {
      if (domain !== this.currentDomain) {
        relationships.push({
          targetDomain: domain,
          relationshipType: 'content-syndication',
          syndicationMethod: this.getSyndicationMethod(domain),
          contentOverlap: this.calculateContentOverlap(domain),
          seoBenefit: this.calculateSEOBenefit(domain)
        });
      }
    });
    
    return relationships;
  }

  getSyndicationMethod(targetDomain) {
    if (this.currentDomain === 'affynix.com') {
      return 'hub-to-spoke';
    } else if (targetDomain === 'affynix.com') {
      return 'spoke-to-hub';
    } else {
      return 'spoke-to-spoke';
    }
  }

  calculateContentOverlap(targetDomain) {
    return 0.7; // Simplified calculation
  }

  calculateSEOBenefit(targetDomain) {
    const relevance = this.calculateContentRelevance(targetDomain);
    const overlap = this.calculateContentOverlap(targetDomain);
    const authority = this.getDomainAuthority(targetDomain);
    
    return (relevance + overlap + authority) / 3;
  }

  addCrossDomainContentLinks() {
    const contentLinks = this.generateContentLinks();
    
    contentLinks.forEach(link => {
      const linkElement = document.createElement('link');
      linkElement.rel = 'alternate';
      linkElement.href = link.url;
      linkElement.setAttribute('data-syndication', 'true');
      linkElement.setAttribute('data-content-type', link.contentType);
      document.head.appendChild(linkElement);
    });
  }

  generateContentLinks() {
    const links = [];
    const currentPath = window.location.pathname;
    
    this.subdomainNetwork.forEach(domain => {
      if (domain !== this.currentDomain) {
        const syndicatedPath = this.generateSyndicatedPath(currentPath, domain);
        if (syndicatedPath) {
          links.push({
            url: `https://${domain}${syndicatedPath}`,
            contentType: this.getContentType(currentPath),
            syndicationWeight: this.calculateSyndicationWeight(domain)
          });
        }
      }
    });
    
    return links;
  }

  generateSyndicatedPath(currentPath, targetDomain) {
    const pathMappings = {
      '/': '/',
      '/finance': '/',
      '/health': '/',
      '/business': '/',
      '/tech': '/'
    };
    
    return pathMappings[currentPath] || currentPath;
  }

  getContentType(path) {
    if (path === '/') return 'homepage';
    if (path.includes('/finance')) return 'finance-content';
    if (path.includes('/health')) return 'health-content';
    if (path.includes('/business')) return 'business-content';
    if (path.includes('/tech')) return 'tech-content';
    return 'general-content';
  }

  addContentNetworkSchema() {
    const contentNetworkSchema = {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "@id": `https://${this.currentDomain}/#content-network`,
      "name": `Affynix ${this.currentDomain.split('.')[0]} Content Network`,
      "description": "Cross-domain content syndication network",
      "isPartOf": {
        "@type": "CreativeWork",
        "name": "Affynix Content Syndication Network",
        "url": "https://affynix.com"
      },
      "hasPart": this.generateContentParts(),
      "publisher": {
        "@type": "Organization",
        "name": "Affynix",
        "url": "https://affynix.com"
      }
    };
    
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.textContent = JSON.stringify(contentNetworkSchema);
    document.head.appendChild(schemaScript);
  }

  generateContentParts() {
    return this.subdomainNetwork.map(domain => ({
      "@type": "WebPage",
      "name": `${domain} Content Hub`,
      "url": `https://${domain}/`,
      "isPartOf": {
        "@id": `https://${this.currentDomain}/#content-network`
      }
    }));
  }

  trackContentSyndication() {
    const metrics = {
      timestamp: Date.now(),
      domain: this.currentDomain,
      syndicationNetwork: Object.keys(this.generateSyndicationNetwork()),
      contentRelationships: this.generateContentRelationships().length,
      averageSEOBenefit: this.calculateAverageSEOBenefit(),
      syndicationStrength: this.calculateSyndicationStrength()
    };
    
    console.log('📡 Content Syndication Metrics:', metrics);
  }

  calculateAverageSEOBenefit() {
    const relationships = this.generateContentRelationships();
    const totalBenefit = relationships.reduce((sum, rel) => sum + rel.seoBenefit, 0);
    return totalBenefit / relationships.length;
  }

  calculateSyndicationStrength() {
    const network = this.generateSyndicationNetwork();
    const totalWeight = Object.values(network).reduce((sum, node) => sum + node.syndicationWeight, 0);
    return totalWeight / Object.keys(network).length;
  }
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.affynixContentSyndication = new AffynixContentSyndication();
  });
}

export default AffynixContentSyndication;