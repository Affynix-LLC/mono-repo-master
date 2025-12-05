#!/bin/zsh

# Comprehensive script to fix all issues and deploy to Vercel
# This handles apostrophes, TypeScript issues, and deployment

echo "🚀 Affynix Platform - Fix and Deploy Script"
echo "============================================="

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

echo ""
echo "🔧 Step 1: Fixing unescaped apostrophes..."
for page in "${PAGES[@]}"; do
    if [ -f "$page" ]; then
        echo "  📝 Fixing: $page"
        # Replace common unescaped apostrophes with &apos;
        sed -i '' "s/What's Included:/What\&apos;s Included:/g" "$page"
        sed -i '' "s/Don't/Don\&apos;t/g" "$page"
        sed -i '' "s/Can't/Can\&apos;t/g" "$page"
        sed -i '' "s/Won't/Won\&apos;t/g" "$page"
        sed -i '' "s/Isn't/Isn\&apos;t/g" "$page"
        sed -i '' "s/Doesn't/Doesn\&apos;t/g" "$page"
        sed -i '' "s/It's/It\&apos;s/g" "$page"
        sed -i '' "s/That's/That\&apos;s/g" "$page"
        sed -i '' "s/There's/There\&apos;s/g" "$page"
        sed -i '' "s/Here's/Here\&apos;s/g" "$page"
        sed -i '' "s/Let's/Let\&apos;s/g" "$page"
        sed -i '' "s/We're/We\&apos;re/g" "$page"
        sed -i '' "s/You're/You\&apos;re/g" "$page"
        sed -i '' "s/They're/They\&apos;re/g" "$page"
        sed -i '' "s/I'm/I\&apos;m/g" "$page"
        sed -i '' "s/He's/He\&apos;s/g" "$page"
        sed -i '' "s/She's/She\&apos;s/g" "$page"
        sed -i '' "s/Who's/Who\&apos;s/g" "$page"
        sed -i '' "s/What's/What\&apos;s/g" "$page"
        sed -i '' "s/Where's/Where\&apos;s/g" "$page"
        sed -i '' "s/When's/When\&apos;s/g" "$page"
        sed -i '' "s/Why's/Why\&apos;s/g" "$page"
        sed -i '' "s/How's/How\&apos;s/g" "$page"
    else
        echo "  ⚠️  File not found: $page"
    fi
done

echo ""
echo "🔧 Step 2: Fixing TypeScript issues..."
for page in "${PAGES[@]}"; do
    if [ -f "$page" ]; then
        echo "  📝 Fixing: $page"
        # Fix hoveredProduct state type
        sed -i '' "s/const \[hoveredProduct, setHoveredProduct\] = useState(null);/const [hoveredProduct, setHoveredProduct] = useState<any>(null);/g" "$page"
    else
        echo "  ⚠️  File not found: $page"
    fi
done

echo ""
echo "🔧 Step 3: Adding 'use client' directives..."
for page in "${PAGES[@]}"; do
    if [ -f "$page" ]; then
        echo "  📝 Fixing: $page"
        # Add 'use client' directive if not already present
        if ! grep -q '"use client"' "$page"; then
            sed -i '' '1i\
"use client";
' "$page"
        fi
    else
        echo "  ⚠️  File not found: $page"
    fi
done

echo ""
echo "✅ All fixes complete!"
echo ""
echo "🚀 Deploying to Vercel..."
echo ""

# Deploy to Vercel
npx vercel --prod --yes

echo ""
echo "🎉 Deployment complete!"
echo "Check your Vercel dashboard for the deployment status."
