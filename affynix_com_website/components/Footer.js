'use client';

/**
 * FOOTER COMPONENT
 * Cross-domain link network footer for SEO authority
 */

import Link from 'next/link';
import Image from 'next/image';
import { trackCrossDomainNavigation } from '../lib/analytics.js';

export default function Footer({ domainConfig }) {
  const handleNetworkLinkClick = (link) => {
    // Track cross-domain navigation
    trackCrossDomainNavigation(window.location.hostname, link.domain);
    
    // Navigate to link
    window.location.href = link.url;
  };

  const subdomains = [
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
  ].sort((a, b) => a.name.localeCompare(b.name));

  const handleSubdomainClick = (slug) => {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname || '';
      const isLocal = host === 'localhost' || host.includes('localhost');
      const isPreview = host.endsWith('.vercel.app') || host.includes('-git-');
      window.location.href = (isLocal || isPreview) ? `/${slug}` : `https://${slug}.affynix.com`;
    }
  };
  
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
      borderTop: `1px solid ${domainConfig.theme.accent}20`,
      padding: '3rem 2rem 2rem',
      marginTop: '4rem'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Brand Section */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.5rem'
            }}>
              <img
                src="/logo/logo1.svg"
                alt="Affynix Logo"
                style={{ width: '32px', height: '32px' }}
              />
              <h3 style={{
                color: domainConfig.theme.accent,
                fontSize: '1.5rem',
                fontWeight: 700,
                margin: 0
              }}>
                AFFYNIX
              </h3>
            </div>
            <p style={{
              color: '#888',
              fontSize: '1rem',
              lineHeight: 1.6,
              marginBottom: '1rem'
            }}>
              All the deals you want.<br />
              No ads. No BS.
            </p>
          </div>
          
          {/* Categories - Subdomains */}
          <div>
            <h4 style={{
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '1rem'
            }}>
              Categories
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.5rem 1rem'
            }}>
              {subdomains.map((subdomain) => (
                <button
                  key={subdomain.slug}
                  onClick={() => handleSubdomainClick(subdomain.slug)}
                  style={{
                    color: '#888',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    padding: '0.25rem 0',
                    transition: 'color 0.2s ease',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = domainConfig.theme.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#888';
                  }}
                >
                  {subdomain.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div style={{
          borderTop: `1px solid ${domainConfig.theme.accent}20`,
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{
            color: '#888',
            fontSize: '0.8rem'
          }}>
            © 2025 Affynix Network. All rights reserved.
          </div>
          
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'center'
          }}>
            <Link 
              href="https://legal.affynix.com/privacy"
              style={{
                color: '#888',
                textDecoration: 'none',
                fontSize: '0.8rem'
              }}
            >
              Privacy Policy
            </Link>
            <Link 
              href="https://legal.affynix.com/terms"
              style={{
                color: '#888',
                textDecoration: 'none',
                fontSize: '0.8rem'
              }}
            >
              Terms of Service
            </Link>
            <Link 
              href="https://legal.affynix.com/affiliate-disclosure"
              style={{
                color: '#888',
                textDecoration: 'none',
                fontSize: '0.8rem'
              }}
            >
              Affiliate Disclosure
            </Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
