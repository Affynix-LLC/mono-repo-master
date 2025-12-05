#!/usr/bin/env node

/**
 * AFFYNIX AFFILIATE TRACKING DASHBOARD
 * 
 * Usage: node scripts/affiliate-tracker.js
 * 
 * Features:
 * - View all affiliate products
 * - Track performance metrics
 * - Generate reports
 * - Monitor commission rates
 */

const fs = require('fs');
const path = require('path');

class AffiliateTracker {
  constructor() {
    this.products = [];
    this.loadAllProducts();
  }

  loadAllProducts() {
    const domains = ['business', 'money', 'health', 'home', 'relationships', 'tech'];
    
    domains.forEach(domain => {
      const filePath = path.join(process.cwd(), `data/products/${domain}.js`);
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const exportMatch = content.match(/export const \w+Products = (\[[\s\S]*?\]);/);
          if (exportMatch) {
            const products = eval(exportMatch[1]);
            products.forEach(product => {
              product.domain = domain;
              this.products.push(product);
            });
          }
        } catch (e) {
          console.log(`⚠️  Could not load products from ${domain}`);
        }
      }
    });
  }

  generateReport() {
    console.log('\n📊 AFFYNIX AFFILIATE TRACKING REPORT');
    console.log('=====================================');
    
    // Summary stats
    const totalProducts = this.products.length;
    const totalValue = this.products.reduce((sum, p) => sum + p.price, 0);
    const avgPrice = totalValue / totalProducts;
    const recurringProducts = this.products.filter(p => p.recurring).length;
    
    console.log(`\n📈 SUMMARY:`);
    console.log(`Total Products: ${totalProducts}`);
    console.log(`Total Value: $${totalValue.toLocaleString()}`);
    console.log(`Average Price: $${avgPrice.toFixed(2)}`);
    console.log(`Recurring Products: ${recurringProducts}`);
    
    // By domain
    console.log(`\n🏢 BY DOMAIN:`);
    const domainStats = {};
    this.products.forEach(product => {
      if (!domainStats[product.domain]) {
        domainStats[product.domain] = { count: 0, value: 0 };
      }
      domainStats[product.domain].count++;
      domainStats[product.domain].value += product.price;
    });
    
    Object.entries(domainStats).forEach(([domain, stats]) => {
      console.log(`${domain}: ${stats.count} products, $${stats.value.toLocaleString()} total value`);
    });
    
    // By category
    console.log(`\n📂 BY CATEGORY:`);
    const categoryStats = {};
    this.products.forEach(product => {
      if (!categoryStats[product.category]) {
        categoryStats[product.category] = 0;
      }
      categoryStats[product.category]++;
    });
    
    Object.entries(categoryStats)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`${category}: ${count} products`);
      });
    
    // Commission analysis
    console.log(`\n💰 COMMISSION ANALYSIS:`);
    const withCommission = this.products.filter(p => p.commission);
    if (withCommission.length > 0) {
      const avgCommission = withCommission.reduce((sum, p) => sum + p.commission, 0) / withCommission.length;
      const totalPotentialCommission = withCommission.reduce((sum, p) => sum + (p.price * p.commission), 0);
      
      console.log(`Products with Commission Data: ${withCommission.length}`);
      console.log(`Average Commission Rate: ${(avgCommission * 100).toFixed(1)}%`);
      console.log(`Total Potential Commission: $${totalPotentialCommission.toLocaleString()}`);
    } else {
      console.log('No commission data available');
    }
    
    // Recent additions
    console.log(`\n🆕 RECENT ADDITIONS:`);
    const recentProducts = this.products
      .filter(p => p.addedDate)
      .sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
      .slice(0, 5);
    
    recentProducts.forEach(product => {
      console.log(`${product.addedDate}: ${product.name} (${product.domain})`);
    });
  }

  listProducts(domain = null) {
    console.log(`\n📋 PRODUCT LIST${domain ? ` - ${domain.toUpperCase()}` : ''}:`);
    console.log('=====================================');
    
    const filteredProducts = domain 
      ? this.products.filter(p => p.domain === domain)
      : this.products;
    
    filteredProducts.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Domain: ${product.domain}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Price: $${product.price}${product.recurring ? `/${product.recurringPeriod}` : ''}`);
      console.log(`   Skill Level: ${product.skillLevel}`);
      console.log(`   Commission: ${product.commission ? `${(product.commission * 100).toFixed(1)}%` : 'Not set'}`);
      console.log(`   Added: ${product.addedDate || 'Unknown'}`);
    });
  }

  findProduct(searchTerm) {
    const results = this.products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (results.length === 0) {
      console.log(`\n❌ No products found matching "${searchTerm}"`);
      return;
    }
    
    console.log(`\n🔍 SEARCH RESULTS for "${searchTerm}":`);
    console.log('=====================================');
    
    results.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Domain: ${product.domain}`);
      console.log(`   Price: $${product.price}`);
      console.log(`   Link: ${product.affiliateLink}`);
    });
  }

  exportCSV() {
    const csvContent = [
      'ID,Name,Domain,Category,Price,Recurring,Commission,Added Date,Affiliate Link',
      ...this.products.map(p => [
        p.id,
        `"${p.name}"`,
        p.domain,
        p.category,
        p.price,
        p.recurring ? 'Yes' : 'No',
        p.commission ? (p.commission * 100).toFixed(1) + '%' : 'N/A',
        p.addedDate || 'Unknown',
        p.affiliateLink
      ].join(','))
    ].join('\n');
    
    const csvPath = path.join(process.cwd(), 'reports/affiliate-products.csv');
    const reportDir = path.dirname(csvPath);
    
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    fs.writeFileSync(csvPath, csvContent);
    console.log(`\n📄 CSV report exported to ${csvPath}`);
  }
}

// CLI interface
if (require.main === module) {
  const tracker = new AffiliateTracker();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    tracker.generateReport();
  } else if (args[0] === 'list') {
    tracker.listProducts(args[1]);
  } else if (args[0] === 'search') {
    tracker.findProduct(args[1]);
  } else if (args[0] === 'export') {
    tracker.exportCSV();
  } else {
    console.log('Usage:');
    console.log('  node scripts/affiliate-tracker.js           # Generate full report');
    console.log('  node scripts/affiliate-tracker.js list     # List all products');
    console.log('  node scripts/affiliate-tracker.js list business  # List business products');
    console.log('  node scripts/affiliate-tracker.js search "keyword"  # Search products');
    console.log('  node scripts/affiliate-tracker.js export   # Export CSV report');
  }
}

module.exports = AffiliateTracker;
