#!/bin/bash

# 🚀 Affynix One-Command Deployment
# This script automates the entire deployment process

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_header() { echo -e "${MAGENTA}$1${NC}"; }
print_step() { echo -e "${CYAN}▶ $1${NC}"; }

clear

cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║           🚀 AFFYNIX ONE-COMMAND DEPLOYMENT 🚀           ║
║                                                           ║
║              Admin Dashboard + Backend API                ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF

echo ""
print_info "This script will deploy your complete Affynix infrastructure"
echo ""

# Check if we're in the right directory
if [ ! -d "website_build/backend" ] || [ ! -d "admin" ]; then
    print_error "Please run this script from affynix_ai_website/ directory"
    exit 1
fi

# ============================================================================
# STEP 0: Prerequisites Check
# ============================================================================

print_header "═══════════════════════════════════════════════════════════"
print_header "STEP 0: Checking Prerequisites"
print_header "═══════════════════════════════════════════════════════════"
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js installed: $NODE_VERSION"
else
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm installed: v$NPM_VERSION"
else
    print_error "npm is not installed"
    exit 1
fi

# Check Railway CLI
if ! command -v railway &> /dev/null; then
    print_warning "Railway CLI not installed"
    read -p "Install Railway CLI now? (y/n): " INSTALL_RAILWAY
    if [ "$INSTALL_RAILWAY" = "y" ]; then
        print_step "Installing Railway CLI..."
        npm install -g @railway/cli
        print_success "Railway CLI installed"
    else
        print_error "Railway CLI is required. Install with: npm install -g @railway/cli"
        exit 1
    fi
else
    print_success "Railway CLI installed"
fi

# Check Vercel CLI
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not installed"
    read -p "Install Vercel CLI now? (y/n): " INSTALL_VERCEL
    if [ "$INSTALL_VERCEL" = "y" ]; then
        print_step "Installing Vercel CLI..."
        npm install -g vercel
        print_success "Vercel CLI installed"
    else
        print_error "Vercel CLI is required. Install with: npm install -g vercel"
        exit 1
    fi
else
    print_success "Vercel CLI installed"
fi

echo ""

# ============================================================================
# STEP 1: Backend Deployment (Railway)
# ============================================================================

print_header "═══════════════════════════════════════════════════════════"
print_header "STEP 1: Backend Deployment to Railway"
print_header "═══════════════════════════════════════════════════════════"
echo ""

cd website_build/backend

# Check Railway login
print_step "Checking Railway authentication..."
if railway whoami &> /dev/null; then
    RAILWAY_USER=$(railway whoami 2>&1 | head -1)
    print_success "Logged in to Railway as: $RAILWAY_USER"
else
    print_warning "Not logged in to Railway"
    print_step "Opening Railway login..."
    railway login

    if railway whoami &> /dev/null; then
        print_success "Successfully logged in to Railway"
    else
        print_error "Railway login failed"
        exit 1
    fi
fi

# Initialize Railway project if needed
print_step "Setting up Railway project..."
if [ ! -f ".railway" ] && [ ! -d ".railway" ]; then
    print_info "Initializing new Railway project..."
    railway init
fi

# Get OpenAI API key
echo ""
print_warning "OpenAI API Key Required"
read -p "Enter your OpenAI API key (or press Enter to skip): " OPENAI_KEY

if [ -z "$OPENAI_KEY" ]; then
    print_warning "Skipping OpenAI key - you'll need to add it later in Railway dashboard"
    OPENAI_KEY="sk-proj-PLACEHOLDER_ADD_YOUR_KEY_IN_RAILWAY_DASHBOARD"
fi

# Set environment variables
print_step "Configuring environment variables..."

# Read the pre-generated JWT secret from template
JWT_SECRET=$(grep "JWT_SECRET=" .env.production.template | cut -d'=' -f2)

railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set DATABASE_PATH=/app/data/affynix.db
railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set JWT_EXPIRES_IN=7d
railway variables set OPENAI_API_KEY="$OPENAI_KEY"
railway variables set LLM_MODEL=gpt-4-turbo-preview

print_success "Environment variables configured"

# Deploy to Railway
echo ""
print_step "Deploying backend to Railway..."
print_info "This may take 2-3 minutes..."
echo ""

railway up

