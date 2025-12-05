#!/bin/zsh

# Script to create a new feature branch from development
# Usage: ./scripts/create-feature.sh feature-name

if [ -z "$1" ]; then
    echo "❌ Error: Please provide a feature name"
    echo "Usage: ./scripts/create-feature.sh feature-name"
    echo "Example: ./scripts/create-feature.sh add-user-authentication"
    exit 1
fi

FEATURE_NAME="$1"
BRANCH_NAME="feature/$FEATURE_NAME"

echo "🔧 Creating feature branch: $BRANCH_NAME"

# Switch to development and pull latest
git checkout development
git pull origin development

# Create and switch to feature branch
git checkout -b "$BRANCH_NAME"

echo "✅ Feature branch created: $BRANCH_NAME"
echo ""
echo "🚀 Next steps:"
echo "  1. Make your changes"
echo "  2. git add . && git commit -m 'Add $FEATURE_NAME'"
echo "  3. git push origin $BRANCH_NAME"
echo "  4. Create PR to development branch"
echo "  5. Test on dev environment"
echo "  6. Merge to staging when ready"
echo "  7. Merge to main for production"
