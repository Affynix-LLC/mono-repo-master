#!/usr/bin/env node

/**
 * ClickBank Vendor Finder
 * Finds real ClickBank vendors for business/marketing products
 * 
 * Usage: node scripts/find-clickbank-vendors.js
 */

const puppeteer = require('puppeteer');

async function findClickBankVendors() {
  console.log('🔍 Finding real ClickBank vendors for business products...');
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false, // Set to true for production
      defaultViewport: { width: 1280, height: 720 }
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Navigate to ClickBank marketplace
    console.log('📱 Navigating to ClickBank marketplace...');
    await page.goto('https://www.clickbank.com/marketplace/', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Search for business/marketing products
    const searchTerms = [
      'social media marketing',
      'email marketing', 
      'business leadership',
      'digital marketing',
      'online business'
    ];
    
    const foundVendors = [];
    
    for (const term of searchTerms) {
      console.log(`\n🔍 Searching for: ${term}`);
      
      try {
        // Search for the term
        await page.waitForSelector('input[type="search"]', { timeout: 10000 });
        await page.click('input[type="search"]');
        await page.keyboard.down('Control');
        await page.keyboard.press('KeyA');
        await page.keyboard.up('Control');
        await page.type('input[type="search"]', term);
        await page.keyboard.press('Enter');
        
        // Wait for results
        await page.waitForTimeout(3000);
        
        // Extract product information
        const products = await page.$$eval('.product-item, .marketplace-item, [data-testid*="product"]', items => {
          return items.slice(0, 5).map(item => {
            const title = item.querySelector('h3, h4, .title, .product-title')?.textContent?.trim();
            const vendor = item.querySelector('.vendor, .seller, .author')?.textContent?.trim();
            const link = item.querySelector('a')?.href;
            const price = item.querySelector('.price, .cost')?.textContent?.trim();
            
            return { title, vendor, link, price };
          }).filter(p => p.title && p.vendor);
        });
        
        console.log(`  ✅ Found ${products.length} products`);
        
        for (const product of products) {
          console.log(`    📦 ${product.title}`);
          console.log(`    👤 Vendor: ${product.vendor}`);
          console.log(`    💰 Price: ${product.price || 'N/A'}`);
          console.log(`    🔗 Link: ${product.link}`);
          
          foundVendors.push({
            searchTerm: term,
            title: product.title,
            vendor: product.vendor,
            link: product.link,
            price: product.price
          });
        }
        
      } catch (error) {
        console.log(`  ❌ Error searching for ${term}:`, error.message);
      }
    }
    
    // Save results
    if (foundVendors.length > 0) {
      const fs = require('fs');
      const outputPath = 'clickbank-vendors-found.json';
      fs.writeFileSync(outputPath, JSON.stringify(foundVendors, null, 2));
      console.log(`\n✅ Saved ${foundVendors.length} vendors to: ${outputPath}`);
      
      // Show summary
      console.log('\n📊 Summary of found vendors:');
      const uniqueVendors = [...new Set(foundVendors.map(v => v.vendor))];
      uniqueVendors.forEach(vendor => {
        const products = foundVendors.filter(v => v.vendor === vendor);
        console.log(`  👤 ${vendor}: ${products.length} products`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the script
if (require.main === module) {
  findClickBankVendors();
}

module.exports = { findClickBankVendors };
