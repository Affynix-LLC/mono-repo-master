/**
 * BUSINESS SUBDOMAIN PRODUCTS
 * Category Distribution: Digital Marketing & Business Development
 * 
 * Product Schema:
 * - id: Unique identifier (biz001, biz002, etc.)
 * - name: Product title (SEO-optimized)
 * - price: Base price in USD
 * - recurring: Boolean for subscription products
 * - recurringPeriod: 'monthly' | 'annual' (if recurring)
 * - category: Must match domain config categories
 * - affiliateLink: ClickBank/partner checkout URL
 * - image: Product image URL (Unsplash CDN for MVP)
 * - description: SEO-optimized description (120-160 chars)
 * - features: Array of key features (4-8 items)
 * - skillLevel: 'Beginner' | 'Intermediate' | 'Advanced'
 * - timeInvestment: Expected time commitment
 * - platform: Delivery format
 */

export const businessProducts = [
  {
    id: 'biz001',
    name: 'Social Media Marketing Mastery Suite',
    price: 297,
    recurring: false,
    category: 'Digital Marketing',
    affiliateLink: 'https://clickbank.com/example-product',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    description: 'Complete social media automation and analytics platform for explosive business growth across all major platforms.',
    features: [
      'Multi-platform scheduling & automation',
      'Advanced analytics dashboard',
      'AI-powered content generation',
      'Team collaboration tools',
      'Competitor analysis tracking',
      'Engagement optimization algorithms'
    ],
    skillLevel: 'Beginner',
    timeInvestment: '30 min/day',
    platform: 'Web + Mobile App'
  },
  {
    id: 'biz002',
    name: 'SEO Domination Toolkit Pro',
    price: 197,
    recurring: true,
    recurringPeriod: 'monthly',
    category: 'Digital Marketing',
    affiliateLink: 'https://clickbank.com/example-product',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    description: 'Professional SEO tools and training for search engine dominance. Rank faster, drive more traffic, dominate your market.',
    features: [
      'Advanced keyword research engine',
      'Backlink analysis & monitoring',
      'Real-time rank tracking',
      'Competitor gap analysis',
      'Technical SEO audits',
      'Content optimization AI'
    ],
    skillLevel: 'Intermediate',
    timeInvestment: '1 hour/day',
    platform: 'Web Dashboard'
  },
  {
    id: 'biz003',
    name: 'Email Marketing Accelerator System',
    price: 497,
    recurring: false,
    category: 'Digital Marketing',
    affiliateLink: 'https://clickbank.com/example-product',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    description: 'Build and scale high-converting email campaigns with proven automation workflows and conversion optimization strategies.',
    features: [
      'List building blueprint',
      'Automation workflow templates',
      'A/B testing framework',
      'Conversion optimization playbook',
      'Deliverability maximization',
      'Revenue attribution tracking'
    ],
    skillLevel: 'Beginner',
    timeInvestment: '2-3 hours/week',
    platform: 'Online Course + Software'
  },
  {
    id: 'biz004',
    name: 'Business Leadership Academy',
    price: 997,
    recurring: true,
    recurringPeriod: 'annual',
    category: 'Business Development',
    affiliateLink: 'https://clickbank.com/example-product',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    description: 'Transform into a visionary leader with strategic business training from industry veterans. Scale your business to 7+ figures.',
    features: [
      'Leadership frameworks & psychology',
      'Team management systems',
      'Strategic planning templates',
      'Executive coaching sessions',
      'Financial modeling tools',
      'M&A preparation resources'
    ],
    skillLevel: 'Advanced',
    timeInvestment: '5 hours/week',
    platform: 'Online Platform + Live Sessions'
  },
  {
    id: 'biz005',
    name: 'Sales Funnel Blueprint System',
    price: 397,
    recurring: false,
    category: 'Business Development',
    affiliateLink: 'https://clickbank.com/example-product',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
    description: 'Build high-converting sales funnels that generate consistent revenue on autopilot. Proven templates and optimization strategies.',
    features: [
      'Funnel architecture templates',
      'Conversion rate optimization',
      'Traffic generation strategies',
      'Split testing frameworks',
      'Upsell sequence design',
      'Analytics integration'
    ],
    skillLevel: 'Intermediate',
    timeInvestment: '1-2 hours/day',
    platform: 'Video Training + Templates'
  },
  {
    id: 'biz006',
    name: 'Affiliate Marketing Mastery Program',
    price: 697,
    recurring: false,
    category: 'Affiliate Marketing',
    affiliateLink: 'https://clickbank.com/example-product',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80',
    description: 'Complete system for building profitable affiliate marketing businesses from scratch. Scale to $10K+/month in 90 days.',
    features: [
      'Niche selection framework',
      'Traffic generation mastery',
      'Conversion tactics library',
      'Scaling strategies & automation',
      'Relationship building system',
      'Compliance & legal guidance'
    ],
    skillLevel: 'Beginner',
    timeInvestment: '3-4 hours/day',
    platform: 'Online Course + Community'
  },
  {
    id: 'biz007',
    name: 'Copywriting Profit System',
    price: 297,
    recurring: false,
    category: 'Sales & Copywriting',
    affiliateLink: 'https://clickbank.com/example-product',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
    description: 'Master persuasive copywriting for emails, ads, and sales pages. Command premium rates or scale your own business conversions.',
    features: [
      'Proven copywriting formulas',
      'High-converting swipe files',
      'Template library (200+ pieces)',
      'Live critique sessions',
      'Neuromarketing principles',
      'Client acquisition system'
    ],
    skillLevel: 'Beginner',
    timeInvestment: '1 hour/day',
    platform: 'Video Course + PDF Resources'
  },
  {
    id: 'biz008',
    name: 'E-commerce Empire Builder',
    price: 1497,
    recurring: true,
    recurringPeriod: 'monthly',
    category: 'Business Development',
    affiliateLink: 'https://clickbank.com/example-product',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
    description: 'Complete e-commerce business system from product sourcing to scaling. Build a sustainable 6-7 figure online store.',
    features: [
      'Shopify store setup system',
      'Product sourcing strategies',
      'Marketing automation suite',
      'Operations management tools',
      'Fulfillment optimization',
      'Customer retention programs'
    ],
    skillLevel: 'Intermediate',
    timeInvestment: '4-6 hours/day',
    platform: 'Full System + Software'
  },
  {
    id: 'biz009',
    name: 'Content Marketing Engine',
    price: 397,
    recurring: true,
    recurringPeriod: 'monthly',
    category: 'Digital Marketing',
    affiliateLink: 'https://clickbank.com/example-product',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
    description: 'AI-powered content creation and distribution system for business growth. Dominate your niche with strategic content.',
    features: [
      'Content calendar automation',
      'AI writing assistant',
      'SEO optimization engine',
      'Multi-platform publishing',
      'Performance analytics',
      'Competitor content tracking'
    ],
    skillLevel: 'Beginner',
    timeInvestment: '2 hours/day',
    platform: 'Web Platform + Mobile'
  }
];
