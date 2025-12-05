# Affynix Platform - Project Rules

## 🎯 Project Overview

The Affynix Platform is a multi-subdomain SaaS platform built on Next.js 14+ with TypeScript, designed for enterprise-grade AI agents, affiliate marketing, and conversion optimization. The platform emphasizes performance, SEO, and revenue attribution through modal-funnel architecture.

## 🏗️ Architecture Principles

### Core Technology Stack

- **Framework**: Next.js 14+ with App Router (mandatory)
- **Language**: TypeScript (strict mode enabled)
- **Styling**: CSS (existing styles preserved for continuity)
- **Analytics**: Google Analytics 4 + ClickRank integration
- **CRM**: Venturz webhook integration with IP enrichment
- **Deployment**: Vercel (preferred) with ISR enabled

### Performance Requirements

- **TTFB**: < 200ms (target: < 100ms)
- **Lighthouse Performance**: > 90
- **Lighthouse SEO**: 100 (perfect score required)
- **Core Web Vitals**: Optimized for LCP, FID, and CLS
- **Hydration Errors**: Zero tolerance

## 📁 File Structure & Naming Conventions

### Directory Structure

```
/app
  /v2/                    # Primary subdomain template
    layout.tsx            # V2-specific layout with modals
    page.tsx              # V2 homepage (Server Component)
/components
  /shared/                # Reusable across all subdomains
  /v2/                    # V2 template components
/lib
  config.ts               # Subdomain configuration system
  seo.ts                  # Structured data generation
  analytics.ts            # Multi-platform tracking
  /utils/                 # Utility functions
/public
  /v2/                    # V2-specific assets
    styles.css            # Extracted from template
    script.js             # Extracted from template
    /images/              # Optimized assets
```

### File Naming Rules

- **Components**: PascalCase (e.g., `Hero.tsx`, `ContactForm.tsx`)
- **Utilities**: kebab-case (e.g., `ip-enrichment.ts`, `validation.ts`)
- **Pages**: lowercase (e.g., `page.tsx`, `layout.tsx`)
- **Config files**: kebab-case (e.g., `next.config.js`, `tsconfig.json`)
- **File Extensions**: Use `.js` exclusively for consistency (no `.jsx` files)

### Import/Export Conventions

- Use named exports for components: `export function ComponentName() {}`
- Use default exports for pages and layouts: `export default function Page() {}`
- Use absolute imports with `@/` prefix: `import { Component } from '@/components/Component'`
- Group imports: external libraries first, then internal modules

## 🎨 Component Development Rules

### Component Structure

```typescript
import React from 'react';
import { ComponentProps } from '@/lib/types';

interface ComponentNameProps {
  // Required props first
  title: string;
  description: string;
  // Optional props with defaults
  variant?: 'primary' | 'secondary';
  showIcon?: boolean;
  // Event handlers
  onSubmit?: (data: FormData) => void;
  // Children
  children?: React.ReactNode;
}

export function ComponentName({
  title,
  description,
  variant = 'primary',
  showIcon = false,
  onSubmit,
  children
}: ComponentNameProps) {
  // Component logic here
  return (
    <div className="component-wrapper">
      {/* JSX content */}
    </div>
  );
}
```

### Component Requirements

- **TypeScript**: All components must be fully typed
- **Accessibility**: WCAG AA compliant (aria-labels, semantic HTML)
- **Responsive**: Mobile-first design approach
- **Performance**: Use React.memo() for expensive components
- **SEO**: Server Components preferred, Client Components only when necessary

### Modal System Rules

- All modals must use the centralized `Modal` component
- Modal IDs must follow pattern: `modal-{type}` (e.g., `modal-starter`, `modal-pro`)
- Each modal must have conversion tracking configured
- Modal triggers must use `data-open` attributes

## 🔧 Configuration Management

### Subdomain Configuration

- All subdomain configs go in `/lib/config.ts`
- Use `getSubdomainConfig()` function to retrieve current config
- Override pattern: `subdomainOverrides[subdomain]`
- Merge strategy: deep merge for nested objects

### Environment Variables

```bash
# Required for all environments
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLICKRANK_ENABLED=true
VENTURZ_WEBHOOK_URL=https://venturz.co/api/webhooks/your-webhook-id
NEXT_PUBLIC_BASE_URL=https://affynix.com
```

### Next.js Configuration

- Enable ISR with `revalidate: 3600`
- Configure image optimization for external domains
- Set security headers (X-Frame-Options, X-Content-Type-Options)
- Enable SVG support via @svgr/webpack

## 🚀 SEO & Performance Rules

### SEO Requirements

- **Meta Tags**: Unique per subdomain in config
- **Canonical URLs**: Properly set for all pages
- **Structured Data**: Implement for all content types
- **Sitemap**: Generate for all subdomains
- **Robots.txt**: Configure per subdomain

### Subdomain Meshing Strategy

- Each subdomain links to 3-5 related subdomains
- Use `rel="nofollow"` on affiliate links
- Distribute link equity strategically
- Submit individual sitemaps to Google Search Console

### Performance Optimization

- **Images**: Use Next.js Image component with WebP/AVIF
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Static generation with ISR
- **Bundle Size**: Monitor and optimize bundle size
- **Lazy Loading**: Implement for below-fold content

## 📊 Analytics & Tracking Rules

### Google Analytics 4 Events

Required events to track:

- `page_view` (automatic)
- `cta_click` (manual)
- `modal_open` (manual)
- `modal_close` (manual)
- `form_submit` (manual)
- `affiliate_click` (manual)
- `lead_captured` (manual)

### Conversion Funnel Tracking

