/**
 * SAMPLE PRODUCTS DATA MODULE
 * Provides fallback product data for each domain when API is unavailable
 */

const SAMPLE_PRODUCTS = {
  business: [
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
      platform: 'Web + Mobile App'
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
      platform: 'Web Dashboard'
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
      platform: 'Online Platform + Live Sessions'
    }
  ],

  money: [
    {
      id: 'money001',
      name: 'Stock Trading Mastery',
      price: 497,
      recurring: false,
      category: 'Investing & Trading',
      affiliateLink: 'https://example.com/stocktrading#checkout',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
      description: 'Complete stock trading course with proven strategies and real-time analysis.',
      features: ['Technical analysis', 'Risk management', 'Portfolio optimization', 'Live trading sessions'],
      skillLevel: 'Intermediate',
      timeInvestment: '2 hours/day',
      platform: 'Online Platform'
    },
    {
      id: 'money002',
      name: 'Real Estate Investment Blueprint',
      price: 697,
      recurring: false,
      category: 'Real Estate',
      affiliateLink: 'https://example.com/realestate#checkout',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400',
      description: 'Complete guide to building wealth through real estate investments.',
      features: ['Market analysis', 'Property evaluation', 'Financing strategies', 'Portfolio building'],
      skillLevel: 'Beginner',
      timeInvestment: '3 hours/week',
      platform: 'Online Course + Tools'
    }
  ],

  health: [
    {
      id: 'health001',
      name: 'Fitness Transformation Program',
      price: 197,
      recurring: false,
      category: 'Fitness & Training',
      affiliateLink: 'https://example.com/fitness#checkout',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      description: 'Complete fitness program with nutrition guides and workout plans.',
      features: ['Custom workout plans', 'Nutrition guides', 'Progress tracking', 'Expert coaching'],
      skillLevel: 'Beginner',
      timeInvestment: '45 min/day',
      platform: 'Mobile App'
    },
    {
      id: 'health002',
      name: 'Mental Wellness Mastery',
      price: 297,
      recurring: true,
      recurringPeriod: 'monthly',
      category: 'Mental Wellness',
      affiliateLink: 'https://example.com/mentalwellness#checkout',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      description: 'Comprehensive mental health and wellness program for optimal living.',
      features: ['Meditation guides', 'Stress management', 'Sleep optimization', 'Mindfulness training'],
      skillLevel: 'Beginner',
      timeInvestment: '20 min/day',
      platform: 'Mobile App + Web'
    }
  ],

  tech: [
    {
      id: 'tech001',
      name: 'AI Development Bootcamp',
      price: 997,
      recurring: false,
      category: 'Artificial Intelligence',
      affiliateLink: 'https://example.com/aibootcamp#checkout',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
      description: 'Complete AI development course covering machine learning and neural networks.',
      features: ['Python programming', 'TensorFlow mastery', 'Project portfolio', 'Industry mentorship'],
      skillLevel: 'Intermediate',
      timeInvestment: '10 hours/week',
      platform: 'Online Platform'
    },
    {
      id: 'tech002',
      name: 'Cybersecurity Essentials',
      price: 497,
      recurring: false,
      category: 'Cybersecurity',
      affiliateLink: 'https://example.com/cybersecurity#checkout',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
      description: 'Professional cybersecurity training for modern digital threats.',
      features: ['Ethical hacking', 'Network security', 'Incident response', 'Certification prep'],
      skillLevel: 'Beginner',
      timeInvestment: '5 hours/week',
      platform: 'Online Lab + Tools'
    }
  ],

  lifestyle: [
    {
      id: 'lifestyle001',
      name: 'Personal Development Mastery',
      price: 397,
      recurring: false,
      category: 'Personal Development',
      affiliateLink: 'https://example.com/personaldev#checkout',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      description: 'Transform your life with comprehensive personal development strategies.',
      features: ['Goal setting', 'Habit formation', 'Time management', 'Life coaching'],
      skillLevel: 'Beginner',
      timeInvestment: '30 min/day',
      platform: 'Online Course + App'
    }
  ],

  relationships: [
    {
      id: 'rel001',
      name: 'Dating Confidence Mastery',
      price: 297,
      recurring: false,
      category: 'Dating & Attraction',
      affiliateLink: 'https://example.com/dating#checkout',
      image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400',
      description: 'Psychology-backed dating strategies for confident connections.',
      features: ['Conversation skills', 'Body language', 'Online dating', 'Relationship building'],
      skillLevel: 'Beginner',
      timeInvestment: '1 hour/week',
      platform: 'Online Course + Community'
    }
  ],

  home: [
    {
      id: 'home001',
      name: 'DIY Home Renovation Guide',
      price: 197,
      recurring: false,
      category: 'Home Improvement',
      affiliateLink: 'https://example.com/homereno#checkout',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      description: 'Complete guide to home renovation and improvement projects.',
      features: ['Step-by-step guides', 'Tool recommendations', 'Budget planning', 'Safety protocols'],
      skillLevel: 'Beginner',
      timeInvestment: '2 hours/week',
      platform: 'Online Course + PDFs'
    }
  ],

  food: [
    {
      id: 'food001',
      name: 'Culinary Arts Mastery',
      price: 297,
      recurring: false,
      category: 'Cooking & Recipes',
      affiliateLink: 'https://example.com/culinary#checkout',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      description: 'Professional cooking techniques and recipe development course.',
      features: ['Knife skills', 'Cooking methods', 'Recipe creation', 'Menu planning'],
      skillLevel: 'Beginner',
      timeInvestment: '1 hour/day',
      platform: 'Video Course + Cookbook'
    }
  ],

  outdoors: [
    {
      id: 'outdoors001',
      name: 'Wilderness Survival Training',
      price: 397,
      recurring: false,
      category: 'Survival Skills',
      affiliateLink: 'https://example.com/survival#checkout',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
      description: 'Complete wilderness survival and outdoor skills training program.',
      features: ['Shelter building', 'Fire making', 'Water purification', 'Navigation'],
      skillLevel: 'Beginner',
      timeInvestment: '3 hours/week',
      platform: 'Online Course + Field Guide'
    }
  ],

  travel: [
    {
      id: 'travel001',
      name: 'Travel Hacking Mastery',
      price: 197,
      recurring: false,
      category: 'Travel Hacking',
      affiliateLink: 'https://example.com/travelhack#checkout',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400',
      description: 'Master the art of travel hacking for free and discounted travel.',
      features: ['Points strategies', 'Credit card optimization', 'Booking techniques', 'Destination guides'],
      skillLevel: 'Beginner',
      timeInvestment: '2 hours/week',
      platform: 'Online Course + Tools'
    }
  ],

  leads: [
    {
      id: 'leads001',
      name: 'Lead Generation Mastery',
      price: 497,
      recurring: false,
      category: 'Lead Magnets',
      affiliateLink: 'https://example.com/leadgen#checkout',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
      description: 'Complete lead generation system for high-converting campaigns.',
      features: ['Lead magnets', 'Email sequences', 'Landing pages', 'Analytics'],
      skillLevel: 'Intermediate',
      timeInvestment: '5 hours/week',
      platform: 'Online Course + Templates'
    }
  ],

  edu: [
    {
      id: 'edu001',
      name: 'Online Teaching Mastery',
      price: 397,
      recurring: false,
      category: 'Educational Technology',
      affiliateLink: 'https://example.com/onlineteaching#checkout',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
      description: 'Complete guide to creating and selling online courses.',
      features: ['Course creation', 'Video production', 'Student engagement', 'Marketing strategies'],
      skillLevel: 'Beginner',
      timeInvestment: '4 hours/week',
      platform: 'Online Course + Tools'
    }
  ],

  sports: [
    {
      id: 'sports001',
      name: 'Athletic Performance Training',
      price: 297,
      recurring: false,
      category: 'Training Programs',
      affiliateLink: 'https://example.com/athletic#checkout',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      description: 'Professional athletic training program for peak performance.',
      features: ['Workout plans', 'Nutrition guides', 'Recovery strategies', 'Performance tracking'],
      skillLevel: 'Intermediate',
      timeInvestment: '1 hour/day',
      platform: 'Mobile App + Web'
    }
  ]
};

