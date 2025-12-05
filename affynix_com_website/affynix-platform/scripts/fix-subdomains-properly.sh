#!/bin/zsh

# Script to properly fix all subdomain pages
# Fixes: dropdown in header, modal animations, hydration issues

echo "🔧 Properly fixing all subdomain pages..."

# Array of subdomain pages
PAGES=(
    "app/business/page.tsx"
    "app/health/page.tsx"
    "app/home/page.tsx"
    "app/lifestyle/page.tsx"
    "app/money/page.tsx"
    "app/relationships/page.tsx"
    "app/tech/page.tsx"
)

# Fix each page
for page in "${PAGES[@]}"; do
    if [ -f "$page" ]; then
        echo "  📝 Fixing: $page"
        
        # Add mounted state after function declaration (properly)
        sed -i '' 's/export default function \([A-Za-z]*\)Page() {/export default function \1Page() {\n  const [mounted, setMounted] = useState(false);/' "$page"
        
        # Add useEffect for mounted after the mounted state
        sed -i '' '/const \[mounted, setMounted\] = useState(false);/a\
  useEffect(() => {\
    setMounted(true);\
  }, []);' "$page"
        
        # Fix modal useEffect - remove setTimeout
        sed -i '' 's/const timer = setTimeout(() => setShowDetails(true), 150);/setShowDetails(true);/' "$page"
        sed -i '' 's/return () => clearTimeout(timer);/return;/' "$page"
        
        # Add dropdown to header (after search input, before closing div)
        sed -i '' '/placeholder="Search.*solutions"/a\
            {mounted && (\
              <select\
                style={{\
                  background: "#1A1A1A",\
                  color: "#C9A961",\
                  border: "1px solid #C9A961",\
                  padding: "0.5rem",\
                  borderRadius: "4px",\
                  fontSize: "0.9rem"\
                }}\
              >\
                <option value="tech.affynix.com">tech.affynix.com</option>\
                <option value="business.affynix.com">business.affynix.com</option>\
                <option value="health.affynix.com">health.affynix.com</option>\
                <option value="money.affynix.com">money.affynix.com</option>\
                <option value="home.affynix.com">home.affynix.com</option>\
                <option value="lifestyle.affynix.com">lifestyle.affynix.com</option>\
                <option value="relationships.affynix.com">relationships.affynix.com</option>\
              </select>\
            )}' "$page"
        
        # Fix modal animations
        sed -i '' 's/animation: .fadeIn 0\.2s ease./opacity: 1, transition: "opacity 0.2s ease"/g' "$page"
        sed -i '' 's/animation: .slideUp 0\.3s ease./transform: "translateY(0)", transition: "transform 0.3s ease"/g' "$page"
        sed -i '' 's/animation: .fadeIn 0\.3s ease.,/opacity: 1, transition: "opacity 0.3s ease",/g' "$page"
        
    else
        echo "  ⚠️  File not found: $page"
    fi
done

echo "✅ All subdomain pages fixed properly!"
echo "🚀 Ready to test in Docker"
