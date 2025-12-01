# 🐛 Bug Fixes - Affynix.ai

## Bug 1: WebSocket Broadcasting Issue ✅ FIXED

**File:** `/website_build/backend/websocket.js:181`

**Problem:**
```javascript
// BEFORE (BROKEN)
if (ws.readyState === ws.OPEN) {
```

The code was checking `ws.OPEN`, which is undefined on individual WebSocket instances. The `OPEN` constant is only available on the WebSocket class constructor, not instances. This caused the condition to always be falsy, preventing messages from being sent to connected clients.

**Solution:**
```javascript
// AFTER (FIXED)
if (ws.readyState === 1) {
```

Used the numeric constant `1` which represents the OPEN state. This is the standard WebSocket readyState value:
- `0` = CONNECTING
- `1` = OPEN
- `2` = CLOSING  
- `3` = CLOSED

**Impact:** WebSocket messages will now correctly broadcast to all connected clients in a conversation.

---

## Bug 2: Admin Navigation Routes Mismatch ✅ FIXED

**File:** `/admin/src/pages/AdminDashboard.jsx:11-23`

**Problem:**
```javascript
// BEFORE (BROKEN)
const routes = {
  'AdminDashboard': '/admin',
  'ClientManager': '/admin/clients',
  'AgentManager': '/admin/agents',
  // etc...
};
```

The `createPageUrl` function was returning paths with `/admin` prefix, but the React Router in `App.jsx` defines routes at root level (`/`, `/clients`, `/agents`, etc.). This caused navigation links to fail silently.

**Solution:**
```javascript
// AFTER (FIXED)
const routes = {
  'AdminDashboard': '/',
  'ClientManager': '/clients',
  'AgentManager': '/agents',
  // etc...
};
```

Since `admin.affynix.ai` is a separate subdomain deployed independently, the routes are at root level. All `/admin/*` prefixes were removed.

**Impact:** Navigation between admin pages now works correctly. Links like "View All →" and stat cards properly route to their respective pages.

---

## Architecture Context

The Affynix platform uses **subdomain-based architecture**:
- `affynix.ai` - Public chat frontend
- `api.affynix.ai` - Backend API + WebSocket server
- `admin.affynix.ai` - Admin portal (separate Vercel deployment)

Each subdomain is independently deployed, so the admin app routes start from `/` (root), not `/admin`.

---

## Testing Checklist

- [x] WebSocket messages broadcast correctly
- [x] Admin navigation routes match defined routes
- [x] All admin page links work (dashboard stat cards)
- [x] "View All →" links navigate properly
- [ ] Test in Docker environment
- [ ] Test on production subdomains

---

## Files Modified

1. `/website_build/backend/websocket.js` - Fixed WebSocket readyState check
2. `/admin/src/pages/AdminDashboard.jsx` - Removed `/admin` prefix from routes

Both fixes are minimal, surgical changes with no side effects.
