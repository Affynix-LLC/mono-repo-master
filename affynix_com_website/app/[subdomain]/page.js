import { headers } from 'next/headers';
import SubdomainPage from '@/components/subdomain-template/SubdomainPage';
import { getSampleProducts } from '@/lib/sample-products';

// Import actual product data
async function getProducts(domainSlug) {
  try {
    // Static imports for each domain
    switch (domainSlug) {
      case 'business':
        const { businessProducts } = await import('@/data/products/business.js');
        return businessProducts || [];
      case 'money':
        const { moneyProducts } = await import('@/data/products/money.js');
        return moneyProducts || [];
      case 'health':
        const { healthProducts } = await import('@/data/products/health.js');
        return healthProducts || [];
      case 'home':
        const { homeProducts } = await import('@/data/products/home.js');
        return homeProducts || [];
      case 'relationships':
        const { relationshipsProducts } = await import('@/data/products/relationships.js');
        return relationshipsProducts || [];
      case 'tech':
        const { techProducts } = await import('@/data/products/tech.js');
        return techProducts || [];
      default:
        return getSampleProducts(domainSlug);
    }
  } catch (error) {
    // Fallback to sample products if file doesn't exist
    console.log(`No product file for ${domainSlug}, using sample products`);
    return getSampleProducts(domainSlug);
  }
}

export async function generateMetadata({ params }) {
  let hostname = 'business.affynix.com';
  
  try {
    const resolvedParams = await params;
    hostname = `${resolvedParams.subdomain}.affynix.com`;
    
    const h = await headers();
    const hostHeader = h.get('host');
    if (hostHeader) {
      hostname = hostHeader;
    }
  } catch (error) {
    console.error('Error in generateMetadata:', error);
    // Fallback value
  }
  
  // Canonical per subdomain
  return {
    alternates: {
      canonical: `https://${hostname}`,
    },
  };
}

export default async function SubdomainPageRoute({ params }) {
  let host = 'localhost:3000';
  let slug = 'business';
  
  try {
    const resolvedParams = await params;
    slug = resolvedParams.subdomain;
    host = `${slug}.affynix.com`;
    
    const h = await headers();
    const hostHeader = h.get('host');
    if (hostHeader) {
      host = hostHeader;
    }
  } catch (error) {
    console.error('Error in SubdomainPageRoute:', error);
    // Fallback values
  }
  
  const products = await getProducts(slug);
  return <SubdomainPage products={products} forceDomain={host} />;
}
