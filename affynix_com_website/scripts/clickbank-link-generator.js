#!/usr/bin/env node

/**
 * ClickBank Link Generator
 * Automates the generation of ClickBank affiliate links using Puppeteer
 * 
 * Usage: node scripts/clickbank-link-generator.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  affiliateNickname: 'affynix',
  trackingParams: {
    'traffic source': 'affynix-platform',
    'traffic type': 'organic',
    'campaign': 'affynix-deals',
    'creative': 'product-modal',
    'ad': 'affynix-recommendation',
    'extclid': 'affynix'
  },
  products: [
    {
      name: 'Social Media Marketing Domination System',
      vendorNickname: 'socialmediapro', // This needs to be a real ClickBank vendor
      category: 'Business',
      price: 297
    },
    {
      name: 'Email Marketing Profit Machine', 
      vendorNickname: 'emailprofits', // This needs to be a real ClickBank vendor
      category: 'Business',
      price: 197
    },
    {
      name: 'Business Leadership Mastery Program',
      vendorNickname: 'leadershipmaster', // This needs to be a real ClickBank vendor
      category: 'Business', 
      price: 997
    }
  ]
};

async function generateClickBankLinks() {
  console.log('🚀 Starting ClickBank Link Generation...');
  
  let browser;
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: false, // Set to true for production
      defaultViewport: { width: 1280, height: 720 }
    });
    
    const page = await browser.newPage();
    
    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    const generatedLinks = [];
    
    for (const product of CONFIG.products) {
      console.log(`\n📦 Processing: ${product.name}`);
      
      try {
        // Navigate to ClickBank marketplace
        console.log('  🔍 Searching for product...');
        await page.goto('https://www.clickbank.com/marketplace/', { 
          waitUntil: 'networkidle2',
          timeout: 30000 
        });
        
        // Search for the product
        await page.waitForSelector('input[type="search"]', { timeout: 10000 });
        await page.type('input[type="search"]', product.name);
        await page.keyboard.press('Enter');
        
        // Wait for search results
        await page.waitForTimeout(3000);
        
        // Try to find the product in search results
        const productLinks = await page.$$eval('a[href*="/products/"]', links => 
          links.map(link => ({
            href: link.href,
            text: link.textContent.trim()
          }))
        );
        
        if (productLinks.length === 0) {
          console.log(`  ❌ No products found for: ${product.name}`);
          continue;
        }
        
        // Find the best match
        const bestMatch = productLinks.find(link => 
          link.text.toLowerCase().includes(product.name.toLowerCase().split(' ')[0])
        ) || productLinks[0];
        
        console.log(`  ✅ Found product: ${bestMatch.text}`);
        
        // Navigate to product page
        await page.goto(bestMatch.href, { waitUntil: 'networkidle2' });
        
        // Look for "Get Affiliate Link" button
        const affiliateButton = await page.$('a[href*="affiliate"], button:contains("Affiliate"), a:contains("Get Link")');
        
        if (!affiliateButton) {
          console.log(`  ❌ No affiliate link button found for: ${product.name}`);
          continue;
        }
        
        // Click the affiliate link button
        await affiliateButton.click();
        await page.waitForTimeout(2000);
        
        // Fill in affiliate nickname
        await page.waitForSelector('input[name*="affiliate"], input[placeholder*="affiliate"]', { timeout: 5000 });
        await page.type('input[name*="affiliate"], input[placeholder*="affiliate"]', CONFIG.affiliateNickname);
        
        // Fill in tracking parameters
        for (const [param, value] of Object.entries(CONFIG.trackingParams)) {
          const input = await page.$(`input[name*="${param}"], input[placeholder*="${param}"]`);
          if (input) {
            await input.type(value);
          }
        }
        
        // Wait for link generation
        await page.waitForTimeout(2000);
        
        // Extract the generated link
        const generatedLink = await page.$eval('input[readonly], input[value*="hop.clickbank.net"]', 
          input => input.value
        );
        
        if (generatedLink) {
          console.log(`  ✅ Generated link: ${generatedLink}`);
          generatedLinks.push({
            ...product,
            affiliateLink: generatedLink,
            generated: true
          });
        } else {
          console.log(`  ❌ Failed to generate link for: ${product.name}`);
        }
        
      } catch (error) {
        console.log(`  ❌ Error processing ${product.name}:`, error.message);
      }
    }
    
    // Save results
    if (generatedLinks.length > 0) {
      const outputPath = path.join(__dirname, '..', 'data', 'products', 'business-generated.js');
      const outputContent = `/**
 * BUSINESS SUBDOMAIN PRODUCTS - Generated ClickBank Links
 * Generated: ${new Date().toISOString()}
 * Products: ${generatedLinks.length}
 */

export const businessProducts = ${JSON.stringify(generatedLinks, null, 2)};
`;
      
      fs.writeFileSync(outputPath, outputContent);
      console.log(`\n✅ Saved ${generatedLinks.length} generated links to: ${outputPath}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Alternative: Manual link generation helper
function generateManualLinks() {
  console.log('\n📋 Manual Link Generation Instructions:');
  console.log('1. Go to ClickBank marketplace: https://www.clickbank.com/marketplace/');
  console.log('2. Search for each product');
  console.log('3. Click "Get Affiliate Link"');
  console.log('4. Set Affiliate Nickname to: affynix');
  console.log('5. Set tracking parameters:');
  
  for (const [param, value] of Object.entries(CONFIG.trackingParams)) {
    console.log(`   - ${param}: ${value}`);
  }
  
  console.log('\n6. Copy the generated HopLink');
  console.log('7. Update the product data in data/products/business.js');
}

// Run the script
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--manual')) {
    generateManualLinks();
  } else {
    generateClickBankLinks();
  }
}

module.exports = { generateClickBankLinks, generateManualLinks };
