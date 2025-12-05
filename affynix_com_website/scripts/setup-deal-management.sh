#!/bin/zsh

# AFFYNIX DEAL MANAGEMENT SETUP
# Makes scripts executable and creates necessary directories

echo "🚀 Setting up Affynix Deal Management System..."

# Make scripts executable
chmod +x scripts/add-deal.js
chmod +x scripts/affiliate-tracker.js

# Create necessary directories
mkdir -p tracking
mkdir -p reports
mkdir -p data/products

# Create a sample tracking configuration
cat > tracking/config.js << 'EOF'
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
EOF

echo "✅ Deal management system setup complete!"
echo ""
echo "📝 Available commands:"
echo "  node scripts/add-deal.js           # Add new affiliate deal"
echo "  node scripts/affiliate-tracker.js  # View tracking dashboard"
echo "  node scripts/affiliate-tracker.js list business  # List business products"
echo "  node scripts/affiliate-tracker.js search 'keyword'  # Search products"
echo "  node scripts/affiliate-tracker.js export  # Export CSV report"
echo ""
echo "🎯 Next steps:"
echo "1. Run 'node scripts/add-deal.js' to add your first real product"
echo "2. Test the modal on your site"
echo "3. Set up analytics tracking"
echo "4. Deploy changes to production"
