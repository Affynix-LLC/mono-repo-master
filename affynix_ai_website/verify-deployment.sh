#!/bin/bash

# Deployment Verification Script
# Tests backend and admin deployments

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }

echo "🧪 Affynix Deployment Verification"
echo "==================================="
echo ""

# Test Backend
test_backend() {
    local BACKEND_URL=$1

    echo "Testing Backend: $BACKEND_URL"
    echo "--------------------------------"

    # Test health endpoint
    print_info "Testing /health endpoint..."
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/health" 2>/dev/null || echo "000")

    if [ "$HTTP_CODE" = "200" ]; then
        print_success "Health check passed (200 OK)"

        # Get health response
        HEALTH_RESPONSE=$(curl -s "$BACKEND_URL/health" 2>/dev/null || echo "{}")
        echo "   Response: $HEALTH_RESPONSE"
    else
        print_error "Health check failed (HTTP $HTTP_CODE)"
        return 1
    fi

    # Test API endpoint (should require auth)
    print_info "Testing /api/test endpoint (should return 401)..."
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/test" 2>/dev/null || echo "000")

    if [ "$HTTP_CODE" = "401" ]; then
        print_success "API authentication working correctly (401 Unauthorized)"
    elif [ "$HTTP_CODE" = "404" ]; then
        print_warning "Endpoint not found (404) - check server routes"
    else
        print_warning "Unexpected response code: $HTTP_CODE"
    fi

    # Check if WebSocket is available
    print_info "Checking WebSocket support..."
    if curl -s -I "$BACKEND_URL" | grep -i "upgrade: websocket" > /dev/null 2>&1; then
        print_success "WebSocket support detected"
    else
        print_info "WebSocket check inconclusive (may still be supported)"
    fi

    echo ""
}

# Test Admin
test_admin() {
    local ADMIN_URL=$1

    echo "Testing Admin: $ADMIN_URL"
    echo "----------------------------"

    # Test admin endpoint
    print_info "Testing admin endpoint..."
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$ADMIN_URL" 2>/dev/null || echo "000")

    if [ "$HTTP_CODE" = "200" ]; then
        print_success "Admin accessible (200 OK)"

        # Check if it's actually HTML
        CONTENT=$(curl -s "$ADMIN_URL" 2>/dev/null | head -1)
        if [[ "$CONTENT" == *"<!DOCTYPE"* ]] || [[ "$CONTENT" == *"<html"* ]]; then
            print_success "Valid HTML content detected"
        fi
    else
        print_error "Admin not accessible (HTTP $HTTP_CODE)"
        return 1
    fi

    # Check for SPA routing
    print_info "Testing SPA routing..."
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$ADMIN_URL/login" 2>/dev/null || echo "000")

    if [ "$HTTP_CODE" = "200" ]; then
        print_success "SPA routing working correctly"
    else
        print_warning "SPA routing may need configuration"
    fi

    echo ""
}

# Create test user
create_test_user() {
    local BACKEND_URL=$1

    echo "Creating Test Admin User"
    echo "------------------------"

    read -p "Create test admin user? (y/n): " CREATE_USER

    if [ "$CREATE_USER" != "y" ]; then
        print_info "Skipping user creation"
        return
    fi

    read -p "Enter email (default: admin@affynix.ai): " EMAIL
    EMAIL=${EMAIL:-admin@affynix.ai}

    read -s -p "Enter password: " PASSWORD
    echo ""

    if [ -z "$PASSWORD" ]; then
        print_error "Password required"
        return 1
    fi

    read -p "Enter name (default: Admin User): " NAME
    NAME=${NAME:-Admin User}

    print_info "Creating user..."

    RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/register" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"name\":\"$NAME\"}" \
        2>/dev/null || echo "{\"error\":\"Request failed\"}")

    if echo "$RESPONSE" | grep -q "success\|token\|user"; then
        print_success "User created successfully!"
        echo "   Email: $EMAIL"
        echo "   You can now login to the admin dashboard"
    else
        print_error "User creation failed"
        echo "   Response: $RESPONSE"
    fi

    echo ""
}

# Main menu
main() {
    echo "Select verification option:"
    echo "1) Test Backend only"
    echo "2) Test Admin only"
    echo "3) Test Both"
    echo "4) Create admin user"
    echo "5) Full verification (Backend + Admin + User)"
    echo "6) Exit"
    echo ""
    read -p "Enter choice (1-6): " CHOICE

    case $CHOICE in
        1)
            read -p "Enter backend URL: " BACKEND_URL
            test_backend "$BACKEND_URL"
            ;;
        2)
            read -p "Enter admin URL: " ADMIN_URL
            test_admin "$ADMIN_URL"
            ;;
        3)
            read -p "Enter backend URL: " BACKEND_URL
            read -p "Enter admin URL: " ADMIN_URL
            test_backend "$BACKEND_URL"
            test_admin "$ADMIN_URL"
            ;;
        4)
            read -p "Enter backend URL: " BACKEND_URL
            create_test_user "$BACKEND_URL"
            ;;
        5)
            read -p "Enter backend URL: " BACKEND_URL
            read -p "Enter admin URL: " ADMIN_URL
            test_backend "$BACKEND_URL"
            test_admin "$ADMIN_URL"
            create_test_user "$BACKEND_URL"
            ;;
        6)
            echo "Goodbye!"
            exit 0
            ;;
        *)
            print_error "Invalid choice"
            main
            ;;
    esac

    echo ""
    echo "✅ Verification complete!"
    echo ""
    echo "📝 Next steps:"
    echo "   1. If backend tests passed, your API is ready"
    echo "   2. If admin tests passed, your dashboard is accessible"
    echo "   3. Login to admin dashboard to start managing your system"
}

# Run
main
