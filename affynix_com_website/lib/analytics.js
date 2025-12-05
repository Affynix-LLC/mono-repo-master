/**
 * UNIFIED ANALYTICS TRACKING LAYER
 * Centralized analytics for all Affynix domains
 */

/**
 * Initialize analytics for a specific domain
 */
export function initializeAnalytics(domainConfig) {
  if (typeof window === 'undefined') return;
  
  const { analytics } = domainConfig;
  
  // Initialize Google Analytics
  if (analytics.googleAnalyticsId) {
    initializeGoogleAnalytics(analytics.googleAnalyticsId);
  }
  
  // Initialize Cloudfilt
  if (analytics.cloudfilt?.enabled) {
    initializeCloudfilt(analytics.cloudfilt.siteId);
  }
  
  // Initialize Charla
  if (analytics.charla?.enabled) {
    initializeCharla(analytics.charla.widgetId);
  }
  
  // Initialize ClickRank
  if (analytics.clickrank?.enabled) {
    initializeClickRank(analytics.clickrank.domain);
  }
  
  // Initialize custom Affynix analytics
  initializeAffynixAnalytics(domainConfig);
}

/**
 * Initialize Google Analytics 4
 */
function initializeGoogleAnalytics(gaId) {
  if (window.gtag) return; // Already initialized
  
  // Load GA4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);
  
  // Initialize GA4
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', gaId, {
    page_title: document.title,
    page_location: window.location.href
  });
}

/**
 * Initialize Cloudfilt analytics
 */
function initializeCloudfilt(siteId) {
  if (window.cloudfilt) return; // Already initialized
  
  const script = document.createElement('script');
  script.src = `https://cloudfilt.com/analytics/${siteId}.js`;
  script.async = true;
  document.head.appendChild(script);
}

/**
 * Initialize Charla widget
 */
function initializeCharla(widgetId) {
  if (window.charla) return; // Already initialized
  
  const script = document.createElement('script');
  script.src = `https://charla.ai/widget/${widgetId}.js`;
  script.async = true;
  document.head.appendChild(script);
}

/**
 * Initialize ClickRank tracking
 */
function initializeClickRank(domain) {
  if (window.clickrank) return; // Already initialized
  
  window.clickrank = {
    domain: domain,
    track: function(event, data) {
      // Send to ClickRank API
      fetch('/api/analytics/clickrank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, data, domain })
      }).catch(console.error);
    }
  };
}

/**
 * Initialize custom Affynix analytics
 */
function initializeAffynixAnalytics(domainConfig) {
  window.affynixAnalytics = {
    domain: domainConfig.slug,
    config: domainConfig,
    
    track: function(event, data = {}) {
      const payload = {
        event,
        data: {
          ...data,
          domain: domainConfig.slug,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent
        }
      };
      
      // Send to internal analytics API
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(console.error);
      
      // Also send to Google Analytics if available
      if (window.gtag) {
        window.gtag('event', event, {
          custom_parameter_1: domainConfig.slug,
          custom_parameter_2: JSON.stringify(data)
        });
      }
    },
    
    trackConversion: function(conversionType, value = 0) {
      this.track('conversion', {
        type: conversionType,
        value: value,
        currency: 'USD'
      });
      
      // Track in GA4
      if (window.gtag) {
        window.gtag('event', 'conversion', {
          event_category: 'affiliate',
          event_label: conversionType,
          value: value,
          currency: 'USD'
        });
      }
    },
    
    trackModalOpen: function(modalType, productId = null) {
      this.track('modal_open', {
        modal_type: modalType,
        product_id: productId
      });
    },
    
    trackAffiliateClick: function(productId, productName, price) {
      this.track('affiliate_click', {
        product_id: productId,
        product_name: productName,
        price: price
      });
      
      // Track conversion
      this.trackConversion('affiliate_click', price);
    }
  };
}

/**
 * Track page view
 */
export function trackPageView(domainConfig) {
  if (typeof window === 'undefined') return;
  
  // Track in GA4
  if (window.gtag) {
    window.gtag('config', domainConfig.analytics.googleAnalyticsId, {
      page_title: domainConfig.seo.metaTitle,
      page_location: window.location.href
    });
  }
  
  // Track in custom analytics
  if (window.affynixAnalytics) {
    window.affynixAnalytics.track('page_view', {
      page_title: domainConfig.seo.metaTitle,
      page_url: window.location.href
    });
  }
}

/**
 * Track product interaction
 */
export function trackProductInteraction(action, product, domainConfig) {
  if (typeof window === 'undefined') return;
  
  const eventData = {
    action,
    product_id: product.id,
    product_name: product.name,
    product_category: product.category,
    product_price: product.price
  };
  
  // Track in custom analytics
  if (window.affynixAnalytics) {
    window.affynixAnalytics.track('product_interaction', eventData);
  }
  
  // Track in GA4
  if (window.gtag) {
    window.gtag('event', 'product_interaction', {
      event_category: 'ecommerce',
      event_label: action,
      custom_parameter_1: product.id,
      custom_parameter_2: product.category
    });
  }
}

/**
 * Track cross-domain navigation
 */
export function trackCrossDomainNavigation(fromDomain, toDomain) {
  if (typeof window === 'undefined') return;
  
  // Track in custom analytics
  if (window.affynixAnalytics) {
    window.affynixAnalytics.track('cross_domain_navigation', {
      from_domain: fromDomain,
      to_domain: toDomain
    });
  }
  
  // Track in GA4
  if (window.gtag) {
    window.gtag('event', 'cross_domain_navigation', {
      event_category: 'navigation',
      event_label: `${fromDomain} -> ${toDomain}`
    });
  }
}

/**
 * Get analytics summary for dashboard
 */
export async function getAnalyticsSummary(domain) {
  try {
    const response = await fetch(`/api/analytics/summary?domain=${domain}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch analytics summary:', error);
    return null;
  }
}
