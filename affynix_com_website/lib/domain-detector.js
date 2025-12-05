export function getDomainConfig(hostname) {
  const subdomain = hostname?.split('.')[0] || 'main';
  
  const configs = {
    health: {
      name: 'Affynix Health',
      description: 'Health, fitness, and wellness solutions for a better life',
      keywords: 'health, fitness, weight loss, nutrition, supplements, beauty, wellness',
      primaryColor: '#065f46',
      secondaryColor: '#047857',
      logo: '/assets/health/logo.svg',
      favicon: '/assets/health/favicon.ico',
      hero: {
        title: 'Transform Your Health & Wellness',
        subtitle: 'Discover proven solutions for fitness, nutrition, and total wellness',
        cta: 'Start Your Health Journey'
      },
      services: [
        'Weight Loss & Fitness Programs',
        'Nutritional Supplements',
        'Beauty & Anti-Aging Solutions',
        'Mental Health & Wellness'
      ],
      schema: {
        '@type': 'HealthAndBeautyBusiness',
        serviceType: 'Health & Wellness',
        areaServed: 'Global'
      }
    },
    
    business: {
      name: 'Affynix Business',
      description: 'Digital marketing and e-business solutions for entrepreneurs',
      keywords: 'digital marketing, affiliate marketing, email marketing, SEO, social media, e-commerce',
      primaryColor: '#7c2d12',
      secondaryColor: '#9a3412',
      logo: '/assets/business/logo.svg',
      favicon: '/assets/business/favicon.ico',
      hero: {
        title: 'Master Digital Marketing & E-Business',
        subtitle: 'Proven strategies to build and scale your online business',
        cta: 'Grow Your Business'
      },
      services: [
        'Affiliate Marketing Systems',
        'Email Marketing Campaigns',
        'SEO & Content Marketing',
        'E-commerce Operations'
      ],
      schema: {
        '@type': 'ProfessionalService',
        serviceType: 'Digital Marketing',
        areaServed: 'Worldwide'
      }
    },
    
    money: {
      name: 'Affynix Money',
      description: 'Financial freedom through smart investing and money management',
      keywords: 'investing, stocks, forex, real estate, financial independence, wealth building',
      primaryColor: '#1a365d',
      secondaryColor: '#2d3748',
      logo: '/assets/money/logo.svg',
      favicon: '/assets/money/favicon.ico',
      hero: {
        title: 'Build Wealth & Financial Freedom',
        subtitle: 'Master investing, trading, and wealth-building strategies',
        cta: 'Start Building Wealth'
      },
      services: [
        'Stock & Forex Trading',
        'Real Estate Investing',
        'Cryptocurrency Strategies',
        'Financial Independence Plans'
      ],
      schema: {
        '@type': 'FinancialService',
        serviceType: 'Investment Education',
        areaServed: 'Global'
      }
    },
    
    lifestyle: {
      name: 'Affynix Lifestyle',
      description: 'Personal development and relationship solutions for a fulfilling life',
      keywords: 'personal development, relationships, dating, self-improvement, success, motivation',
      primaryColor: '#312e81',
      secondaryColor: '#3730a3',
      logo: '/assets/lifestyle/logo.svg',
      favicon: '/assets/lifestyle/favicon.ico',
      hero: {
        title: 'Transform Your Life & Relationships',
        subtitle: 'Unlock your potential with proven personal development strategies',
        cta: 'Transform Your Life'
      },
      services: [
        'Personal Development Programs',
        'Relationship & Dating Coaching',
        'Success & Motivation Training',
        'Life Transformation Systems'
      ],
      schema: {
        '@type': 'ProfessionalService',
        serviceType: 'Personal Development',
        areaServed: 'Worldwide'
      }
    }
  };
  
  return configs[subdomain] || configs.lifestyle; // Default fallback
}