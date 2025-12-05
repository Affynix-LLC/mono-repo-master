#!/usr/bin/env node

/**
 * TEST CLICKBANK MOCK - Test the system with mock data
 * 
 * Usage: node scripts/test-clickbank-mock.js business 1
 */

const fs = require('fs');
const path = require('path');

// Mock ClickBank product data
const MOCK_PRODUCTS = {
  business: [
    {
      id: '12345',
      title: 'Social Media Marketing Mastery',
      price: '297.00',
      category: 'Business',
      description: 'Complete system for dominating social media marketing and growing your business online.',
      hoplink: 'https://hop.clickbank.net/?vendor=socialmedia&affiliate=yourid',
      imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
      vendorId: 'socialmedia',
      gravity: 45,
      popularityRank: 1
    }
  ],
  money: [
    {
      id: '67890',
      title: 'Real Estate Investment Blueprint',
      price: '497.00',
      category: 'Finance',
      description: 'Step-by-step guide to building wealth through real estate investments.',
      hoplink: 'https://hop.clickbank.net/?vendor=realestate&affiliate=yourid',
      imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80',
      vendorId: 'realestate',
      gravity: 38,
      popularityRank: 2
    }
  ],
  health: [
    {
      id: '11111',
      title: 'Weight Loss Transformation System',
      price: '197.00',
      category: 'Health',
      description: 'Proven system for sustainable weight loss and healthy lifestyle transformation.',
      hoplink: 'https://hop.clickbank.net/?vendor=weightloss&affiliate=yourid',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
      vendorId: 'weightloss',
      gravity: 52,
      popularityRank: 1
    }
  ]
};

class MockClickBankSync {
  constructor(domain, count = 1) {
    this.domain = domain;
    this.count = count;
    this.products = MOCK_PRODUCTS[domain] || [];
  }

  convertProduct(mockProduct) {
    return {
      id: `cb${mockProduct.id}`,
      name: mockProduct.title,
      price: parseFloat(mockProduct.price),
      recurring: false,
      category: this.getCategory(mockProduct),
      affiliateLink: mockProduct.hoplink,
      image: mockProduct.imageUrl,
      description: this.generateDescription(mockProduct),
      features: this.generateFeatures(mockProduct),
      skillLevel: 'Beginner',
      timeInvestment: '30 min/day',
      platform: 'Online Course',
      affiliateNetwork: 'ClickBank',
      vendorId: mockProduct.vendorId,
      productId: mockProduct.id,
      commission: 0.6,
      addedDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      clickbankData: {
        gravity: mockProduct.gravity,
        popularityRank: mockProduct.popularityRank
      }
    };
  }

  getCategory(product) {
    const categoryMap = {
      business: 'Digital Marketing',
      money: 'Investing',
      health: 'Fitness'
    };
    return categoryMap[this.domain] || 'General';
  }

  generateDescription(product) {
    return `${product.description} Transform your results with this proven system.`;
  }

  generateFeatures(product) {
    const baseFeatures = [
      'Step-by-step training system',
      'Proven strategies and techniques',
      'Complete implementation guide',
      'Bonus resources and tools'
    ];

    const domainFeatures = {
      business: ['Marketing automation', 'Sales optimization'],
      money: ['Investment strategies', 'Wealth building'],
      health: ['Fitness routines', 'Nutrition guidance']
    };

    return [...baseFeatures, ...(domainFeatures[this.domain] || [])];
  }

  async saveProducts() {
    const convertedProducts = this.products
      .slice(0, this.count)
      .map(product => this.convertProduct(product));
    
    const filePath = path.join(process.cwd(), `data/products/${this.domain}.js`);
    const dir = path.dirname(filePath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const domainName = this.domain.charAt(0).toUpperCase() + this.domain.slice(1);
    const fileContent = `/**
 * ${domainName.toUpperCase()} SUBDOMAIN PRODUCTS
 * Test data from ClickBank mock
 * Generated: ${new Date().toISOString()}
 * Products: ${convertedProducts.length}
 */

export const ${this.domain}Products = ${JSON.stringify(convertedProducts, null, 2)};
`;

    fs.writeFileSync(filePath, fileContent);
    console.log(`💾 Saved ${convertedProducts.length} products to ${filePath}`);
  }

  async run() {
    console.log(`🚀 CLICKBANK MOCK TEST - ${this.domain.toUpperCase()}`);
    console.log('=====================================');
    
    if (this.products.length === 0) {
      console.log(`❌ No mock products available for ${this.domain} domain`);
      console.log('Available domains:', Object.keys(MOCK_PRODUCTS).join(', '));
      return;
    }

    await this.saveProducts();
    
    console.log('\n🎉 Mock test complete!');
    console.log(`📊 Added ${this.count} mock product(s) to ${this.domain} domain`);
    console.log('\n📝 Next steps:');
    console.log('1. Test the modal on your site');
    console.log('2. Get your ClickBank Clerk API Key');
    console.log('3. Update the real API integration');
    console.log('4. Deploy changes to production');
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const domain = args[0] || 'business';
  const count = parseInt(args[1]) || 1;
  
  const mockSync = new MockClickBankSync(domain, count);
  mockSync.run();
}

module.exports = MockClickBankSync;
