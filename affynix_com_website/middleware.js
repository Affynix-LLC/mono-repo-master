import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Handle subdomain routing
  const hostname = request.headers.get('host') || '';
  
  // Extract subdomain from hostname
  // For affynix.com subdomains: business.affynix.com -> business
  // For Vercel preview: affynix-business-xxx.vercel.app -> extract if possible
  let subdomain = null;
  
  if (hostname.includes('.affynix.com')) {
    subdomain = hostname.split('.')[0];
  } else if (hostname.includes('vercel.app')) {
    // For Vercel preview URLs: affynix-<subdomain>-<hash>.vercel.app
    const previewMatch = hostname.match(/^affynix-([^-]+)-/);
    if (previewMatch) {
      subdomain = previewMatch[1];
    } else {
      // Fallback: check the first path segment
      const pathSubdomain = pathname.split('/')[1];
      const validSubdomains = [
        'business', 'money', 'health', 'home', 'lifestyle', 
        'relationships', 'tech', 'food', 'outdoors', 'travel', 
        'leads', 'edu', 'sports'
      ];
      if (validSubdomains.includes(pathSubdomain)) {
        subdomain = pathSubdomain;
      }
    }
  }

  // Main domain routing - serve normally
  if (hostname === 'affynix.com' || hostname === 'www.affynix.com') {
    return NextResponse.next();
  }

  // Subdomain routing - rewrite to subdomain page
  const validSubdomains = [
    'business', 'money', 'health', 'home', 'lifestyle', 
    'relationships', 'tech', 'food', 'outdoors', 'travel', 
    'leads', 'edu', 'sports'
  ];
  
  if (subdomain && subdomain !== 'www' && validSubdomains.includes(subdomain)) {
    // Only rewrite if not already on the subdomain path
    if (pathname !== `/${subdomain}` && pathname !== `/${subdomain}/`) {
      const url = request.nextUrl.clone();
      url.pathname = `/${subdomain}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
