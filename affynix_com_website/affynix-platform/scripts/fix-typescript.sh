#!/bin/zsh

# Script to fix TypeScript issues in all subdomain pages
# This fixes the hoveredProduct state type error

echo "🔧 Fixing TypeScript issues in subdomain pages..."

# Array of subdomain page files
PAGES=(
    "app/business/page.tsx"
    "app/health/page.tsx"
    "app/home/page.tsx"
    "app/lifestyle/page.tsx"
    "app/money/page.tsx"
    "app/relationships/page.tsx"
    "app/tech/page.tsx"
)

# Fix TypeScript issues in each file
for page in "${PAGES[@]}"; do
    if [ -f "$page" ]; then
        echo "  📝 Fixing: $page"
        # Fix hoveredProduct state type
        sed -i '' "s/const \[hoveredProduct, setHoveredProduct\] = useState(null);/const [hoveredProduct, setHoveredProduct] = useState<any>(null);/g" "$page"
    else
        echo "  ⚠️  File not found: $page"
    fi
done

echo "✅ TypeScript fixing complete!"
echo "🚀 Ready to deploy to Vercel"
