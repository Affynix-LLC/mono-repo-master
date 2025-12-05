/**
 * AFFYNIX DOMAIN CONFIGURATION SYSTEM
 * Single source of truth for all subdomain variations
 * Maps domain → SEO package → product data → styling
 */

export const DOMAIN_CONFIGS = {
  'business.affynix.com': {
    // Identity & Branding
    slug: 'business',
    name: 'Business',
    title: 'Business Growth Solutions',
    tagline: 'Curated tools and training for digital marketing and business development',
    
    // Visual Theme
    theme: {
      primary: '#1A365D',
      secondary: '#2D4A6B',
      accent: '#C9A961',
      gradient: 'linear-gradient(135deg, #1A365D 0%, #2D4A6B 100%)',
      heroGradient: 'linear-gradient(135deg, rgba(26,54,93,0.95) 0%, rgba(45,74,107,0.95) 100%)'
    },
    
    // SEO Configuration
    seo: {
      metaTitle: 'Business Growth Solutions - Digital Marketing & Development Tools | Affynix',
      metaDescription: 'Discover professional business development tools, digital marketing software, and affiliate marketing training. Curated selection of high-converting business growth products.',
      keywords: [
        'business development tools',
        'digital marketing software',
        'affiliate marketing training',
        'e-commerce solutions',
        'email marketing platforms',
        'SEO tools',
        'social media automation'
      ],
      ogImage: '/logo/logo1.svg',
      twitterCard: 'summary_large_image',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Business Growth Solutions',
        description: 'Professional business development and digital marketing tools',
        provider: {
          '@type': 'Organization',
          name: 'Affynix',
          url: 'https://affynix.com'
        }
      }
    },
    
    // Navigation & Categories
    categories: [
      'All',
      'Digital Marketing',
      'Business Development',
      'E-commerce',
      'Affiliate Marketing'
    ],
    
    // Product Source (will be loaded dynamically)
      productSource: 'https://data.affynix.com/api/products',
    
    // Analytics Configuration
    analytics: {
      cloudfilt: {
        enabled: true,
        siteId: 'business-affynix'
      },
      charla: {
        enabled: true,
        widgetId: 'business-widget'
      },
      clickrank: {
        enabled: true,
        domain: 'business.affynix.com'
      }
    },
    
    // Cross-domain Network
    networkLinks: [
      { domain: 'affynix.com', label: 'Affynix Network', rel: 'home' },
      { domain: 'ai.affynix.com', label: 'AI', rel: 'related' },
      { domain: 'email.affynix.com', label: 'Email', rel: 'related' },
      { domain: 'data.affynix.com', label: 'Data', rel: 'related' }
    ]
  },
  
  'money.affynix.com': {
    slug: 'money',
    name: 'Money',
    title: 'Wealth Building & Investment',
    tagline: 'Expert training in investing, trading, and financial independence',
    
    theme: {
      primary: '#1B3B6F',
      secondary: '#2A5298',
      accent: '#C9A961',
      gradient: 'linear-gradient(135deg, #1B3B6F 0%, #2A5298 100%)',
      heroGradient: 'linear-gradient(135deg, rgba(27,59,111,0.95) 0%, rgba(42,82,152,0.95) 100%)'
    },
    
    seo: {
      metaTitle: 'Wealth Building & Investment Education - Trading & Finance | Affynix',
      metaDescription: 'Master investing, trading, and personal finance with expert-curated courses. Stock trading, forex, real estate, and wealth building strategies.',
      keywords: [
        'investment education',
        'stock trading courses',
        'forex training',
        'real estate investing',
        'personal finance',
        'wealth building',
        'financial independence'
      ],
      ogImage: '/logo/logo1.svg',
      twitterCard: 'summary_large_image',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Wealth Building & Investment',
        description: 'Investment and trading education programs'
      }
    },
    
    categories: [
      'All',
      'Investing & Trading',
      'Personal Finance',
      'Real Estate',
      'Cryptocurrency'
    ],
    
    productSource: 'https://api.affynix.com/api/products',
    
    analytics: {
      cloudfilt: { enabled: true, siteId: 'money-affynix' },
      charla: { enabled: true, widgetId: 'money-widget' },
      clickrank: { enabled: true, domain: 'money.affynix.com' }
    },
    
    networkLinks: [
      { domain: 'affynix.com', label: 'Affynix Network', rel: 'home' },
      { domain: 'business.affynix.com', label: 'Business', rel: 'related' },
      { domain: 'health.affynix.com', label: 'Health', rel: 'related' },
      { domain: 'lifestyle.affynix.com', label: 'Lifestyle', rel: 'related' }
    ]
  },
  
  'health.affynix.com': {
    slug: 'health',
    name: 'Health',
    title: 'Fitness & Wellness Solutions',
    tagline: 'Evidence-based programs for fitness, nutrition, and optimal health',
    
    theme: {
      primary: '#8B1538',
      secondary: '#A91D3A',
      accent: '#C9A961',
      gradient: 'linear-gradient(135deg, #8B1538 0%, #A91D3A 100%)',
      heroGradient: 'linear-gradient(135deg, rgba(139,21,56,0.95) 0%, rgba(169,29,58,0.95) 100%)'
    },
    
    seo: {
      metaTitle: 'Fitness & Wellness Solutions - Nutrition, Training & Health | Affynix',
      metaDescription: 'Transform your health with evidence-based fitness programs, nutrition guides, and wellness solutions. Expert-curated health and fitness products.',
      keywords: [
        'fitness programs',
        'nutrition guides',
        'weight loss',
        'muscle building',
        'wellness solutions',
        'health supplements',
        'workout training'
      ],
      ogImage: '/logo/logo1.svg',
      twitterCard: 'summary_large_image',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Fitness & Wellness Solutions',
        description: 'Health, fitness, and wellness programs'
      }
    },
    
    categories: [
      'All',
      'Fitness & Training',
      'Nutrition & Supplements',
      'Mental Wellness',
      'Weight Management'
    ],
    
    productSource: 'https://api.affynix.com/api/products',
    
    analytics: {
      cloudfilt: { enabled: true, siteId: 'health-affynix' },
      charla: { enabled: true, widgetId: 'health-widget' },
      clickrank: { enabled: true, domain: 'health.affynix.com' }
    },
    
    networkLinks: [
      { domain: 'affynix.com', label: 'Affynix Network', rel: 'home' },
      { domain: 'business.affynix.com', label: 'Business', rel: 'related' },
      { domain: 'money.affynix.com', label: 'Money', rel: 'related' },
      { domain: 'lifestyle.affynix.com', label: 'Lifestyle', rel: 'related' }
    ]
  },
  
  'lifestyle.affynix.com': {
    slug: 'lifestyle',
    name: 'Lifestyle',
    title: 'Lifestyle Mastery & Personal Development',
    tagline: 'Elevate every aspect of your life with expert guidance',
    
    theme: {
      primary: '#2C5F2E',
      secondary: '#3A7D3E',
      accent: '#C9A961',
      gradient: 'linear-gradient(135deg, #2C5F2E 0%, #3A7D3E 100%)',
      heroGradient: 'linear-gradient(135deg, rgba(44,95,46,0.95) 0%, rgba(58,125,62,0.95) 100%)'
    },
    
    seo: {
      metaTitle: 'Lifestyle Mastery - Relationships, Travel & Personal Development | Affynix',
      metaDescription: 'Master dating, relationships, travel, and personal development. Curated lifestyle solutions for relationship success and life enhancement.',
      keywords: [
        'dating advice',
        'relationship coaching',
        'travel guides',
        'personal development',
        'lifestyle optimization',
        'social skills',
        'self improvement'
      ],
      ogImage: '/logo/logo1.svg',
      twitterCard: 'summary_large_image',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Lifestyle Mastery',
        description: 'Relationship, travel, and personal development resources'
      }
    },
    
    categories: [
      'All',
      'Dating & Relationships',
      'Travel & Adventure',
      'Personal Development',
      'Social Skills'
    ],
    
    productSource: 'https://api.affynix.com/api/products',
    
    analytics: {
      cloudfilt: { enabled: true, siteId: 'lifestyle-affynix' },
      charla: { enabled: true, widgetId: 'lifestyle-widget' },
      clickrank: { enabled: true, domain: 'lifestyle.affynix.com' }
    },
    
    networkLinks: [
      { domain: 'affynix.com', label: 'Affynix Network', rel: 'home' },
      { domain: 'business.affynix.com', label: 'Business', rel: 'related' },
      { domain: 'money.affynix.com', label: 'Money', rel: 'related' },
      { domain: 'health.affynix.com', label: 'Health', rel: 'related' }
    ]
  },
  
  'tech.affynix.com': {
    slug: 'tech',
    name: 'Tech',
    title: 'Technology & Innovation Solutions',
    tagline: 'Cutting-edge tech tools and training for digital transformation',
    
    theme: {
      primary: '#1E3A8A',
      secondary: '#3B82F6',
      accent: '#C9A961',
      gradient: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
      heroGradient: 'linear-gradient(135deg, rgba(30,58,138,0.95) 0%, rgba(59,130,246,0.95) 100%)'
    },
    
    seo: {
      metaTitle: 'Technology & Innovation Solutions - AI, Coding & Digital Tools | Affynix',
      metaDescription: 'Master cutting-edge technology with expert-curated tools and training. AI, coding, cybersecurity, and digital innovation solutions.',
      keywords: [
        'artificial intelligence',
        'programming courses',
        'cybersecurity training',
        'cloud computing',
        'data science',
        'web development',
        'mobile app development'
      ],
      ogImage: '/logo/logo1.svg',
      twitterCard: 'summary_large_image',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Technology & Innovation Solutions',
        description: 'Technology training and digital tools'
      }
    },
    
    categories: [
      'All',
      'Artificial Intelligence',
      'Programming & Development',
      'Cybersecurity',
      'Cloud Computing'
    ],
    
    productSource: 'https://api.affynix.com/api/products',
    
    analytics: {
      cloudfilt: { enabled: true, siteId: 'tech-affynix' },
      charla: { enabled: true, widgetId: 'tech-widget' },
      clickrank: { enabled: true, domain: 'tech.affynix.com' }
    },
    
    networkLinks: [
      { domain: 'affynix.com', label: 'Affynix Network', rel: 'home' },
      { domain: 'business.affynix.com', label: 'Business', rel: 'related' },
      { domain: 'money.affynix.com', label: 'Money', rel: 'related' },
      { domain: 'health.affynix.com', label: 'Health', rel: 'related' }
    ]
  },
  
  'home.affynix.com': {
    slug: 'home',
    name: 'Home',
    title: 'Home & Garden Solutions',
    tagline: 'Transform your living space with expert home improvement and gardening solutions',
    
    theme: {
      primary: '#7C2D12',
      secondary: '#9A3412',
      accent: '#C9A961',
      gradient: 'linear-gradient(135deg, #7C2D12 0%, #9A3412 100%)',
      heroGradient: 'linear-gradient(135deg, rgba(124,45,18,0.95) 0%, rgba(154,52,18,0.95) 100%)'
    },
    
    seo: {
      metaTitle: 'Home & Garden Solutions - DIY, Interior Design & Landscaping | Affynix',
      metaDescription: 'Transform your home and garden with expert DIY guides, interior design tools, and landscaping solutions. Create your dream living space.',
      keywords: [
        'home improvement',
        'interior design',
        'gardening tools',
        'DIY projects',
        'landscaping',
        'home decor',
        'outdoor living'
      ],
      ogImage: '/images/home-og.jpg',
      twitterCard: 'summary_large_image',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Home & Garden Solutions',
        description: 'Home improvement and gardening resources'
      }
    },
    
    categories: [
      'All',
      'Interior Design',
      'Gardening & Landscaping',
      'DIY Projects',
      'Home Organization'
    ],
    
    productSource: '/data/home-products.json',
    
    analytics: {
      cloudfilt: { enabled: true, siteId: 'home-affynix' },
      charla: { enabled: true, widgetId: 'home-widget' },
      clickrank: { enabled: true, domain: 'home.affynix.com' }
    },
    
    networkLinks: [
      { domain: 'affynix.com', label: 'Affynix Network', rel: 'home' },
      { domain: 'lifestyle.affynix.com', label: 'Lifestyle', rel: 'related' },
      { domain: 'health.affynix.com', label: 'Health', rel: 'related' },
      { domain: 'business.affynix.com', label: 'Business', rel: 'related' }
    ]
  },
  
  'relationships.affynix.com': {
    slug: 'relationships',
    name: 'Relationships',
    title: 'Dating & Relationship Mastery',
    tagline: 'Psychology-backed training for attraction, communication, and lasting connections',
    
    theme: {
      primary: '#6B2C5C',
      secondary: '#8B3D7C',
      accent: '#C9A961',
      gradient: 'linear-gradient(135deg, #6B2C5C 0%, #8B3D7C 100%)',
      heroGradient: 'linear-gradient(135deg, rgba(107,44,92,0.95) 0%, rgba(139,61,124,0.95) 100%)'
    },
    
    seo: {
      metaTitle: 'Dating & Relationship Mastery - Attraction & Communication Training | Affynix',
      metaDescription: 'Master dating and relationships with psychology-backed training. Attraction, communication, and connection strategies for lasting relationships.',
      keywords: [
        'dating advice',
        'relationship coaching',
        'attraction psychology',
        'communication skills',
        'social confidence',
        'relationship building',
        'dating strategies'
      ],
      ogImage: '/images/relationships-og.jpg',
      twitterCard: 'summary_large_image',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Dating & Relationship Mastery',
        description: 'Dating and relationship training resources'
      }
    },
    
    categories: [
      'All',
      'Dating & Attraction',
      'Communication Skills',
      'Social Confidence',
      'Relationship Building'
    ],
    
    productSource: '/data/relationships-products.json',
    
    analytics: {
      cloudfilt: { enabled: true, siteId: 'relationships-affynix' },
      charla: { enabled: true, widgetId: 'relationships-widget' },
      clickrank: { enabled: true, domain: 'relationships.affynix.com' }
    },
    
    networkLinks: [
      { domain: 'affynix.com', label: 'Affynix Network', rel: 'home' },
      { domain: 'lifestyle.affynix.com', label: 'Lifestyle', rel: 'related' },
      { domain: 'health.affynix.com', label: 'Health', rel: 'related' },
      { domain: 'business.affynix.com', label: 'Business', rel: 'related' }
    ]
  },
  
  'food.affynix.com': {
    slug: 'food',
    name: 'Food',
    title: 'Culinary Mastery & Nutrition',
    tagline: 'Cooking techniques, recipes, and specialized diet programs for optimal health',
    
    theme: {
      primary: '#7C3E2C',
      secondary: '#9B5A3F',
      accent: '#C9A961',
      gradient: 'linear-gradient(135deg, #7C3E2C 0%, #9B5A3F 100%)',
      heroGradient: 'linear-gradient(135deg, rgba(124,62,44,0.95) 0%, rgba(155,90,63,0.95) 100%)'
    },
    
    seo: {
      metaTitle: 'Culinary Mastery & Nutrition - Cooking & Diet Programs | Affynix',
      metaDescription: 'Master cooking and nutrition with expert culinary training, specialized diet programs, and healthy recipe collections.',
      keywords: [
        'cooking courses',
        'culinary training',
        'nutrition programs',
        'specialized diets',
        'meal planning',
        'recipe collections',
        'healthy cooking'
      ],
      ogImage: '/images/food-og.jpg',
      twitterCard: 'summary_large_image',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Culinary Mastery & Nutrition',
        description: 'Cooking and nutrition training resources'
      }
    },
    
    categories: [
      'All',
      'Cooking & Recipes',
      'Specialized Diets',
      'Meal Planning',
      'Nutrition Science'
    ],
    
    productSource: '/data/food-products.json',
    
    analytics: {
      cloudfilt: { enabled: true, siteId: 'food-affynix' },
      charla: { enabled: true, widgetId: 'food-widget' },
      clickrank: { enabled: true, domain: 'food.affynix.com' }
    },
    
    networkLinks: [
      { domain: 'affynix.com', label: 'Affynix Network', rel: 'home' },
      { domain: 'health.affynix.com', label: 'Health', rel: 'related' },
      { domain: 'lifestyle.affynix.com', label: 'Lifestyle', rel: 'related' },
      { domain: 'home.affynix.com', label: 'Home', rel: 'related' }
    ]
  },
  
  'outdoors.affynix.com': {
    slug: 'outdoors',
    name: 'Outdoors',
    title: 'Adventure & Survival Training',
    tagline: 'Skills and gear for camping, hiking, and wilderness survival',
    
    theme: {
      primary: '#2C5F2E',
      secondary: '#3A7D3E',
      accent: '#C9A961',
      gradient: 'linear-gradient(135deg, #2C5F2E 0%, #3A7D3E 100%)',
      heroGradient: 'linear-gradient(135deg, rgba(44,95,46,0.95) 0%, rgba(58,125,62,0.95) 100%)'
    },
    
    seo: {
      metaTitle: 'Adventure & Survival Training - Camping, Hiking & Wilderness Skills | Affynix',
      metaDescription: 'Master outdoor skills with expert survival training, camping guides, and wilderness adventure programs.',
      keywords: [
        'survival training',
        'camping guides',
        'hiking skills',
        'wilderness survival',
        'outdoor gear',
        'adventure sports',
        'bushcraft'
      ],
      ogImage: '/images/outdoors-og.jpg',
      twitterCard: 'summary_large_image',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Adventure & Survival Training',
        description: 'Outdoor skills and survival training resources'
      }
    },
    
    categories: [
      'All',
      'Camping & Hiking',
      'Survival Skills',
      'Outdoor Equipment',
      'Adventure Sports'
    ],
    
    productSource: '/data/outdoors-products.json',
    
    analytics: {
      cloudfilt: { enabled: true, siteId: 'outdoors-affynix' },
      charla: { enabled: true, widgetId: 'outdoors-widget' },
      clickrank: { enabled: true, domain: 'outdoors.affynix.com' }
    },
    
    networkLinks: [
      { domain: 'affynix.com', label: 'Affynix Network', rel: 'home' },
      { domain: 'health.affynix.com', label: 'Health', rel: 'related' },
      { domain: 'lifestyle.affynix.com', label: 'Lifestyle', rel: 'related' },
      { domain: 'travel.affynix.com', label: 'Travel', rel: 'related' }
    ]
  },
  
  'travel.affynix.com': {
    slug: 'travel',
    name: 'Travel',
    title: 'Travel Mastery & Adventure',
    tagline: 'Guides, strategies, and resources for exceptional travel experiences',
    
    theme: {
      primary: '#1E3A5F',
      secondary: '#2E5A8F',
      accent: '#C9A961',
      gradient: 'linear-gradient(135deg, #1E3A5F 0%, #2E5A8F 100%)',
      heroGradient: 'linear-gradient(135deg, rgba(30,58,95,0.95) 0%, rgba(46,90,143,0.95) 100%)'
    },
    
    seo: {
      metaTitle: 'Travel Mastery & Adventure - Travel Hacking & Destination Guides | Affynix',
      metaDescription: 'Master travel with expert guides, travel hacking strategies, and destination recommendations for unforgettable adventures.',
      keywords: [
        'travel hacking',
        'destination guides',
        'travel planning',
        'adventure travel',
        'budget travel',
        'travel photography',
        'cultural experiences'
      ],
      ogImage: '/images/travel-og.jpg',
      twitterCard: 'summary_large_image',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Travel Mastery & Adventure',
        description: 'Travel guides and adventure resources'
      }
    },
    
    categories: [
      'All',
      'Travel Planning',
      'Travel Hacking',
      'Destination Guides',
      'Adventure Travel'
    ],
    
    productSource: '/data/travel-products.json',
    
    analytics: {
      cloudfilt: { enabled: true, siteId: 'travel-affynix' },
      charla: { enabled: true, widgetId: 'travel-widget' },
      clickrank: { enabled: true, domain: 'travel.affynix.com' }
    },
    
    networkLinks: [
      { domain: 'affynix.com', label: 'Affynix Network', rel: 'home' },
      { domain: 'lifestyle.affynix.com', label: 'Lifestyle', rel: 'related' },
      { domain: 'outdoors.affynix.com', label: 'Outdoors', rel: 'related' },
      { domain: 'money.affynix.com', label: 'Money', rel: 'related' }
    ]
  },

  'leads.affynix.com': {
    slug: 'leads',
    name: 'Leads',
    title: 'Lead Generation Solutions',
    tagline: 'High-converting lead generation tools and strategies',
    theme: {
      primary: '#553C9A',
      secondary: '#6B46C1',
      accent: '#C9A961',
      gradient: 'linear-gradient(135deg, #553C9A 0%, #6B46C1 100%)',
      heroGradient: 'linear-gradient(135deg, rgba(85,60,154,0.95) 0%, rgba(107,70,193,0.95) 100%)'
    },
    seo: {
      metaTitle: 'Lead Generation Solutions - High-Converting Tools & Strategies | Affynix',
      metaDescription: 'Discover powerful lead generation tools, email marketing software, and conversion optimization strategies. Boost your business with quality leads.',
      keywords: [
        'lead generation',
        'email marketing',
        'conversion optimization',
        'lead magnets',
        'sales funnels',
        'marketing automation',
        'lead nurturing'
      ],
      ogImage: '/images/leads-og.jpg',
      twitterCard: 'summary_large_image',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Lead Generation Solutions',
        description: 'High-converting lead generation tools and strategies',
        provider: {
          '@type': 'Organization',
          name: 'Affynix',
          url: 'https://affynix.com'
        }
      }
    },
    categories: [
      'All',
      'Email Marketing',
      'Lead Magnets',
      'Sales Funnels',
      'Marketing Automation'
    ],
    productSource: 'https://api.affynix.com/api/products',
    analytics: {
      cloudfilt: { enabled: true, siteId: 'leads-affynix' },
      charla: { enabled: true, widgetId: 'leads-widget' },
      clickrank: { enabled: true, domain: 'leads.affynix.com' }
    },
    networkLinks: [
      { domain: 'affynix.com', label: 'Affynix Network', rel: 'home' },
      { domain: 'ai.affynix.com', label: 'AI', rel: 'related' },
      { domain: 'email.affynix.com', label: 'Email', rel: 'related' },
      { domain: 'data.affynix.com', label: 'Data', rel: 'related' }
    ]
  },

  'edu.affynix.com': {
    slug: 'edu',
    name: 'Education',
    title: 'Educational Solutions',
    tagline: 'Transform learning with cutting-edge educational tools and courses',
    theme: {
      primary: '#1E40AF',
      secondary: '#3B82F6',
      accent: '#C9A961',
      gradient: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
      heroGradient: 'linear-gradient(135deg, rgba(30,64,175,0.95) 0%, rgba(59,130,246,0.95) 100%)'
    },
    seo: {
      metaTitle: 'Educational Solutions - Transform Learning with Cutting-Edge Tools | Affynix',
      metaDescription: 'Discover powerful educational tools, online courses, and learning management systems. Enhance education with innovative technology solutions.',
      keywords: [
        'online education',
        'learning management',
        'educational technology',
        'online courses',
        'student tools',
        'teaching resources',
        'e-learning platforms'
      ],
      ogImage: '/images/edu-og.jpg',
      twitterCard: 'summary_large_image',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Educational Solutions',
        description: 'Transform learning with cutting-edge educational tools and courses',
        provider: {
          '@type': 'Organization',
          name: 'Affynix',
          url: 'https://affynix.com'
        }
      }
    },
    categories: [
      'All',
      'Online Courses',
      'Learning Management',
      'Educational Technology',
      'Student Tools'
    ],
    productSource: 'https://api.affynix.com/api/products',
    analytics: {
      cloudfilt: { enabled: true, siteId: 'edu-affynix' },
      charla: { enabled: true, widgetId: 'edu-widget' },
      clickrank: { enabled: true, domain: 'edu.affynix.com' }
    },
    networkLinks: [
      { domain: 'affynix.com', label: 'Affynix Network', rel: 'home' },
      { domain: 'ai.affynix.com', label: 'AI', rel: 'related' },
      { domain: 'email.affynix.com', label: 'Email', rel: 'related' },
      { domain: 'data.affynix.com', label: 'Data', rel: 'related' }
    ]
  },

  'sports.affynix.com': {
    slug: 'sports',
    name: 'Sports',
    title: 'Sports & Fitness Solutions',
    tagline: 'Elevate your athletic performance with premium sports tools and training',
    theme: {
      primary: '#DC2626',
      secondary: '#EF4444',
      accent: '#C9A961',
      gradient: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
      heroGradient: 'linear-gradient(135deg, rgba(220,38,38,0.95) 0%, rgba(239,68,68,0.95) 100%)'
    },
    seo: {
      metaTitle: 'Sports & Fitness Solutions - Elevate Athletic Performance | Affynix',
      metaDescription: 'Discover premium sports equipment, fitness training programs, and athletic performance tools. Achieve your fitness goals with professional solutions.',
      keywords: [
        'sports equipment',
        'fitness training',
        'athletic performance',
        'sports nutrition',
        'workout programs',
        'sports technology',
        'fitness tracking'
      ],
      ogImage: '/images/sports-og.jpg',
      twitterCard: 'summary_large_image',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Sports & Fitness Solutions',
        description: 'Elevate your athletic performance with premium sports tools and training',
        provider: {
          '@type': 'Organization',
          name: 'Affynix',
          url: 'https://affynix.com'
        }
      }
    },
    categories: [
      'All',
      'Fitness Equipment',
      'Training Programs',
      'Sports Nutrition',
      'Athletic Performance'
    ],
    productSource: 'https://api.affynix.com/api/products',
    analytics: {
      cloudfilt: { enabled: true, siteId: 'sports-affynix' },
      charla: { enabled: true, widgetId: 'sports-widget' },
      clickrank: { enabled: true, domain: 'sports.affynix.com' }
    },
    networkLinks: [
      { domain: 'affynix.com', label: 'Affynix Network', rel: 'home' },
      { domain: 'ai.affynix.com', label: 'AI', rel: 'related' },
      { domain: 'email.affynix.com', label: 'Email', rel: 'related' },
      { domain: 'data.affynix.com', label: 'Data', rel: 'related' }
    ]
  }
};

