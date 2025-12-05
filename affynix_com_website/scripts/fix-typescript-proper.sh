#!/bin/zsh

# Script to fix TypeScript issues with proper types instead of 'any'
# This fixes the hoveredProduct state type error with proper typing

echo "🔧 Fixing TypeScript issues with proper types..."

# Array of subdomain page files with their corresponding product arrays
declare -A PRODUCT_ARRAYS=(
    ["app/business/page.tsx"]="BUSINESS_PRODUCTS"
    ["app/health/page.tsx"]="HEALTH_PRODUCTS"
    ["app/home/page.tsx"]="HOME_PRODUCTS"
    ["app/lifestyle/page.tsx"]="LIFESTYLE_PRODUCTS"
    ["app/money/page.tsx"]="MONEY_PRODUCTS"
    ["app/relationships/page.tsx"]="RELATIONSHIPS_PRODUCTS"
    ["app/tech/page.tsx"]="TECH_PRODUCTS"
    ["app/subdomains/business-affynix-page.tsx"]="BUSINESS_PRODUCTS"
)

# Fix TypeScript issues in each file
for page in "${!PRODUCT_ARRAYS[@]}"; do
    if [ -f "$page" ]; then
        echo "  📝 Fixing: $page"
        product_array="${PRODUCT_ARRAYS[$page]}"
        # Fix hoveredProduct state type with proper typing
        sed -i '' "s/const \[hoveredProduct, setHoveredProduct\] = useState<any>(null);/const [hoveredProduct, setHoveredProduct] = useState<typeof ${product_array}[0] | null>(null);/g" "$page"
    else
        echo "  ⚠️  File not found: $page"
    fi
done

echo "✅ TypeScript fixing complete!"
echo "🚀 Ready to deploy to Vercel"
