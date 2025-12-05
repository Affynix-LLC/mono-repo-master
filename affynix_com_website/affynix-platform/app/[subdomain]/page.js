import { headers } from 'next/headers';
import SubdomainPage from '@/components/subdomain-template/SubdomainPage';
import { getSampleProducts } from '@/lib/sample-products';

export async function generateMetadata({ params }) {
  let hostname = `${params.subdomain}.affynix.com`;
  try {
    const h = headers();
    hostname = h.get('host') || hostname;
  } catch {}
  // Canonical per subdomain
  return {
    alternates: {
      canonical: `https://${hostname}`,
    },
  };
}

export default async function SubdomainPageRoute({ params }) {
  let host = `${params.subdomain}.affynix.com`;
  try {
    const h = headers();
    host = h.get('host') || host;
  } catch {}
  const slug = params.subdomain;
  const products = getSampleProducts(slug);
  return <SubdomainPage products={products} forceDomain={host} />;
}
