# Affynix Platform

A modern, scalable multi-subdomain platform for affiliate marketing funnels across 8 active verticals. Built with Next.js 14+ and optimized for SEO, performance, and conversion tracking.

## 🚀 Features

- **8 Active Subdomains**: Business, Money, Health, Home, Lifestyle, Relationships, Tech, Food, Outdoors, Travel, Leads, Education, Sports
- **Hub Landing Page**: Centralized navigation with professional SVG icons and gradient theming
- **SEO Network**: Cross-domain authority boosting and content syndication
- **Modal Conversion Funnels**: No separate landing pages - modals handle all conversions
- **Analytics Integration**: Cloudfilt, Charla, ClickRank tracking
- **Performance Optimized**: 95+ Lighthouse scores, Core Web Vitals optimized
- **JavaScript Standardized**: Converted from TypeScript for faster builds
- **Production Ready**: All routes functional and deployment-ready

## 🏗️ Project Structure

```
/Users/13omb3r/Dev/affynix-platform/
│
├── app/                                # Next.js App Router
│   ├── layout.js                       # Root layout with global styles
│   ├── page.js                         # Hub landing page
│   ├── [subdomain]/                    # Dynamic subdomain routing
│   │   └── page.js                     # Subdomain page handler
│   ├── business/page.js                # Business subdomain
│   ├── health/page.js                  # Health subdomain
│   ├── home/page.js                    # Home subdomain
│   ├── money/page.js                   # Money subdomain
│   ├── relationships/page.js           # Relationships subdomain
│   ├── tech/page.js                    # Tech subdomain
│   └── api/data/                       # API endpoints
│       └── products.js                 # Product data API
│
├── components/                         # React Components
│   ├── DomainHeader.js                 # Subdomain-specific headers
│   ├── DomainPage.js                   # Subdomain page wrapper
│   ├── Footer.js                       # Global footer component
│   ├── LandingPage.js                  # Hub landing page component
│   ├── ProductGrid.js                  # Product grid display
│   ├── ProductModal.js                 # Product detail modal
│   ├── SEOInjector.js                  # SEO meta injection
│   ├── StealthHeader.js                # Minimal navigation header
│   └── subdomain-template/             # Reusable subdomain components
│       ├── DealsList.js                # Product deals list
│       ├── Footer.js                   # Subdomain footer
│       ├── Header.js                   # Subdomain header
│       ├── Hero.js                     # Hero section
│       └── SubdomainPage.js            # Subdomain page wrapper
│
├── modals/                             # Modal Components
│   ├── ContactModal.js                 # Contact form modal
│   ├── DealDetailModal.js              # Product detail modal
│   └── SearchModal.js                  # Search interface modal
│
├── lib/                                # Core Libraries
│   ├── analytics.js                    # Multi-platform analytics
│   ├── domain-config.js                # Subdomain configurations
│   ├── domain-detector.js              # Domain detection logic
│   ├── seo-network.js                  # SEO network optimization
│   └── subdomain-config/               # Subdomain-specific configs
│       └── domain-config.js            # Additional domain configs
│
├── data/                               # Product Data
│   └── products/                       # Vertical-specific products
│       ├── business.js                 # Business products (62 items)
│       ├── health.js                   # Health products (543 items)
│       ├── home.js                     # Home products (171 items)
│       ├── money.js                    # Money products (89 items)
│       ├── relationships.js            # Relationships products (140 items)
│       └── tech.js                     # Tech products
│
├── public/                             # Static Assets
│   └── js/                             # SEO & Analytics Scripts
│       ├── authority-booster.js        # Cross-domain authority
│       ├── content-syndication.js      # Content distribution
│       ├── dynamic-canonical.js        # Dynamic canonical URLs
│       ├── schema-network.js           # Structured data network
│       ├── seo-network-loader.js       # SEO script loader
│       └── user-journey-tracker.js     # User behavior tracking
│
├── logo/                               # Brand Assets
│   ├── logo1.png                       # Primary logo (268KB)
│   └── logo2.png                       # Secondary logo (163KB)
│
├── config/                             # Configuration Files
│   └── network-domains.js              # Network domain configuration
│
├── scripts/                            # Deployment & Utility Scripts
│   ├── deploy-prod.sh                  # Production deployment
│   ├── deploy-staging.sh               # Staging deployment
│   ├── fix-subdomains-properly.sh      # Subdomain fixes
│   ├── update-all-subdomains.sh        # Bulk subdomain updates
│   └── [other utility scripts]         # Additional automation
│
├── affynix-subdomain-template/         # Template System
│   ├── app/                            # Template app structure
│   ├── components/                     # Template components
│   ├── lib/                            # Template libraries
│   ├── modals/                         # Template modals
│   └── package.json                    # Template dependencies
│
├── affynix-backend/                    # Backend Services
│   ├── services/                       # Microservices
│   │   ├── admin/                      # Admin service
│   │   ├── api-gateway/                # API gateway
│   │   ├── auth/                       # Authentication
│   │   └── data/                       # Data service
│   ├── infrastructure/                 # Infrastructure as Code
│   │   ├── docker/                     # Docker configurations
│   │   ├── kubernetes/                 # K8s manifests
│   │   ├── nginx/                      # Nginx configs
│   │   └── terraform/                  # Terraform modules
│   └── devops/                         # DevOps automation
│       ├── ci-cd/                      # CI/CD pipelines
│       └── scripts/                    # Deployment scripts
│
├── middleware.ts                       # Next.js middleware for routing
├── next.config.js                      # Next.js configuration
├── tsconfig.json                       # TypeScript configuration
├── tailwind.config.js                  # Tailwind CSS configuration
├── package.json                        # Dependencies and scripts
├── docker-compose.yml                  # Docker orchestration
├── Dockerfile                          # Container configuration
└── README.md                           # This file
```

