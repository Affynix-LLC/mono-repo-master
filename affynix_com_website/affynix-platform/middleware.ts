import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
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
  const subdomain = hostname.split('.')[0];

  // Main domain routing - serve normally
  if (hostname === 'affynix.com' || hostname === 'www.affynix.com') {
    return NextResponse.next();
  }

  // Subdomain routing - redirect to specific subdomain pages
  if (subdomain && subdomain !== 'www') {
    const validSubdomains = ['business','money','health','home','lifestyle','relationships','tech','food','outdoors','travel','leads','edu','sports'];
    
    if (validSubdomains.includes(subdomain)) {
      // Redirect to the subdomain page
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
