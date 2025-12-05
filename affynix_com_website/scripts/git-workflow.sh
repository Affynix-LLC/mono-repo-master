#!/bin/bash

# Git Workflow Helper Script for Affynix Platform
# Usage: ./scripts/git-workflow.sh [command] [options]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_help() {
    echo -e "${BLUE}Affynix Platform Git Workflow Helper${NC}"
    echo ""
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  start-feature <name>     Start a new feature branch"
    echo "  update-feature          Update current feature branch with latest development"
    echo "  finish-feature          Finish current feature (merge to development)"
    echo "  promote-staging         Promote development to staging"
    echo "  promote-production      Promote staging to production"
    echo "  status                  Show current branch status"
    echo "  help                    Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start-feature user-authentication"
    echo "  $0 update-feature"
    echo "  $0 finish-feature"
}

check_branch() {
    local expected_branch=$1
    local current_branch=$(git branch --show-current)
    
    if [ "$current_branch" != "$expected_branch" ]; then
        echo -e "${RED}Error: Must be on $expected_branch branch. Currently on $current_branch${NC}"
        exit 1
    fi
}

start_feature() {
    local feature_name=$1
    
    if [ -z "$feature_name" ]; then
        echo -e "${RED}Error: Feature name is required${NC}"
        echo "Usage: $0 start-feature <name>"
        exit 1
    fi
    
    echo -e "${BLUE}Starting new feature: $feature_name${NC}"
    
    # Switch to development and update
    git checkout development
    git pull origin development
    
    # Create feature branch
    git checkout -b "feature/$feature_name"
    
    echo -e "${GREEN}✓ Feature branch 'feature/$feature_name' created and checked out${NC}"
    echo -e "${YELLOW}Remember to push your branch: git push origin feature/$feature_name${NC}"
}

update_feature() {
    local current_branch=$(git branch --show-current)
    
    if [[ ! $current_branch =~ ^feature/ ]]; then
        echo -e "${RED}Error: Must be on a feature branch${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}Updating feature branch with latest development${NC}"
    
    # Update development
    git checkout development
    git pull origin development
    
    # Switch back to feature and merge
    git checkout "$current_branch"
    git merge development
    
    echo -e "${GREEN}✓ Feature branch updated with latest development${NC}"
}

finish_feature() {
    local current_branch=$(git branch --show-current)
    
    if [[ ! $current_branch =~ ^feature/ ]]; then
        echo -e "${RED}Error: Must be on a feature branch${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}Finishing feature: $current_branch${NC}"
    
    # Update feature with latest development
    update_feature
    
    # Push feature branch
    git push origin "$current_branch"
    
    echo -e "${GREEN}✓ Feature branch pushed to remote${NC}"
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Create a pull request from $current_branch to development"
    echo "2. Request code review"
    echo "3. Merge after approval"
    echo "4. Delete the feature branch locally: git branch -d $current_branch"
}

promote_staging() {
    check_branch "development"
    
    echo -e "${BLUE}Promoting development to staging${NC}"
    
    # Update development
    git pull origin development
    
    # Switch to staging and merge
    git checkout staging
    git pull origin staging
    git merge development
    git push origin staging
    
    echo -e "${GREEN}✓ Development promoted to staging${NC}"
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Deploy to staging environment"
    echo "2. Perform QA testing"
    echo "3. Create pull request to main when ready for production"
}

promote_production() {
    check_branch "staging"
    
    echo -e "${BLUE}Promoting staging to production${NC}"
    
    # Update staging
    git pull origin staging
    
    # Switch to main and merge
    git checkout main
    git pull origin main
    git merge staging
    git push origin main
    
    echo -e "${GREEN}✓ Staging promoted to production${NC}"
    echo -e "${YELLOW}Production deployment should trigger automatically${NC}"
}

show_status() {
    echo -e "${BLUE}Current Git Status:${NC}"
    echo ""
    
    # Current branch
    local current_branch=$(git branch --show-current)
    echo -e "Current branch: ${GREEN}$current_branch${NC}"
    
    # Branch status
    echo ""
    echo "Branch status:"
    git status --porcelain
    
    # Recent commits
    echo ""
    echo "Recent commits:"
    git log --oneline -5
    
    # Remote status
    echo ""
    echo "Remote status:"
    git status -uno
}

# Main script logic
case "$1" in
    "start-feature")
        start_feature "$2"
        ;;
    "update-feature")
        update_feature
        ;;
    "finish-feature")
        finish_feature
        ;;
    "promote-staging")
        promote_staging
        ;;
    "promote-production")
        promote_production
        ;;
    "status")
        show_status
        ;;
    "help"|"")
        print_help
        ;;
    *)
        echo -e "${RED}Error: Unknown command '$1'${NC}"
        print_help
        exit 1
        ;;
esac
