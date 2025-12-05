# ClickBank Affiliate Link Setup Guide

## 🎯 Goal
Generate real ClickBank affiliate links with your nickname "affynix" and proper tracking parameters.

## 🔍 Current Problem
Our current affiliate links use fake vendor IDs, causing the `vendoraccntstate` error.

## 🛠️ Solutions

### Option 1: Find Real Vendors (Recommended)
```bash
# Find real ClickBank vendors for business products
node scripts/find-clickbank-vendors.js
```

This will:
- Search ClickBank marketplace for business/marketing products
- Find real vendor nicknames
- Save results to `clickbank-vendors-found.json`

### Option 2: Manual Link Generation
1. Go to [ClickBank Marketplace](https://www.clickbank.com/marketplace/)
2. Search for business/marketing products
3. Click "Get Affiliate Link" on products you want to promote
4. Set **Affiliate Nickname** to: `affynix`
5. Set **Tracking Parameters**:
   - `traffic source`: `affynix-platform`
   - `traffic type`: `organic`
   - `campaign`: `affynix-deals`
   - `creative`: `product-modal`
   - `ad`: `affynix-recommendation`
   - `extclid`: `affynix`
6. Copy the generated HopLink
7. Update the `REAL_VENDORS` object in `scripts/update-product-links.js`
8. Run: `node scripts/update-product-links.js`

## 📋 Tracking Parameters Explained

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `traffic source` | `affynix-platform` | Identifies traffic from your platform |
| `traffic type` | `organic` | Type of traffic (organic, paid, social, etc.) |
| `campaign` | `affynix-deals` | Campaign identifier |
| `creative` | `product-modal` | Creative element (modal, banner, etc.) |
| `ad` | `affynix-recommendation` | Ad placement identifier |
| `extclid` | `affynix` | External click ID for tracking |

## 🚀 Quick Start

1. **Find Real Vendors**:
   ```bash
   node scripts/find-clickbank-vendors.js
   ```

2. **Update Product Links**:
   ```bash
   node scripts/update-product-links.js
   ```

3. **Deploy Changes**:
   ```bash
   git add .
   git commit -m "fix: update ClickBank affiliate links with real vendors"
   git push origin main
   ```

## 🔧 Scripts Available

- `scripts/find-clickbank-vendors.js` - Find real ClickBank vendors
- `scripts/update-product-links.js` - Update product data with real links
- `scripts/clickbank-link-generator.js` - Full automation (advanced)

## 📝 Next Steps

1. Run the vendor finder script to discover real ClickBank vendors
2. Update the product data with real affiliate links
3. Test the modals with working ClickBank links
4. Deploy the changes

## ⚠️ Important Notes

- The affiliate nickname "affynix" must be set up in your ClickBank account
- Only use real vendor nicknames from ClickBank marketplace
- Test links before deploying to production
- Keep tracking parameters consistent for analytics
