/**
 * SMART TRACKING ID GENERATOR
 * Intelligent tracking system for Affynix affiliate marketing
 */

export class SmartTracking {
  constructor() {
    this.baseNickname = 'affynix';
    this.trafficSources = {
      'email': 'email',
      'organic': 'organic', 
      'paid': 'paid',
      'social': 'social',
      'direct': 'direct',
      'referral': 'referral'
    };
  }

  /**
   * Generate smart ClickBank TID
   * Format: affynix-{product}-{subdomain}-{traffic-source}
   */
  generateTID(productId, subdomain, trafficSource = 'organic') {
    const product = this.getProductName(productId);
    const domain = this.getDomainSlug(subdomain);
    const source = this.trafficSources[trafficSource] || 'organic';
    
    return `${this.baseNickname}-${product}-${domain}-${source}`;
  }

  /**
   * Generate comprehensive UTM parameters
   */
  generateUTM(productId, subdomain, trafficSource = 'organic', campaign = null) {
    const product = this.getProductName(productId);
    const domain = this.getDomainSlug(subdomain);
    
    return {
      utm_source: 'affynix',
      utm_medium: 'affiliate',
      utm_campaign: campaign || `${product}-${domain}`,
      utm_content: `${product}-${domain}-${trafficSource}`,
      utm_term: `${product}-supplement`,
      affynix_source: `${domain}-subdomain`,
      affynix_product: productId,
      affynix_traffic: trafficSource
    };
  }

  /**
   * Build complete tracking URL with all parameters
   */
  buildTrackingURL(baseAffiliateLink, productId, subdomain, trafficSource = 'organic', campaign = null) {
    const url = new URL(baseAffiliateLink);
    const tid = this.generateTID(productId, subdomain, trafficSource);
    const utm = this.generateUTM(productId, subdomain, trafficSource, campaign);
    
    // Add ClickBank TID
    url.searchParams.set('tid', tid);
    
    // Add UTM parameters
    Object.entries(utm).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    
    return {
      url: url.toString(),
      tid: tid,
      utm: utm
    };
  }

  /**
   * Get product name from product ID
   */
  getProductName(productId) {
    const productMap = {
      'lds001': 'prostavive',
      'hlt007': 'prodentim',
      'biz001': 'productname', // Add more as needed
      'mny001': 'productname',
      'rel001': 'productname',
      'hom001': 'productname',
      'tch001': 'productname'
    };
    
    return productMap[productId] || 'unknown';
  }

  /**
   * Get domain slug from subdomain
   */
  getDomainSlug(subdomain) {
    const domainMap = {
      'leads.affynix.com': 'leads',
      'health.affynix.com': 'health',
      'business.affynix.com': 'business',
      'money.affynix.com': 'money',
      'relationships.affynix.com': 'relationships',
      'home.affynix.com': 'home',
      'tech.affynix.com': 'tech',
      'lifestyle.affynix.com': 'lifestyle'
    };
    
    return domainMap[subdomain] || 'unknown';
  }

  /**
   * Track conversion with detailed attribution
   */
  trackConversion(productId, subdomain, trafficSource, conversionValue = 0) {
    const tid = this.generateTID(productId, subdomain, trafficSource);
    const utm = this.generateUTM(productId, subdomain, trafficSource);
    
    // Send to analytics
    if (typeof window !== 'undefined' && window.affynixAnalytics) {
      window.affynixAnalytics.track('conversion', {
        product_id: productId,
        subdomain: subdomain,
        traffic_source: trafficSource,
        tid: tid,
        conversion_value: conversionValue,
        utm_campaign: utm.utm_campaign,
        utm_content: utm.utm_content
      });
    }
    
    return { tid, utm };
  }
}

// Export singleton instance
export const smartTracking = new SmartTracking();

// Example usage:
// const tracking = smartTracking.buildTrackingURL(
//   'https://affiliate-link.com',
//   'lds001', // ProstaVive
//   'leads.affynix.com',
//   'email'
// );
// console.log(tracking.url); // Full URL with smart tracking
// console.log(tracking.tid); // affynix-prostavive-leads-email
