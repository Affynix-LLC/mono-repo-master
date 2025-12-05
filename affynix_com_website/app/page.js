import { headers } from 'next/headers';
import { getDomainConfig } from '../lib/domain-config';
import LandingPage from '../components/LandingPage';

export async function generateMetadata() {
  let hostname = 'affynix.com';
  try {
    const h = await headers();
    hostname = h.get('host') || hostname;
  } catch {}
  const config = getDomainConfig(hostname);

  return {
    title: config.seo.metaTitle,
    description: config.seo.metaDescription,
    keywords: config.seo.keywords.join(', '),
    openGraph: {
      title: config.seo.metaTitle,
      description: config.seo.metaDescription,
      type: 'website',
      siteName: 'Affynix',
      images: [
        {
          url: config.seo.ogImage,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
    },
    twitter: {
      card: config.seo.twitterCard,
      title: config.seo.metaTitle,
      description: config.seo.metaDescription,
      images: [config.seo.ogImage],
    },
    alternates: {
      canonical: `https://${hostname}`,
    },
  };
}

export default async function Page() {
  let hostname = 'affynix.com';
  try {
    const h = await headers();
    hostname = h.get('host') || hostname;
  } catch {}
  
  // For localhost or main domain, show landing page
  const domain = hostname.includes('localhost') || hostname === 'affynix.com' || hostname === 'www.affynix.com' 
    ? 'affynix.com' 
    : hostname;
  const config = getDomainConfig(domain);

  return <LandingPage domainConfig={config} />;
}
