#!/usr/bin/env node

/**
 * CLICKBANK SYNC - Simplified Integration
 * 
 * Usage: node scripts/clickbank-sync.js [domain] [count]
 * 
 * Examples:
 * node scripts/clickbank-sync.js business 5
 * node scripts/clickbank-sync.js money 3
 */

const fs = require('fs');
const path = require('path');

// ClickBank API configuration
const CLICKBANK_API = {
  developerKey: 'API-5FLYGLS0XJWYXSY6O1JGBWRL9LCRWGTO9E1R',
  clerkKey: 'API-BNHNZQ5JMN1M373BXKXZOSQI5GZLWJMCA9XQ',
  baseUrl: 'https://api.clickbank.com/rest/1.3'
};

// Category mapping for ClickBank
const CATEGORY_MAPPING = {
  business: ['Business', 'Marketing', 'Sales', 'Entrepreneur'],
  money: ['Finance', 'Investing', 'Real Estate', 'Trading'],
  health: ['Health', 'Fitness', 'Weight Loss', 'Nutrition'],
  home: ['Home', 'Garden', 'DIY', 'Crafts'],
  relationships: ['Dating', 'Relationships', 'Marriage', 'Family'],
  tech: ['Software', 'Technology', 'Programming', 'Web Development']
};

class ClickBankSync {
  constructor(domain, count = 5) {
    this.domain = domain;
    this.count = count;
    this.products = [];
  }

  async fetchProducts() {
    console.log(`🔄 Fetching ${this.count} products for ${this.domain} domain...`);
    
    try {
      const response = await this.makeRequest('/marketplace/products');
      
      if (response && response.data) {
        // Filter products by category
        const filteredProducts = response.data
          .filter(product => this.isRelevantProduct(product))
          .slice(0, this.count);
        
        this.products = filteredProducts;
        console.log(`✅ Found ${this.products.length} relevant products`);
        return this.products;
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error.message);
      throw error;
    }
  }

  isRelevantProduct(product) {
    const categories = CATEGORY_MAPPING[this.domain] || [];
    const productCategory = (product.category || '').toLowerCase();
    const productTitle = (product.title || '').toLowerCase();
    
    return categories.some(cat => 
      productCategory.includes(cat.toLowerCase()) ||
      productTitle.includes(cat.toLowerCase())
    );
  }

  async makeRequest(endpoint) {
    return new Promise((resolve, reject) => {
      const https = require('https');
      const url = `${CLICKBANK_API.baseUrl}${endpoint}`;
      
      const options = {
        headers: {
          'Accept': 'application/json',
          'Authorization': CLICKBANK_API.developerKey
        }
      };

      https.get(url, options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          console.log('Response status:', res.statusCode);
          console.log('Response headers:', res.headers);
          console.log('Raw response:', data.substring(0, 200) + '...');
          
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            reject(new Error(`Failed to parse JSON: ${error.message}\nRaw data: ${data.substring(0, 500)}`));
          }
        });
      }).on('error', (error) => {
        reject(error);
      });
    });
  }

  convertProduct(clickbankProduct) {
    return {
      id: `cb${clickbankProduct.id}`,
      name: clickbankProduct.title || 'Untitled Product',
      price: parseFloat(clickbankProduct.price) || 0,
      recurring: false,
      category: this.getCategory(clickbankProduct),
      affiliateLink: clickbankProduct.hoplink || clickbankProduct.url,
      image: clickbankProduct.imageUrl || this.getDefaultImage(),
      description: this.generateDescription(clickbankProduct),
      features: this.generateFeatures(clickbankProduct),
      skillLevel: 'Beginner',
      timeInvestment: '30 min/day',
      platform: 'Online Course',
      affiliateNetwork: 'ClickBank',
      vendorId: clickbankProduct.vendorId,
      productId: clickbankProduct.id,
      commission: 0.6,
      addedDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
  }

  getCategory(product) {
    const categories = CATEGORY_MAPPING[this.domain];
    return categories[0] || 'General';
  }

  getDefaultImage() {
    const images = {
      business: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
      money: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80',
      health: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
      home: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
      relationships: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80',
      tech: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80'
    };
    return images[this.domain] || images.business;
  }

  generateDescription(product) {
    const title = product.title || '';
    const desc = product.description || '';
    
    let description = `${title}. ${desc}`.substring(0, 150);
    
    if (description.length < 120) {
      description += ' Transform your results with this proven system.';
    }
    
    return description.substring(0, 160);
  }

  generateFeatures(product) {
    const features = [
      'Step-by-step training system',
      'Proven strategies and techniques',
      'Complete implementation guide',
      'Bonus resources and tools'
    ];
    
    // Add domain-specific features
    const domainFeatures = {
      business: ['Marketing automation', 'Sales optimization', 'Business growth strategies'],
      money: ['Investment strategies', 'Wealth building techniques', 'Financial planning'],
      health: ['Fitness routines', 'Nutrition guidance', 'Wellness protocols'],
      home: ['DIY techniques', 'Home improvement tips', 'Lifestyle optimization'],
      relationships: ['Communication skills', 'Relationship building', 'Personal development'],
      tech: ['Software tools', 'Automation systems', 'Digital solutions']
    };
    
    const specificFeatures = domainFeatures[this.domain] || [];
    return [...features, ...specificFeatures].slice(0, 6);
  }

  async saveProducts() {
    const convertedProducts = this.products.map(product => this.convertProduct(product));
    
    const filePath = path.join(process.cwd(), `data/products/${this.domain}.js`);
    const dir = path.dirname(filePath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const domainName = this.domain.charAt(0).toUpperCase() + this.domain.slice(1);
    const fileContent = `/**
 * ${domainName.toUpperCase()} SUBDOMAIN PRODUCTS
 * Auto-synced from ClickBank API
 * Generated: ${new Date().toISOString()}
 * Products: ${convertedProducts.length}
 */

export const ${this.domain}Products = ${JSON.stringify(convertedProducts, null, 2)};
`;

    fs.writeFileSync(filePath, fileContent);
    console.log(`💾 Saved ${convertedProducts.length} products to ${filePath}`);
  }

  async run() {
    console.log(`🚀 CLICKBANK SYNC - ${this.domain.toUpperCase()}`);
    console.log('=====================================');
    
    try {
      await this.fetchProducts();
      await this.saveProducts();
      
      console.log('\n🎉 Sync complete!');
      console.log(`📊 Added ${this.products.length} products to ${this.domain} domain`);
      
    } catch (error) {
      console.error('\n❌ Sync failed:', error.message);
      process.exit(1);
    }
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const domain = args[0] || 'business';
  const count = parseInt(args[1]) || 5;
  
  if (!CATEGORY_MAPPING[domain]) {
    console.error(`❌ Invalid domain: ${domain}`);
    console.log('Available domains:', Object.keys(CATEGORY_MAPPING).join(', '));
    process.exit(1);
  }
  
  const sync = new ClickBankSync(domain, count);
  sync.run();
}

module.exports = ClickBankSync;
