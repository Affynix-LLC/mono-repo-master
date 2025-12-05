#!/bin/zsh

# Script to fix TypeScript issues with proper types instead of 'any'
# This fixes the hoveredProduct state type error with proper typing

echo "🔧 Fixing TypeScript issues with proper types..."

# Fix each file individually
echo "  📝 Fixing: app/business/page.tsx"
sed -i '' "s/const \[hoveredProduct, setHoveredProduct\] = useState<any>(null);/const [hoveredProduct, setHoveredProduct] = useState<typeof BUSINESS_PRODUCTS[0] | null>(null);/g" app/business/page.tsx

echo "  📝 Fixing: app/health/page.tsx"
sed -i '' "s/const \[hoveredProduct, setHoveredProduct\] = useState<any>(null);/const [hoveredProduct, setHoveredProduct] = useState<typeof HEALTH_PRODUCTS[0] | null>(null);/g" app/health/page.tsx

echo "  📝 Fixing: app/home/page.tsx"
sed -i '' "s/const \[hoveredProduct, setHoveredProduct\] = useState<any>(null);/const [hoveredProduct, setHoveredProduct] = useState<typeof HOME_PRODUCTS[0] | null>(null);/g" app/home/page.tsx

echo "  📝 Fixing: app/lifestyle/page.tsx"
sed -i '' "s/const \[hoveredProduct, setHoveredProduct\] = useState<any>(null);/const [hoveredProduct, setHoveredProduct] = useState<typeof LIFESTYLE_PRODUCTS[0] | null>(null);/g" app/lifestyle/page.tsx

echo "  📝 Fixing: app/money/page.tsx"
sed -i '' "s/const \[hoveredProduct, setHoveredProduct\] = useState<any>(null);/const [hoveredProduct, setHoveredProduct] = useState<typeof MONEY_PRODUCTS[0] | null>(null);/g" app/money/page.tsx

echo "  📝 Fixing: app/relationships/page.tsx"
sed -i '' "s/const \[hoveredProduct, setHoveredProduct\] = useState<any>(null);/const [hoveredProduct, setHoveredProduct] = useState<typeof RELATIONSHIPS_PRODUCTS[0] | null>(null);/g" app/relationships/page.tsx

echo "  📝 Fixing: app/tech/page.tsx"
sed -i '' "s/const \[hoveredProduct, setHoveredProduct\] = useState<any>(null);/const [hoveredProduct, setHoveredProduct] = useState<typeof TECH_PRODUCTS[0] | null>(null);/g" app/tech/page.tsx

echo "  📝 Fixing: app/subdomains/business-affynix-page.tsx"
sed -i '' "s/const \[hoveredProduct, setHoveredProduct\] = useState<any>(null);/const [hoveredProduct, setHoveredProduct] = useState<typeof BUSINESS_PRODUCTS[0] | null>(null);/g" app/subdomains/business-affynix-page.tsx

echo "✅ TypeScript fixing complete!"
echo "🚀 Ready to deploy to Vercel"
