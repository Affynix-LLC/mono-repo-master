#!/usr/bin/env node

/**
 * CLICKBANK API INTEGRATION
 * 
 * Usage: node scripts/clickbank-integration.js
 * 
 * Features:
 * - Fetch products from ClickBank API
 * - Auto-categorize products by domain
 * - Validate and format product data
 * - Add to local product files
 * - Track commission rates
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ClickBank API configuration
const CLICKBANK_CONFIG = {
  apiKey: 'API-5FLYGLS0XJWYXSY6O1JGBWRL9LCRWGTO9E1R',
  baseUrl: 'https://api.clickbank.com/rest/1.3',
  headers: {
    'Accept': 'application/json',
    'Authorization': 'API-5FLYGLS0XJWYXSY6O1JGBWRL9LCRWGTO9E1R'
  }
};

// Domain mapping for ClickBank categories
const DOMAIN_MAPPING = {
  business: {
    categories: ['Business', 'Marketing', 'Sales', 'Entrepreneur', 'Leadership', 'Management'],
    keywords: ['business', 'marketing', 'sales', 'entrepreneur', 'leadership', 'management', 'startup', 'coaching']
  },
  money: {
    categories: ['Finance', 'Investing', 'Real Estate', 'Trading', 'Wealth', 'Money'],
    keywords: ['finance', 'investing', 'real estate', 'trading', 'wealth', 'money', 'stocks', 'crypto', 'forex']
  },
  health: {
    categories: ['Health', 'Fitness', 'Weight Loss', 'Nutrition', 'Wellness', 'Medical'],
    keywords: ['health', 'fitness', 'weight loss', 'nutrition', 'wellness', 'medical', 'diet', 'exercise', 'supplements']
  },
  home: {
    categories: ['Home', 'Garden', 'DIY', 'Crafts', 'Lifestyle', 'Family'],
    keywords: ['home', 'garden', 'diy', 'crafts', 'lifestyle', 'family', 'cooking', 'decorating', 'improvement']
  },
  relationships: {
    categories: ['Dating', 'Relationships', 'Marriage', 'Family', 'Personal Development'],
    keywords: ['dating', 'relationships', 'marriage', 'family', 'personal development', 'love', 'attraction', 'communication']
  },
  tech: {
    categories: ['Software', 'Technology', 'Programming', 'Web Development', 'Digital'],
    keywords: ['software', 'technology', 'programming', 'web development', 'digital', 'apps', 'tools', 'automation']
  }
};

class ClickBankIntegration {
  constructor() {
    this.products = [];
    this.processedCount = 0;
    this.errorCount = 0;
  }

  // Make API request to ClickBank
  async makeApiRequest(endpoint) {
    return new Promise((resolve, reject) => {
      const url = `${CLICKBANK_CONFIG.baseUrl}${endpoint}`;
      
      const options = {
        headers: CLICKBANK_CONFIG.headers
      };

      https.get(url, options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            reject(new Error(`Failed to parse JSON: ${error.message}`));
          }
        });
      }).on('error', (error) => {
        reject(error);
      });
    });
  }

  // Fetch products from ClickBank
  async fetchProducts(limit = 100) {
    console.log('🔄 Fetching products from ClickBank API...');
    
    try {
      // Get marketplace products
      const response = await this.makeApiRequest(`/marketplace/products?limit=${limit}`);
      
      if (response && response.data) {
        this.products = response.data;
        console.log(`✅ Fetched ${this.products.length} products from ClickBank`);
        return this.products;
      } else {
        throw new Error('No products found in API response');
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error.message);
      throw error;
    }
  }

  // Categorize product by domain
  categorizeProduct(product) {
    const title = (product.title || '').toLowerCase();
    const description = (product.description || '').toLowerCase();
    const category = (product.category || '').toLowerCase();
    const text = `${title} ${description} ${category}`;

    // Score each domain
    const scores = {};
    
    Object.entries(DOMAIN_MAPPING).forEach(([domain, config]) => {
      let score = 0;
      
      // Check categories
      config.categories.forEach(cat => {
        if (text.includes(cat.toLowerCase())) {
          score += 3;
        }
      });
      
      // Check keywords
      config.keywords.forEach(keyword => {
        if (text.includes(keyword.toLowerCase())) {
          score += 1;
        }
      });
      
      scores[domain] = score;
    });

    // Return domain with highest score
    const bestDomain = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    
    return {
      domain: scores[bestDomain] > 0 ? bestDomain : 'business', // Default to business
      confidence: scores[bestDomain],
      scores
    };
  }

  // Convert ClickBank product to our format
  convertProduct(clickbankProduct, domain) {
    const domainConfig = DOMAIN_MAPPING[domain];
    
    return {
      id: `cb${clickbankProduct.id}`,
      name: clickbankProduct.title || 'Untitled Product',
      price: parseFloat(clickbankProduct.price) || 0,
      recurring: false, // ClickBank doesn't always specify this
      category: this.getCategory(clickbankProduct, domain),
      affiliateLink: clickbankProduct.hoplink || clickbankProduct.url,
      image: clickbankProduct.imageUrl || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80',
      description: this.generateDescription(clickbankProduct),
      features: this.extractFeatures(clickbankProduct),
      skillLevel: this.determineSkillLevel(clickbankProduct),
      timeInvestment: this.estimateTimeInvestment(clickbankProduct),
      platform: 'Online Course/Software',
      affiliateNetwork: 'ClickBank',
      vendorId: clickbankProduct.vendorId,
      productId: clickbankProduct.id,
      commission: this.calculateCommission(clickbankProduct),
      addedDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      clickbankData: {
        gravity: clickbankProduct.gravity,
        popularityRank: clickbankProduct.popularityRank,
        category: clickbankProduct.category,
        language: clickbankProduct.language
      }
    };
  }

  // Helper methods
  getCategory(product, domain) {
    const domainConfig = DOMAIN_MAPPING[domain];
    const productCategory = (product.category || '').toLowerCase();
    
    // Try to match with domain categories
    for (const cat of domainConfig.categories) {
      if (productCategory.includes(cat.toLowerCase())) {
        return cat;
      }
    }
    
    // Default categories by domain
    const defaults = {
      business: 'Digital Marketing',
      money: 'Investing',
      health: 'Fitness',
      home: 'Lifestyle',
      relationships: 'Personal Development',
      tech: 'Software'
    };
    
    return defaults[domain] || 'General';
  }

  generateDescription(product) {
    const title = product.title || '';
    const desc = product.description || '';
    
    // Create SEO-optimized description (120-160 chars)
    let description = `${title}. ${desc}`.substring(0, 150);
    
    if (description.length < 120) {
      description += ' Transform your results with this proven system.';
    }
    
    return description.substring(0, 160);
  }

  extractFeatures(product) {
    const features = [];
    const text = `${product.title} ${product.description}`.toLowerCase();
    
    // Common feature keywords
    const featureKeywords = [
      'step-by-step', 'proven', 'system', 'training', 'course', 'guide',
      'templates', 'tools', 'software', 'automation', 'strategies',
      'techniques', 'methods', 'blueprint', 'framework', 'formula'
    ];
    
    featureKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        features.push(keyword.charAt(0).toUpperCase() + keyword.slice(1) + ' system');
      }
    });
    
    // Ensure we have at least 4 features
    while (features.length < 4) {
      features.push(`Advanced ${features.length + 1} strategy`);
    }
    
    return features.slice(0, 8);
  }

  determineSkillLevel(product) {
    const text = `${product.title} ${product.description}`.toLowerCase();
    
    if (text.includes('beginner') || text.includes('basic') || text.includes('start')) {
      return 'Beginner';
    } else if (text.includes('advanced') || text.includes('expert') || text.includes('professional')) {
      return 'Advanced';
    } else {
      return 'Intermediate';
    }
  }

  estimateTimeInvestment(product) {
    const text = `${product.title} ${product.description}`.toLowerCase();
    
    if (text.includes('quick') || text.includes('fast') || text.includes('instant')) {
      return '15-30 min/day';
    } else if (text.includes('comprehensive') || text.includes('complete') || text.includes('full')) {
      return '1-2 hours/day';
    } else {
      return '30-60 min/day';
    }
  }

  calculateCommission(product) {
    // ClickBank typically offers 50-75% commission
    // This is a rough estimate - actual rates vary
    return 0.6; // 60% default
  }

  // Save products to domain files
  async saveProducts() {
    console.log('💾 Saving products to domain files...');
    
    const domainProducts = {};
    
    // Group products by domain
    this.products.forEach(product => {
      const categorization = this.categorizeProduct(product);
      const domain = categorization.domain;
      
      if (!domainProducts[domain]) {
        domainProducts[domain] = [];
      }
      
      const convertedProduct = this.convertProduct(product, domain);
      domainProducts[domain].push(convertedProduct);
    });
    
    // Save each domain's products
    for (const [domain, products] of Object.entries(domainProducts)) {
      if (products.length > 0) {
        await this.saveDomainProducts(domain, products);
        console.log(`✅ Saved ${products.length} products to ${domain} domain`);
      }
    }
  }

  async saveDomainProducts(domain, products) {
    const filePath = path.join(process.cwd(), `data/products/${domain}.js`);
    const dir = path.dirname(filePath);
    
    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Generate file content
    const domainName = domain.charAt(0).toUpperCase() + domain.slice(1);
    const fileContent = `/**
 * ${domainName.toUpperCase()} SUBDOMAIN PRODUCTS
 * Auto-generated from ClickBank API
 * Generated: ${new Date().toISOString()}
 */

export const ${domain}Products = ${JSON.stringify(products, null, 2)};
`;

    // Write file
    fs.writeFileSync(filePath, fileContent);
  }

  // Main execution
  async run() {
    console.log('🚀 CLICKBANK API INTEGRATION');
    console.log('============================');
    
    try {
      // Fetch products
      await this.fetchProducts(50); // Start with 50 products
      
      // Save products
      await this.saveProducts();
      
      console.log('\n🎉 Integration complete!');
      console.log(`📊 Processed ${this.products.length} products`);
      console.log(`✅ Successfully categorized and saved`);
      
      // Show summary
      const domainCounts = {};
      this.products.forEach(product => {
        const cat = this.categorizeProduct(product);
        domainCounts[cat.domain] = (domainCounts[cat.domain] || 0) + 1;
      });
      
      console.log('\n📈 Products by domain:');
      Object.entries(domainCounts).forEach(([domain, count]) => {
        console.log(`  ${domain}: ${count} products`);
      });
      
    } catch (error) {
      console.error('\n❌ Integration failed:', error.message);
      process.exit(1);
    }
  }
}

// Run the integration
if (require.main === module) {
  const integration = new ClickBankIntegration();
  integration.run();
}

module.exports = ClickBankIntegration;