/**
 * Domain Detection & Configuration Retrieval
 * Detects current domain and returns corresponding configuration
 */
export function getDomainConfig(hostname) {
  // If hostname provided directly (for testing or explicit calls)
  if (hostname && DOMAIN_CONFIGS[hostname]) {
    return DOMAIN_CONFIGS[hostname];
  }
  
  // Server-side detection
  if (typeof window === 'undefined') {
    // This will be called from components that already have headers
    const domain = hostname || 'business.affynix.com';
    return DOMAIN_CONFIGS[domain] || DOMAIN_CONFIGS['business.affynix.com'];
  }
  
  // Client-side detection
  const domain = window.location.hostname;
  return DOMAIN_CONFIGS[domain] || DOMAIN_CONFIGS['business.affynix.com'];
}

/**
 * Get all domains for cross-linking
 */
export function getAllDomains() {
  return Object.keys(DOMAIN_CONFIGS);
}

/**
 * Get network authority score for domain
 * Used in SEO network calculations
 */
export function getDomainAuthority(domain) {
  const baseScores = {
    'affynix.com': 95,
    'business.affynix.com': 88,
    'money.affynix.com': 88,
    'health.affynix.com': 88,
    'lifestyle.affynix.com': 88,
    'tech.affynix.com': 88,
    'home.affynix.com': 88,
    'relationships.affynix.com': 88,
    'food.affynix.com': 88,
    'outdoors.affynix.com': 88,
    'travel.affynix.com': 88,
    'leads.affynix.com': 88,
    'edu.affynix.com': 88,
    'sports.affynix.com': 88
  };
  
  return baseScores[domain] || 80;
}
