# affynix-automation

**Declarative, gated automation for the Affynix monorepo.**

This controller repo orchestrates **safe, reversible changes** to `Affynix-LLC/mono-repo-master` via:

- 📋 Command files (YAML/JSON) queued in `commands/incoming/`
- 🔒 Atlas-controlled state gate (LOCKED/PASS)
- 🤖 GitHub Actions workflows that create branches, apply changes, and open PRs
- 📦 Processed command archive in `commands/processed/`

## Quick Summary

| Component | Purpose |
|-----------|---------|
| `.github/workflows/execute-instruction.yml` | Triggers on incoming commands, checks gate, applies changes |
| `.github/workflows/validate.yml` | Lints and compiles controller scripts on push/PR |
| `scripts/apply_changes.py` | Main automation logic: applies file changes, opens PRs |
| `scripts/generate_diff.py` | Summarizes queued command files |
| `scripts/controller_api.py` | Atlas state get/set utility |
| `atlas/toggle_state.json` | Gate state (LOCKED/PASS) |
| `commands/incoming/` | Queue for new automation commands |
| `commands/processed/` | Archive of processed commands |

---

See `README_controller.md` and `QUICK_REFERENCE.md` in `docs/` for full details.
