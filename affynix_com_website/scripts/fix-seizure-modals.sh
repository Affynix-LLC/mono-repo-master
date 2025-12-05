#!/bin/zsh

# Script to fix modal flashing that causes seizures
# Remove all rapid animations and transitions

echo "🚨 Fixing modal seizure issue - removing rapid animations..."

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
        # Remove all transitions and animations
        sed -i '' "s/opacity: 1, transition: 'opacity 0\.2s ease'//g" "$page"
        sed -i '' "s/transform: 'translateY(0)', transition: 'transform 0\.3s ease'//g" "$page"
        sed -i '' "s/opacity: 1, transition: 'opacity 0\.3s ease',//g" "$page"
        # Remove the setTimeout that causes rapid flashing
        sed -i '' "s/const timer = setTimeout(() => setShowDetails(true), 150);/setShowDetails(true);/g" "$page"
        sed -i '' "s/return () => clearTimeout(timer);/return;/g" "$page"
    else
        echo "  ⚠️  File not found: $page"
    fi
done

echo "✅ Seizure-safe modal fixes complete!"
echo "🚀 Ready to deploy"
