#!/usr/bin/env node

/**
 * Update Product Links
 * Updates product data with real ClickBank affiliate links
 * 
 * Usage: node scripts/update-product-links.js
 */

const fs = require('fs');
const path = require('path');

// Real ClickBank vendors and their affiliate links
// You'll need to replace these with actual vendors found from the find-clickbank-vendors.js script
const REAL_VENDORS = {
  // Example structure - replace with real data
  'socialmediapro': {
    name: 'Social Media Marketing Domination System',
    vendorNickname: 'socialmediapro', // Real ClickBank vendor nickname
    affiliateLink: 'https://hop.clickbank.net/?vendor=socialmediapro&affiliate=affynix&traffic_source=affynix-platform&traffic_type=organic&campaign=affynix-deals&creative=product-modal&ad=affynix-recommendation&extclid=affynix',
    price: 297,
    category: 'Business'
  },
  'emailprofits': {
    name: 'Email Marketing Profit Machine',
    vendorNickname: 'emailprofits', // Real ClickBank vendor nickname  
    affiliateLink: 'https://hop.clickbank.net/?vendor=emailprofits&affiliate=affynix&traffic_source=affynix-platform&traffic_type=organic&campaign=affynix-deals&creative=product-modal&ad=affynix-recommendation&extclid=affynix',
    price: 197,
    category: 'Business'
  },
  'leadershipmaster': {
    name: 'Business Leadership Mastery Program',
    vendorNickname: 'leadershipmaster', // Real ClickBank vendor nickname
    affiliateLink: 'https://hop.clickbank.net/?vendor=leadershipmaster&affiliate=affynix&traffic_source=affynix-platform&traffic_type=organic&campaign=affynix-deals&creative=product-modal&ad=affynix-recommendation&extclid=affynix',
    price: 997,
    category: 'Business'
  }
};

function updateProductLinks() {
  console.log('🔄 Updating product links with real ClickBank vendors...');
  
  // Read current product data
  const businessProductsPath = path.join(__dirname, '..', 'data', 'products', 'business.js');
  
  if (!fs.existsSync(businessProductsPath)) {
    console.error('❌ business.js file not found');
    return;
  }
  
  let businessProducts;
  try {
    // Read and parse the current file
    const fileContent = fs.readFileSync(businessProductsPath, 'utf8');
    
    // Extract the businessProducts array (simple approach)
    const match = fileContent.match(/export const businessProducts = (\[[\s\S]*?\]);/);
    if (!match) {
      console.error('❌ Could not parse businessProducts array');
      return;
    }
    
    businessProducts = JSON.parse(match[1]);
    console.log(`📦 Found ${businessProducts.length} products to update`);
    
  } catch (error) {
    console.error('❌ Error reading business.js:', error.message);
    return;
  }
  
  // Update products with real vendor data
  const updatedProducts = businessProducts.map((product, index) => {
    const vendorKey = Object.keys(REAL_VENDORS)[index];
    const realVendor = REAL_VENDORS[vendorKey];
    
    if (realVendor) {
      console.log(`✅ Updating: ${product.name}`);
      console.log(`   Old link: ${product.affiliateLink}`);
      console.log(`   New link: ${realVendor.affiliateLink}`);
      
      return {
        ...product,
        vendorId: realVendor.vendorNickname,
        affiliateLink: realVendor.affiliateLink,
        lastUpdated: new Date().toISOString()
      };
    } else {
      console.log(`⚠️  No real vendor found for: ${product.name}`);
      return product;
    }
  });
  
  // Generate new file content
  const newContent = `/**
 * BUSINESS SUBDOMAIN PRODUCTS
 * Real ClickBank marketplace products with affiliate links
 * Generated: ${new Date().toISOString()}
 * Products: ${updatedProducts.length}
 */

export const businessProducts = ${JSON.stringify(updatedProducts, null, 2)};
`;
  
  // Write updated file
  try {
    fs.writeFileSync(businessProductsPath, newContent);
    console.log(`\n✅ Updated ${updatedProducts.length} products in: ${businessProductsPath}`);
    
    // Show summary
    console.log('\n📊 Updated products:');
    updatedProducts.forEach(product => {
      console.log(`  📦 ${product.name}`);
      console.log(`     👤 Vendor: ${product.vendorId}`);
      console.log(`     🔗 Link: ${product.affiliateLink.substring(0, 80)}...`);
    });
    
  } catch (error) {
    console.error('❌ Error writing updated file:', error.message);
  }
}

// Manual link input helper
function addManualLink() {
  console.log('\n📝 Manual Link Input:');
  console.log('To add a real ClickBank link manually:');
  console.log('1. Go to ClickBank marketplace');
  console.log('2. Find a product you want to promote');
  console.log('3. Click "Get Affiliate Link"');
  console.log('4. Set Affiliate Nickname to: affynix');
  console.log('5. Set tracking parameters:');
  console.log('   - traffic source: affynix-platform');
  console.log('   - traffic type: organic');
  console.log('   - campaign: affynix-deals');
  console.log('   - creative: product-modal');
  console.log('   - ad: affynix-recommendation');
  console.log('   - extclid: affynix');
  console.log('6. Copy the generated HopLink');
  console.log('7. Update the REAL_VENDORS object in this script');
  console.log('8. Run: node scripts/update-product-links.js');
}

// Run the script
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--manual')) {
    addManualLink();
  } else {
    updateProductLinks();
  }
}

module.exports = { updateProductLinks, addManualLink };
