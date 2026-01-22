# Affynix ID Affiliate Site Kit

This project lets you generate affiliate microsites on third-level Handshake domains of the form:

    <username>.id.affynix

The system:
- Creates a GitHub repository for each affiliate.
- Adds a `CNAME` file pointing to `<username>.id.affynix`.
- Renders a personalized `index.html` using the template in `templates/index_template.html`.
- Commits everything to GitHub.
- Enables GitHub Pages on the `main` branch.
- Sets the custom domain for GitHub Pages so the site serves from `https://<username>.id.affynix`.

## Prerequisites

1. A Handshake TLD: `affynix` (owned and managed via Namebase or compatible DNS).
2. The SLD `id.affynix` delegated to DNS you can control.
3. DNS A-records on `id.affynix` pointing to GitHub Pages IPs:

       id.affynix  A 185.199.108.153
       id.affynix  A 185.199.109.153
       id.affynix  A 185.199.110.153
       id.affynix  A 185.199.111.153

4. A GitHub account.
5. A GitHub Personal Access Token (classic) with `repo` and `pages` scopes.
6. Python 3.9+ installed locally.

## Layout

- `src/issuer.py`  
  Main CLI tool to create an affiliate site.

- `templates/index_template.html`  
  HTML template for affiliate microsites. Supports simple token replacement.

- `templates/styles.css`  
  Shared styling for all affiliate microsites.

- `config.example.json`  
  Example configuration file. Copy it to `config.json` and edit.

- `requirements.txt`  
  Python dependencies (only `requests`).

## Setup

1. Create and edit a config file:

   ```bash
   cp config.example.json config.json
   ```

   Then open `config.json` and fill out:

   - `"github_owner"` – your GitHub username or org
   - `"default_branch"` – usually `"main"`
   - `"base_tld"` – `"affynix"`
   - `"id_sld"` – `"id"`
   - `"github_token_env"` – environment variable name that will hold your GitHub token (default: `GITHUB_TOKEN`)

2. Export your GitHub token:

   ```bash
   export GITHUB_TOKEN="YOUR_TOKEN_HERE"
   ```

3. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

## Usage

Create a new affiliate site:

```bash
python src/issuer.py \
  --username john \
  --affiliate-id AFF123 \
  --primary-offer-url "https://example.com/offer" \
  --headline "John's AI Toolkit" \
  --cta-text "Get the Stack"
```

What this does:

- Creates a repo named: `john-id-affynix-site`
- Renders `index.html` from the template, injecting:
  - `{{USERNAME}}`
  - `{{AFFILIATE_ID}}`
  - `{{PRIMARY_OFFER_URL}}`
  - `{{HEADLINE}}`
  - `{{CTA_TEXT}}`
- Adds:
  - `index.html`
  - `templates/styles.css`
  - `CNAME` with `john.id.affynix`
- Enables GitHub Pages on the `main` branch, with custom domain set to `john.id.affynix`.

After that, once DNS is propagated, the site will be reachable at:

    https://john.id.affynix

## Notes

- All affiliates are third-level domains under `id.affynix` by default.
- You can manually create premium two-level domains like `username.affynix` by repeating the process with a different CNAME and separate DNS records for each second-level domain.
- This kit does **not** modify your DNS automatically. It assumes you have already set the A-records on `id.affynix` as shown above.

## Safety

- The GitHub token is only read from your local environment.
- No credentials are stored in this repository.
- Review `src/issuer.py` before running to confirm behavior.