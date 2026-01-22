#!/bin/bash

# Affynix Admin & Backend Deployment Script
# This script helps deploy both the admin dashboard and backend API

set -e  # Exit on error

echo "🚀 Affynix Admin & Backend Deployment Script"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if required tools are installed
check_dependencies() {
    echo "Checking dependencies..."

    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    print_success "Node.js installed: $(node --version)"

    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    print_success "npm installed: $(npm --version)"

    if ! command -v git &> /dev/null; then
        print_error "git is not installed"
        exit 1
    fi
    print_success "git installed"

    echo ""
}

# Deploy backend to Railway
deploy_backend() {
    echo "📦 Deploying Backend to Railway..."
    echo "=================================="

    if ! command -v railway &> /dev/null; then
        print_info "Railway CLI not installed. Installing..."
        npm install -g @railway/cli
    fi

    cd website_build/backend

    print_info "Checking Railway login status..."
    if ! railway whoami &> /dev/null; then
        print_info "Please login to Railway:"
        railway login
    fi

    print_success "Railway CLI ready"

    # Check if .env exists for reference
    if [ ! -f ".env" ]; then
        print_info "Creating .env from template..."
        cp .env.example .env
        print_info "Please edit .env with your actual values before deploying"
        read -p "Press enter when ready to continue..."
    fi

    print_info "Setting environment variables in Railway..."

    # Generate JWT secret if not set
    JWT_SECRET=$(openssl rand -hex 32)

    railway variables set NODE_ENV=production
    railway variables set PORT=3001
    railway variables set DATABASE_PATH=/app/data/affynix.db
    railway variables set JWT_SECRET=$JWT_SECRET
    railway variables set JWT_EXPIRES_IN=7d

    # Prompt for OpenAI key
    read -p "Enter your OpenAI API key (or press enter to skip): " OPENAI_KEY
    if [ ! -z "$OPENAI_KEY" ]; then
        railway variables set OPENAI_API_KEY=$OPENAI_KEY
        railway variables set LLM_MODEL=gpt-4-turbo-preview
    fi

    print_info "Deploying to Railway..."
    railway up

    # Get the deployment URL
    BACKEND_URL=$(railway status --json | grep -o '"url":"[^"]*"' | cut -d'"' -f4 || echo "")

    if [ ! -z "$BACKEND_URL" ]; then
        print_success "Backend deployed successfully!"
        print_success "Backend URL: $BACKEND_URL"
        echo ""
        echo "Save this URL - you'll need it for the admin deployment!"
        echo ""
    else
        print_error "Could not retrieve backend URL. Check Railway dashboard."
    fi

    cd ../..
}

# Deploy admin to Vercel
deploy_admin() {
    echo "🎨 Deploying Admin to Vercel..."
    echo "==============================="

    if ! command -v vercel &> /dev/null; then
        print_info "Vercel CLI not installed. Installing..."
        npm install -g vercel
    fi

    cd admin

    print_info "Checking Vercel login status..."
    if ! vercel whoami &> /dev/null; then
        print_info "Please login to Vercel:"
        vercel login
    fi

    print_success "Vercel CLI ready"

    # Prompt for backend URL
    read -p "Enter your backend URL (e.g., https://api.affynix.ai): " BACKEND_URL

    if [ -z "$BACKEND_URL" ]; then
        print_error "Backend URL is required!"
        exit 1
    fi

    # Update .env.production
    echo "VITE_API_URL=$BACKEND_URL" > .env.production
    print_success "Updated .env.production with backend URL"

    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_info "Installing dependencies..."
        npm install
    fi

    print_info "Deploying to Vercel..."
    vercel --prod

    print_success "Admin deployed successfully!"
    print_info "Check Vercel dashboard for deployment URL"

    cd ..
}

# Test deployments
test_deployments() {
    echo ""
    echo "🧪 Testing Deployments..."
    echo "========================"

    read -p "Enter your backend URL to test: " BACKEND_URL

    if [ ! -z "$BACKEND_URL" ]; then
        print_info "Testing backend health endpoint..."

        HEALTH_CHECK=$(curl -s "$BACKEND_URL/health" || echo "")

        if [ ! -z "$HEALTH_CHECK" ]; then
            print_success "Backend is responding!"
            echo "Response: $HEALTH_CHECK"
        else
            print_error "Backend is not responding"
        fi
    fi

    read -p "Enter your admin URL to test: " ADMIN_URL

    if [ ! -z "$ADMIN_URL" ]; then
        print_info "Testing admin endpoint..."

        ADMIN_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "$ADMIN_URL" || echo "")

        if [ "$ADMIN_CHECK" = "200" ]; then
            print_success "Admin is responding!"
        else
            print_error "Admin returned status: $ADMIN_CHECK"
        fi
    fi
}

# Main menu
show_menu() {
    echo ""
    echo "What would you like to deploy?"
    echo "1) Backend only (Railway)"
    echo "2) Admin only (Vercel)"
    echo "3) Both (Backend + Admin)"
    echo "4) Test deployments"
    echo "5) Exit"
    echo ""
    read -p "Enter your choice (1-5): " choice

    case $choice in
        1)
            deploy_backend
            ;;
        2)
            deploy_admin
            ;;
        3)
            deploy_backend
            deploy_admin
            ;;
        4)
            test_deployments
            ;;
        5)
            echo "Goodbye!"
            exit 0
            ;;
        *)
            print_error "Invalid choice"
            show_menu
            ;;
    esac
}

# Main execution
main() {
    check_dependencies
    show_menu

    echo ""
    print_success "Deployment process complete!"
    echo ""
    echo "📝 Next Steps:"
    echo "1. Verify backend is running at your Railway URL"
    echo "2. Verify admin is accessible at your Vercel URL"
    echo "3. Create your first admin user via backend API"
    echo "4. Login to admin dashboard"
    echo ""
    echo "For detailed instructions, see DEPLOYMENT_GUIDE.md"
}

# Run main function
main
