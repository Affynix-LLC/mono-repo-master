/**
 * CENTRALIZED PRODUCT DATA API
 * Serves products for all subdomains from data.affynix.com
 */

// Centralized product database
const PRODUCTS_DATABASE = {
  'business.affynix.com': [
    {
      id: 'biz001',
      name: 'Social Media Mastery Suite',
      price: 297,
      recurring: false,
      category: 'Digital Marketing',
      affiliateLink: 'https://example.com/socialmedia#checkout',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400',
      description: 'Complete social media automation and analytics platform for business growth.',
      features: ['Multi-platform scheduling', 'Advanced analytics', 'AI content generation', 'Team collaboration'],
      skillLevel: 'Beginner',
      timeInvestment: '30 min/day',
      platform: 'Web + Mobile App',
      tags: ['social media', 'automation', 'analytics'],
      rating: 4.8,
      reviews: 1247
    },
    {
      id: 'biz002',
      name: 'SEO Domination Toolkit',
      price: 197,
      recurring: true,
      recurringPeriod: 'monthly',
      category: 'Digital Marketing',
      affiliateLink: 'https://example.com/seo#checkout',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
      description: 'Professional SEO tools and training for search engine dominance.',
      features: ['Keyword research', 'Backlink analysis', 'Rank tracking', 'Competitor insights'],
      skillLevel: 'Intermediate',
      timeInvestment: '1 hour/day',
      platform: 'Web Dashboard',
      tags: ['SEO', 'marketing', 'analytics'],
      rating: 4.9,
      reviews: 892
    },
    {
      id: 'biz003',
      name: 'Business Leadership Academy',
      price: 997,
      recurring: true,
      recurringPeriod: 'annual',
      category: 'Business Development',
      affiliateLink: 'https://example.com/leadership#checkout',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
      description: 'Transform into a visionary leader with strategic business training.',
      features: ['Leadership frameworks', 'Team management', 'Strategic planning', 'Executive coaching'],
      skillLevel: 'Advanced',
      timeInvestment: '5 hours/week',
      platform: 'Online Platform + Live Sessions',
      tags: ['leadership', 'management', 'strategy'],
      rating: 4.7,
      reviews: 456
    }
  ],
  
  'money.affynix.com': [
    {
      id: 'money001',
      name: 'Investment Mastery Course',
      price: 497,
      recurring: false,
      category: 'Investing',
      affiliateLink: 'https://example.com/investing#checkout',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
      description: 'Learn to build wealth through smart investment strategies.',
      features: ['Portfolio management', 'Risk assessment', 'Market analysis', 'Tax optimization'],
      skillLevel: 'Intermediate',
      timeInvestment: '2 hours/week',
      platform: 'Online Course + Tools',
      tags: ['investing', 'wealth', 'finance'],
      rating: 4.8,
      reviews: 2341
    },
    {
      id: 'money002',
      name: 'Cryptocurrency Trading Pro',
      price: 297,
      recurring: true,
      recurringPeriod: 'monthly',
      category: 'Crypto',
      affiliateLink: 'https://example.com/crypto#checkout',
      image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400',
      description: 'Master cryptocurrency trading with professional tools and strategies.',
      features: ['Trading signals', 'Portfolio tracking', 'Risk management', 'Market alerts'],
      skillLevel: 'Advanced',
      timeInvestment: '1 hour/day',
      platform: 'Trading Platform',
      tags: ['crypto', 'trading', 'blockchain'],
      rating: 4.6,
      reviews: 1876
    }
  ],
  
  'health.affynix.com': [
    {
      id: 'health001',
      name: 'Fitness Transformation Program',
      price: 197,
      recurring: true,
      recurringPeriod: 'monthly',
      category: 'Fitness',
      affiliateLink: 'https://example.com/fitness#checkout',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      description: 'Complete fitness program with personalized workout plans.',
      features: ['Custom workouts', 'Nutrition plans', 'Progress tracking', 'Expert coaching'],
      skillLevel: 'All Levels',
      timeInvestment: '45 min/day',
      platform: 'Mobile App + Web',
      tags: ['fitness', 'workout', 'nutrition'],
      rating: 4.9,
      reviews: 3421
    },
    {
      id: 'health002',
      name: 'Mental Wellness Toolkit',
      price: 147,
      recurring: false,
      category: 'Mental Health',
      affiliateLink: 'https://example.com/wellness#checkout',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      description: 'Comprehensive mental health and wellness resources.',
      features: ['Meditation guides', 'Stress management', 'Sleep optimization', 'Mindfulness training'],
      skillLevel: 'Beginner',
      timeInvestment: '20 min/day',
      platform: 'Mobile App',
      tags: ['mental health', 'wellness', 'meditation'],
      rating: 4.7,
      reviews: 2156
    }
  ],
  
  'tech.affynix.com': [
    {
      id: 'tech001',
      name: 'AI Development Bootcamp',
      price: 997,
      recurring: false,
      category: 'Programming',
      affiliateLink: 'https://example.com/ai-bootcamp#checkout',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
      description: 'Learn AI and machine learning from scratch to advanced level.',
      features: ['Python programming', 'ML algorithms', 'Deep learning', 'Project portfolio'],
      skillLevel: 'Intermediate',
      timeInvestment: '10 hours/week',
      platform: 'Online Learning + Labs',
      tags: ['AI', 'programming', 'machine learning'],
      rating: 4.8,
      reviews: 1234
    },
    {
      id: 'tech002',
      name: 'Cloud Infrastructure Pro',
      price: 397,
      recurring: true,
      recurringPeriod: 'monthly',
      category: 'DevOps',
      affiliateLink: 'https://example.com/cloud#checkout',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
      description: 'Master cloud computing and infrastructure management.',
      features: ['AWS/Azure training', 'Containerization', 'CI/CD pipelines', 'Monitoring tools'],
      skillLevel: 'Advanced',
      timeInvestment: '5 hours/week',
      platform: 'Cloud Labs + Certification',
      tags: ['cloud', 'devops', 'infrastructure'],
      rating: 4.9,
      reviews: 987
    }
  ],
  
  'lifestyle.affynix.com': [
    {
      id: 'life001',
      name: 'Minimalist Living Guide',
      price: 97,
      recurring: false,
      category: 'Lifestyle',
      affiliateLink: 'https://example.com/minimalist#checkout',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      description: 'Transform your life with minimalist principles and practices.',
      features: ['Decluttering methods', 'Mindful consumption', 'Space optimization', 'Life balance'],
      skillLevel: 'Beginner',
      timeInvestment: '30 min/day',
      platform: 'E-book + Worksheets',
      tags: ['minimalism', 'lifestyle', 'organization'],
      rating: 4.6,
      reviews: 1876
    }
  ],

  'leads.affynix.com': [
    {
      id: 'leads001',
      name: 'Lead Magnet Mastery',
      price: 297,
      recurring: false,
      category: 'Lead Magnets',
      affiliateLink: 'https://example.com/lead-magnets#checkout',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400',
      description: 'Create irresistible lead magnets that convert visitors into customers.',
      features: ['Lead magnet templates', 'Conversion optimization', 'Email sequences', 'A/B testing'],
      skillLevel: 'Intermediate',
      timeInvestment: '2 hours/week',
      platform: 'Online Course + Templates',
      tags: ['lead generation', 'conversion', 'email marketing'],
      rating: 4.8,
      reviews: 1234
    },
    {
      id: 'leads002',
      name: 'Email Marketing Automation Pro',
      price: 197,
      recurring: true,
      recurringPeriod: 'monthly',
      category: 'Email Marketing',
      affiliateLink: 'https://example.com/email-automation#checkout',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
      description: 'Automate your email marketing with powerful sequences and segmentation.',
      features: ['Email sequences', 'Segmentation tools', 'Analytics dashboard', 'Template library'],
      skillLevel: 'Beginner',
      timeInvestment: '1 hour/week',
      platform: 'Web Dashboard',
      tags: ['email marketing', 'automation', 'segmentation'],
      rating: 4.7,
      reviews: 2156
    }
  ],

  'edu.affynix.com': [
    {
      id: 'edu001',
      name: 'Online Course Creation Mastery',
      price: 497,
      recurring: false,
      category: 'Online Courses',
      affiliateLink: 'https://example.com/course-creation#checkout',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
      description: 'Build and launch profitable online courses from scratch.',
      features: ['Course structure templates', 'Video production guides', 'Marketing strategies', 'Platform setup'],
      skillLevel: 'Intermediate',
      timeInvestment: '5 hours/week',
      platform: 'Online Platform + Resources',
      tags: ['online courses', 'education', 'teaching'],
      rating: 4.9,
      reviews: 3421
    },
    {
      id: 'edu002',
      name: 'Learning Management System Pro',
      price: 297,
      recurring: true,
      recurringPeriod: 'monthly',
      category: 'Learning Management',
      affiliateLink: 'https://example.com/lms#checkout',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
      description: 'Complete learning management system for educational institutions.',
      features: ['Student tracking', 'Assignment management', 'Grade book', 'Communication tools'],
      skillLevel: 'Advanced',
      timeInvestment: '3 hours/week',
      platform: 'Web Application',
      tags: ['LMS', 'education', 'management'],
      rating: 4.6,
      reviews: 1876
    }
  ],

  'sports.affynix.com': [
    {
      id: 'sports001',
      name: 'Elite Athlete Training Program',
      price: 397,
      recurring: false,
      category: 'Training Programs',
      affiliateLink: 'https://example.com/athlete-training#checkout',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      description: 'Professional training program for elite athletes and serious fitness enthusiasts.',
      features: ['Custom workout plans', 'Nutrition guidance', 'Performance tracking', 'Expert coaching'],
      skillLevel: 'Advanced',
      timeInvestment: '2 hours/day',
      platform: 'Mobile App + Web',
      tags: ['athletics', 'training', 'performance'],
      rating: 4.8,
      reviews: 2341
    },
    {
      id: 'sports002',
      name: 'Sports Nutrition Mastery',
      price: 197,
      recurring: false,
      category: 'Sports Nutrition',
      affiliateLink: 'https://example.com/sports-nutrition#checkout',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
      description: 'Optimize your athletic performance with science-based nutrition strategies.',
      features: ['Meal planning', 'Supplement guides', 'Hydration strategies', 'Recovery protocols'],
      skillLevel: 'Intermediate',
      timeInvestment: '30 min/day',
      platform: 'E-book + Meal Plans',
      tags: ['nutrition', 'sports', 'performance'],
      rating: 4.7,
      reviews: 1876
    }
  ]
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain') || 'business.affynix.com';
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    // Get products for the domain
    let products = PRODUCTS_DATABASE[domain] || [];
    
    // Filter by category if specified
    if (category && category !== 'All') {
      products = products.filter(product => product.category === category);
    }
    
    // Filter by search term if specified
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Add metadata
    const response = {
      domain,
      totalProducts: products.length,
      categories: [...new Set(products.map(p => p.category))],
      products
    };
    
    return Response.json(response, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'public, max-age=300' // 5 minute cache
      }
    });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return Response.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