echo ""
print_success "Backend deployed to Railway!"

# Get deployment URL
print_step "Retrieving deployment URL..."
sleep 3  # Wait for deployment to register

BACKEND_URL=""
if railway status &> /dev/null; then
    # Try to get URL from status
    BACKEND_URL=$(railway status 2>&1 | grep -o 'https://[^[:space:]]*' | head -1)
fi

if [ -z "$BACKEND_URL" ]; then
    print_warning "Could not automatically detect backend URL"
    print_info "Please check Railway dashboard for your deployment URL"
    read -p "Enter your backend URL: " BACKEND_URL
fi

if [ ! -z "$BACKEND_URL" ]; then
    print_success "Backend URL: $BACKEND_URL"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔗 Backend: $BACKEND_URL"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    # Save for later use
    echo "$BACKEND_URL" > /tmp/affynix_backend_url.txt
else
    print_error "Backend URL is required for admin deployment"
    exit 1
fi

# Test backend
print_step "Testing backend health..."
sleep 2
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/health" 2>/dev/null || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
    print_success "Backend health check passed! ✓"
else
    print_warning "Health check returned $HTTP_CODE (backend may still be starting up)"
fi

cd ../..

# ============================================================================
# STEP 2: Admin Configuration
# ============================================================================

print_header "═══════════════════════════════════════════════════════════"
print_header "STEP 2: Configuring Admin with Backend URL"
print_header "═══════════════════════════════════════════════════════════"
echo ""

cd admin

print_step "Setting backend URL in admin configuration..."
echo "VITE_API_URL=$BACKEND_URL" > .env.production
print_success "Admin configured with backend URL"

cd ..

# ============================================================================
# STEP 3: Admin Deployment (Vercel)
# ============================================================================

print_header "═══════════════════════════════════════════════════════════"
print_header "STEP 3: Admin Deployment to Vercel"
print_header "═══════════════════════════════════════════════════════════"
echo ""

cd admin

# Check Vercel login
print_step "Checking Vercel authentication..."
if vercel whoami &> /dev/null; then
    VERCEL_USER=$(vercel whoami 2>&1)
    print_success "Logged in to Vercel as: $VERCEL_USER"
else
    print_warning "Not logged in to Vercel"
    print_step "Opening Vercel login..."
    vercel login

    if vercel whoami &> /dev/null; then
        print_success "Successfully logged in to Vercel"
    else
        print_error "Vercel login failed"
        exit 1
    fi
fi

# Deploy to Vercel
echo ""
print_step "Deploying admin to Vercel..."
print_info "This may take 2-3 minutes..."
echo ""

# Deploy with production flag
DEPLOY_OUTPUT=$(vercel --prod --yes 2>&1)
echo "$DEPLOY_OUTPUT"

# Extract URL from output
ADMIN_URL=$(echo "$DEPLOY_OUTPUT" | grep -o 'https://[^[:space:]]*\.vercel\.app' | tail -1)

if [ ! -z "$ADMIN_URL" ]; then
    print_success "Admin deployed to Vercel!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎨 Admin: $ADMIN_URL"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    # Save for later use
    echo "$ADMIN_URL" > /tmp/affynix_admin_url.txt
else
    print_warning "Could not automatically detect admin URL"
    print_info "Check Vercel dashboard for your deployment URL"
    read -p "Enter your admin URL: " ADMIN_URL
fi

# Test admin
print_step "Testing admin accessibility..."
sleep 2
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$ADMIN_URL" 2>/dev/null || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
    print_success "Admin is accessible! ✓"
else
    print_warning "Admin returned $HTTP_CODE (may still be propagating)"
fi

cd ..

# ============================================================================
# STEP 4: Verification & User Setup
# ============================================================================

print_header "═══════════════════════════════════════════════════════════"
print_header "STEP 4: Verification & Admin User Creation"
print_header "═══════════════════════════════════════════════════════════"
echo ""

print_step "Creating first admin user..."
echo ""

print_info "Let's create your first admin user account"
read -p "Email (default: admin@affynix.ai): " ADMIN_EMAIL
ADMIN_EMAIL=${ADMIN_EMAIL:-admin@affynix.ai}

