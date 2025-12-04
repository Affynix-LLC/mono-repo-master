# How to Get Airtable Base ID

## Method 1: From Airtable API Documentation (Easiest)

1. Go to https://airtable.com/api
2. Select your base (or create a new one)
3. The Base ID will be shown at the top of the API documentation page
4. It looks like: `appXXXXXXXXXXXXXX` (starts with "app")

## Method 2: From Base URL

1. Open your Airtable base in the browser
2. Look at the URL - it will be something like:
   ```
   https://airtable.com/appXXXXXXXXXXXXXX/...
   ```
3. The Base ID is the part after `/app` and before the next `/`
4. Example: `appAbC123XyZ456`

## Method 3: From Base Settings

1. Click on "Help" menu in Airtable
2. Select "API documentation"
3. The Base ID is shown at the top

## Quick Steps:

1. **Go to**: https://airtable.com/api
2. **Select your base** (or create one called "Affynix Offers")
3. **Copy the Base ID** from the top of the page (starts with "app")
4. **Add to `.env`**:
   ```bash
   AIRTABLE_API_KEY=patwU6DAjkobXeSizAir
   AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
   ```

## Create the Offers Table

If you don't have a table yet, create one called "Offers" with these fields:

- **Name** (Single line text)
- **Network** (Single line text)
- **Category** (Single line text)
- **Subdomain** (Single line text)
- **Price** (Number)
- **Commission** (Number)
- **Recurring** (Checkbox)
- **AffiliateLink** (URL)
- **RawURL** (URL)
- **Summary** (Long text)
- **Assets** (Multiple attachments - optional)
- **Status** (Single select: Pending, Active, Archived)

