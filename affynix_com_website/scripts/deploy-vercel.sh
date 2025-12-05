#!/bin/zsh

# AFFYNIX VERCEL DEPLOYMENT SCRIPT
# Deploys to different environments using Vercel webhook URLs

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Deployment URLs
PRODUCTION_URL="https://api.vercel.com/v1/integrations/deploy/prj_SDMeaVh0GEc7gdmbxBtSfbJ50LcC/TgRFJFoCPu"
STAGING_URL="https://api.vercel.com/v1/integrations/deploy/prj_SDMeaVh0GEc7gdmbxBtSfbJ50LcC/QSSIUL51mT"
DEVELOPMENT_URL="https://api.vercel.com/v1/integrations/deploy/prj_SDMeaVh0GEc7gdmbxBtSfbJ50LcC/KTnzA5W8wD"
DEVELOPMENT_DEPLOY_URL="https://api.vercel.com/v1/integrations/deploy/prj_SDMeaVh0GEc7gdmbxBtSfbJ50LcC/c7jbXEUfqh"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if we're in the right directory
check_directory() {
    if [[ ! -f "package.json" ]] || [[ ! -f "next.config.js" ]]; then
        print_error "Not in the correct project directory. Please run from the affynix-platform root."
        exit 1
    fi
}

# Function to run pre-deployment checks
pre_deployment_checks() {
    print_status "Running pre-deployment checks..."
    
    # Check if we're in the right directory
    check_directory
    
    # Check if dependencies are installed
    if [[ ! -d "node_modules" ]]; then
        print_warning "node_modules not found. Installing dependencies..."
        npm install
    fi
    
    # Run type checking
    print_status "Running TypeScript type checking..."
    npm run type-check
    
    # Run linting
    print_status "Running ESLint..."
    npm run lint
    
    # Build the project
    print_status "Building the project..."
    npm run build
    
    print_success "Pre-deployment checks passed!"
}

# Function to trigger Vercel deployment
trigger_deployment() {
    local environment=$1
    local webhook_url=$2
    
    print_status "Triggering deployment to $environment..."
    
    # Make the webhook request
    response=$(curl -s -w "\n%{http_code}" -X POST "$webhook_url" \
        -H "Content-Type: application/json" \
        -d '{"ref": "main", "environment": "'$environment'"}' 2>/dev/null)
    
    # Extract HTTP status code
    http_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | sed '$d')
    
    if [[ "$http_code" -eq 200 ]] || [[ "$http_code" -eq 201 ]]; then
        print_success "Deployment triggered successfully for $environment"
        print_status "Response: $response_body"
    else
        print_error "Failed to trigger deployment for $environment"
        print_error "HTTP Status: $http_code"
        print_error "Response: $response_body"
        exit 1
    fi
}

# Function to deploy to specific environment
deploy_to_environment() {
    local environment=$1
    
    case $environment in
        "production")
            trigger_deployment "production" "$PRODUCTION_URL"
            ;;
        "staging")
            trigger_deployment "staging" "$STAGING_URL"
            ;;
        "development")
            trigger_deployment "development" "$DEVELOPMENT_URL"
            ;;
        "development-deploy")
            trigger_deployment "development-deploy" "$DEVELOPMENT_DEPLOY_URL"
            ;;
        *)
            print_error "Invalid environment: $environment"
            print_status "Available environments: production, staging, development, development-deploy"
            exit 1
            ;;
    esac
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [ENVIRONMENT]"
    echo ""
    echo "ENVIRONMENT options:"
    echo "  production        - Deploy to production (main branch)"
    echo "  staging          - Deploy to staging (staging branch)"
    echo "  development      - Deploy to development (development branch)"
    echo "  development-deploy - Deploy to development-deploy (development branch)"
    echo ""
    echo "Examples:"
    echo "  $0 production"
    echo "  $0 staging"
    echo "  $0 development"
    echo ""
    echo "The script will:"
    echo "  1. Run pre-deployment checks (type checking, linting, building)"
    echo "  2. Trigger the Vercel deployment webhook"
    echo "  3. Report the deployment status"
}

# Main execution
main() {
    # Check if environment is provided
    if [[ $# -eq 0 ]]; then
        show_usage
        exit 1
    fi
    
    local environment=$1
    
    print_status "Starting deployment process for $environment..."
    
    # Run pre-deployment checks
    pre_deployment_checks
    
    # Deploy to the specified environment
    deploy_to_environment "$environment"
    
    print_success "Deployment process completed for $environment!"
    print_status "Check your Vercel dashboard for deployment status."
}

# Run main function with all arguments
main "$@"