while true; do
    read -s -p "Password (min 8 characters): " ADMIN_PASSWORD
    echo ""
    read -s -p "Confirm password: " ADMIN_PASSWORD_CONFIRM
    echo ""

    if [ "$ADMIN_PASSWORD" = "$ADMIN_PASSWORD_CONFIRM" ]; then
        if [ ${#ADMIN_PASSWORD} -ge 8 ]; then
            break
        else
            print_error "Password must be at least 8 characters"
        fi
    else
        print_error "Passwords do not match"
    fi
done

read -p "Full name (default: Admin User): " ADMIN_NAME
ADMIN_NAME=${ADMIN_NAME:-Admin User}

print_step "Creating user in backend..."

CREATE_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/register" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\",\"name\":\"$ADMIN_NAME\"}" \
    2>/dev/null || echo '{"error":"Request failed"}')

if echo "$CREATE_RESPONSE" | grep -q "success\|token\|user\|id"; then
    print_success "Admin user created successfully! ✓"
    echo ""
    print_info "Credentials:"
    echo "   Email: $ADMIN_EMAIL"
    echo "   Password: [hidden]"
else
    print_warning "User creation response:"
    echo "$CREATE_RESPONSE"
    echo ""
    print_info "You can create a user manually:"
    echo "curl -X POST $BACKEND_URL/api/register \\"
    echo "  -H 'Content-Type: application/json' \\"
    echo "  -d '{\"email\":\"$ADMIN_EMAIL\",\"password\":\"YOUR_PASSWORD\",\"name\":\"$ADMIN_NAME\"}'"
fi

echo ""

# ============================================================================
# COMPLETION & SUMMARY
# ============================================================================

print_header "═══════════════════════════════════════════════════════════"
print_header "🎉 DEPLOYMENT COMPLETE!"
print_header "═══════════════════════════════════════════════════════════"
echo ""

cat << EOF
╔═══════════════════════════════════════════════════════════╗
║                    DEPLOYMENT SUMMARY                      ║
╚═══════════════════════════════════════════════════════════╝

✅ Backend API (Railway)
   URL: $BACKEND_URL
   Status: Deployed
   Health: /health

✅ Admin Dashboard (Vercel)
   URL: $ADMIN_URL
   Status: Deployed
   Login: $ADMIN_EMAIL

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 NEXT STEPS:

1. Login to Admin Dashboard:
   🔗 $ADMIN_URL/login
   Email: $ADMIN_EMAIL
   Password: [your password]

2. Add Custom Domains (Optional):
   Backend:  api.affynix.ai → Railway
   Admin:    admin.affynix.ai → Vercel

3. Update CORS if needed:
   If admin can't connect, add admin URL to CORS in:
   website_build/backend/server.js

4. Monitor Your Deployments:
   Railway: railway logs
   Vercel: Dashboard → Logs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔒 SECURITY REMINDERS:

• JWT Secret is already configured
• Change it if needed: openssl rand -hex 32
• Use strong passwords for all admin users
• Enable 2FA in Railway and Vercel
• Never commit .env files with real API keys

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 NEED HELP?

• Backend Logs: railway logs
• Vercel Logs: Dashboard → Project → Logs
• Docs: See DEPLOYMENT_GUIDE.md
• Issues: Check backend health endpoint first

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EOF

# Save deployment info
cat > DEPLOYMENT_INFO.txt << EOF
Affynix Deployment Information
Generated: $(date)

Backend URL: $BACKEND_URL
Admin URL: $ADMIN_URL
Admin Email: $ADMIN_EMAIL

JWT Secret: $JWT_SECRET

Railway Project: Check Railway dashboard
Vercel Project: Check Vercel dashboard

Health Check: $BACKEND_URL/health
Admin Login: $ADMIN_URL/login
EOF

print_success "Deployment information saved to DEPLOYMENT_INFO.txt"
echo ""
print_success "🎉 All done! Your Affynix infrastructure is live!"
echo ""

# Open browser
read -p "Open admin dashboard in browser? (y/n): " OPEN_BROWSER
if [ "$OPEN_BROWSER" = "y" ]; then
    if command -v open &> /dev/null; then
        open "$ADMIN_URL/login"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "$ADMIN_URL/login"
    else
        print_info "Please open $ADMIN_URL/login in your browser"
    fi
fi

echo ""
print_header "Thank you for using Affynix! 🚀"
echo ""
