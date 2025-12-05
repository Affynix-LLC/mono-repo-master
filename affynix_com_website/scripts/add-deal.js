#!/usr/bin/env node

/**
 * AFFYNIX DEAL MANAGEMENT SCRIPT
 * 
 * Usage: node scripts/add-deal.js
 * 
 * Features:
 * - Interactive deal creation wizard
 * - Data validation and formatting
 * - Automatic file updates
 * - Affiliate tracking setup
 * - SEO optimization suggestions
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Domain configuration
const DOMAINS = {
  business: {
    name: 'Business',
    categories: ['Digital Marketing', 'Business Development', 'Sales Training', 'Leadership'],
    file: 'data/products/business.js'
  },
  money: {
    name: 'Money',
    categories: ['Investing', 'Real Estate', 'Trading', 'Personal Finance', 'Cryptocurrency'],
    file: 'data/products/money.js'
  },
  health: {
    name: 'Health',
    categories: ['Fitness', 'Nutrition', 'Weight Loss', 'Mental Health', 'Wellness'],
    file: 'data/products/health.js'
  },
  lifestyle: {
    name: 'Lifestyle',
    categories: ['Dating & Relationships', 'Travel & Adventure', 'Personal Development', 'Social Skills'],
    file: 'data/products/lifestyle.js'
  },
  tech: {
    name: 'Tech',
    categories: ['Programming', 'Web Development', 'Data Science', 'AI/ML', 'Cybersecurity'],
    file: 'data/products/tech.js'
  },
  home: {
    name: 'Home',
    categories: ['Home Improvement', 'Gardening', 'DIY', 'Interior Design', 'Lifestyle'],
    file: 'data/products/home.js'
  },
  relationships: {
    name: 'Relationships',
    categories: ['Dating', 'Marriage', 'Communication', 'Personal Development'],
    file: 'data/products/relationships.js'
  },
  food: {
    name: 'Food',
    categories: ['Cooking & Recipes', 'Specialized Diets', 'Meal Planning', 'Nutrition Science'],
    file: 'data/products/food.js'
  },
  outdoors: {
    name: 'Outdoors',
    categories: ['Camping & Hiking', 'Survival Skills', 'Outdoor Equipment', 'Adventure Sports'],
    file: 'data/products/outdoors.js'
  },
  travel: {
    name: 'Travel',
    categories: ['Travel Planning', 'Travel Hacking', 'Destination Guides', 'Adventure Travel'],
    file: 'data/products/travel.js'
  },
  leads: {
    name: 'Leads',
    categories: ['Email Marketing', 'Lead Magnets', 'Sales Funnels', 'Marketing Automation'],
    file: 'data/products/leads.js'
  },
  edu: {
    name: 'Education',
    categories: ['Online Courses', 'Learning Management', 'Educational Technology', 'Student Tools'],
    file: 'data/products/edu.js'
  },
  sports: {
    name: 'Sports',
    categories: ['Fitness Equipment', 'Training Programs', 'Sports Nutrition', 'Athletic Performance'],
    file: 'data/products/sports.js'
  }
};

// Product template with validation rules
const PRODUCT_TEMPLATE = {
  id: { required: true, pattern: /^[a-z]{3}\d{3}$/, example: 'biz001' },
  name: { required: true, minLength: 10, maxLength: 80, example: 'Social Media Marketing Mastery Suite' },
  price: { required: true, type: 'number', min: 1, example: 297 },
  recurring: { required: true, type: 'boolean', example: false },
  recurringPeriod: { required: false, options: ['monthly', 'annual'], example: 'monthly' },
  category: { required: true, example: 'Digital Marketing' },
  affiliateLink: { required: true, pattern: /^https?:\/\/.+/, example: 'https://clickbank.com/product' },
  image: { required: true, pattern: /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i, example: 'https://images.unsplash.com/photo-123.jpg' },
  description: { required: true, minLength: 120, maxLength: 160, example: 'Complete social media automation platform for explosive business growth across all major platforms.' },
  features: { required: true, type: 'array', minItems: 4, maxItems: 8, example: ['Multi-platform scheduling', 'Advanced analytics', 'AI content generation'] },
  skillLevel: { required: true, options: ['Beginner', 'Intermediate', 'Advanced'], example: 'Beginner' },
  timeInvestment: { required: true, example: '30 min/day' },
  platform: { required: true, example: 'Web + Mobile App' },
  // Tracking fields
  affiliateNetwork: { required: false, example: 'ClickBank' },
  vendorId: { required: false, example: 'vendor123' },
  productId: { required: false, example: 'prod456' },
  commission: { required: false, type: 'number', example: 0.5 },
  addedDate: { required: false, auto: true },
  lastUpdated: { required: false, auto: true }
};

class DealManager {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }

  async selectDomain() {
    console.log('\n🏢 SELECT DOMAIN:');
    const domains = Object.keys(DOMAINS);
    domains.forEach((domain, index) => {
      console.log(`${index + 1}. ${DOMAINS[domain].name} (${domain})`);
    });
    
    const choice = await this.question('\nEnter domain number: ');
    const domainIndex = parseInt(choice) - 1;
    
    if (domainIndex < 0 || domainIndex >= domains.length) {
      console.log('❌ Invalid selection');
      return await this.selectDomain();
    }
    
    return domains[domainIndex];
  }

  async selectCategory(domain) {
    console.log(`\n📂 SELECT CATEGORY for ${DOMAINS[domain].name}:`);
    const categories = DOMAINS[domain].categories;
    categories.forEach((category, index) => {
      console.log(`${index + 1}. ${category}`);
    });
    
    const choice = await this.question('\nEnter category number: ');
    const categoryIndex = parseInt(choice) - 1;
    
    if (categoryIndex < 0 || categoryIndex >= categories.length) {
      console.log('❌ Invalid selection');
      return await this.selectCategory(domain);
    }
    
    return categories[categoryIndex];
  }

  async generateId(domain) {
    const filePath = path.join(process.cwd(), DOMAINS[domain].file);
    let existingIds = [];
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const idMatches = content.match(/id:\s*['"`]([^'"`]+)['"`]/g);
      if (idMatches) {
        existingIds = idMatches.map(match => match.match(/['"`]([^'"`]+)['"`]/)[1]);
      }
    }
    
    const prefix = domain.substring(0, 3);
    let counter = 1;
    let newId = `${prefix}${counter.toString().padStart(3, '0')}`;
    
    while (existingIds.includes(newId)) {
      counter++;
      newId = `${prefix}${counter.toString().padStart(3, '0')}`;
    }
    
    return newId;
  }

  async collectProductData(domain, category) {
    console.log('\n📝 PRODUCT INFORMATION:');
    const product = {};
    
    // Auto-generate ID
    product.id = await this.generateId(domain);
    console.log(`✅ Generated ID: ${product.id}`);
    
    // Collect required fields
    for (const [field, rules] of Object.entries(PRODUCT_TEMPLATE)) {
      if (rules.auto) {
        product[field] = new Date().toISOString().split('T')[0];
        continue;
      }
      
      if (rules.required) {
        const prompt = `\n${field}${rules.example ? ` (e.g., ${rules.example})` : ''}: `;
        let value = await this.question(prompt);
        
        // Validation
        if (rules.type === 'number') {
          value = parseFloat(value);
          if (isNaN(value) || value < (rules.min || 0)) {
            console.log(`❌ Invalid number. Must be >= ${rules.min || 0}`);
            value = await this.question(prompt);
          }
        } else if (rules.type === 'boolean') {
          value = value.toLowerCase() === 'true' || value.toLowerCase() === 'yes';
        } else if (rules.type === 'array') {
          value = value.split(',').map(item => item.trim());
          if (value.length < rules.minItems || value.length > rules.maxItems) {
            console.log(`❌ Must have ${rules.minItems}-${rules.maxItems} features`);
            value = await this.question(prompt);
          }
        } else if (rules.pattern && !rules.pattern.test(value)) {
          console.log(`❌ Invalid format`);
          value = await this.question(prompt);
        } else if (rules.minLength && value.length < rules.minLength) {
          console.log(`❌ Too short. Minimum ${rules.minLength} characters`);
          value = await this.question(prompt);
        } else if (rules.maxLength && value.length > rules.maxLength) {
          console.log(`❌ Too long. Maximum ${rules.maxLength} characters`);
          value = await this.question(prompt);
        }
        
        product[field] = value;
      }
    }
    
    // Set category
    product.category = category;
    
    return product;
  }

  async saveProduct(domain, product) {
    const filePath = path.join(process.cwd(), DOMAINS[domain].file);
    const dir = path.dirname(filePath);
    
    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Read existing products
    let products = [];
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const exportMatch = content.match(/export const \w+Products = (\[[\s\S]*?\]);/);
      if (exportMatch) {
        try {
          products = eval(exportMatch[1]);
        } catch (e) {
          console.log('⚠️  Could not parse existing products, starting fresh');
        }
      }
    }
    
    // Add new product
    products.push(product);
    
    // Generate file content
    const domainName = DOMAINS[domain].name.toLowerCase();
    const fileContent = `/**
 * ${DOMAINS[domain].name.toUpperCase()} SUBDOMAIN PRODUCTS
 * Category Distribution: ${DOMAINS[domain].categories.join(', ')}
 * 
 * Product Schema:
 * - id: Unique identifier (${domain.substring(0, 3)}001, ${domain.substring(0, 3)}002, etc.)
 * - name: Product title (SEO-optimized)
 * - price: Base price in USD
 * - recurring: Boolean for subscription products
 * - recurringPeriod: 'monthly' | 'annual' (if recurring)
 * - category: Must match domain config categories
 * - affiliateLink: ClickBank/partner checkout URL
 * - image: Product image URL (800x600px recommended)
 * - description: SEO-optimized description (120-160 chars)
 * - features: Array of key features (4-8 items)
 * - skillLevel: 'Beginner' | 'Intermediate' | 'Advanced'
 * - timeInvestment: Expected time commitment
 * - platform: Delivery format
 * - affiliateNetwork: Partner network (ClickBank, etc.)
 * - vendorId: Vendor identifier
 * - productId: Product identifier
 * - commission: Commission rate (0.0-1.0)
 * - addedDate: Date added (YYYY-MM-DD)
 * - lastUpdated: Last updated (YYYY-MM-DD)
 */