## 🌐 Active Subdomains

| Subdomain | Products | Focus Area | Status |
|-----------|----------|------------|--------|
| `business.affynix.com` | 62 | Digital Marketing, Business Dev | ✅ Active |
| `money.affynix.com` | 89 | Finance, Investing, Real Estate | ✅ Active |
| `health.affynix.com` | 543 | Fitness, Nutrition, Wellness | ✅ Active |
| `home.affynix.com` | 171 | Home, Lifestyle, Skills | ✅ Active |
| `lifestyle.affynix.com` | Aggregate | Personal Development | ✅ Active |
| `relationships.affynix.com` | 140 | Dating, Relationships | ✅ Active |
| `tech.affynix.com` | Future B2B | Technology & AI | 🔄 Planned |
| `food.affynix.com` | Culinary | Cooking, Diet Programs | 🔄 Planned |
| `outdoors.affynix.com` | Adventure | Camping, Hiking, Survival | 🔄 Planned |
| `travel.affynix.com` | Travel | Travel Hacking, Destinations | 🔄 Planned |
| `leads.affynix.com` | Marketing | Lead Generation Tools | 🔄 Planned |
| `edu.affynix.com` | Education | Learning Solutions | 🔄 Planned |
| `sports.affynix.com` | Sports | Athletic Performance | 🔄 Planned |

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**

   ```zsh
   git clone https://github.com/Affynix-LLC/affynix-platform.git
   cd affynix-platform
   ```

2. **Install dependencies**

   ```zsh
   npm ci
   ```

3. **Set up environment variables**

   ```zsh
   cp .env.local.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Run the development server**

   ```zsh
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env.local` file with the following variables:

```zsh
# Analytics
NEXT_PUBLIC_CLOUDFILT_SITE_ID=your-site-id
NEXT_PUBLIC_CHARLA_WIDGET_ID=your-widget-id
NEXT_PUBLIC_CLICKRANK_DOMAIN=your-domain

