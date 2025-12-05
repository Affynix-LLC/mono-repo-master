// AFFILIATE TRACKING CODE for lds001 - ProstaVive
// ClickBank Integrated Sales Reporting Implementation
// Based on: https://support.clickbank.com/en/articles/10535141-integrated-sales-reporting

const trackingData = {
  productId: 'lds001',
  productName: 'ProstaVive: Advanced Prostate Health Formula',
  category: 'Lead Magnets',
  price: 39,
  affiliateLink: 'https://3ef98ys81hlt6q2ntm476b4q1m.hop.clickbank.net/?&traffic_source=email&traffic_type=email&campaign=C-I&creative=video&adgroup=coldblastemail1&ad=1',
  network: 'ClickBank',
  vendorId: 'prostavive',
  commission: 0.75,
  addedDate: '2024-12-19',
  // ClickBank tracking parameters
  clickbankTracking: {
    role: 'affiliate',
    trackingCodes: 'affynix-prostavive', // TID parameter
    productTitle: 'ProstaVive: Advanced Prostate Health Formula',
    affiliateCommission: 0.75,
    itemNumber: 'prostavive-formula'
  }
};

// Track product view with ClickBank parameters
analytics.track('Product Added', trackingData);

// Enhanced ClickBank tracking for affiliate clicks
function trackAffiliateClick() {
  analytics.track('Affiliate Click', trackingData);
  
  // Build ClickBank hoplink with proper tracking parameters
  const baseUrl = 'https://3ef98ys81hlt6q2ntm476b4q1m.hop.clickbank.net/';
  const url = new URL(baseUrl);
  
  // Add existing traffic source parameters
  url.searchParams.set('traffic_source', 'email');
  url.searchParams.set('traffic_type', 'email');
  url.searchParams.set('campaign', 'C-I');
  url.searchParams.set('creative', 'video');
  url.searchParams.set('adgroup', 'coldblastemail1');
  url.searchParams.set('ad', '1');
  
  // Add Affynix tracking parameters with smart attribution
  url.searchParams.set('tid', 'affynix-prostavive'); // ClickBank TID
  url.searchParams.set('utm_source', 'affynix');
  url.searchParams.set('utm_medium', 'affiliate');
  url.searchParams.set('utm_campaign', 'prostavive-leads');
  url.searchParams.set('utm_content', 'prostavive-prostate-health');
  url.searchParams.set('utm_term', 'prostate-health-supplement');
  url.searchParams.set('affynix_source', 'leads-subdomain');
  url.searchParams.set('affynix_product', 'lds001');
  
  window.open(url.toString(), '_blank');
}

// Enhanced tracking for prostate health niche
function trackProstateHealthInterest() {
  analytics.track('Health Interest', {
    category: 'Men\'s Health',
    subcategory: 'Prostate Health',
    productId: 'hlt007',
    interestLevel: 'high'
  });
}

// Track modal interactions
function trackModalInteraction(action) {
  analytics.track('Modal Interaction', {
    productId: 'hlt007',
    action: action, // 'open', 'close', 'details_expand', 'cta_click'
    timestamp: new Date().toISOString()
  });
}

// Export for use in components
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    trackingData,
    trackAffiliateClick,
    trackProstateHealthInterest,
    trackModalInteraction
  };
}