/**
 * Get sample products for a specific domain
 * @param {string} domainSlug - The domain slug (e.g., 'business', 'tech')
 * @returns {Array} Array of sample products
 */
export function getSampleProducts(domainSlug) {
  return SAMPLE_PRODUCTS[domainSlug] || SAMPLE_PRODUCTS.business;
}

/**
 * Get all sample products across all domains
 * @returns {Object} Object with domain slugs as keys and product arrays as values
 */
export function getAllSampleProducts() {
  return SAMPLE_PRODUCTS;
}

/**
 * Get a random sample product from a specific domain
 * @param {string} domainSlug - The domain slug
 * @returns {Object|null} Random product or null if no products
 */
export function getRandomSampleProduct(domainSlug) {
  const products = getSampleProducts(domainSlug);
  if (products.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * products.length);
  return products[randomIndex];
}

/**
 * Search sample products across all domains
 * @param {string} searchTerm - Search term
 * @param {string} category - Optional category filter
 * @returns {Array} Array of matching products with domain info
 */
export function searchSampleProducts(searchTerm, category = null) {
  const results = [];
  
  Object.entries(SAMPLE_PRODUCTS).forEach(([domainSlug, products]) => {
    products.forEach(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !category || product.category === category;
      
      if (matchesSearch && matchesCategory) {
        results.push({
          ...product,
          domainSlug,
          domainName: domainSlug.charAt(0).toUpperCase() + domainSlug.slice(1)
        });
      }
    });
  });
  
  return results;
}