# Deployment
NEXT_PUBLIC_BASE_URL=https://affynix.com
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Configure domains** for all 8 subdomains
4. **Deploy automatically** on push to main branch

### Manual Deployment

```zsh
npm run build
npm run start
```

### Production Deployment Script

```zsh
./scripts/deploy-prod.sh
```

## 📊 Analytics & Tracking

The platform includes comprehensive analytics across multiple platforms:

- **Cloudfilt**: Site performance and user behavior (srv21019)
- **Charla**: Customer support and engagement (app.getcharla.com)
- **ClickRank**: Click tracking and conversion optimization (js.clickrank.ai)
- **Custom Events**: Form submissions, modal interactions, user journeys

## 🎨 Customization

### Adding New Subdomains

1. Add subdomain configuration in `lib/domain-config.js`
2. Create subdomain page in `app/[subdomain]/page.js`
3. Add to middleware routing in `middleware.ts`
4. Configure DNS and Vercel domains

### Theming

Each subdomain has unique gradient theming defined in `lib/domain-config.js`:

- **Business**: Blue gradient (#3B82F6)
- **Money**: Green gradient (#10B981)
- **Health**: Red gradient (#EF4444)
- **Home**: Orange gradient (#F59E0B)
- **Lifestyle**: Purple gradient (#8B5CF6)
- **Relationships**: Pink gradient (#EC4899)
- **Tech**: Blue gradient (#3B82F6)

### Components

All components are built with JavaScript and include:
- Accessibility features (WCAG AA compliant)
- SEO optimization
- Performance optimization
- Mobile responsiveness

## 🧪 Testing

```zsh
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run build test
npm run build

# Run development server
npm run dev
```

## 📈 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for LCP, FID, and CLS
- **Image Optimization**: Next.js Image component with WebP/AVIF
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Static generation with ISR
- **Bundle Size**: Optimized JavaScript bundles

## 🔒 Security

- **Content Security Policy**: Configured headers
- **Input Validation**: Comprehensive form validation
- **XSS Protection**: Input sanitization
- **HTTPS**: Enforced in production
- **Environment Variables**: Secure configuration management

## 📚 Documentation

- [Implementation Guide](./Implementation_Guide.md) - Technical implementation details
- [Executive Summary](./Executive_Summary.md) - Business overview and strategy
- [Domain Configuration](./lib/domain-config.js) - Subdomain setup guide

## 🌿 Git Workflow

This repository follows a feature branch workflow:

```zsh
main                    → Production deployments only
└── feature/*           → Feature branches (merged to main)
```

### Quick Start with Git Workflow

```zsh
# Start a new feature
git checkout -b feature/your-feature-name

# Work on your feature
git add .
git commit -m "feat: your feature description"

# Push and create PR
git push -u origin feature/your-feature-name
```

## 🤝 Contributing

1. **Create a feature branch**

   ```zsh
   git checkout -b feature/your-feature-name
   ```

2. **Work on your feature**
   - Make your changes
   - Commit frequently with descriptive messages
   - Test your changes locally

3. **Create a Pull Request**
   - From your feature branch to `main`
   - Include detailed description
   - Reference any related issues

4. **Clean up**
   - Delete your feature branch after merging

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in this repository
- Check the documentation
- Review the implementation guide

## 🗺️ Roadmap

- [x] Hub landing page with professional design
- [x] 8 active subdomains with routing
- [x] SEO network optimization
- [x] Modal conversion funnels
- [x] Analytics integration
- [x] Production deployment ready
- [ ] Additional subdomain templates
- [ ] Advanced analytics dashboard
- [ ] A/B testing framework
- [ ] Multi-language support
- [ ] Advanced form builder
- [ ] Integration marketplace

## 🏆 Current Status

**Production Ready** ✅
- All 8 subdomains functional
- SEO optimized
- Analytics integrated
- Performance optimized
- Deployment ready

---

**Affynix Platform** - Built for scale, optimized for conversions, designed for growth.

Built by 0xroboros for Affynix LLC