export const ${domainName}Products = ${JSON.stringify(products, null, 2)};
`;

    // Write file
    fs.writeFileSync(filePath, fileContent);
    console.log(`\n✅ Product saved to ${filePath}`);
    
    return product;
  }

  async generateTrackingCode(product) {
    const trackingCode = `
// AFFILIATE TRACKING CODE for ${product.id}
// Add this to your analytics or tracking system

const trackingData = {
  productId: '${product.id}',
  productName: '${product.name}',
  category: '${product.category}',
  price: ${product.price},
  affiliateLink: '${product.affiliateLink}',
  network: '${product.affiliateNetwork || 'Unknown'}',
  vendorId: '${product.vendorId || 'Unknown'}',
  commission: ${product.commission || 0},
  addedDate: '${product.addedDate}'
};

// Track product view
analytics.track('Product Added', trackingData);

// Track affiliate click
function trackAffiliateClick() {
  analytics.track('Affiliate Click', trackingData);
  // Add UTM parameters
  const url = new URL('${product.affiliateLink}');
  url.searchParams.set('utm_source', 'affynix');
  url.searchParams.set('utm_medium', 'affiliate');
  url.searchParams.set('utm_campaign', '${product.id}');
  window.open(url.toString(), '_blank');
}
`;

    const trackingFile = path.join(process.cwd(), `tracking/${product.id}.js`);
    const trackingDir = path.dirname(trackingFile);
    
    if (!fs.existsSync(trackingDir)) {
      fs.mkdirSync(trackingDir, { recursive: true });
    }
    
    fs.writeFileSync(trackingFile, trackingCode);
    console.log(`\n📊 Tracking code saved to ${trackingFile}`);
  }

  async run() {
    console.log('🚀 AFFYNIX DEAL MANAGEMENT SYSTEM');
    console.log('=====================================');
    
    try {
      // Select domain
      const domain = await this.selectDomain();
      console.log(`\n✅ Selected: ${DOMAINS[domain].name}`);
      
      // Select category
      const category = await this.selectCategory(domain);
      console.log(`\n✅ Selected: ${category}`);
      
      // Collect product data
      const product = await this.collectProductData(domain, category);
      
      // Show summary
      console.log('\n📋 PRODUCT SUMMARY:');
      console.log('==================');
      Object.entries(product).forEach(([key, value]) => {
        console.log(`${key}: ${Array.isArray(value) ? value.join(', ') : value}`);
      });
      
      // Confirm save
      const confirm = await this.question('\n💾 Save this product? (y/n): ');
      if (confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes') {
        await this.saveProduct(domain, product);
        await this.generateTrackingCode(product);
        console.log('\n🎉 Product added successfully!');
        console.log('\n📝 Next steps:');
        console.log('1. Test the modal on your site');
        console.log('2. Verify affiliate link works');
        console.log('3. Check tracking in analytics');
        console.log('4. Deploy changes to production');
      } else {
        console.log('\n❌ Product not saved');
      }
      
    } catch (error) {
      console.error('\n❌ Error:', error.message);
    } finally {
      this.rl.close();
    }
  }
}

// Run the script
if (require.main === module) {
  const manager = new DealManager();
  manager.run();
}

module.exports = DealManager;
