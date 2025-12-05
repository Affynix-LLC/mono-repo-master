/**
 * AFFYNIX TRACKING CONFIGURATION
 * Configure your analytics and tracking settings here
 */

export const trackingConfig = {
  // Analytics providers
  googleAnalytics: {
    enabled: true,
    measurementId: 'G-XXXXXXXXXX' // Replace with your GA4 ID
  },
  
  // Click tracking
  clickTracking: {
    enabled: true,
    endpoint: '/api/track-click'
  },
  
  // UTM parameters
  utm: {
    source: 'affynix',
    medium: 'affiliate',
    campaign: 'product-modal'
  },
  
  // Commission tracking
  commission: {
    enabled: true,
    defaultRate: 0.5, // 50% default commission
    networks: {
      clickbank: 0.5,
      shareasale: 0.3,
      cj: 0.4
    }
  }
};
