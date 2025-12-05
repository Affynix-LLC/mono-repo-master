#!/bin/bash

# Branch Protection Setup Script for GitHub Pro
# Run this after upgrading to GitHub Pro

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

REPO="0x13omb3r/affynix"

echo -e "${BLUE}🔒 Setting up branch protection rules for $REPO${NC}"
echo ""

# Check if user is authenticated
if ! gh auth status > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Not authenticated with GitHub CLI${NC}"
    echo "Please run: gh auth login"
    exit 1
fi

# Check if user has Pro (by trying to access branch protection)
echo -e "${BLUE}🔍 Checking GitHub Pro access...${NC}"
if ! gh api repos/$REPO/branches/main/protection > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Cannot access branch protection settings${NC}"
    echo "This usually means:"
    echo "1. You don't have GitHub Pro"
    echo "2. You don't have admin access to the repository"
    echo "3. The repository is private and you need Pro"
    echo ""
    echo "Please upgrade to GitHub Pro first:"
    echo "https://github.com/settings/billing"
    exit 1
fi

echo -e "${GREEN}✅ GitHub Pro access confirmed${NC}"
echo ""

# Function to set up branch protection
setup_branch_protection() {
    local branch=$1
    local required_reviews=$2
    local description=$3
    
    echo -e "${BLUE}Setting up protection for $branch branch ($description)${NC}"
    
    gh api repos/$REPO/branches/$branch/protection --method PUT \
        --field required_status_checks='{"strict":true,"contexts":["Manual Branch Protection Checks"]}' \
        --field enforce_admins=true \
        --field required_pull_request_reviews='{"required_approving_review_count":'$required_reviews',"dismiss_stale_reviews":true,"require_code_owner_reviews":false}' \
        --field restrictions='{"users":[],"teams":[],"apps":[]}' \
        --field allow_force_pushes=false \
        --field allow_deletions=false \
        --field required_conversation_resolution=true \
        --field require_linear_history=true
    
    echo -e "${GREEN}✅ $branch branch protection configured${NC}"
}

# Set up protection for each branch
setup_branch_protection "main" "2" "Production - 2 reviews required"
setup_branch_protection "staging" "1" "Pre-production - 1 review required"  
setup_branch_protection "development" "1" "Development - 1 review required"

echo ""
echo -e "${GREEN}🎉 Branch protection setup complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Test the protection by trying to push directly to main:"
echo "   git checkout main"
echo "   echo 'test' >> test.txt"
echo "   git add test.txt"
echo "   git commit -m 'test'"
echo "   git push origin main  # This should be blocked"
echo ""
echo "2. Test the proper workflow:"
echo "   ./scripts/git-workflow.sh start-feature test-protection"
echo "   echo 'test' >> test.txt"
echo "   git add test.txt"
echo "   git commit -m 'test proper workflow'"
echo "   ./scripts/git-workflow.sh finish-feature"
echo ""
echo "3. Check protection status:"
echo "   gh api repos/$REPO/branches/main/protection"
echo ""
echo -e "${BLUE}Your repository is now properly protected! 🛡️${NC}"
