// AFFILIATE TRACKING CODE for hlt007 - ProDentim
// ClickBank Integrated Sales Reporting Implementation
// Based on: https://support.clickbank.com/en/articles/10535141-integrated-sales-reporting

const trackingData = {
  productId: 'hlt007',
  productName: 'ProDentim: Advanced Oral Health Probiotics',
  category: 'Nutrition & Supplements',
  price: 49,
  affiliateLink: 'https://2b3ba8t68dwiak8n-hmzuksld7.hop.clickbank.net/?&traffic_source=email&traffic_type=email&campaign=C-I&creative=video&ad=1',
  network: 'ClickBank',
  vendorId: 'prodentim',
  commission: 0.5,
  addedDate: '2024-12-19',
  // ClickBank tracking parameters
  clickbankTracking: {
    role: 'affiliate',
    trackingCodes: 'affynix-prodentim', // TID parameter
    productTitle: 'ProDentim: Advanced Oral Health Probiotics',
    affiliateCommission: 0.5,
    itemNumber: 'prodentim-probiotics'
  }
};

// Track product view with ClickBank parameters
analytics.track('Product Added', trackingData);

// Enhanced ClickBank tracking for affiliate clicks
function trackAffiliateClick() {
  analytics.track('Affiliate Click', trackingData);
  
  // Build ClickBank hoplink with proper tracking parameters
  const baseUrl = 'https://2b3ba8t68dwiak8n-hmzuksld7.hop.clickbank.net/';
  const url = new URL(baseUrl);
  
  // Add existing traffic source parameters
  url.searchParams.set('traffic_source', 'email');
  url.searchParams.set('traffic_type', 'email');
  url.searchParams.set('campaign', 'C-I');
  url.searchParams.set('creative', 'video');
  url.searchParams.set('ad', '1');
  
  // Add Affynix tracking parameters with smart attribution
  url.searchParams.set('tid', 'affynix-prodentim'); // ClickBank TID
  url.searchParams.set('utm_source', 'affynix');
  url.searchParams.set('utm_medium', 'affiliate');
  url.searchParams.set('utm_campaign', 'prodentim-health');
  url.searchParams.set('utm_content', 'prodentim-oral-health');
  url.searchParams.set('utm_term', 'probiotic-oral-health');
  url.searchParams.set('affynix_source', 'health-subdomain');
  url.searchParams.set('affynix_product', 'hlt007');
  
  window.open(url.toString(), '_blank');
}

// Enhanced tracking for oral health niche
function trackOralHealthInterest() {
  analytics.track('Health Interest', {
    category: 'Oral Health',
    subcategory: 'Probiotic Supplements',
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

// Track dental health concerns
function trackDentalHealthConcerns() {
  analytics.track('Health Concerns', {
    category: 'Dental Health',
    concerns: ['gum health', 'tooth decay', 'oral microbiome', 'bad breath'],
    productId: 'hlt007'
  });
}

// Export for use in components
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    trackingData,
    trackAffiliateClick,
    trackOralHealthInterest,
    trackModalInteraction,
    trackDentalHealthConcerns
  };
}