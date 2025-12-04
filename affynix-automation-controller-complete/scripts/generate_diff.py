import json
from pathlib import Path
from typing import Any

import yaml

COMMANDS_DIR = Path("commands/incoming")

def load_instruction(path: Path) -> dict[str, Any]:
    if path.suffix.lower() in {".yml", ".yaml"}:
        return yaml.safe_load(path.read_text(encoding="utf-8"))
    if path.suffix.lower() == ".json":
        return json.loads(path.read_text(encoding="utf-8"))
    raise ValueError(f"Unsupported command file type: {path}")

def summarize_instruction(instr: dict[str, Any]) -> str:
    target_repo = instr.get("target_repo", "Affynix-LLC/mono-repo-master")
    branch = instr.get("branch_name", "(auto)")
    base = instr.get("base_branch", "main")
    changes = instr.get("changes", [])

    lines = [
        f"Target repo: {target_repo}",
        f"Base branch: {base}",
        f"New branch: {branch}",
        f"Number of file changes: {len(changes)}",
        "",
        "Files:"
    ]

    for change in changes:
        path = change.get("path", "?")
        mode = change.get("mode", "overwrite")
        lines.append(f"  - {path} ({mode})")

    return "\n".join(lines)

def main() -> int:
    command_files = sorted(
        p for p in COMMANDS_DIR.glob("*")
        if p.is_file() and not p.name.startswith(".")
    )

    if not command_files:
        print("No incoming command files found.")
        return 0

    for path in command_files:
        print(f"=== Instruction: {path.name} ===")
        try:
            instr = load_instruction(path)
        except Exception as exc:
            print(f"ERROR reading {path}: {exc}")
            continue

        print(summarize_instruction(instr))
        print()

    return 0

if __name__ == "__main__":
    raise SystemExit(main())