1. **Modal Opens**: Track engagement metrics
2. **Form Submissions**: Primary conversion goal
3. **Affiliate Clicks**: Revenue attribution
4. **Lead Quality**: Score based on email domain and behavior

### ClickRank Integration

- Track subdomain rankings independently
- Monitor keyword movement for SEO mesh effect
- Set up alerts for ranking drops
- Configure conversion goals in ClickRank dashboard

## 🔒 Security & Validation Rules

### Input Validation

- All form inputs must be validated client-side and server-side
- Use `/lib/utils/validation.ts` for validation schemas
- Sanitize all user inputs to prevent XSS
- Implement rate limiting for form submissions

### Security Headers

- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin
- Content Security Policy: Configure as needed

### Data Protection

- Never log sensitive user data
- Use environment variables for all secrets
- Implement proper error handling without data leakage
- Follow GDPR compliance for EU users

## 🎯 Conversion Optimization Rules

### Modal Funnel Architecture

- **Trigger Points**: Pricing CTAs, exit-intent, scroll depth (60%+), time on page (45s+)
- **Funnel Steps**: modal_open → form_submit → lead_captured → affiliate_click
- **A/B Testing**: Test headlines, CTA copy, urgency triggers
- **Conversion Rate Target**: 10%+ (vs 2% traditional landing pages)

### CTA Optimization

- Primary CTAs: "Get Started", "Start Free Trial"
- Secondary CTAs: "See Features", "Learn More"
- Urgency triggers: "Limited spots", "14-day trial"
- Color psychology: Use brand colors for trust

### Form Optimization

- Minimize required fields (email + name only for initial capture)
- Use progressive profiling for additional data
- Implement real-time validation
- Show success/error states clearly

## 🧪 Testing & Quality Assurance

### Code Quality

- **TypeScript**: Strict mode enabled, no `any` types
- **ESLint**: Next.js config with custom rules
- **Prettier**: Consistent code formatting
- **Type Checking**: Run `npm run type-check` before commits

### Testing Requirements

- **Unit Tests**: Critical business logic
- **Integration Tests**: Form submissions, API calls
- **E2E Tests**: Modal flows, conversion funnels
- **Performance Tests**: Lighthouse CI on every PR

### Pre-Deployment Checklist

- [ ] TTFB < 200ms
- [ ] Lighthouse Performance > 90
- [ ] Lighthouse SEO = 100
- [ ] Zero hydration errors
- [ ] All modals functional
- [ ] Forms submitting to Venturz
- [ ] GA4 events firing
- [ ] Mobile responsive
- [ ] Dark mode working

## 🚀 Deployment Rules

### Git Workflow

- **Main Branch**: Production deployments only
- **Staging Branch**: Pre-production testing
- **Development Branch**: Active development work
- **Feature Branches**: `feature/description` (merged to development)

### Deployment Process

1. Create feature branch from `development`
2. Implement changes with tests
3. Create PR to `development`
4. Code review and approval
5. Merge to `development`
6. Promote `development` to `staging`
7. Test on staging environment
8. Promote `staging` to `main` (production)

### Environment Management

- **Development**: Local development with `.env.local`
- **Staging**: Vercel preview deployments
- **Production**: Vercel production with custom domain

## 📈 Monitoring & Optimization

### Weekly Reviews

- Google Analytics conversion rates by subdomain
- ClickRank keyword rankings
- Vercel Analytics Core Web Vitals
- Venturz lead quality and conversion rates

### Monthly A/B Tests

- Headline variants
- CTA button colors and copy
- Modal timing and trigger points
- Pricing display formats

### Quarterly Reviews

- Content refresh for outdated references
- Update testimonials with new case studies
- Refine subdomain meshing strategy
- Optimize underperforming funnels

## 🚫 Prohibited Practices

### Code Quality

- ❌ Using `any` type in TypeScript
- ❌ Console.log statements in production code
- ❌ Hardcoded URLs or configuration values
- ❌ Inline styles (use CSS classes)
- ❌ Missing error handling
- ❌ Unused imports or variables

### Performance

- ❌ Large bundle sizes without code splitting
- ❌ Unoptimized images
- ❌ Blocking JavaScript in critical path
- ❌ Missing lazy loading for below-fold content
- ❌ Inefficient re-renders

### Security

- ❌ Exposing sensitive data in client-side code
- ❌ Missing input validation
- ❌ Insecure API endpoints
- ❌ Hardcoded secrets or API keys
- ❌ Missing CSRF protection

### SEO

- ❌ Missing meta tags
- ❌ Duplicate content across subdomains
- ❌ Broken internal links
- ❌ Missing structured data
- ❌ Poor mobile responsiveness

## 📚 Documentation Requirements

### Code Documentation

- All public functions must have JSDoc comments
- Complex business logic must be documented
- API endpoints must have OpenAPI documentation
- Component props must be documented with examples

### README Updates

- Update README.md for new features
- Document environment variable changes
- Update deployment instructions
- Maintain troubleshooting section

## 🎯 Success Metrics

### Performance KPIs

- TTFB: < 100ms (target), < 200ms (acceptable)
- Lighthouse Performance: > 90
- Lighthouse SEO: 100
- Core Web Vitals: All green

### Business KPIs

- Conversion Rate: 10%+ (modal funnel)
- Lead Quality Score: > 7/10
- Subdomain SEO Rankings: Top 3 for target keywords
- Revenue Attribution: 100% trackable

### Technical KPIs

- Zero production errors
- 99.9% uptime
- < 2s page load time
- 100% mobile responsive

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Maintainer**: Affynix Development Team

> These rules ensure the Affynix Platform maintains high performance, security, and conversion optimization standards while supporting scalable multi-subdomain architecture.
