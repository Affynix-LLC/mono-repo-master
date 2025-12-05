#!/bin/zsh

# Script to fix unescaped apostrophes in all subdomain pages
# This fixes the ESLint error: react/no-unescaped-entities

echo "🔧 Fixing unescaped apostrophes in subdomain pages..."

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

# Fix apostrophes in each file
for page in "${PAGES[@]}"; do
    if [ -f "$page" ]; then
        echo "  📝 Fixing: $page"
        # Replace unescaped apostrophes with &apos;
        sed -i '' "s/What's Included:/What\&apos;s Included:/g" "$page"
        sed -i '' "s/Don't/Don\&apos;t/g" "$page"
        sed -i '' "s/Can't/Can\&apos;t/g" "$page"
        sed -i '' "s/Won't/Won\&apos;t/g" "$page"
        sed -i '' "s/Isn't/Isn\&apos;t/g" "$page"
        sed -i '' "s/Doesn't/Doesn\&apos;t/g" "$page"
        sed -i '' "s/Hasn't/Hasn\&apos;t/g" "$page"
        sed -i '' "s/Haven't/Haven\&apos;t/g" "$page"
        sed -i '' "s/Shouldn't/Shouldn\&apos;t/g" "$page"
        sed -i '' "s/Couldn't/Couldn\&apos;t/g" "$page"
        sed -i '' "s/Wouldn't/Wouldn\&apos;t/g" "$page"
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

echo "✅ Apostrophe fixing complete!"
echo "🚀 Ready to deploy to Vercel"
