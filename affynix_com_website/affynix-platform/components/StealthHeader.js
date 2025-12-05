'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function StealthHeader({ domainConfig }) {
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll for subtle background activation
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 100);
    });
  }

  const verticals = [
    { slug: 'business', name: 'Business' },
    { slug: 'money', name: 'Money' },
    { slug: 'health', name: 'Health' },
    { slug: 'tech', name: 'Tech' },
    { slug: 'lifestyle', name: 'Lifestyle' },
    { slug: 'relationships', name: 'Relationships' },
    { slug: 'home', name: 'Home' },
    { slug: 'food', name: 'Food' },
    { slug: 'outdoors', name: 'Outdoors' },
    { slug: 'travel', name: 'Travel' },
    { slug: 'leads', name: 'Leads' },
    { slug: 'edu', name: 'Education' },
    { slug: 'sports', name: 'Sports' }
  ];

  return (
    <>
      {/* SEO-Only Navigation - Zero Visual Footprint */}
      <nav 
        style={{ 
          position: 'absolute', 
          left: '-10000px', 
          width: '1px', 
          height: '1px', 
          overflow: 'hidden' 
        }}
        aria-label="Main navigation"
      >
        <ul itemScope itemType="https://schema.org/SiteNavigationElement">
          <li itemProp="name">
            {/* Use Next.js Link for internal navigation */}
            <span itemProp="url">
              <Link href="/" rel="home" legacyBehavior>
                <a>Affynix Home</a>
              </Link>
            </span>
          </li>
          {verticals.map(vertical => (
            <li key={vertical.slug} itemProp="name">
              <a 
                href={`https://${vertical.slug}.affynix.com`} 
                itemProp="url"
              >
                {vertical.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Minimal Utility Bar - Logo + Categories + Contact */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: isScrolled 
          ? 'rgba(10, 10, 10, 0.85)' 
          : 'transparent',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        borderBottom: isScrolled 
          ? '1px solid rgba(201, 169, 97, 0.1)' 
          : 'none',
        transition: 'all 0.3s ease',
        padding: '1rem 2rem'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo - Subtle Presence */}
          <Link 
            href="/" 
            className="flex items-center gap-3"
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#C9A961',
              textDecoration: 'none',
              letterSpacing: '0.5px',
              opacity: 0.7,
              transition: 'opacity 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
            aria-label="Affynix Home"
          >
            <img
              src="/logo/logo1.svg"
              alt="Affynix Logo"
              className="w-6 h-6"
            />
            <span>AFFYNIX</span>
          </Link>

          {/* Categories Nav - hub only */}
          <nav aria-label="Categories" style={{ display: 'none', gap: '1rem' }} className="affynix-hub-nav">
            {verticals.slice(0,6).map(v => (
              <a
                key={v.slug}
                href={`https://${v.slug}.affynix.com`}
                style={{
                  color: '#C9A961',
                  opacity: 0.8,
                  textDecoration: 'none',
                  fontSize: '0.85rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
              >
                {v.name}
              </a>
            ))}
          </nav>
        </div>
      </header>

    </>
  );
}
