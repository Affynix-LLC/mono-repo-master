#!/bin/zsh

# Script to fix modal animations that trigger ad blockers
# Replace CSS animations with CSS transitions

echo "🔧 Fixing modal animations to prevent ad blocker issues..."

# Array of subdomain page files
PAGES=(
    "app/business/page.tsx"
    "app/health/page.tsx"
    "app/home/page.tsx"
    "app/lifestyle/page.tsx"
    "app/money/page.tsx"
    "app/relationships/page.tsx"
    "app/tech/page.tsx"
    "app/subdomains/business-affynix-page.tsx"
)

# Fix modal animations in each file
for page in "${PAGES[@]}"; do
    if [ -f "$page" ]; then
        echo "  📝 Fixing: $page"
        # Replace CSS animations with transitions
        sed -i '' "s/animation: 'fadeIn 0\.2s ease'/opacity: 1, transition: 'opacity 0.2s ease'/g" "$page"
        sed -i '' "s/animation: 'slideUp 0\.3s ease'/transform: 'translateY(0)', transition: 'transform 0.3s ease'/g" "$page"
        sed -i '' "s/animation: 'fadeIn 0\.3s ease',/opacity: 1, transition: 'opacity 0.3s ease',/g" "$page"
    else
        echo "  ⚠️  File not found: $page"
    fi
done

echo "✅ Modal fixes complete!"
echo "🚀 Ready to deploy"
