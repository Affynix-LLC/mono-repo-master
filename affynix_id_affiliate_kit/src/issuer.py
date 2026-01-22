import os
import json
import argparse
import base64
from pathlib import Path

import requests


class Config:
    def __init__(self, path: Path):
        with open(path, "r") as f:
            data = json.load(f)
        self.github_owner = data["github_owner"]
        self.default_branch = data.get("default_branch", "main")
        self.base_tld = data.get("base_tld", "affynix")
        self.id_sld = data.get("id_sld", "id")
        self.github_token_env = data.get("github_token_env", "GITHUB_TOKEN")
        self.repo_name_pattern = data.get("repo_name_pattern", "{username}-id-affynix-site")

    def make_repo_name(self, username: str) -> str:
        return self.repo_name_pattern.format(username=username)


class GitHubClient:
    def __init__(self, owner: str, token_env: str):
        token = os.getenv(token_env)
        if not token:
            raise RuntimeError(f"Environment variable {token_env} is not set.")
        self.owner = owner
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "affynix-id-affiliate-kit"
        })
        self.api_root = "https://api.github.com"

    def create_repo(self, name: str, default_branch: str):
        url = f"{self.api_root}/user/repos"
        payload = {
            "name": name,
            "auto_init": True,
            "private": False
        }
        r = self.session.post(url, json=payload)
        if r.status_code not in (200, 201):
            raise RuntimeError(f"Failed to create repo {name}: {r.status_code} {r.text}")
        # Optionally set default branch if needed.
        repo = r.json()
        if repo.get("default_branch") != default_branch:
            ref_url = f"{self.api_root}/repos/{self.owner}/{name}"
            r2 = self.session.patch(ref_url, json={"default_branch": default_branch})
            if r2.status_code not in (200, 201):
                print(f"Warning: could not set default_branch to {default_branch}: {r2.status_code} {r2.text}")
        return repo

    def put_file(self, repo: str, path: str, content: str, message: str):
        url = f"{self.api_root}/repos/{self.owner}/{repo}/contents/{path}"
        encoded = base64.b64encode(content.encode("utf-8")).decode("ascii")
        payload = {
            "message": message,
            "content": encoded,
            "branch": "main"
        }
        r = self.session.put(url, json=payload)
        if r.status_code not in (200, 201):
            raise RuntimeError(f"Failed to put file {path} in repo {repo}: {r.status_code} {r.text}")
        return r.json()

    def enable_pages(self, repo: str, custom_domain: str):
        # Configure GitHub Pages to serve from main branch root
        pages_url = f"{self.api_root}/repos/{self.owner}/{repo}/pages"
        payload = {
            "source": {
                "branch": "main",
                "path": "/"
            }
        }
        r = self.session.post(pages_url, json=payload)
        if r.status_code not in (201, 202):
            # Might already exist, try update
            if r.status_code != 409:
                print(f"Warning: could not create Pages config: {r.status_code} {r.text}")
        # Set custom domain
        patch_payload = {"cname": custom_domain}
        r2 = self.session.put(pages_url, json=patch_payload)
        if r2.status_code not in (200, 201, 202):
            print(f"Warning: could not set custom domain {custom_domain}: {r2.status_code} {r2.text}")


def render_template(template_path: Path, context: dict) -> str:
    text = template_path.read_text(encoding="utf-8")
    for key, value in context.items():
        placeholder = "{{" + key + "}}"
        text = text.replace(placeholder, value)
    return text


def main():
    parser = argparse.ArgumentParser(description="Affynix ID Affiliate Site Issuer")
    parser.add_argument("--config", default="config.json", help="Path to config JSON file")
    parser.add_argument("--username", required=True, help="Affiliate username (for subdomain)")
    parser.add_argument("--affiliate-id", required=True, help="Affiliate ID/token")
    parser.add_argument("--primary-offer-url", required=True, help="Primary offer URL")
    parser.add_argument("--headline", default="My Affynix AI Stack", help="Main headline for the site")
    parser.add_argument("--cta-text", default="Unlock the Stack", help="CTA button text")
    args = parser.parse_args()

    config_path = Path(args.config)
    if not config_path.exists():
        raise SystemExit(f"Config file not found: {config_path}")

    cfg = Config(config_path)
    gh = GitHubClient(cfg.github_owner, cfg.github_token_env)

    username = args.username.strip()
    fqdn = f"{username}.{cfg.id_sld}.{cfg.base_tld}"
    repo_name = cfg.make_repo_name(username)

    print(f"[*] Creating repo: {repo_name}")
    gh.create_repo(repo_name, cfg.default_branch)

    # Load templates
    templates_dir = Path(__file__).resolve().parents[1] / "templates"
    index_template_path = templates_dir / "index_template.html"
    styles_path = templates_dir / "styles.css"

    context = {
        "USERNAME": username,
        "AFFILIATE_ID": args.affiliate_id,
        "PRIMARY_OFFER_URL": args.primary_offer_url,
        "HEADLINE": args.headline,
        "CTA_TEXT": args.cta_text,
    }

    print("[*] Rendering index.html")
    index_html = render_template(index_template_path, context)

    print("[*] Uploading index.html")
    gh.put_file(repo_name, "index.html", index_html, "Add rendered index.html")

    print("[*] Uploading styles.css")
    gh.put_file(repo_name, "styles.css", styles_path.read_text(encoding="utf-8"), "Add styles.css")

    print(f"[*] Writing CNAME for {fqdn}")
    gh.put_file(repo_name, "CNAME", fqdn + "\n", f"Set CNAME to {fqdn}")

    print("[*] Enabling GitHub Pages")
    gh.enable_pages(repo_name, fqdn)

    print()
    print("=== DONE ===")
    print(f"Affiliate site target domain: https://{fqdn}")
    print()
    print("Ensure you have the following DNS records set on your Handshake TLD:")
    print()
    print(f"  {cfg.id_sld}.{cfg.base_tld}  A 185.199.108.153")
    print(f"  {cfg.id_sld}.{cfg.base_tld}  A 185.199.109.153")
    print(f"  {cfg.id_sld}.{cfg.base_tld}  A 185.199.110.153")
    print(f"  {cfg.id_sld}.{cfg.base_tld}  A 185.199.111.153")
    print()
    print("Once DNS propagates, the site will resolve automatically.")
    print()

if __name__ == "__main__":
    main()