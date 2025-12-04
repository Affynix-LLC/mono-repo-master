import json
import sys
from datetime import datetime, timezone
from pathlib import Path

TOGGLE_PATH = Path("atlas/toggle_state.json")

def load_state() -> dict:
    if not TOGGLE_PATH.exists():
        return {
            "atlas_state": "LOCKED",
            "last_actor": "unknown",
            "last_change_utc": datetime.now(timezone.utc).isoformat()
        }
    with TOGGLE_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)

def save_state(state: dict) -> None:
    TOGGLE_PATH.parent.mkdir(parents=True, exist_ok=True)
    state["last_change_utc"] = datetime.now(timezone.utc).isoformat()
    with TOGGLE_PATH.open("w", encoding="utf-8") as f:
        json.dump(state, f, indent=2)

def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print("Usage: controller_api.py [get|set] [LOCKED|PASS] [actor]")
        return 1

    cmd = argv[1].lower()
    state = load_state()

    if cmd == "get":
        print(json.dumps(state, indent=2))
        return 0

    if cmd == "set":
        if len(argv) < 3:
            print("Usage: controller_api.py set [LOCKED|PASS] [actor]")
            return 1
        new_state = argv[2].upper()
        if new_state not in {"LOCKED", "PASS"}:
            print("State must be LOCKED or PASS")
            return 1
        actor = argv[3] if len(argv) > 3 else "unknown"
        state["atlas_state"] = new_state
        state["last_actor"] = actor
        save_state(state)
        print(json.dumps(state, indent=2))
        return 0

    print("Unknown command. Use get or set.")
    return 1

if __name__ == "__main__":
    sys.exit(main(sys.argv))
