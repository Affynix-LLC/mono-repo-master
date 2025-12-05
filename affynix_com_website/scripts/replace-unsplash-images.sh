#!/bin/zsh

# Script to replace Unsplash image URLs with local CDN paths
# This improves performance and removes external dependencies

echo "🖼️  Replacing Unsplash images with local CDN paths..."

# Replace Unsplash URLs in config.ts
echo "📝 Updating lib/config.ts..."

# Replace ogImage
sed -i '' "s|https://images\.unsplash\.com/photo-1498050108023-c5249f4df085?w=1200&q=80&auto=format&fit=crop|/images/og/affynix-platform.jpg|g" lib/config.ts

# Replace hero image
sed -i '' "s|https://images\.unsplash\.com/photo-1556157382-97eda2d62296?w=1200&q=80&auto=format&fit=crop|/images/hero/ai-dashboard.jpg|g" lib/config.ts

# Replace showcase images
sed -i '' "s|https://images\.unsplash\.com/photo-1498050108023-c5249f4df085?w=900&q=80&auto=format&fit=crop|/images/showcase/ai-agent-dashboard.jpg|g" lib/config.ts
sed -i '' "s|https://images\.unsplash\.com/photo-1506765515384-028b60a970df?w=900&q=80&auto=format&fit=crop|/images/showcase/conversion-analytics.jpg|g" lib/config.ts
sed -i '' "s|https://images\.unsplash\.com/photo-1522071820081-009f0129c71c?w=900&q=80&auto=format&fit=crop|/images/showcase/team-collaboration.jpg|g" lib/config.ts
sed -i '' "s|https://images\.unsplash\.com/photo-1557800636-894a64c1696f?w=1200&q=80&auto=format&fit=crop|/images/showcase/api-documentation.jpg|g" lib/config.ts

# Replace resource article images
sed -i '' "s|https://images\.unsplash\.com/photo-1515879218367-8466d910aaa4?w=800&q=80&auto=format&fit=crop|/images/articles/ai-agent-training.jpg|g" lib/config.ts
sed -i '' "s|https://images\.unsplash\.com/photo-1521737604893-d14cc237f11d?w=800&q=80&auto=format&fit=crop|/images/articles/conversion-optimization.jpg|g" lib/config.ts
sed -i '' "s|https://images\.unsplash\.com/photo-1602525436197-c8b5d0fce2b6?w=800&q=80&auto=format&fit=crop|/images/articles/platform-updates.jpg|g" lib/config.ts
sed -i '' "s|https://images\.unsplash\.com/photo-1487014679447-9f8336841d58?w=800&q=80&auto=format&fit=crop|/images/articles/revenue-optimization.jpg|g" lib/config.ts

# Replace AI subdomain ogImage
sed -i '' "s|https://images\.unsplash\.com/photo-1677442136019-21780ecad995?w=1200&q=80&auto=format&fit=crop|/images/og/affynix-ai.jpg|g" lib/config.ts

# Replace dummy logo images with placeholder paths
sed -i '' "s|https://dummyimage\.com/120x40/ddd/222&text=ACME|/images/logos/acme.png|g" lib/config.ts
sed -i '' "s|https://dummyimage\.com/120x40/ddd/222&text=POLAR|/images/logos/polar.png|g" lib/config.ts
sed -i '' "s|https://dummyimage\.com/120x40/ddd/222&text=FUSION|/images/logos/fusion.png|g" lib/config.ts
sed -i '' "s|https://dummyimage\.com/120x40/ddd/222&text=KITE|/images/logos/kite.png|g" lib/config.ts
sed -i '' "s|https://dummyimage\.com/120x40/ddd/222&text=EMBER|/images/logos/ember.png|g" lib/config.ts

# Replace avatar images
sed -i '' "s|https://i\.pravatar\.cc/48\?img=12|/images/avatars/jordan-lee.jpg|g" lib/config.ts
sed -i '' "s|https://i\.pravatar\.cc/48\?img=32|/images/avatars/avery-chen.jpg|g" lib/config.ts
sed -i '' "s|https://i\.pravatar\.cc/48\?img=7|/images/avatars/sam-rivera.jpg|g" lib/config.ts

echo "✅ Image URL replacement complete!"
echo ""
echo "📁 Expected image structure:"
echo "  /public/images/"
echo "    ├── og/"
echo "    │   ├── affynix-platform.jpg"
echo "    │   └── affynix-ai.jpg"
echo "    ├── hero/"
echo "    │   └── ai-dashboard.jpg"
echo "    ├── showcase/"
echo "    │   ├── ai-agent-dashboard.jpg"
echo "    │   ├── conversion-analytics.jpg"
echo "    │   ├── team-collaboration.jpg"
echo "    │   └── api-documentation.jpg"
echo "    ├── articles/"
echo "    │   ├── ai-agent-training.jpg"
echo "    │   ├── conversion-optimization.jpg"
echo "    │   ├── platform-updates.jpg"
echo "    │   └── revenue-optimization.jpg"
echo "    ├── logos/"
echo "    │   ├── acme.png"
echo "    │   ├── polar.png"
echo "    │   ├── fusion.png"
echo "    │   ├── kite.png"
echo "    │   └── ember.png"
echo "    └── avatars/"
echo "        ├── jordan-lee.jpg"
echo "        ├── avery-chen.jpg"
echo "        └── sam-rivera.jpg"
echo ""
echo "🚀 Next steps:"
echo "  1. Add the actual image files to /public/images/"
echo "  2. Test the site to ensure images load correctly"
echo "  3. Deploy the changes"
